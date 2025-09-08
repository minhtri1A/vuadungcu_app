import { useFocusEffect } from '@react-navigation/native';
import Alert from 'components/Alert';
import { Routes } from 'const/index';
import { SET_NUM_SHOW_PHONE_CONFIRM } from 'features/action';
import {
    useAppDispatch,
    useAppSelector,
    useCartOrderStatusSwr,
    useCustomerSwr,
    useIsLogin,
    useNavigation,
    usePreventAppExist,
} from 'hooks';
import useGiftSwr from 'hooks/swr/gift/useGiftSwr';
import { useRefreshControl } from 'hooks/useRefreshControl';
import React, { memo, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import ProfileHeader from './components/ProfileHeader';
import ProfileList from './components/ProfileList';
import ProfileOrders from './components/ProfileOrders';
import useStyles from './styles';
/* eslint-disable react-hooks/exhaustive-deps */
// import { StackNavigationProp } from '@react-navigation/stack';

// interface Props {
//     navigation: StackNavigationProp<any, any>;
// }

const numShowPhoneConfirm = 2;

const ProfileScreen = memo(function ProfileScreen() {
    //hooks
    const isLogin = useIsLogin();
    const styles = useStyles();
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const currentNumShow = useAppSelector((state) => state.apps.numShowPhoneConfirm);

    //swr
    const customersSwr = useCustomerSwr('all', { revalidateOnMount: false });
    const giftSwr = useGiftSwr();
    const {
        customers: { telephone_confirm },
    } = customersSwr;
    const cartOrderStatusSwr = useCartOrderStatusSwr({ revalidateOnMount: false });

    //state
    //--alert phone confirm
    const [openAlert, setOpenAlert] = useState(false);
    const [effect, setEffect] = useState(false);

    //refresh
    const { refreshing, refreshControl } = useRefreshControl(() => {
        customersSwr.mutate();
        cartOrderStatusSwr.mutate();
        giftSwr.mutate();
    });

    /* --- effect --- */
    usePreventAppExist();
    //--check login
    useEffect(() => {
        //
        if (isLogin) {
            customersSwr.mutate();
            cartOrderStatusSwr.mutate();
            giftSwr.mutate();
        }
    }, [isLogin]);

    //--xử lý open confirm
    useEffect(() => {
        if (
            (telephone_confirm === null || telephone_confirm === 'N') &&
            currentNumShow < numShowPhoneConfirm &&
            effect
        ) {
            //sử dụng flag effect nhằm tránh xử lý liên tục khi currentNumShow thây đổi
            setOpenAlert(true);
            dispatch(SET_NUM_SHOW_PHONE_CONFIRM(currentNumShow + 1));
        }
    }, [effect, telephone_confirm]);

    //--kiểm tra khi nào user vào màn hình này
    useFocusEffect(
        React.useCallback(() => {
            setEffect(true);
            return () => {
                setEffect(false);
            };
        }, [])
    );

    /* --- handle --- */

    /* --- navigate --- */
    const navigateToPhoneConfirm = () => {
        setOpenAlert(false);
        navigation.navigate(Routes.NAVIGATION_ACCOUNT_STACK, {
            screen: Routes.NAVIGATION_EDIT_VERIFY_SCREEN,
            params: {
                type: 'telephone',
                title: 'Số điện thoại',
            },
        });
    };

    return (
        <View style={styles.view_container}>
            <View style={styles.view_header}>
                <ProfileHeader customersSwr={customersSwr} giftSwr={giftSwr} />
            </View>
            <ScrollView
                style={styles.flatlist_style}
                refreshControl={refreshControl()}
                showsVerticalScrollIndicator={false}
            >
                {/* order */}
                {isLogin ? <ProfileOrders cartOrderStatusSwr={cartOrderStatusSwr} /> : <></>}
                {/* LoyalPoint */}

                {/* bottom list */}
                <ProfileList refresh={refreshing} />
            </ScrollView>

            {/* alert check phone confirm */}
            <Alert
                title="Thêm số điện thoại cho tài khoản"
                message="Để cải thiện trải nghiệm của bạn và đảm bảo rằng chúng tôi có thể cung cấp hỗ trợ tốt nhất cho bạn, chúng tôi cần bạn cung cấp số điện thoại của bạn cho chúng tôi. Nhấn vào để thêm số điện thoại !"
                isVisible={openAlert}
                messageProps={{ ta: 'center' }}
                modalProps={{ backdropOpacity: 0.4 }}
                okBtnTitle="Thêm số điện thoại"
                onOk={navigateToPhoneConfirm}
                onCancel={() => setOpenAlert(false)}
            />
        </View>
    );
});

export default ProfileScreen;
