import { RouteProp } from '@react-navigation/native';
import { NewsStackParamsList } from 'navigation/type';
import React, { memo, useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import AfterInteractions from 'components/AfterInteractions';
import Text from 'components/Text';
import { useTheme } from 'hooks';
/* eslint-disable react-hooks/exhaustive-deps */
import Slider from '@react-native-community/slider';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Icon } from '@rneui/themed';
import BottomSheet from 'components/BottomSheet';
import Divider from 'components/Divider';
import LoadingFetchAPI from 'components/LoadingFetchAPI';
import NewsItemHorizontal from 'components/NewsItemHorizontal.tsx';
import Touch from 'components/Touch';
import View from 'components/View';
import { REACT_NATIVE_APP_WEB_URL } from 'const/env';
import { Status } from 'const/index';
import { NEWS_DETAIL_PAGE_URL } from 'const/webPath';
import useNewsDetailSwr from 'hooks/swr/newsSwr/useNewsDetailSwr';
import useNewsSwr from 'hooks/swr/newsSwr/useNewsSwr';
import { map } from 'lodash';
import { Platform, ScrollView } from 'react-native';
import HTML from 'react-native-render-html';
import Share from 'react-native-share';
import WebView from 'react-native-webview';
import { calculatorBetweenTwoTime, isEmpty } from 'utils/helpers';
import useStyles from '../styles';
import { sendSentryError } from 'utils/storeHelpers';
import Header from 'components/Header2';

interface Props {
    // navigation: NativeStackScreenProps<ProductStackParamsList, 'ProductScreen'>;
    route: RouteProp<NewsStackParamsList, 'NewsDetailScreen'>;
    navigation: DrawerNavigationProp<NewsStackParamsList, 'NewsDetailScreen'>;
}

const NewsDetailScreen = memo(function NewsDetailScreen({ route }: Props) {
    //hook
    const {
        theme: { colors, typography, dimens },
    } = useTheme();
    const styles = useStyles();
    //state
    const [isVisibleOption, setIsVisibleOption] = useState(false);
    const [fontFamily, setFontFamily] = useState(Platform.OS === 'ios' ? 'Helvetica' : 'Roboto');
    const [fontSize, setFontSize] = useState(16);
    //params
    const news_uuid = route.params.news_uuid;
    //swr
    const { newsDetail, loadingInit } = useNewsDetailSwr(news_uuid);
    const { news, mutate: mutateNews } = useNewsSwr(
        { category_uuid: newsDetail?.category_uuid, page_size: 8 },
        { revalidateOnMount: false }
    );
    //value
    const { category_name, title, updated_at, content } = newsDetail || {};
    //font
    const font1 = Platform.OS === 'ios' ? 'Helvetica' : 'Roboto';
    const font2 = Platform.OS === 'ios' ? 'Baskerville' : 'serif';

    //effect
    useEffect(() => {
        if (newsDetail) {
            mutateNews();
        }
    }, [newsDetail]);

    //render

    const renderNewsRelated = () =>
        map(news, (value, index) => <NewsItemHorizontal news_items={value} key={index} />);

    //handle
    const handleVisibleOption = () => {
        setIsVisibleOption((pre) => !pre);
    };

    const handleChangeFontFamily = (type: '1' | '2') => () => {
        if (type === '1') {
            setFontFamily(font1);
        } else {
            setFontFamily(font2);
        }
        // setFontFamily(font)
    };

    const handleChangeFontSize = (size: number) => {
        setFontSize(size);
    };

    const handleShareNews = () => {
        Share.open({
            title: 'share',
            url: `${REACT_NATIVE_APP_WEB_URL}${NEWS_DETAIL_PAGE_URL(title, news_uuid)}`,
        })
            .then(() => {})
            .catch((err) => {
                sendSentryError(err, 'handleShareNews*');
            });
    };

    const handleNewsTime = (newsTime: string) => {
        const now = Date.now(); //milisecond
        const newsTime_ = parseInt(newsTime) * 1000; // convert timestamp to milisecond
        const checkTwoTime = calculatorBetweenTwoTime(newsTime_, now);

        return `${checkTwoTime?.num} ${checkTwoTime?.title} trước`;
    };

    return (
        <View style={{ flex: 1 }}>
            <Header
                center={
                    <Text size={'title2'} ta="center">
                        {category_name}
                    </Text>
                }
                showGoBack
                iconGoBackColor={colors.black_[10]}
                bgColor={colors.white_[10]}
            />
            <AfterInteractions>
                {loadingInit === Status.LOADING ? (
                    <View flex={1}>
                        <LoadingFetchAPI visible={true} size={typography.size(50)} />
                    </View>
                ) : (
                    <ScrollView>
                        <View style={styles.view_body}>
                            {/* news */}
                            <View style={styles.view_content}>
                                {/* news title */}
                                <View>
                                    <Text
                                        style={{ fontFamily: fontFamily }}
                                        size="title3"
                                        fw="bold"
                                        lh={30}
                                    >
                                        {title}
                                    </Text>
                                    <Text color={colors.grey_[400]}>
                                        {handleNewsTime(updated_at)}
                                    </Text>
                                </View>
                                {/* news body */}
                                <View mt="extraLarge">
                                    <HTML
                                        source={{
                                            html: !isEmpty(content) ? content : '<p> </p>',
                                        }}
                                        contentWidth={dimens.width * 0.92}
                                        baseStyle={{
                                            fontSize: fontSize,
                                            fontFamily: fontFamily,
                                            color: colors.black_[10],
                                        }}
                                        // renderers={{
                                        //     // p: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                                        //     //     return <View key={passProps.key}>{children}</View>;
                                        //     // },
                                        //     table: TableRenderer,
                                        // }}
                                        // renderersProps={{
                                        //     // img: {
                                        //     //     // initialDimensions: { width: dimens.width, height: 200 },
                                        //     //     enableExperimentalPercentWidth: true,
                                        //     // },
                                        //     table: {
                                        //         tableStyleSpecs: {
                                        //             trEvenBackground: colors.grey_[100],
                                        //             trOddBackground: colors.grey_[100],
                                        //             thEvenBackground: colors.grey_[400],
                                        //             columnsBorderWidthPx: 1,
                                        //             outerBorderWidthPx: 1,
                                        //             fontSizePx: typography.body1,
                                        //             tdBorderColor: colors.grey_[300],
                                        //             outerBorderColor: colors.grey_[300],
                                        //         },
                                        //     },
                                        // }}
                                        // customHTMLElementModels={{ table: tableModel }}
                                        WebView={WebView}
                                    />
                                </View>
                            </View>
                        </View>
                        {/* new related */}
                        <Divider />
                        <View p={'large'} style={{ zIndex: 1111 }} bg={colors.white_[10]}>
                            <Text mb="extraLarge" size="title1" color={colors.grey_[500]}>
                                Tin tức liên quan
                            </Text>
                            {renderNewsRelated()}
                        </View>
                    </ScrollView>
                )}
                {/* bottom tab */}
                <View style={styles.view_bottom_tab}>
                    <View flexDirect="row">
                        {/* <Touch mr="medium">
                        <Icon
                            type="ionicon"
                            name="heart-outline"
                            color={colors.grey_[500]}
                            size={typography.title2}
                        />
                        <Text color={ colors.grey_[500]}>Yêu thích</Text>
                    </Touch> */}
                        <Touch onPress={handleShareNews}>
                            <Icon
                                type="ionicon"
                                name="share-outline"
                                color={colors.grey_[500]}
                                size={typography.title2}
                            />
                            <Text color={colors.grey_[500]}>Chia sẻ</Text>
                        </Touch>
                    </View>

                    <Touch onPress={handleVisibleOption}>
                        <Icon
                            type="entypo"
                            name="dots-three-vertical"
                            color={colors.grey_[500]}
                            size={typography.title3}
                        />
                    </Touch>
                </View>
                {/* bottom sheet option */}
                <BottomSheet isVisible={isVisibleOption} onBackdropPress={handleVisibleOption}>
                    <View style={styles.view_option_title}>
                        <Text ta="center" size="title1" color={colors.grey_[500]}>
                            Tuỳ chỉnh
                        </Text>
                    </View>
                    {/* size font */}
                    <View style={styles.view_option_item}>
                        <View flexDirect="row">
                            <Icon type="ionicon" name="text" size={typography.title2} />
                            <Text size="body3" ml={'tiny'}>
                                Cỡ chữ
                            </Text>
                        </View>
                        <View flex={0.7}>
                            <View flexDirect="row" jC="space-between" aI="center">
                                <Text size={'sub2'} color={colors.main['600']}>
                                    A
                                </Text>
                                <Text
                                    size={10}
                                    color={fontSize > 14 ? colors.main['600'] : colors.grey_[500]}
                                >
                                    |
                                </Text>
                                <Text
                                    size={10}
                                    color={fontSize > 15 ? colors.main['600'] : colors.grey_[500]}
                                >
                                    |
                                </Text>
                                <Text
                                    size={10}
                                    color={fontSize > 16 ? colors.main['600'] : colors.grey_[500]}
                                >
                                    |
                                </Text>
                                <Text
                                    size="body3"
                                    color={fontSize > 17 ? colors.main['600'] : colors.grey_[500]}
                                >
                                    A
                                </Text>
                            </View>
                            <Slider
                                value={fontSize}
                                onValueChange={handleChangeFontSize}
                                maximumValue={18}
                                minimumValue={14}
                                step={1}
                                minimumTrackTintColor={colors.main['600']}
                                style={{ height: 5 }}
                                disabled
                                thumbTintColor={colors.main['600']}
                            />
                        </View>
                    </View>
                    {/* font style */}
                    <View style={styles.view_option_item}>
                        <View flexDirect="row">
                            <Icon type="fontisto" name="font" size={typography.title1} />
                            <Text size="body3" ml={'tiny'}>
                                Kiểu chữ
                            </Text>
                        </View>
                        <View flex={0.75} flexDirect="row">
                            <Touch
                                style={styles.touch_btn_change_1}
                                bg={fontFamily === font1 ? colors.grey_[500] : colors.grey_[400]}
                                activeOpacity={0.8}
                                onPress={handleChangeFontFamily('1')}
                            >
                                <Text ta="center" color={colors.white_[10]} fw="bold">
                                    {font1}
                                </Text>
                            </Touch>
                            <Touch
                                style={styles.touch_btn_change_2}
                                bg={fontFamily === font2 ? colors.grey_[500] : colors.grey_[400]}
                                activeOpacity={0.8}
                                onPress={handleChangeFontFamily('2')}
                            >
                                <Text ta="center" color={colors.white_[10]} fw="bold">
                                    {font2}
                                </Text>
                            </Touch>
                        </View>
                    </View>
                </BottomSheet>
            </AfterInteractions>
        </View>
    );
});

export default NewsDetailScreen;
