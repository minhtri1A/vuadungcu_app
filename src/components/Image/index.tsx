/* eslint-disable react-native/no-inline-styles */
import View from 'components/View';
import { useTheme } from 'hooks';
import { includes, omitBy } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, DimensionValue, FlexStyle, Image as Img } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';

interface Props extends FastImageProps {
    size?: any; //size icon loading
    bg?: boolean; //bg wrap image
    w?: DimensionValue | number;
    h?: DimensionValue | number;
    radius?: number;
    aS?: FlexStyle['alignSelf'];
    ratio?: number;
    defaultImage?: boolean;
    //neu true se tu dong lay width va height cua image de set ratio
    dynamicRatio?: boolean;
}

//render image
const Image = memo(function Image(props: Props) {
    const { theme } = useTheme();
    //state
    const [width, setWidth] = useState<number>();
    const [height, setHeight] = useState<number>();
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(false);
    //clear customs prop
    const propsImage = omitBy(props, (_, key) =>
        includes(['style', 'bg', 'w', 'h', 'radius', 'aS', 'ratio', 'dynamicSize'], key)
    );
    const {
        w = '100%',
        h = '100%',
        bg,
        radius,
        aS = 'center',
        ratio,
        source,
        dynamicRatio,
    } = props;

    //effect

    useEffect(() => {
        let isMounted = true;

        if (dynamicRatio && isMounted && source) {
            isMounted = false;
            (async () => {
                if (typeof source === 'object') {
                    Img.getSize(source.uri || '', (w_, h_) => {
                        setWidth(w_);
                        setHeight(h_);
                    });
                }
            })();
        }
    }, [source, dynamicRatio]);

    if (dynamicRatio && width === undefined) {
        return (
            <View w={w} ratio={1}>
                <ActivityIndicator color={theme.colors.grey_[400]} />
            </View>
        );
    }

    return (
        <>
            <FastImage
                style={[
                    {
                        width: w,
                        height: dynamicRatio ? 'auto' : h,
                        borderRadius: radius,
                        backgroundColor: bg ? theme.colors.grey_[200] : undefined,
                        alignSelf: aS,
                        aspectRatio:
                            dynamicRatio && width && width > 0 && height && height > 0
                                ? width / height
                                : ratio,
                    },
                    props.style,
                ]}
                defaultSource={require('asset/img_icon_vdc_grey.png')}
                {...propsImage}
            />
            {/* {loading ? (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        left: theme.spacings.tiny,
                        right: theme.spacings.tiny,
                        bottom: theme.spacings.tiny,
                        top: theme.spacings.tiny,
                        zIndex: -1,
                        // backgroundColor: 'red',
                    }}
                >
                    <FastImage
                        source={require('asset/img_icon_vdc_grey.png')}
                        resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
                        style={{ width: '90%', height: '90%' }}
                    />
                </View>
            ) : null}
            {error ? (
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        left: theme.spacings.tiny,
                        right: theme.spacings.tiny,
                        bottom: theme.spacings.tiny,
                        top: theme.spacings.tiny,
                        zIndex: -1,
                        // backgroundColor: 'red',
                    }}
                >
                    <FastImage
                        source={require('asset/img_icon_vdc_grey.png')}
                        resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
                        style={{ width: '90%', height: '90%' }}
                    />
                </View>
            ) : null} */}
        </>
    );
});

export default Image;
