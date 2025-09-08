import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        /* ------login screen------* */
        view_loginContainer: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
        },
        view_loginHeader: {
            height: theme.dimens.height * 0.2,
            alignItems: 'center',
            marginTop: theme.spacings.extraLarge,
        },
        /* ------register screen------ */
        view_registerContainer: {
            flex: 1,
            backgroundColor: theme.colors.white_[10],
        },
        view_wrapInput: {
            flex: 1,
            paddingLeft: theme.spacings.medium,
            paddingRight: theme.spacings.medium,
        },
        view_wrap_referral: {
            marginBottom: theme.spacings.medium * 2,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderTopColor: theme.colors.grey_[200],
            borderBottomColor: theme.colors.grey_[200],
            paddingVertical: theme.spacings.medium,
        },
        /* ------signin user------ */
        view_signuserContainer: {
            alignItems: 'center',
        },
        view_inputStyle: {
            width: '100%',
            paddingLeft: theme.spacings.medium,
            paddingRight: theme.spacings.medium,
        },
        view_buttonLogin: {
            marginTop: theme.spacings.large,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.spacings.medium,
            width: theme.dimens.width,
            padding: theme.spacings.medium,
        },

        view_wrapBtnUser: {
            flexDirection: 'row',

            height: theme.dimens.height * 0.065,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        /* ------common------ */
        createBorder: {
            flex: 0.1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },

        borders: {
            width: '50%',
            height: 1,
            borderTopWidth: 0.5,
            borderColor: theme.colors.grey_[400],
        },
        txtOtherLogin: {
            width: '20%',
            textAlign: 'center',
            fontSize: theme.typography.body1,
            color: theme.colors.grey_[400],
        },
        /* ------signin social common ------ */
        touch_social: {
            flex: 1,
            flexDirection: 'row',
            padding: theme.dimens.sizeElement('md'),
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.spacings.small,
            borderRadius: 5,
        },
        btn_title_style: {
            flex: 1,
            // textAlign: 'center',
            paddingLeft: '10%',
        },
    });
};

export default useStyles;
