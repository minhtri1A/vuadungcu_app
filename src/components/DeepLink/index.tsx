import Touch, { TouchCustomProps } from 'components/Touch';
import { useNavigate } from 'hooks';
import * as React from 'react';
import { Linking } from 'react-native';
import { isEmpty } from 'utils/helpers';

export interface Props extends TouchCustomProps {
    children: React.ReactNode;
    url: string;
}

export default function DeepLink(props: Props) {
    //hooks
    const navigate = useNavigate();
    //value
    const { children, url } = props;
    const iprops = {
        ...props,
        children: undefined,
        url: undefined,
    };
    const handlePress = () => {
        if (!isEmpty(url) && url !== '#') {
            // Linking.canOpenURL(url)
            //     .then((supported) => {
            //         if (supported) {
            //             Linking.openURL(url);
            //         } else {
            //             console.log('Cannot open URL', url);
            //         }
            //     })
            //     .catch((error) => {
            //         console.log(error);
            //     });
            //check app or web link
            if (url.includes('vdcapp://')) {
                Linking.openURL(url);
            } else {
                navigate.WEBVIEW_SCREEN_ROUTE({ url })();
            }
        }
    };
    return (
        <Touch activeOpacity={0.8} {...iprops} onPress={handlePress}>
            {children}
        </Touch>
    );
}
