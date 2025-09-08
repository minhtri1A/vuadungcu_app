import Text from 'components/Text';
import Title from 'components/Title';
import View from 'components/View';
import { useIsLogin, useTheme } from 'hooks';
import { EventLoyalPointSwrType } from 'models';
import React, { memo } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import IconsCustom from 'theme/IconsCustom';
import useStyles from '../styles';

interface Props {
    EventLoyalPointSwr: EventLoyalPointSwrType;
}

const ProfileAccumulated = memo(function ProfileAccumulated({ EventLoyalPointSwr }: Props) {
    //hooks
    const { theme } = useTheme();
    const styles = useStyles();
    const isLogin = useIsLogin();
    //swr
    const { data: customerAccumulated } = EventLoyalPointSwr;
    //value
    const { loyal_name, score, discount } = customerAccumulated || {};
    // <DotIndicator color={theme.colors.main["600"]} size={4} />

    const checkRenderPoint = () => {
        if (isLogin) {
            return (
                <>
                    <View style={styles.view_wrapAml}>
                        <View style={styles.view_Aml}>
                            <View flexDirect="row" jC="center" p={'tiny'}>
                                <Text>Cấp bậc hiện tại </Text>
                            </View>
                            <View style={styles.view_valueAml}>
                                <Text size={'title1'} ta="center" numberOfLines={2}>
                                    {loyal_name}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.view_Aml}>
                            <View flexDirect="row" jC="center" p={'tiny'}>
                                <Text>Chiết khấu hiện tại</Text>
                            </View>
                            <View style={styles.view_valueAml}>
                                <Text size={'title1'} ta="center">
                                    {discount}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.view_timeExpired}>
                        <Icon
                            name="alarm-outline"
                            size={theme.typography.size(20)}
                            color={theme.colors.grey_[500]}
                        />
                        <Text size={'sub1'}>31-12-2021</Text>
                    </View>
                </>
            );
        }

        return (
            <View style={styles.view_loginTitle}>
                <Text color={theme.colors.grey_[500]}>Đăng nhập để xem điểm tích luỹ</Text>
            </View>
        );
    };

    return (
        <View style={styles.view_amlContainer}>
            <Title
                titleLeft={'Điểm tích luỹ'}
                IconLeft={
                    <IconsCustom
                        name={'logo-ntl'}
                        size={theme.typography.title1}
                        color={theme.colors.red['500']}
                    />
                }
                iconRightProps={{
                    type: 'ionicon',
                    name: 'aperture',
                    size: theme.typography.title1,
                    color: theme.colors.main['600'],
                }}
                titleRight={score}
                wrapperContainerStyle={{ marginBottom: theme.spacings.medium }}
                containerStyle={{ paddingHorizontal: theme.spacings.small }}
                titleLeftProps={{ size: 'body3', ml: 'small' }}
                titleRightProps={{ fw: 'bold', color: theme.colors.main['600'] }}
                containerProps={{ ml: 4 }}
                dividerBottom
            />

            {checkRenderPoint()}
        </View>
    );
});

export default ProfileAccumulated;
