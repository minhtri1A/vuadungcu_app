import {
    CategoriesResponseType,
    DataRegisterDeviceType,
    DistrictResponseType,
    ParamsArticleType,
    ParamsGetBrandsType,
    ParamsGetCategoriesType,
    ParamsGetNewsType,
    ParamsGetProductFiltersType,
    ParamsGetProductShippingType,
    ParamsGetProductType,
    ParamsGetSellersType,
    ParamsGetSlidesType,
    ProductDetailResponseType,
    ProductFilterResponseType,
    ProductListResponseType,
    ProvinceResponseType,
    RegisterDeviceResponseType,
    SellerInfoResponseType,
    WardResponseType,
} from 'models';
import { NavigatorConfigType } from 'navigation/navigator/config';
import { ServiceType } from '..';

export interface adminApiType {
    getTokenCache(): any;
    checkToken(): any;
    revokeToken(access_token: string): any;
    getDeliveryWebConfig(): any;
    getCategories(
        category_uuid: string,
        params?: ParamsGetCategoriesType
    ): Promise<CategoriesResponseType>;
    //product
    getProduct(params?: ParamsGetProductType): Promise<ProductListResponseType>;
    getProductDetail<K extends keyof ProductDetailResponseType>(
        action: K,
        product_uuid: string,
        product_seller_uuid?: string
    ): Promise<ProductDetailResponseType[K]>;
    getProductDetailPos(barcode: string): any;
    getProductShipping(product_seller_uuid: string, params: ParamsGetProductShippingType): any;
    getProductConfig(product_seller_uuid: string): any;
    getProductFilters(params: ParamsGetProductFiltersType): ProductFilterResponseType;
    //location
    getProvinces(): Promise<ProvinceResponseType>;
    getDistricts(province_id: string): Promise<DistrictResponseType>;
    getWards(district_id: string): Promise<WardResponseType>;
    getArticle(article_type: ParamsArticleType): any;
    getSlides(params: ParamsGetSlidesType): any;
    //brands
    getBrands(params?: ParamsGetBrandsType): any;
    getBrandDetail(brand_uuid: string): any;
    //system
    registerDevice(
        fcm_token: string,
        data: DataRegisterDeviceType
    ): Promise<RegisterDeviceResponseType>;
    updateCmsPageConfig(data: Array<NavigatorConfigType>): any;
    //news
    getNewsCategory(): any;
    getNews(params?: ParamsGetNewsType): any;
    getNewsDetail(news_uuid: string): any;
    //seller
    getSellerInfo(
        param_type: 'seller_uuid' | 'seller_code',
        value: string
    ): Promise<SellerInfoResponseType>;
    getSellerProductCompare(product_uuid: string): any;
    getAllSellers(params?: ParamsGetSellersType): any;
    //up image temp
    uploadImageTemp(data: any): Promise<{
        code: string;
        detail: string;
        status: number;
        title: string;
        type: string;
        video: '/video/temp/video-test.mp4';
    }>;
}

export default function admin(service: ServiceType): adminApiType {
    return {
        //system
        getTokenCache: () => service.get('/cache-token'),
        checkToken: () => service.get('/check-token'),
        revokeToken: (access_token) => service.delete(`token/${access_token}`),
        getDeliveryWebConfig: () => service.get('/carts/deliveries/web-config'),
        //category
        getCategories: (category_uuid, params) =>
            service.get(`/categories/${category_uuid}`, undefined, params),
        //product
        getProduct: (params) => service.get('/products', undefined, params),
        getProductDetail: (action, product_uuid, product_seller_uuid) =>
            service.get(`/products/${action}/${product_uuid}`, undefined, { product_seller_uuid }),
        getProductDetailPos: (Barcode) =>
            service.get('/products/detail-pos', undefined, undefined, { Barcode }),
        getProductShipping: (product_seller_uuid, params) =>
            service.get(`/products/shipping/${product_seller_uuid}`, undefined, params),
        getProductConfig: (product_seller_uuid) =>
            service.get(`products/config/${product_seller_uuid}`),
        getProductFilters: (params) => service.get('/products/list/filters', undefined, params),
        //direct
        getProvinces: () => service.get('/directories/provinces', undefined, undefined),
        getDistricts: (province_id) =>
            service.get('directories/districts', undefined, { province_id }),
        getWards: (district_id) => service.get('directories/wards', undefined, { district_id }),
        getArticle: (article_type) => service.get(`/article/${article_type}`),
        // slides
        getSlides: (params) => service.get('/sites/slides', undefined, params),
        //brand
        getBrands: (params) => service.get('/brands', undefined, params),
        getBrandDetail: (brands_uuid) => service.get(`/brands/${brands_uuid}`),
        //system
        registerDevice: (fcm_token, data) =>
            service.put(`/devices/notification/${fcm_token}`, data),

        //config cms page
        updateCmsPageConfig: (data) => service.put('/pages/cms_configs', data),
        //news
        getNewsCategory: () => service.get('/news-category'),
        getNews: (params) => service.get('/news', undefined, params),
        getNewsDetail: (Newsuuid) =>
            service.get('/news/detail', undefined, undefined, { Newsuuid }),
        //seller
        getSellerInfo: (param_type, value) =>
            service.get(`/sellers/${value}`, undefined, { param_type }),
        getSellerProductCompare: (product_uuid) => service.get(`/products/seller/${product_uuid}`),
        getAllSellers: (params) => service.get('/sellers', undefined, params),
        //upload image
        uploadImageTemp: (data: any) =>
            service
                .baseAxios({
                    method: 'POST',
                    url: 'https://imagetest.ngothanhloi.com/temp',
                    data: data,
                    headers: {
                        accept: 'application/json',
                        'content-type': 'multipart/form-data',
                    },
                })
                .then((dt) => dt.data)
                .catch((e) => e),
    };
}
