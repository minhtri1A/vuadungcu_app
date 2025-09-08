import { Theme } from '@rneui/themed';
import { useTheme } from 'hooks';
import { includes, omitBy } from 'lodash';
import React, { memo, useMemo } from 'react';
import { FlexStyle, StyleSheet, Text as TXT, TextProps } from 'react-native';
import { themeType } from 'theme';
import { fontWeightType, textAlignType } from 'theme/typography';

interface Props extends TextProps {
    size?: keyof Omit<themeType['typography'], 'fontFamily' | 'size'> | number;
    color?: string;
    bg?: string;
    fw?: fontWeightType;
    ta?: textAlignType;
    lh?: number;
    tD?: 'none' | 'underline' | 'line-through' | 'underline line-through';
    flex?: FlexStyle['flex'];
    aS?: FlexStyle['alignSelf'];
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
    pattern?: 'sale_price' | 'price' | 'error';
}
export type TextCustomProps = Props;

const Text = memo(function Text(props: Props) {
    const { theme } = useTheme();
    const styles = useMemo(() => createStyles(theme, props), [theme, props]);
    const { children, pattern, style, ...restProps } = props;

    const propsFiltered = omitBy(restProps, (_, key) =>
        includes(
            [
                'size',
                'color',
                'fw',
                'ta',
                'lh',
                'aS',
                'bg',
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
                'tD',
                'pattern',
                'style',
            ],
            key
        )
    );

    return (
        <TXT style={[styles.default, pattern && styles[pattern || ''], style]} {...propsFiltered}>
            {children}
        </TXT>
    );
});

const getSpacing = (theme: themeType, value?: keyof Theme['spacings'] | number) => {
    if (!value) return undefined;
    return typeof value === 'string' ? theme.spacings[value] : theme.spacings.spacing(value);
};

const createStyles = (theme: themeType, props: Props) => {
    const size = props.size || 'body1';
    const fontSize =
        typeof size === 'string' ? theme.typography[size] : theme.typography.size(size);

    return StyleSheet.create({
        default: {
            flex: props.flex,
            fontSize,
            color: props.color || theme.colors.black_[10],
            backgroundColor: props.bg,
            fontWeight: props.fw,
            textAlign: props.ta,
            lineHeight: props.lh,
            alignSelf: props.aS,
            textDecorationLine: props.tD,

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
        price: {
            fontSize: theme.typography.body1,
            color: theme.colors.grey_[400],
            textDecorationLine: 'line-through',
        },
        sale_price: {
            textAlignVertical: 'center',
            fontSize: theme.typography.body2,
            color: theme.colors.red['400'],
        },
        error: {
            color: theme.colors.red['500'],
            fontSize: theme.typography.sub2,
        },
    });
};

export default Text;
