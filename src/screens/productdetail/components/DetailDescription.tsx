import Collapse from 'components/Collapse';
import Divider from 'components/Divider';
import Text from 'components/Text';
import View from 'components/View';
import { useTheme } from 'hooks';
import { map } from 'lodash';
import { ProductDetailResponseType } from 'models';
import React, { memo } from 'react';
import HTML from 'react-native-render-html';
import WebView from 'react-native-webview';
import { typography } from 'theme/typography';
import { isEmpty } from 'utils/helpers';
import useStyles from '../styles';

interface Props {
    pds?: ProductDetailResponseType['detail-static'];
}

// const baseStyleAttribute = {
//     fontSize: typography.body1,
// };
const baseStyleDescript = {
    fontSize: typography.body2,
};

const ignoredDomTags_ = ['colgroup'];

const DetailDescription = memo(function DetailDescription({ pds }: Props) {
    //hooks
    const styles = useStyles();
    const {
        theme: { colors, spacings, dimens },
    } = useTheme();

    //state

    //value
    const { attributes, description = '' } = pds || {};

    if (!description) {
        return null;
    }

    return (
        <>
            <View
                style={{
                    backgroundColor: colors.white_[10],
                }}
            >
                <View style={styles.view_title_section}>
                    <Text fw="bold">CHI TIẾT SẢN PHẨM</Text>
                </View>

                <View ph={spacings.medium}>
                    {!isEmpty(attributes)
                        ? map(attributes, (value, index) => {
                              return (
                                  <View
                                      flexDirect="row"
                                      style={
                                          index !== attributes.length - 1
                                              ? styles.view_wrap_attribute
                                              : undefined
                                      }
                                      key={index}
                                  >
                                      <View style={styles.view_attribute_label}>
                                          <HTML
                                              source={{ html: value.frontend_label }}
                                              contentWidth={dimens.width * 0.5}
                                              baseStyle={{
                                                  ...baseStyleDescript,
                                                  color: colors.black_[10],
                                              }}
                                          />
                                      </View>
                                      <View style={styles.view_attribute_value}>
                                          <HTML
                                              source={{ html: value.value }}
                                              contentWidth={dimens.width * 0.5}
                                              baseStyle={{
                                                  ...baseStyleDescript,
                                                  color: colors.black_[10],
                                              }}
                                          />
                                      </View>
                                  </View>
                              );
                          })
                        : null}
                    <View pv={spacings.medium}>
                        <Text fw="bold" color={colors.black_[10]}>
                            MÔ TẢ SẢN PHẨM
                        </Text>
                    </View>
                    <Divider height={0.5} />
                    <Collapse color={colors.grey_[500]} initHeight={100}>
                        <HTML
                            source={{
                                html: !isEmpty(description) ? description : '<p> </p>',
                            }}
                            contentWidth={dimens.width * 0.8}
                            baseStyle={{ ...baseStyleDescript, color: colors.black_[10] }}
                            ignoredDomTags={ignoredDomTags_}
                            // renderers={{
                            //     // p: (htmlAttribs, children, convertedCSSStyles, passProps) => {
                            //     //     return <View key={passProps.key}>{children}</View>;
                            //     // },
                            //     table: TableRenderer,
                            // }}
                            // renderersProps={{
                            //     img: { initialDimensions: { width: 100, height: 100 } },
                            //     table: {
                            //         tableStyleSpecs: {
                            //             trEvenBackground: colors.grey_[200],
                            //             trOddBackground: colors.grey_[200],
                            //             thEvenBackground: colors.grey_[400],
                            //             columnsBorderWidthPx: 1,
                            //             outerBorderWidthPx: 1,
                            //             fontSizePx: typography.body1,
                            //         },
                            //     },
                            // }}
                            // customHTMLElementModels={{ table: tableModel }}
                            WebView={WebView}
                        />
                    </Collapse>
                </View>
            </View>
            <Divider />
        </>
    );
});

export default DetailDescription;
