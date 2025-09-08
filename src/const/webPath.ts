import { kebabCase } from 'lodash';

const removeAccents = (str: any) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

const addParamsToUrl = (uri: string, params: any) => {
    if (params) {
        let separator = '?';
        for (let key in params) {
            if (!isEmpty(params[key])) {
                uri += `${separator}${key}=${params[key]}`;
                separator = '&';
            }
        }
    }
    return uri;
};

export const isEmpty = (value: any) => {
    if (!value) {
        return true;
    }
    if (typeof value === 'object') {
        if (Object.keys(value).length === 0) {
            return true;
        }
    }
    return false;
};

//custom
export const PRODUCT_DETAIL_URL = (name: string, productUUID: string, psu?: string): string =>
    addParamsToUrl(`/${removeAccents(kebabCase(name))}-pd.${productUUID}.html`, { psu });

export const PRODUCT_PAGE_URL = (name: string, categoryUUID: string): string =>
    `/${removeAccents(kebabCase(name))}-c.${categoryUUID}.html`;

//dynamic
export const DYNAMIC_LIST_PATH = {
    product_detail: 'pd',
    product: 'c',
    news_detail: 'nd',
    new_list: 'nc',
};
//index
export const INDEX_PAGE_URL = '/';
//cart
export const CART_PAGE_URL = '/cart';
export const CART_SHIPPING_PAGE_URL = '/cart/shipping';
export const CART_DELIVERY_PAGE_URL = '/cart/delivery';
//checkout
export const CHECKOUT_PAGE_URL = '/checkout';
//order succeess
export const ORDER_SUCCESS_PAGE_URL = '/order-success';
//profile
export const ACCOUNT_PAGE_URL = '/profile/account';
export const COIN_PAGE_URL = '/profile/event-coin';
export const LOYAL_PAGE_URL = '/profile/event-loyal';
export const ADDRESS_PAGE_URL = '/profile/address';
export const ORDER_PAGE_URL = '/profile/orders';
export const WARRANTY_PAGE_URL = '/profile/warranty';
//brand
export const BRANDS_PAGE_URL = '/brands';
export const BRAND_FEATURED_PAGE_URL = '/brand-featured';
//article
//--policy
export const ARTICLE_RECEIVE_PAGE_URL = '/help-center/receive';
export const ARTICLE_WARRANTY_RETURN_PAGE_URL = '/help-center/warranty-return';
export const ARTICLE_PAYMENT_PAGE_URL = '/help-center/payment';
export const ARTICLE_PRIVACY_PAGE_URL = '/help-center/privacy';
//--event
export const ARTICLE_EVENT_COIN_PAGE_URL = '/help-center/event-coin';
export const ARTICLE_EVENT_QR_PAGE_URL = '/help-center/event-qr';
export const ARTICLE_EVENT_LOYAL_PAGE_URL = '/help-center/event-loyal';
//socical
export const FACEBOOK_URL = 'https://www.facebook.com/vuadungcuCom';
export const BCT_URL = 'http://online.gov.vn/Home/WebDetails/84927';
export const CHPLAY_URL = 'https://play.google.com/store/apps/details?id=com.vuadungcuapp';
export const APPSTORE_URL = 'https://apps.apple.com/vn/app/id1603805291';
//user
export const LOGIN_URL = '/user/login';
export const REGISTER_URL = '/user/register';
export const FORGOT_PASSWORD_URL = '/user/forgot-password';
//news
export const NEWS_PAGE_URL = '/news';
export const NEWS_LIST_PAGE_URL = (category_uuid: string): string =>
    addParamsToUrl('/news', { category_uuid });
export const NEWS_DETAIL_PAGE_URL = (title: string, news_uuid: string): string =>
    `/news/${removeAccents(kebabCase(title))}-nd.${news_uuid}.html`;
//shop
export const SHOP_PAGE_URL = (seller_code: string, tab?: 'store' | 'product' | 'info') =>
    addParamsToUrl(`/shop/${seller_code}`, { tab });
export const SELLER_PRICE_COMPARISON_URL = (product_uuid: string, psu: string) =>
    addParamsToUrl(`/price-comparison/${product_uuid}`, { psu });
//download
export const DOWNLOAD_URL = '/download';
