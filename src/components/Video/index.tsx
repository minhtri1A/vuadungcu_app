/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
import Slider from '@react-native-community/slider';
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { RESET_VIDEO_OPTION } from 'features/action';
import { useAppDispatch, useAppSelector, useNavigate, useTheme } from 'hooks';
import React, { memo, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Video, {
    OnLoadData,
    OnProgressData,
    ReactVideoProps,
    VideoNativeProps,
    VideoRef,
} from 'react-native-video';
import { themeType } from 'theme';
import { formatSecondToTime, removePropertiesFromObject } from 'utils/helpers';

interface Props extends ReactVideoProps {
    isShowFullScreen?: boolean;
    onLoadingVideo?: (isLoading: boolean) => void;
    //th video trong swiper khi keo qua anh khac se tam dung video
    isStop?: boolean;
    autoplay?: boolean;
    disableOption?: boolean;
}

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const Video_ = memo(function Video_(props: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const videoOption = useAppSelector((state) => state.apps.videoOption);
    //state
    const [isLoading, setIsLoading] = useState(false);
    const [showOption, setShowOption] = useState(true);
    const [pause, setPause] = useState(true);
    const [durationVideo, setDurationVideo] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [muted, setMuted] = useState(true);
    //ref
    const videoRef = useRef<VideoRef>(null);
    //props
    const {
        isShowFullScreen = true,
        onLoadingVideo,
        isStop,
        autoplay = false,
        disableOption,
    } = props;
    const propsVideo: VideoNativeProps = removePropertiesFromObject(props, [
        'isShowFullScreen',
        'onLoadingVideo',
        'isStop',
        'disableOption',
    ]);

    //effect
    //-- hide option video
    useEffect(() => {
        let timer: any = null;
        if (showOption && !pause) {
            timer = setTimeout(() => {
                // LayoutAnimation.configureNext({
                //     duration: 300,
                //     create: { type: 'easeIn', property: 'opacity' },
                //     delete: { type: 'easeOut', property: 'opacity' },
                // });
                setShowOption(false);
            }, 3000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [showOption, pause]);

    //th chuyen hinh anh trong swiper
    useEffect(() => {
        if (isStop) {
            setPause(true);
            // setCurrentTime(0);
            // videoRef.current?.seek(0);
        }
        if (!isStop && isLoading) {
            setPause(false);
        }
    }, [isStop]);
    //handle goback from fullscreen
    useEffect(() => {
        if (videoOption.isGoback) {
            setCurrentTime(videoOption.currentTime);
            setPause(videoOption.pause);
            setMuted(videoOption.muted);
            setShowOption(true);
            dispatch(RESET_VIDEO_OPTION());
            videoRef.current?.seek(videoOption.currentTime);
        }
    }, [videoOption]);

    //handle event video
    const handleLoadVideo = (data: OnLoadData) => {
        if (onLoadingVideo) {
            onLoadingVideo(true);
        }
        setIsLoading(true);
        setDurationVideo(Math.ceil(data.duration));
        setPause(!autoplay);
        setShowOption(!autoplay);
        videoRef.current?.seek(0, 0);
    };

    const handleEndVideo = () => {
        setCurrentTime(0);
        setPause(true);
        videoRef.current?.seek(0, 0);
    };

    const handleProgress = (data: OnProgressData) => {
        setCurrentTime(Math.ceil(data.currentTime));
    };

    //--handle option

    const handleVisibleVideoOption = () => {
        // LayoutAnimation.configureNext({
        //     duration: 200,
        //     create: { type: 'easeIn', property: 'opacity' },
        //     delete: { type: 'easeOut', property: 'opacity' },
        // });
        setShowOption((pre) => !pre);
    };

    const handleChangePause = () => {
        setPause((pre) => !pre);
    };

    const handeChangeValueSlide = (value: number) => {
        setCurrentTime(value);
        videoRef.current?.seek(value);
    };

    const handleChangeMuted = () => {
        setMuted((pre) => !pre);
    };

    const handleChangeFullscreen = () => {
        navigate.VIDEO_FULL_SCREEN_ROUTE({
            source: props.source,
            currentTime,
            durationVideo,
            muted,
            pause,
        })();
        setPause(true);
    };

    return (
        <View style={styles.view_container}>
            <Touch activeOpacity={1} w={'100%'} h={'100%'} onPress={handleVisibleVideoOption}>
                <Video
                    ref={videoRef}
                    paused={pause ? true : false}
                    resizeMode="contain"
                    // posterResizeMode="stretch"
                    muted={muted}
                    style={styles.video_style}
                    progressUpdateInterval={1000}
                    {...propsVideo}
                    onLoad={handleLoadVideo}
                    onEnd={handleEndVideo}
                    onProgress={handleProgress}
                />
            </Touch>
            {/* option paused*/}
            {showOption && !disableOption ? (
                <>
                    <View
                        style={[
                            styles.view_paused,
                            {
                                paddingLeft: pause ? 3 : 0,
                            },
                        ]}
                    >
                        <IconButton
                            type="entypo"
                            name={pause ? 'controller-play' : 'controller-paus'}
                            size={theme.typography.size(30)}
                            color={'grey1'}
                            onPress={handleChangePause}
                            activeOpacity={0.9}
                        />
                    </View>
                    {/* option progress*/}
                    <View style={styles.view_bottom_option}>
                        <Text ml={'medium'} color={theme.colors.white_[10]}>
                            {formatSecondToTime(currentTime, 'minutes')}
                        </Text>
                        <Slider
                            value={currentTime}
                            onValueChange={handeChangeValueSlide}
                            maximumValue={durationVideo}
                            minimumValue={0}
                            step={0.5}
                            style={{ flex: 1 }}
                            thumbTintColor={theme.colors.grey_[100]}
                            minimumTrackTintColor={theme.colors.grey_[100]}
                            maximumTrackTintColor={theme.colors.white_[10]}
                        />

                        <Text color={theme.colors.white_[10]}>
                            {formatSecondToTime(durationVideo - currentTime, 'minutes')}
                        </Text>
                        <IconButton
                            type="feather"
                            name={muted ? 'volume-x' : 'volume-2'}
                            activeOpacity={0.9}
                            ml={'small'}
                            mr={'small'}
                            size={theme.typography.size(25)}
                            onPress={handleChangeMuted}
                        />
                        {isShowFullScreen ? (
                            <IconButton
                                type="material"
                                name={'fullscreen'}
                                activeOpacity={0.9}
                                mr={'small'}
                                size={theme.typography.size(26)}
                                onPress={handleChangeFullscreen}
                            />
                        ) : null}
                    </View>
                </>
            ) : null}
            {!isLoading && !disableOption ? (
                <View style={{ position: 'absolute' }}>
                    <ActivityIndicator
                        size={theme.typography.size(50)}
                        color={theme.colors.grey_[400]}
                    />
                </View>
            ) : null}
        </View>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_container: {
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
        },
        video_style: {
            width: '100%',
            height: '100%',
            backgroundColor: theme.colors.black_[10],
        },

        view_paused: {
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 0,
            borderRadius: 1000,
            borderWidth: 1,
            borderColor: theme.colors.white_[10],
            width: theme.dimens.scale(50),
            aspectRatio: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        view_bottom_option: {
            flexDirection: 'row',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 5,
            alignItems: 'center',
        },
    });

export default Video_;
