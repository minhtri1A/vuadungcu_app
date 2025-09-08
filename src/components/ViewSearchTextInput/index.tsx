import Text from 'components/Text';
import { NAVIGATION_TO_SEARCH_SCREEN } from 'const/routes';
import { useTheme } from 'hooks';
import * as RootNavigation from 'navigation/RootNavigation';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { themeType } from 'theme';

interface Props {
    textInputCenter?: any;
}

const ViewSearchTextInput = memo(function ViewSearchTextInput({ textInputCenter = null }: Props) {
    const { theme } = useTheme();
    const styles = useStyles(theme);

    const navigationSearchScreen = () => {
        RootNavigation.navigate(NAVIGATION_TO_SEARCH_SCREEN);
    };

    return (
        <TouchableOpacity
            style={styles.searchTextInput}
            activeOpacity={0.8}
            onPress={navigationSearchScreen}
        >
            <Icon
                name={'search-sharp'}
                size={theme.typography.title2}
                color={theme.colors.main['600']}
                style={styles.iconSearch}
            />
            <Text style={styles.placeholder}>
                {textInputCenter !== null ? textInputCenter : 'Bấm vào để tìm kiếm'}
            </Text>
        </TouchableOpacity>
    );
});

export default ViewSearchTextInput;

const useStyles = (theme: themeType) =>
    StyleSheet.create({
        searchTextInput: {
            flexDirection: 'row',
            width: '100%',
            backgroundColor: theme.colors.white_[10],
            borderRadius: theme.spacings.tiny,
            paddingLeft: theme.spacings.small,
            paddingRight: theme.spacings.small,
            alignItems: 'center',
        },
        iconSearch: {
            padding: theme.spacings.small,
        },

        placeholder: {
            fontSize: theme.typography.body2,
            color: theme.colors.main['600'],
        },
    });
