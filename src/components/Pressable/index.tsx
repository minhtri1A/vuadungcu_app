import { Theme } from '@rneui/themed';
import { useTheme } from 'hooks';
import { includes, omitBy } from 'lodash';
import React, { memo } from 'react';
import {
    FlexStyle,
    StyleSheet,
    View as V,
    ViewProps,
    Pressable as Pr,
    PressableProps,
} from 'react-native';

export interface PressCustomProps extends PressableProps {
    activeOpacity?: number;
    ref?: any;
    //view style
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
    //padding
    gap?: keyof Theme['spacings'] | number;
    p?: keyof Theme['spacings'] | number;
    pt?: keyof Theme['spacings'] | number;
    pb?: keyof Theme['spacings'] | number;
    pl?: keyof Theme['spacings'] | number;
    pr?: keyof Theme['spacings'] | number;
    ph?: keyof Theme['spacings'] | number;
    pv?: keyof Theme['spacings'] | number;

    //margin
    m?: keyof Theme['spacings'] | number;
    mt?: keyof Theme['spacings'] | number;
    mb?: keyof Theme['spacings'] | number;
    ml?: keyof Theme['spacings'] | number;
    mr?: keyof Theme['spacings'] | number;
    mh?: keyof Theme['spacings'] | number;
    mv?: keyof Theme['spacings'] | number;
    //
    children?: any;
}

const Pressable = memo(function Pressable(props: PressCustomProps) {
    //props
    const { children, ref, activeOpacity } = props;
    //clear customs prop
    const propsButton = omitBy(props, (_, key) =>
        includes(
            [
                'p',
                'pt',
                'pb',
                'pl',
                'pr',
                'm',
                'mt',
                'mb',
                'ml',
                'mr',
                'children',
                'style',
                'w',
                'h',
                'flex',
                'jC',
                'aI',
                'aS',
                'bg',
                'radius',
                'ratio',
                'ref',
                'activeOpacity',
            ],
            key
        )
    );
    //

    //other

    //hooks
    const styles = useStyles(props);

    return (
        <Pr
            style={({ pressed }) => [
                styles.view_style,
                { opacity: pressed && activeOpacity ? activeOpacity : 1 },
            ]}
            {...propsButton}
            ref={ref}
        >
            {children}
        </Pr>
    );
});

export default Pressable;

const useStyles = ({
    gap,
    //padding
    p,
    pt,
    pb,
    pl,
    pr,
    ph,
    pv,
    //margin
    m,
    mt,
    mb,
    ml,
    mr,
    mh,
    mv,
    //view style
    w,
    h,
    bg,
    radius,
    ratio,
    //flex
    flex,
    flexDirect,
    jC,
    aI,
    aS,
    ref,
}: PressCustomProps) => {
    const { theme } = useTheme();

    ///padding
    const gap_ = typeof gap === 'string' ? theme.spacings[gap] : theme.spacings.spacing(gap);
    const padding = typeof p === 'string' ? theme.spacings[p] : theme.spacings.spacing(p);
    const paddingLeft = typeof pl === 'string' ? theme.spacings[pl] : theme.spacings.spacing(pl);
    const paddingRight = typeof pr === 'string' ? theme.spacings[pr] : theme.spacings.spacing(pr);
    const paddingTop = typeof pt === 'string' ? theme.spacings[pt] : theme.spacings.spacing(pt);
    const paddingBottom = typeof pb === 'string' ? theme.spacings[pb] : theme.spacings.spacing(pb);
    const paddingHorizontal = ph
        ? typeof ph === 'string'
            ? { paddingLeft: theme.spacings[ph], paddingRight: theme.spacings[ph] }
            : { paddingLeft: theme.spacings.spacing(ph), paddingRight: theme.spacings.spacing(ph) }
        : {};
    const paddingVertical = pv
        ? typeof pv === 'string'
            ? { paddingTop: theme.spacings[pv], paddingBottom: theme.spacings[pv] }
            : { paddingTop: theme.spacings.spacing(pv), paddingBottom: theme.spacings.spacing(pv) }
        : {};
    //margin
    const margin = typeof m === 'string' ? theme.spacings[m] : theme.spacings.spacing(m);
    const marginLeft = typeof ml === 'string' ? theme.spacings[ml] : theme.spacings.spacing(ml);
    const marginRight = typeof mr === 'string' ? theme.spacings[mr] : theme.spacings.spacing(mr);
    const marginTop = typeof mt === 'string' ? theme.spacings[mt] : theme.spacings.spacing(mt);
    const marginBottom = typeof mb === 'string' ? theme.spacings[mb] : theme.spacings.spacing(mb);
    const marginHorizontal = mh
        ? typeof mh === 'string'
            ? { marginLeft: theme.spacings[mh], marginRight: theme.spacings[mh] }
            : { marginLeft: theme.spacings.spacing(mh), marginRight: theme.spacings.spacing(mh) }
        : {};
    const marginVertical = mv
        ? typeof mv === 'string'
            ? { marginTop: theme.spacings[mv], marginBottom: theme.spacings[mv] }
            : { marginTop: theme.spacings.spacing(mv), marginBottom: theme.spacings.spacing(mv) }
        : {};
    return StyleSheet.create({
        /* -------home screen------- */
        view_style: {
            flex: flex,
            flexDirection: flexDirect,
            justifyContent: jC,
            alignItems: aI,
            alignSelf: aS,
            //s
            width: w,
            height: h,
            backgroundColor: bg,
            borderRadius: radius,
            aspectRatio: ratio,
            //padding
            padding,
            paddingLeft,
            paddingRight,
            paddingTop,
            paddingBottom,
            //margin
            margin,
            marginLeft,
            marginRight,
            marginTop,
            marginBottom,
            gap: gap_,
            ...paddingHorizontal,
            ...paddingVertical,
            ...marginHorizontal,
            ...marginVertical,
        },
    });
};
