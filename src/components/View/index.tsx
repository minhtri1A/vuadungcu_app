import React, { memo } from 'react';
import { View as V, ViewProps, StyleSheet, FlexStyle } from 'react-native';
import { Theme } from '@rneui/themed';
import { useTheme } from 'hooks';
import { omitBy } from 'lodash';

export interface ViewCustomProps extends ViewProps {
    ref?: any;
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
    position?: 'absolute' | 'relative' | 'static';

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

    // Spacing
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

const View = memo((props: ViewCustomProps) => {
    const { children, ref } = props;
    const propsWithoutCustom = omitBy(props, (_, key) => SPACING_KEYS.includes(key));
    const styles = useStyles(props);

    return (
        <V style={[styles.viewStyle, props.style]} {...propsWithoutCustom} ref={ref}>
            {children}
        </V>
    );
});

export default View;

const getSpacing = (theme: Theme, value?: keyof Theme['spacings'] | number) => {
    if (value === undefined) {
        return undefined;
    }
    return typeof value === 'string' ? theme.spacings[value] : theme.spacings.spacing(value);
};

const useStyles = (props: ViewCustomProps) => {
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
            position: props.position,

            //border
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

            // spacing
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
