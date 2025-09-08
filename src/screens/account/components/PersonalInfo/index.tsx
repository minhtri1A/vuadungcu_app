import { ListItem } from '@rneui/themed';
import PersonalEditModal from 'components/AccountModal/PersonalEditModal';
import Text from 'components/Text';
import { useTheme } from 'hooks';
import { CustomerSwrType } from 'models';
import moment from 'moment';
import React, { memo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { themeType } from 'theme';

interface Props {
    customerSwr: CustomerSwrType;
}

export default memo(function PersonalInfo({ customerSwr }: Props) {
    //hook
    const { theme } = useTheme();
    const styles = useStyles(theme);
    //swr
    const {
        customers: { firstname, lastname, dob, gender },
        updateOrAddCustomerInfo,
    } = customerSwr;
    //value
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDateModal, setOpenDateModal] = useState(false);
    const [typeEdit, setTypeEdit] = useState<any>('');
    const personalInfo = {
        firstname,
        lastname,
        dob,
        gender,
    };

    //account edit modal
    const handleOpenEditModal = (type?: string) => () => {
        setOpenEditModal(true);
        setTypeEdit(type);
    };
    const handleCloseEditModal = () => {
        setOpenEditModal(false);
    };
    //date modal
    const handleOpenDateModal = () => {
        setOpenDateModal(true);
    };
    const handleSubmitDate = (date: Date) => {
        setOpenDateModal(false);
        // dispatch(
        //     PUT_CUSTOMER_INFO({
        //         type: 'profile',
        //         data: {
        //             ...personalInfo,
        //             dob: moment(date).format('YYYY-MM-DD'),
        //         },
        //     })
        // );
        updateOrAddCustomerInfo('profile', {
            ...personalInfo,
            dob: moment(date).format('YYYY-MM-DD'),
        });
    };

    return (
        <>
            {/* personal info */}
            <View style={styles.view_titleStyle}>
                <Text fw="bold" color={theme.colors.grey_[400]}>
                    Thông tin cá nhân
                </Text>
            </View>
            {/* ---lastname--- */}
            <ListItem
                bottomDivider
                containerStyle={styles.list_containerStyle}
                onPress={handleOpenEditModal('lastname')}
            >
                <ListItem.Title style={styles.list_title_style}>Họ của bạn</ListItem.Title>
                <ListItem.Title style={styles.list_titleValue}>{lastname}</ListItem.Title>
                <ListItem.Chevron size={theme.typography.body3} />
            </ListItem>
            {/* ---firstname--- */}
            <ListItem
                bottomDivider
                containerStyle={styles.list_containerStyle}
                onPress={handleOpenEditModal('firstname')}
            >
                <ListItem.Title style={styles.list_title_style}>Tên của bạn</ListItem.Title>
                <ListItem.Title style={styles.list_titleValue}>{firstname}</ListItem.Title>
                <ListItem.Chevron size={theme.typography.body3} />
            </ListItem>
            {/* birtday */}
            <ListItem
                bottomDivider
                containerStyle={styles.list_containerStyle}
                onPress={handleOpenDateModal}
            >
                <ListItem.Title style={styles.list_title_style}>Năm sinh</ListItem.Title>
                <ListItem.Title style={styles.list_titleValue}>
                    {moment(dob ? dob : new Date()).format('DD-MM-YYYY')}
                </ListItem.Title>
                <ListItem.Chevron size={theme.typography.body3} />
            </ListItem>
            {/* ---gender--- */}
            <ListItem
                containerStyle={styles.list_containerStyle}
                onPress={handleOpenEditModal('gender')}
            >
                <ListItem.Title style={styles.list_title_style}>Giới tính</ListItem.Title>
                <ListItem.Title style={styles.list_titleValue}>
                    {gender === 'M' ? 'Nam' : gender === 'F' ? 'Nữ' : 'Chưa rõ'}
                </ListItem.Title>
                <ListItem.Chevron size={theme.typography.body2} />
            </ListItem>
            {/* modal - edit - personal info */}
            {openEditModal ? (
                <PersonalEditModal
                    open={openEditModal}
                    handleCloseEditModal={handleCloseEditModal}
                    typeEdit={typeEdit}
                    customerSwr={customerSwr}
                />
            ) : null}

            {/* date picker */}
            {openDateModal ? (
                <DatePicker
                    modal
                    mode={'date'}
                    open={openDateModal}
                    date={dob ? new Date(dob) : new Date()}
                    onConfirm={handleSubmitDate}
                    onCancel={() => {
                        setOpenDateModal(false);
                    }}
                    // locale="vi_VN"
                    confirmText={'Hoàn thành'}
                    cancelText="Huỷ bỏ"
                    title={'Chọn năm sinh'}
                    // androidVariant="iosClone"
                    // textColor={theme.colors.black_[10]}
                />
            ) : null}
        </>
    );
});

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        view_titleStyle: {
            padding: theme.spacings.small,
        },
        list_containerStyle: {
            justifyContent: 'space-between',
            padding: theme.spacings.medium,
            paddingLeft: theme.spacings.small,
            paddingRight: theme.spacings.small,
            backgroundColor: theme.colors.white_[10],
        },
        list_titleValue: {
            flex: 1,
            textAlign: 'right',
            color: theme.colors.grey_[500],
            fontSize: theme.typography.body1,
        },
        list_title_style: {
            fontSize: theme.typography.body2,
            color: theme.colors.black_[10],
        },
        list_sub_title_style: {
            fontSize: theme.typography.sub2,
        },
    });
