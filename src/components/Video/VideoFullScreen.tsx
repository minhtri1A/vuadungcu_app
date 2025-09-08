/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable radix */
import Slider from '@react-native-community/slider';
import { RouteProp } from '@react-navigation/native';
import { Icon } from '@rneui/themed';
import IconButton from 'components/IconButton';
import Text from 'components/Text';
import Touch from 'components/Touch';
import View from 'components/View';
import { SET_VIDEO_OPTION } from 'features/action';
import { useAppDispatch, useNavigation, useTheme } from 'hooks';
import { RootStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useRef, useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, UIManager } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video, { OnProgressData, VideoProperties } from 'react-native-video';
import { themeType } from 'theme';
import { formatSecondToTime } from 'utils/helpers';

interface Props extends VideoProperties {
    route: RouteProp<RootStackParamsList, 'VideoFullScreen'>;
}

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const VideoFullScreen = memo(function VideoFullScreen({ route }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    // const { showOption, currentTime, durationVideo, muted, pause } = useAppSelector(
    //     (state) => state.apps.videoOption
    // );
    //state
    const [showOption, setShowOption] = useState(true);
    const [pause, setPause] = useState(true);
    const [durationVideo, setDurationVideo] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [muted, setMuted] = useState(true);
    //params
    const source = route.params.source;

    //ref
    const videoRef = useRef<Video>(null);

    //effect

    useEffect(() => {
        //params
        const params = route.params;
        setPause(params.pause);
        setDurationVideo(params.durationVideo);
        setCurrentTime(params.currentTime);
        setMuted(params.muted);
        Orientation?.lockToLandscape();
        return () => {
            Orientation?.lockToPortrait();
        };
    }, []);

    //set goback value
    useEffect(() => {
        return () => {
            dispatch(SET_VIDEO_OPTION({ currentTime, muted, pause, isGoback: true }));
        };
    }, [currentTime, muted, pause]);

    //-- hide option video
    useEffect(() => {
        let timer: any = null;
        if (showOption) {
            timer = setTimeout(() => {
                LayoutAnimation.configureNext({
                    duration: 300,
                    create: { type: 'easeIn', property: 'opacity' },
                    delete: { type: 'easeOut', property: 'opacity' },
                });
                setShowOption(false);
            }, 2000);
        }
        return () => {
            clearTimeout(timer);
        };
    }, [showOption]);

    //handle event video

    const handleLoadVideo = () => {
        videoRef.current?.seek(currentTime);
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
        LayoutAnimation.configureNext({
            duration: 200,
            create: { type: 'easeIn', property: 'opacity' },
            delete: { type: 'easeOut', property: 'opacity' },
        });
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
        Orientation?.lockToPortrait();
        navigation.goBack();
    };

    return (
        <View style={styles.view_container}>
            <Touch activeOpacity={1} w={'100%'} h={'100%'} onPress={handleVisibleVideoOption}>
                <Video
                    source={source}
                    ref={videoRef}
                    paused={pause}
                    resizeMode="contain"
                    onLoad={handleLoadVideo}
                    muted={muted}
                    style={styles.video_style}
                    progressUpdateInterval={1000}
                    onEnd={handleEndVideo}
                    onProgress={handleProgress}
                />
            </Touch>
            {/* option paused*/}
            {!showOption ? (
                <View
                    style={[
                        styles.view_paused,
                        {
                            paddingLeft: pause ? 3 : 0,
                        },
                    ]}
                >
                    <Icon
                        type="entypo"
                        name={pause ? 'controller-play' : 'controller-paus'}
                        size={30}
                        color={theme.colors.grey_[200]}
                        onPress={handleChangePause}
                    />
                </View>
            ) : null}
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
                    step={1}
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
                    size={theme.typography.size(25)}
                    onPress={handleChangeMuted}
                />
                <IconButton
                    type="material"
                    name={'fullscreen-exit'}
                    activeOpacity={0.9}
                    ml={'small'}
                    mr={'small'}
                    size={theme.typography.size(26)}
                    onPress={handleChangeFullscreen}
                />
            </View>
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

export default VideoFullScreen;
