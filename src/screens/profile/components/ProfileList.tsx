import Image from 'components/Image';
import Text from 'components/Text';
import Title from 'components/Title';
import View from 'components/View';
import { Message, Status } from 'const/index';
import { getMessage, useIsLogin, useNavigate, useTheme } from 'hooks';
import usePosListSWRInfinite from 'hooks/swr/posSwr/usePosListSWRInfinite';
import useSpinAttendanceSwr from 'hooks/swr/spinSwr/useSpinAttendanceSwr';
import React, { memo, useEffect, useState } from 'react';
import DeviceInfo from 'react-native-device-info';
import { showMessage } from 'react-native-flash-message';
import useStyles from '../styles';

interface Props {
    refresh: boolean;
}

const ProfileList = memo(function ProfileList({ refresh }: Props) {
    //hooks
    const { theme } = useTheme();
    const navigate = useNavigate();
    const isLogin = useIsLogin();
    const styles = useStyles();

    //swr
    const { data: dataSpin, mutate: mutateSpin } = useSpinAttendanceSwr({
        revalidateOnMount: false,
    });
    const { posList, mutate: mutatePosList } = usePosListSWRInfinite({ revalidateOnMount: false });
    //state
    const [status, setStatus] = useState<string>(Status.DEFAULT);
    const [message, setMessage] = useState(Message.NOT_MESSAGE);
    //value
    const messageh = getMessage(message);

    //const
    const titleLeftProps: any = { size: 'body1', ml: 'small' };
    //effect
    //init
    useEffect(() => {
        if (isLogin) {
            mutateSpin();
            mutatePosList();
        }
    }, [isLogin]);
    //--refresh
    useEffect(() => {
        if (refresh && isLogin) {
            mutateSpin();
            mutatePosList();
        }
    }, [refresh, isLogin]);
    //--show message
    useEffect(() => {
        if (status === Status.SUCCESS || status === Status.ERROR) {
            showMessage({
                message: messageh,
                icon: status === Status.SUCCESS ? 'success' : 'danger',
                onHide: () => {
                    setStatus(Status.DEFAULT);
                    setMessage(Message.NOT_MESSAGE);
                },
            });
        }
    }, [status, messageh]);

    //render comment

    return (
        <View style={styles.view_list_container}>
            {isLogin ? (
                <View style={styles.view_list}>
                    <View style={styles.txt_list_title}>
                        <Text size={'body2'}>Tiện ích</Text>
                    </View>
                    {/* gift */}
                    <Title
                        titleLeft="Quà tặng của bạn"
                        flexLeft={1}
                        iconLeftProps={{
                            type: 'ionicon',
                            name: 'gift',
                            color: theme.colors.blue['500'],
                            size: theme.typography.title3,
                        }}
                        titleLeftProps={titleLeftProps}
                        chevron
                        onPress={navigate.GIFT_ROUTE}
                    />
                    {dataSpin?.spin?.active === 'Y' ? (
                        <Title
                            titleLeft="Quay thưởng mỗi ngày"
                            IconLeft={
                                <Image
                                    source={require('asset/wheel.png')}
                                    w={theme.typography.title1}
                                    h={theme.typography.title1}
                                />
                            }
                            titleLeftProps={{ size: 'body1', ml: theme.spacings.spacing(16) }}
                            chevron
                            onPress={navigate.SPIN_ATTENDANCE_ROUTE}
                            flexLeft={1}
                        />
                    ) : null}

                    {/* warranty */}
                    <Title
                        titleLeft="Sổ bảo hành"
                        iconLeftProps={{
                            type: 'ionicon',
                            name: 'ribbon',
                            color: theme.colors.green['500'],
                            size: theme.typography.title3,
                        }}
                        titleLeftProps={titleLeftProps}
                        chevron
                        onPress={navigate.WARRANTY_ROUTE()}
                    />
                    {/* coin */}
                    <Title
                        titleLeft="Xu Dụng Cụ"
                        IconLeft={
                            <Image
                                source={require('asset/img-icon-coin.png')}
                                w={theme.typography.title1}
                                h={theme.typography.title1}
                            />
                        }
                        titleLeftProps={{ size: 'body1', ml: theme.spacings.spacing(16) }}
                        chevron
                        onPress={navigate.COIN_ROUTE}
                    />

                    {/* loyal point */}
                    {posList?.length > 0 ? (
                        <Title
                            titleLeft="Cửa hàng trực tiếp"
                            flexLeft={1}
                            iconLeftProps={{
                                type: 'material',
                                name: 'card-membership',
                                color: theme.colors.red['400'],
                                size: theme.typography.title3,
                            }}
                            titleLeftProps={titleLeftProps}
                            chevron
                            onPress={navigate.POS_LIST_ROUTE}
                        />
                    ) : null}

                    {/* address */}
                    <Title
                        titleLeft="Sổ địa chỉ"
                        iconLeftProps={{
                            type: 'ionicon',
                            name: 'location',
                            color: theme.colors.red['500'],
                            size: theme.typography.title3,
                        }}
                        titleLeftProps={titleLeftProps}
                        chevron
                        onPress={navigate.ADDRESS_ROUTE({ type: 'customer' })}
                    />
                </View>
            ) : null}

            {/* policy */}
            {/* <Text p="small" size={'body1'} color={theme.colors.grey_[400]}>
                Về vua dụng cụ
            </Text> */}
            <View style={styles.view_list}>
                <View style={styles.txt_list_title}>
                    <Text size={'body2'}>Về vua dụng cụ</Text>
                </View>
                <Title
                    titleLeft="Quy chế hoạt động"
                    flexLeft={1}
                    iconLeftProps={{
                        type: 'material-community',
                        name: 'file-document-outline',
                        color: theme.colors.grey_[500],
                        size: theme.typography.title3,
                    }}
                    titleLeftProps={titleLeftProps}
                    chevron
                    onPress={navigate.POLICY_DETAIL_ROUTE({ type: 'general_mobile' })}
                />

                <Title
                    titleLeft="Chính sách vua dụng cụ"
                    flexLeft={1}
                    iconLeftProps={{
                        type: 'ionicon',
                        name: 'shield-checkmark-outline',
                        color: theme.colors.grey_[500],
                        size: theme.typography.title3,
                    }}
                    titleLeftProps={titleLeftProps}
                    chevron
                    onPress={navigate.POLICY_ROUTE()}
                />

                <Title
                    titleLeft="Cơ chế giải quyết tranh chấp"
                    flexLeft={1}
                    iconLeftProps={{
                        type: 'ionicon',
                        name: 'layers-outline',
                        color: theme.colors.grey_[500],
                        size: theme.typography.title3,
                    }}
                    titleLeftProps={titleLeftProps}
                    chevron
                    onPress={navigate.POLICY_DETAIL_ROUTE({ type: 'dispute' })}
                />

                <Title
                    titleLeft="Giới thiệu"
                    flexLeft={1}
                    iconLeftProps={{
                        type: 'ionicon',
                        name: 'help-circle-outline',
                        color: theme.colors.grey_[500],
                        size: theme.typography.title3,
                    }}
                    titleLeftProps={titleLeftProps}
                    chevron
                    onPress={navigate.INTRODUCTION_ROUTE()}
                />

                <View style={styles.view_device_info}>
                    <Text>Thông tin ứng dụng</Text>
                    <Text>{` Phiên bản: ${DeviceInfo.getVersion()}`}</Text>
                </View>
            </View>
        </View>
    );
});

// const useStyles = () => {
//     const { theme } = useTheme();
//     return StyleSheet.create({
//         WrapInfoOder: {
//             backgroundColor: theme.colors.white_[10],
//         },

//         ListInfoOders: {
//             flexDirection: 'row',
//             justifyContent: 'space-around',
//             paddingTop: theme.spacings.small,
//         },
//         InfoOder: {
//             alignItems: 'center',
//             width: '25%',
//         },
//     });
// };

export default ProfileList;
