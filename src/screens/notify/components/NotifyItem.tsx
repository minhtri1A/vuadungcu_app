import { Icon } from '@rneui/themed';
import Collapse from 'components/Collapse';
import Image from 'components/Image';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import React, { memo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { themeType } from 'theme';
/* eslint-disable react-hooks/exhaustive-deps */
// import { StackNavigationProp } from '@react-navigation/stack';

// interface Props {
//     navigation: StackNavigationProp<any, any>;
// }

const NotifyItem = memo(function NotifyItem() {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles(theme);
    const [collapseVisible, setCollapseVisible] = useState(false);

    //render

    //handle
    const handleVisibleClick = (visible: boolean) => {
        setCollapseVisible(visible);
    };

    return (
        <View style={styles.view_wrap_item}>
            {/* top */}
            <View style={styles.view_item_top}>
                <Image source={require('asset/img_icon_vdc_black.png')} resizeMode="contain" />
            </View>
            {/* body */}
            <View flexDirect="row">
                <View style={styles.view_image}>
                    {/* <Image source={require('asset/img_ring.png')} resizeMode="contain" /> */}
                    <View style={{ position: 'absolute', top: 0, right: 3, zIndex: 99 }}>
                        <Icon
                            type="octicon"
                            name="dot-fill"
                            color={theme.colors.red['500']}
                            size={theme.typography.size(18)}
                        />
                    </View>
                </View>
                <View flex={1} ml="medium">
                    <Text fw="bold" numberOfLines={collapseVisible ? 3 : 2}>
                        Thông báo đây nè thông báo đay nè thông báo đây nè
                    </Text>
                    {!collapseVisible ? (
                        <Text color={theme.colors.grey_[500]} numberOfLines={1}>
                            Thông báo đây nè thông báo đay nè thông báo đây nè
                        </Text>
                    ) : null}
                </View>
            </View>
            {/* collap */}
            <Collapse
                initHeight={theme.dimens.verticalScale(30)}
                color={theme.colors.grey_[400]}
                viewMoreHeight={theme.dimens.verticalScale(30)}
                viewLessHeight={theme.dimens.verticalScale(50)}
                onVisibleCollapse={handleVisibleClick}
                liner={false}
            >
                <View pt="medium">
                    <Text color={theme.colors.grey_[500]}>
                        Thông báo đây nè thông báo đay nè thông báo đây nè Thông báo đây nè thông
                        báo đay nè thông báo đây nè Thông báo đây nè thông báo đay nè thông báo đây
                        nè2
                    </Text>
                    <View w={'100%'} ratio={2 / 1} mt="small">
                        {/* <Image
                            source={require('asset/img_news_2.png')}
                            resizeMode="cover"
                            radius={5}
                        /> */}
                    </View>
                </View>
            </Collapse>
            {/* bottom */}
            <View style={styles.view_item_bottom}>
                <Text size={'sub2'} color={theme.colors.grey_[400]}>
                    1-1-2020
                </Text>
            </View>
        </View>
    );
});

const useStyles = (theme: themeType) => {
    return StyleSheet.create({
        /* ------- screen ------- */

        view_wrap_item: {
            backgroundColor: theme.colors.white_[10],
            paddingHorizontal: theme.spacings.medium,
            paddingVertical: theme.spacings.extraLarge,
            borderRadius: 5,
            marginTop: theme.spacings.medium,
            margin: 2,
            ...theme.styles.shadow2,
        },
        view_item_top: {
            width: theme.dimens.scale(20),
            aspectRatio: 1,
            position: 'absolute',
            right: theme.spacings.small,
            top: theme.spacings.tiny,
        },
        view_image: {
            width: '20%',
            aspectRatio: 1,
            backgroundColor: theme.colors.main['300'],
            padding: theme.spacings.small,
            borderRadius: 5,
        },
        view_item_bottom: {
            position: 'absolute',
            right: theme.spacings.small,
            bottom: theme.spacings.tiny,
        },
    });
};

export default NotifyItem;
