/* eslint-disable curly */
import NetInfo from '@react-native-community/netinfo';
import { NEXT_PUBLIC_CURRENCY } from 'const/env';
import { forEach, includes, omitBy, split, trim, upperFirst } from 'lodash';
import { ResultGetParasmWithUrlType, SliderItemsResponseType } from 'models';

export const createSubCategories = (category = [], parentID = null) => {
    let arrDM: any = [];
    category.forEach((element: any) => {
        if (element.parent_uuid === parentID) {
            // CategoryText.splice(index,1)
            let child = createSubCategories(category, element.uuid);
            if (child.length > 0) {
                element.childrend = child;
            }
            arrDM.push(element);
        }
    });

    return arrDM;
};
//0, false, null, undefined, '',
//check empty data = null,undeifined,false,0,[],{},...
export function isEmpty(value: unknown, checkZero = true): value is null | undefined {
    // null | undefined
    if (value === null || value === undefined) return true;

    // boolean false
    if (value === false) return true;

    // 0
    if (typeof value === 'number') {
        if (!checkZero && value === 0) return false;
        if (checkZero && value === 0) return true;
    }

    // str
    if (typeof value === 'string') {
        const trimmed = value.trim();

        if (trimmed === '') return true; // chuỗi rỗng

        const num = Number(trimmed);
        if (!isNaN(num) && num === 0) {
            if (!checkZero) return false;
            return true;
        }
    }

    // arr
    if (Array.isArray(value) && value.length === 0) return true;

    // object
    if (
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.keys(value as object).length === 0
    )
        return true;

    return false;
}

//xoá html và emoji trong string
export const removeTagsAndEmojis = (str: string) => {
    if (isEmpty(str)) {
        return '';
    }
    // Xoá các thẻ HTML
    str = str.replace(/\<[^>]*\>/g, '');
    // Xoá các emoji
    str = str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');

    return str;
};

//10.000.000dd
export const currencyFormat = (num: any, unit = true) => {
    if (isEmpty(num)) {
        num = 0;
    }
    if (typeof num === 'string') {
        num = parseInt(num);
    }
    const currency = num
        .toFixed(0) // always two decimal digits
        .replace('.', ',') // replace decimal point character with ,
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.'); // use . as a separator
    return unit ? `${currency}${NEXT_PUBLIC_CURRENCY}` : currency;
};
//xoa dau tieng viet
export const removeAccents = (str?: string) => {
    if (!str) {
        return '';
    }
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

//chuyển chữ cái đầu thành chữ hoa dựa vào khoảng trắng
export const upperFirstWithSpace = (str: string): string => {
    const splitStr = split(str, ' ');

    let upperFirstStr = '';

    forEach(splitStr, (value) => {
        upperFirstStr = `${upperFirstStr} ${upperFirst(value)}`;
    });
    return upperFirstStr;
};

//check internet
export const isConnectedToInternet = (): any => {
    return new Promise((resolve, reject) => {
        NetInfo.fetch()
            .then((state) => {
                resolve(state.isConnected);
            })
            .catch((e) => reject(e));
    });
};

//thêm params vào url
export const addParamsToUrl = (uri: string, params: any) => {
    if (params) {
        const rx = /([\?]).*/.exec(uri);
        let separator = isEmpty(rx) ? '?' : '&';
        for (let key in params) {
            if (params[key] !== undefined) {
                uri += `${separator}${key}=${params[key]}`;
                separator = '&';
            }
        }
    }
    return uri;
};

export const isURL = (str: string) => {
    var pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // fragment locator
    return pattern.test(str);
};

export const getURLParams = (parameterName: string, url: string) => {
    let name = parameterName.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    const path = url.replace(/([\?]).*/, '');

    return {
        path,
        paramsValue:
            results && results[2] ? decodeURIComponent(results[2].replace(/\+/g, ' ')) : null,
    };
    // if (!results) return null;
    // if (!results[2]) return null;
    // return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

export const getParamsWithCustomUrl = (url: string): ResultGetParasmWithUrlType => {
    //url need format - may-khoan-bua-ingco-dung-pin-13-mm-20-v-cidli-2003-pd.10.html
    //url result - -pd.10.html
    const regexUrl = /\-[a-z]{1,2}\.([a-zA-Z0-9]){1,32}(\.html)/.exec(url);
    const path = url.replace(/([\?]).*/, ''); //remove query string (url khong co params)
    //query
    // var searchParams = new URLSearchParams(
    //     'https://vuadungcu.com/may-cha-nham-rung-makita-93-x-228-mm-bo-3711-pd.351.html?psu=352'
    // );
    var regex = /[?&]([^=#]+)=([^&#]*)/g;
    let searchParams: any = {};
    let match;
    while ((match = regex.exec(url))) {
        searchParams[match[1]] = match[2];
    }
    let data = {
        regexUrl,
        path,
        type: '',
        id: '',
        searchParams,
    };
    //url is regex
    if (regexUrl) {
        //get params - eg result ['pd','10','html']
        const listParams = trim(regexUrl[0], '-').split('.');
        data = {
            ...data,
            type: listParams[0],
            id: listParams[1],
        };
    }
    return data;
};

//kiểm tra hình ảnh thu nhỏ và link của slide
export const getSlideImage = (slide: SliderItemsResponseType) => {
    const image = slide.small_slide === 'Y' ? slide.small_image : slide.image;
    const link = slide.app_link !== '#' ? slide.app_link : slide.web_link;
    return {
        image,
        link,
    };
};

/*------------------ date - time ------------------ */
//--tinhs toán khoảng cách giữa 2 thời gian dựa trên phutt, giờờ, ngày , tháng, năm
export const getMinuteOfTime = (d1: number, d2: number) => {
    return Math.floor((d2 - d1) / (60 * 1000));
};
export const getHoursOfTime = (d1: number, d2: number) => {
    return Math.floor((d2 - d1) / (60 * 60 * 1000));
};

export const getDayOfTime = (d1: number, d2: number) => {
    return Math.floor((d2 - d1) / (60 * 60 * 24 * 1000));
};

export const getMonthOfTime = (d1: number, d2: number) => {
    return Math.floor((d2 - d1) / (60 * 60 * 24 * 30 * 1000));
};

export const getYearOfTime = (d1: number, d2: number) => {
    return Math.floor((d2 - d1) / (60 * 60 * 24 * 30 * 12 * 1000));
};
//--- sẽ check được thời gian cách nhau là phút,giờ,...
//--- sẽ check được thời gian cách nhau là phút,giờ,...
export const calculatorBetweenTwoTime = (
    d1: number,
    d2: number
):
    | { num: number; type: 'minute' | 'hours' | 'day' | 'month' | 'year'; title: string }
    | undefined => {
    const timeUnits = [
        { unit: 'minute', func: getMinuteOfTime, limit: 60, title: 'phút' },
        { unit: 'hours', func: getHoursOfTime, limit: 24, title: 'giờ' },
        { unit: 'day', func: getDayOfTime, limit: 31, title: 'ngày' },
        { unit: 'month', func: getMonthOfTime, limit: 12, title: 'tháng' },
        { unit: 'year', func: getYearOfTime, limit: Infinity, title: 'năm' },
    ];

    for (const unit of timeUnits) {
        const value = unit.func(d1, d2);
        if (value < unit.limit) {
            return {
                num: value,
                type: unit.unit as any,
                title: unit.title,
            };
        }
    }
};

//chuyển time thành d/m/y - 12th10,...
export const getDateWithTimeStamp = (
    timestamp: any,
    //cộng vào bao nhiêu ngày
    days = 0,
    //format:
    localeType?: 'Locale' | 'LocaleDate' | 'LocaleTime' | 'LocaleDateTime' | 'LocaleDelivery',
    format = 'vi-VN'
) => {
    if (typeof timestamp !== 'number') {
        // eslint-disable-next-line radix
        timestamp = parseInt(timestamp);
    }
    const days_ = 60 * 60 * 24 * 1000 * days;
    const timestamp_ = timestamp * 1000 + days_;
    const date = new Date(timestamp_);
    const LocaleDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    if (localeType === 'LocaleDate') {
        // return new Date(timestamp_).toLocaleDateString(format);
        return LocaleDate;
    } else if (localeType === 'Locale') {
        return new Date(timestamp_).toLocaleString(format);
    } else if (localeType === 'LocaleTime') {
        return new Date(timestamp_).toLocaleTimeString(format);
    } else if (localeType === 'LocaleDelivery') {
        return `${date.getDate()} Th${date.getMonth() + 1}`;
    } else if (localeType === 'LocaleDateTime') {
        return `${date.toLocaleTimeString(format)} - ${LocaleDate}`;
    } else {
        return LocaleDate;
    }
};
// convert 1000 = 1k - 1000000 = 1m
export function convertToSortNumber(number: any) {
    let num = number;
    if (typeof number === 'string') {
        num = parseInt(number);
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'm';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    } else {
        return num.toString();
    }
}

export const formatSecondToTime = (second: number, type: 'second' | 'minutes' | 'hours') => {
    if (type === 'second') {
        return [parseInt(`${second % 60}`)].join(':').replace(/\b(\d)\b/g, '0$1');
    }
    if (type === 'minutes') {
        return [parseInt(`${(second / 60) % 60}`), parseInt(`${second % 60}`)]
            .join(':')
            .replace(/\b(\d)\b/g, '0$1');
    }
    //hours type
    return [
        parseInt(`${second / 60 / 60}`),
        parseInt(`${(second / 60) % 60}`),
        parseInt(`${second % 60}`),
    ]
        .join(':')
        .replace(/\b(\d)\b/g, '0$1');
};

//trả về một danh sách props mới với các props bị xoá trong keyDelete
export const removePropertiesFromObject = (props: any, keyDelete: Array<any>): any => {
    const newProps = omitBy(props, (value, key) => includes(keyDelete, key));

    return newProps;
};

//sap xep mang
export const sortArray = (array: Array<any>) => {
    return array.sort((a, b) => {
        // Kiểm tra xem a có chứa con số hay không
        const isANumber = /\d/.test(a);
        // Kiểm tra xem b có chứa con số hay không
        const isBNumber = /\d/.test(b);
        // Đưa các chuỗi có chứa con số xuống cuối cùng
        if (isANumber && !isBNumber) {
            return 1;
        } else if (!isANumber && isBNumber) {
            return -1;
        }
        // Sắp xếp các giá trị không phải số theo thứ tự từ điển
        return a.localeCompare(b);
    });
};

/* ------- data ------- */

export const formatProductPrices = (item: {
    type_id: 'configurable' | 'simple';

    max_special_price?: number;
    max_price?: number;
    min_price?: number;
    min_special_price?: number;

    price?: number;
    special_price?: number;
}) => {
    const finalPrice = (() => {
        if (item.type_id === 'simple') {
            return `${currencyFormat(item.special_price)}`;
        }
        // config
        if (!item.max_special_price || item.max_price === item.max_special_price) {
            return `${currencyFormat(item.min_price, false)} - ${currencyFormat(item.max_price)}`;
        }
        return `${currencyFormat(item.min_special_price, false)} - ${currencyFormat(
            item.max_special_price
        )}`;
    })();

    const crossedPrice = (() => {
        if (item?.type_id === 'simple' && item?.price !== item?.special_price) {
            return `${item?.price}`;
        }

        if (item?.type_id === 'configurable') {
            if (!item?.max_special_price || item?.max_price === item?.max_special_price) {
                return;
            }
            return `${currencyFormat(item?.min_price, false)} - ${currencyFormat(item?.max_price)}`;
        }
    })();

    return {
        finalPrice,
        crossedPrice,
    };
};
