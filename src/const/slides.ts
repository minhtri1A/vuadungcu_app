///khi thêm một const cho slide nhớ thêm vào type bên dưới
/* --- home --- */
export const HOME_MAIN_BANNER = 'home_main_banner';
export const HOME_SUB_BANNER = 'home_sub_banner';
export const HOME_BRAND_SECTION_BANNER = 'home_brand_section_banner';
export const HOME_SALE_SECTION_BANNER = 'home_sale_section_banner';
/* --- brand --- */
export const BRAND_TOP_BANNER = 'brand_top_banner';
/* --- brand featured --- */
export const BRAND_FEATURED_TOP_BANNER = 'brand_featured_top_banner';

/* --- news --- */
export const NEWS_RIGHT_BANNER = 'news_right_banner';

export type Slide_Group_Type =
    //home
    | typeof HOME_MAIN_BANNER
    | typeof HOME_SUB_BANNER
    | typeof HOME_BRAND_SECTION_BANNER
    | typeof HOME_SALE_SECTION_BANNER
    //brand
    | typeof BRAND_TOP_BANNER
    //brand featured
    | typeof BRAND_FEATURED_TOP_BANNER
    //news
    | typeof NEWS_RIGHT_BANNER;
