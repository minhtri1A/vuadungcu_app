//customer
///address
//customer/

//products/?params

//auth - data

//cart/?params

//policy

// slides
export type PageType = 'Home' | 'Cart' | 'Product' | 'brand';

///slide group type
export type HomeGroupSlideType =
    | 'home_sub_slide'
    | 'home_sale_slide'
    | 'home_main_slide'
    | 'home_brand_slide';

export type CartGroupSlideType = 'cart_main_slide' | 'cart_sub_slide';
export type BrandGroupSlideType = 'brand_product_slide' | 'brand_product_slide_responsive';
export type BrandFeaturedSlideType = 'brand_featured_product_slide';
export type NewsListSlideType = 'news_body_right_slide_1';
//slide size (responsive)
export type SlideSizeType = 'default' | 'small';

export interface ParamsGetSlidesType {
    type?: 'group' | 'page';
    page?: PageType;
    group?:
        | HomeGroupSlideType
        | CartGroupSlideType
        | BrandGroupSlideType
        | BrandFeaturedSlideType
        | NewsListSlideType;
    size_type?: SlideSizeType;
}
