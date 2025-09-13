/* eslint-disable react-hooks/exhaustive-deps */
import Voice from '@react-native-voice/voice';
import { useEffect, useRef, useState } from 'react';

export const useSpeechToText = () => {
    const [result, setResult] = useState('');
    const [isListening, setIsListening] = useState(false);

    const timeoutRef = useRef<any>(null);

    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechPartialResults = onSpeechPartialResults;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const startListening = async () => {
        try {
            setIsListening(true);
            setResult(''); // clear previous result
            await Voice.start('vi-VN');
        } catch (error) {
            setIsListening(false);
        }
    };

    const stopListening = async () => {
        try {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setIsListening(false);
            await Voice.stop();
        } catch (error) {
            setIsListening(true);
        }
    };

    const onSpeechResults = (e: any) => {
        setResult(e.value[0]);
    };

    const onSpeechStart = () => {
        // clear previous timeout and start a new one when speech starts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(stopListening, 3000);
    };

    const onSpeechPartialResults = () => {
        // clear previous timeout and start a new one when speech changes
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(stopListening, 1000);
    };

    const onSpeechEnd = () => {
        // ignore, as we will rely on onSpeechPartialResults to automatically stop listening
    };

    return { result, isListening, startListening, stopListening };
};
