import { useTheme } from 'hooks';
import { StyleSheet } from 'react-native';

const useStyles = () => {
    const { theme } = useTheme();
    return StyleSheet.create({
        ////////////address form screen/////////////
        list_defaultAddress: {
            justifyContent: 'space-between',
            paddingVertical: theme.spacings.medium,
            backgroundColor: theme.colors.white_[10],
        },
        v_btnAddnew: {
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: theme.spacings.large,
            paddingHorizontal: theme.spacings.medium,
        },
        v_errorFormik: {
            backgroundColor: theme.colors.white_[10],
            paddingLeft: theme.spacings.medium,
        },
        //address form location
        search_container: {
            width: '98%',
            backgroundColor: theme.colors.white_[10],
            borderTopWidth: 0,
            borderBottomWidth: 0,
        },
        inputContainerSearch: {
            borderRadius: 10,
            backgroundColor: theme.colors.grey_[100],
            height: '90%',
        },
        view_searchLocation: {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.colors.white_[10],
            height: theme.dimens.height * 0.1,
        },
        list_title_style: {
            fontSize: theme.typography.body2,
            color: theme.colors.black_[10],
        },
        list_title_location_style: {
            flex: 1,
            fontSize: theme.typography.body2,
            color: theme.colors.black_[10],
        },
        list_sub_title_style: {
            fontSize: theme.typography.sub2,
        },
        list_input_style: {
            fontSize: theme.typography.body1,
        },

        //
        list_container: {
            justifyContent: 'space-between',
            backgroundColor: theme.colors.white_[10],
        },
    });
};

export default useStyles;
