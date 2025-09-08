/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
import Text, { TextCustomProps } from 'components/Text';
import React, { memo, useEffect, useRef, useState } from 'react';

interface Props {
    //init second
    second: number;
    //down: second -> 0 - up: 0 -> second
    type?: 'down' | 'up';
    duration?: number;
    //check xem co reset lai second khi visible thay doi(paused)
    //true se reset lai gia tri second khi tat va mo lai visible
    //false se giu nguyen gia tri secondRef khi visible thay doi
    isResetChangeVisible?: boolean;
    onFinishCountDown?(): any;
    visible: boolean;
    textProps?: TextCustomProps;
    textType?: 'second' | 'minutes' | 'hours';
}

//count
export default memo(function CountSeconds({
    second,
    type = 'down',
    duration = 1000,
    onFinishCountDown,
    visible,
    textProps,
    textType = 'second',
    isResetChangeVisible = true,
}: Props) {
    const [seconds, setSeconds] = useState(0);
    const secondRef = useRef(0);
    const interval = useRef<any>(null);

    useEffect(() => {
        if (visible && second > 0) {
            //mac dinh down neu gia tri dang xu ly(secondRef) < 1 se luon set value la second prop
            if (type === 'down' && (secondRef.current < 1 || isResetChangeVisible)) {
                // setSeconds(second);
                secondRef.current = second;
            }
            if (
                type === 'up' &&
                (secondRef.current < 1 || secondRef.current >= second || isResetChangeVisible)
            ) {
                secondRef.current = second;
            }

            setCountDown();
        }
        return () => {
            clearInterval(interval.current);
        };
    }, [visible, second]);

    const formatTime = () => {
        if (textType === 'second') {
            return [parseInt(`${seconds % 60}`)].join(':').replace(/\b(\d)\b/g, '0$1');
        }
        if (textType === 'minutes') {
            return [parseInt(`${(seconds / 60) % 60}`), parseInt(`${seconds % 60}`)]
                .join(':')
                .replace(/\b(\d)\b/g, '0$1');
        }
        //hours type
        return [
            parseInt(`${seconds / 60 / 60}`),
            parseInt(`${(seconds / 60) % 60}`),
            parseInt(`${seconds % 60}`),
        ]
            .join(':')
            .replace(/\b(\d)\b/g, '0$1');
    };

    const setCountDown = () => {
        interval.current = setInterval(() => {
            if (
                (type === 'down' && secondRef.current < 1) ||
                (type === 'up' && secondRef.current >= second)
            ) {
                clearInterval(interval.current);
                if (onFinishCountDown) {
                    onFinishCountDown();
                    setSeconds(second);
                }
            }
            if (type === 'down') {
                //down 10 9 8
                if (secondRef.current > 0) {
                    secondRef.current -= 1;
                    setSeconds(secondRef.current);
                }
            } else {
                //up 1 2 3
                if (secondRef.current < second) {
                    secondRef.current += 1;
                    setSeconds(secondRef.current);
                }
            }
        }, duration);
    };

    return <Text {...textProps}>{formatTime()}</Text>;
});
