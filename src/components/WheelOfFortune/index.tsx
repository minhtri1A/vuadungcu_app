import PulseIndicator from 'components/Spinner/PulseIndicator';
import Text from 'components/Text';
import Touch from 'components/Touch';
import { Status } from 'const/index';
import * as d3Shape from 'd3-shape';
import { useTheme } from 'hooks';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
    Defs,
    G,
    Image as ImageSvg,
    LinearGradient,
    Path,
    Stop,
    Svg,
    TSpan,
    Text as TextSvg,
} from 'react-native-svg';

interface Props {
    rewards?: Array<{
        image: string;
        label: string;
        type: 'score' | 'gift';
    }>;
    //status get winner api
    status: string;
    //index trung thuong > 0
    winner?: number;
    duration?: number;
    textColor?: any;
    textAngle?: any;
    backgroundColor?: any;
    knobSize?: any;
    width: any;
    height: any;
    itemSize?: any;
    //can set winner truoc status
    onPlay?(): void;
    //goi khi vong quay xong - reset status
    onFinish(value: any, index: any): void;
    //click vao title
    onPressDisableTitle?(): void;
    //an button khi bat dau quay
    hidePlayButton?: boolean;
    //disable khong cho quay
    disable?: boolean;
    disableTitle?: string;
    disableSubTitle?: string;
}

interface WheelPathsType {
    path: any;
    linearColor: string[];
    value: {
        image: string;
        label: string;
        type: 'score' | 'gift';
    };
    centroid: [number, number];
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const colors = [
    ['#FF3D3DFF', '#DB4848FF'],
    ['#FF771DFF', '#F48F4DFF'],
    ['#107AADFF', '#42B4EBFF'],
    ['#8DFF40FF', '#7AE730FF'],
    ['#A70808FF', '#A53838FF'],
];

const WheelOfFortune = ({
    rewards = [],
    winner,
    duration,
    textColor,
    textAngle,
    knobSize = 20,
    width = 300,
    height = 300,
    itemSize = 60,
    hidePlayButton,
    disable,
    disableTitle,
    disableSubTitle,
    status,
    onPlay,
    onFinish,
    onPressDisableTitle,
}: Props) => {
    //hook
    const { theme } = useTheme();
    const width2 = theme.dimens.width;
    const height2 = theme.dimens.height;
    //state
    //--check event listener
    //--check hien thi button
    const [started, setStarted] = useState(false);
    const [isReady, setIsReady] = useState(false);
    //ref
    const Rewards = useRef<any>([]);
    const RewardCount = useRef(0);
    const numberOfSegments = useRef(0);
    const fontSize = useRef(0);
    const oneTurn = useRef(0);
    //kich thuoc 1 o trong vong quay
    const angleBySegment = useRef(0);
    //kich thuoc 1/2 o trong vong quay
    const angleOffset = useRef(0);
    //d3Shape value
    const _wheelPaths = useRef<Array<WheelPathsType>>([]);
    //value animated rorate
    const _angle = useRef<Animated.Value>(new Animated.Value(0));
    //-- do khi quay xong vi tri trung thuong luon o mep cua o nen can day vao trong angleOffset(1/2 o) de day vao giuaw
    //-- randomAngleOffset nham muc dich vi tri trung thuong se ngau nhien trong o khong co dinh o chinh giua
    const randomAngleOffset = useRef<any>(0);
    //color
    //--tong so o thuong
    const numRewards = rewards.length || 4;
    //--so mau tuong ung moi phan thuong - vd 5/2 ceil
    const numColor = numRewards <= 4 ? numRewards : Math.ceil(numRewards / 2);
    //--so mau se render - 0 den < numColor
    const colorsWheel = colors.filter((_, index) => index < numColor);

    useEffect(() => {
        prepareWheel();
        setIsReady(true);
        return () => {
            // onRef(undefined)
        };
    }, []);

    useEffect(() => {
        if (status === Status.SUCCESS) {
            prepareWheel();
            _onPress(winner);
        }
    }, [status, winner]);

    const prepareWheel = () => {
        Rewards.current = rewards;
        RewardCount.current = Rewards.current.length;
        numberOfSegments.current = RewardCount.current;
        fontSize.current = 20;
        oneTurn.current = 360;
        angleBySegment.current = oneTurn.current / numberOfSegments.current;
        angleOffset.current = angleBySegment.current / 2;
        // setWinner_(
        //     winner && winner > 0 ? winner - 1 : Math.floor(Math.random() * numberOfSegments.current)
        // );
        // randomAngleOffset.current = Math.floor(Math.random() * (angleOffset.current * 1.9));
        _wheelPaths.current = makeWheel();
        _angle.current = new Animated.Value(0);
    };

    const _tryAgain = () => {
        prepareWheel();
        // _onPress();
    };

    const makeWheel = () => {
        //from: tạo 1 mang voi length=vd:4 phan tu set value cac phan tu la 1
        const data: Array<any> = Array.from({ length: numberOfSegments.current }).fill(1);
        //tien hanh tao hinh tron voi 4 phan tu deu nhau
        const arcs = d3Shape.pie()(data);
        return arcs.map((arc, index) => {
            const instance = d3Shape
                .arc()
                .padAngle(0)
                .outerRadius(theme.dimens.width / 2.2)
                .innerRadius(0);
            return {
                path: instance(arc as any),
                linearColor: colorsWheel[index % colorsWheel.length],
                value: rewards[index],
                centroid: instance.centroid(arc as any),
            };
        });
    };

    //su kien click vao bat dau quay thuong
    const _onPress = (winner_index?: number) => {
        setStarted(true);
        //winner or random winner
        const winner_ =
            winner_index !== undefined && winner_index >= 0
                ? winner_index
                : Math.floor(Math.random() * numberOfSegments.current);

        //se random vi tri trong o trunh thuong
        randomAngleOffset.current = Math.floor(Math.random() * (angleOffset.current * 1.9));
        //thoi gian vong quay chay
        const duration_ = duration || 5000;
        //animated quay - winder là index của vị trí chiến thắng
        const toValue =
            360 -
            winner_ * (oneTurn.current / numberOfSegments.current) +
            360 * (duration_ / 1000) +
            angleOffset.current -
            randomAngleOffset.current;
        Animated.timing(_angle.current, {
            toValue: toValue,
            duration: duration_,
            useNativeDriver: true,
        }).start(() => {
            //
            setStarted(false);
            onFinish(rewards[winner_], winner_);
        });
    };

    const _textRender = (x: number, y: number, number: any, i: number) => (
        <TextSvg
            x={x - number.length * 5}
            y={y - 80}
            fill={textColor ? textColor : '#fff'}
            textAnchor="middle"
            fontSize={fontSize.current}
        >
            {Array.from({ length: number.length }).map((_, j) => {
                // Render reward text vertically
                if (textAngle === 'vertical') {
                    return (
                        <TSpan x={x} dy={fontSize.current} key={`arc-${i}-slice-${j}`}>
                            {number.charAt(j)}
                        </TSpan>
                    );
                }
                // Render reward text horizontally
                else {
                    return (
                        <TSpan y={y - 40} dx={fontSize.current * 0.07} key={`arc-${i}-slice-${j}`}>
                            {number.charAt(j)}
                        </TSpan>
                    );
                }
            })}
        </TextSvg>
    );

    const _renderSvgWheel = () => {
        return (
            <View style={[styles.container]}>
                {/* shadow */}
                <Image
                    source={require('asset/shadow-wheel.png')}
                    resizeMode="contain"
                    style={{
                        position: 'absolute',
                        width: width * 1.55,
                        height: height * 1.55,
                        zIndex: -1,
                    }}
                />
                {/* disable */}
                {disable ? (
                    <View
                        style={{
                            position: 'absolute',
                            width: width * 0.91,
                            height: height * 0.91,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            zIndex: 999,
                            borderRadius: 1000,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {disableTitle ? (
                            <Touch
                                activeOpacity={0.9}
                                onPress={onPressDisableTitle}
                                style={{
                                    backgroundColor: theme.colors.black_[10],
                                    padding: theme.spacings.small,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                    width: '80%',
                                }}
                            >
                                <Text color={theme.colors.grey_[200]} ta="center">
                                    {disableTitle}
                                </Text>
                                {disableSubTitle ? (
                                    <Text color={theme.colors.grey_[200]} ta="center">
                                        {disableSubTitle}
                                    </Text>
                                ) : null}
                            </Touch>
                        ) : null}
                    </View>
                ) : null}

                {/* play btn */}
                {_renderTopToPlay()}
                <ImageBackground
                    source={require('asset/border-wheel.png')}
                    style={{ padding: width / 50 }}
                >
                    {/* knob */}
                    {_renderKnob()}
                    {/* wheel */}
                    <Animated.View
                        style={{
                            transform: [
                                {
                                    rotate: _angle.current.interpolate({
                                        inputRange: [-oneTurn.current, 0, oneTurn.current],
                                        outputRange: [
                                            `-${oneTurn.current}deg`,
                                            `0deg`,
                                            `${oneTurn.current}deg`,
                                        ],
                                    }),
                                },
                            ],

                            width: width,
                            height: height,
                            borderRadius: (width2 - 20) / 2,
                        }}
                    >
                        <AnimatedSvg
                            width={'100%'}
                            height={'100%'}
                            viewBox={`0 0 ${width2} ${width2}`}
                            style={{
                                transform: [{ rotate: `-${angleOffset.current}deg` }],
                                // margin: 10,
                            }}
                        >
                            <G y={width2 / 2} x={width2 / 2}>
                                {_wheelPaths.current.map((arc, i) => {
                                    const [x, y] = arc.centroid;
                                    const number = arc.value.toString();

                                    return (
                                        <G key={`arc-${i}`}>
                                            {/* tao liner color cho cac phan cua svg - id cua path va liner can giong nhau */}
                                            <Defs>
                                                <LinearGradient
                                                    id={`gradient${i}`}
                                                    x1={`100%`}
                                                    y1={`100%`}
                                                    x2={`10%`}
                                                    y2={`0%`}
                                                >
                                                    {arc.linearColor.map(
                                                        (color: any, index: any) => {
                                                            return (
                                                                <Stop
                                                                    offset={`${100 - index * 50}%`}
                                                                    stopColor={color}
                                                                    key={index}
                                                                />
                                                            );
                                                        }
                                                    )}
                                                </LinearGradient>
                                            </Defs>
                                            <Path
                                                d={arc.path}
                                                strokeWidth={2}
                                                fill={`url(#gradient${i})`}
                                            />
                                            <G
                                                rotation={
                                                    (i * oneTurn.current) /
                                                        numberOfSegments.current +
                                                    angleOffset.current
                                                }
                                                origin={`${x}, ${y}`}
                                            >
                                                {/* {arc.value.type === 'text' ? (
                                                    _textRender(x, y, number, i)
                                                ) : (
                                                    <ImageSvg
                                                        href={arc.value.image}
                                                        width={itemSize}
                                                        height={itemSize}
                                                        x={x - 30}
                                                        y={y - 55}
                                                    />
                                                )} */}
                                                <ImageSvg
                                                    href={arc.value.image}
                                                    width={itemSize}
                                                    height={itemSize}
                                                    x={x - 30}
                                                    y={y - 55}
                                                />
                                            </G>
                                        </G>
                                    );
                                })}
                            </G>
                        </AnimatedSvg>
                    </Animated.View>
                </ImageBackground>
            </View>
        );
    };

    const _renderKnob = () => {
        const knobSize_ = knobSize ? knobSize : 20;
        // [0, this.numberOfSegments]
        const YOLO = Animated.modulo(
            Animated.divide(
                Animated.modulo(
                    Animated.subtract(_angle.current, angleOffset.current),
                    oneTurn.current
                ),
                new Animated.Value(angleBySegment.current)
            ),
            1
        );
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: -knobSize,
                    width: knobSize,
                    height: knobSize * 2,
                    justifyContent: 'flex-end',
                    alignSelf: 'center',
                    zIndex: 1,
                    // transform: [
                    //     {
                    //         rotate: started
                    //             ? YOLO.interpolate({
                    //                   inputRange: [-1, -0.5, -0.0001, 0.0001, 0.5, 1],
                    //                   outputRange: [
                    //                       '0deg',
                    //                       '0deg',
                    //                       '35deg',
                    //                       '-35deg',
                    //                       '0deg',
                    //                       '0deg',
                    //                   ],
                    //               })
                    //             : '0deg',
                    //     },
                    // ],
                }}
            >
                <Svg
                    width={knobSize_}
                    height={(knobSize_ * 100) / 57}
                    viewBox={`0 0 57 100`}
                    style={{
                        transform: [{ translateY: 10 }],
                    }}
                >
                    <Image
                        source={require('/asset/knob.png')}
                        style={{ width: knobSize_ * 1.2, height: (knobSize_ * 100) / 57 }}
                    />
                </Svg>
            </Animated.View>
        );
    };

    const _renderTopToPlay = () => {
        if (hidePlayButton && started) {
            return null;
        }
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={{ position: 'absolute', zIndex: 998 }}
                onPress={() => {
                    if (disable) {
                        return;
                    }
                    if (started) {
                        return;
                    }

                    if (onPlay) {
                        onPlay();
                    }
                }}
            >
                <Image
                    source={require('asset/play-wheel.png')}
                    style={{ width: width / 4, height: height / 4 }}
                />
                {status === Status.LOADING ? (
                    <PulseIndicator
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            zIndex: 999,
                        }}
                        size={width / 4}
                        color={'rgba(212, 174, 80, 0.8)'}
                    />
                ) : null}
            </TouchableOpacity>
        );
    };

    if (!isReady) {
        return <></>;
    }

    return (
        <View style={[styles.container, { width: width, height: height }]}>
            <TouchableOpacity
                activeOpacity={1}
                style={{
                    // position: 'absolute',
                    width: width2,
                    height: height2 / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Animated.View style={[styles.content, { padding: 10 }]}>
                    {_renderSvgWheel()}
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

export default WheelOfFortune;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    content: {},
    startText: {
        fontSize: 50,
        color: '#fff',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.4)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
});
