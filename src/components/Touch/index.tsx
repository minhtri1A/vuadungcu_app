import React, { memo } from 'react';
import { TouchableOpacity as T, TouchableOpacityProps, FlexStyle, StyleSheet } from 'react-native';
import { Theme } from '@rneui/themed';
import { useTheme } from 'hooks';
import { omitBy } from 'lodash';

export interface TouchCustomProps extends TouchableOpacityProps {
    w?: FlexStyle['width'];
    h?: FlexStyle['height'];
    flex?: FlexStyle['flex'];
    flexDirect?: FlexStyle['flexDirection'];
    jC?: FlexStyle['justifyContent'];
    aI?: FlexStyle['alignItems'];
    aS?: FlexStyle['alignSelf'];
    bg?: string;
    radius?: number;
    ratio?: number;

    // border
    bW?: number;
    bC?: string;
    // Border chi tiết
    bTW?: number; // borderTopWidth
    bBW?: number; // borderBottomWidth
    bLW?: number; // borderLeftWidth
    bRW?: number; // borderRightWidth

    bTC?: string; // borderTopColor
    bBC?: string; // borderBottomColor
    bLC?: string; // borderLeftColor
    bRC?: string; // borderRightColor

    // spacings
    gap?: keyof Theme['spacings'] | number;
    p?: keyof Theme['spacings'] | number;
    pt?: keyof Theme['spacings'] | number;
    pb?: keyof Theme['spacings'] | number;
    pl?: keyof Theme['spacings'] | number;
    pr?: keyof Theme['spacings'] | number;
    ph?: keyof Theme['spacings'] | number;
    pv?: keyof Theme['spacings'] | number;
    m?: keyof Theme['spacings'] | number;
    mt?: keyof Theme['spacings'] | number;
    mb?: keyof Theme['spacings'] | number;
    ml?: keyof Theme['spacings'] | number;
    mr?: keyof Theme['spacings'] | number;
    mh?: keyof Theme['spacings'] | number;
    mv?: keyof Theme['spacings'] | number;
    children?: any;
}

const SPACING_KEYS = [
    'gap',
    'p',
    'pt',
    'pb',
    'pl',
    'pr',
    'ph',
    'pv',
    'm',
    'mt',
    'mb',
    'ml',
    'mr',
    'mh',
    'mv',
    'w',
    'h',
    'flex',
    'jC',
    'aI',
    'aS',
    'bg',
    'radius',
    'ratio',
    'bW',
    'bC',
    'bTW',
    'bBW',
    'bLW',
    'bRW',
    'bTC',
    'bBC',
    'bLC',
    'bRC',
    'style',
];

const Touch = memo(({ children, ...props }: TouchCustomProps) => {
    const propsWithoutCustom = omitBy(props, (_, key) => SPACING_KEYS.includes(key));
    const styles = useStyles(props);

    return (
        <T style={[styles.viewStyle, props.style]} {...propsWithoutCustom}>
            {children}
        </T>
    );
});

export default Touch;

const getSpacing = (theme: Theme, value?: keyof Theme['spacings'] | number) => {
    if (value === undefined) return undefined;
    return typeof value === 'string' ? theme.spacings[value] : theme.spacings.spacing(value);
};

const useStyles = (props: TouchCustomProps) => {
    const { theme } = useTheme();

    return StyleSheet.create({
        viewStyle: {
            flex: props.flex,
            flexDirection: props.flexDirect,
            justifyContent: props.jC,
            alignItems: props.aI,
            alignSelf: props.aS,
            width: props.w,
            height: props.h,
            backgroundColor: props.bg,
            borderRadius: props.radius,
            aspectRatio: props.ratio,

            // border
            borderWidth: props.bW,
            borderColor: props.bC,

            borderTopWidth: props.bTW,
            borderBottomWidth: props.bBW,
            borderLeftWidth: props.bLW,
            borderRightWidth: props.bRW,

            borderTopColor: props.bTC,
            borderBottomColor: props.bBC,
            borderLeftColor: props.bLC,
            borderRightColor: props.bRC,

            // spacings
            gap: getSpacing(theme, props.gap),

            padding: getSpacing(theme, props.p),
            paddingLeft: getSpacing(theme, props.pl),
            paddingRight: getSpacing(theme, props.pr),
            paddingTop: getSpacing(theme, props.pt),
            paddingBottom: getSpacing(theme, props.pb),

            margin: getSpacing(theme, props.m),
            marginLeft: getSpacing(theme, props.ml),
            marginRight: getSpacing(theme, props.mr),
            marginTop: getSpacing(theme, props.mt),
            marginBottom: getSpacing(theme, props.mb),

            ...(props.ph !== undefined && {
                paddingLeft: getSpacing(theme, props.ph),
                paddingRight: getSpacing(theme, props.ph),
            }),
            ...(props.pv !== undefined && {
                paddingTop: getSpacing(theme, props.pv),
                paddingBottom: getSpacing(theme, props.pv),
            }),
            ...(props.mh !== undefined && {
                marginLeft: getSpacing(theme, props.mh),
                marginRight: getSpacing(theme, props.mh),
            }),
            ...(props.mv !== undefined && {
                marginTop: getSpacing(theme, props.mv),
                marginBottom: getSpacing(theme, props.mv),
            }),
        },
    });
};
