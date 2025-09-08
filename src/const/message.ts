export const NOT_MESSAGE = 'not_message';
export const SYSTEMS_ERROR = 'SYSTEMS_ERROR';
/* ------ cart ------ */
//add to cart
export const ADD_TO_CART_SUCCESS = 'ADD_TO_CART_SUCCESS';
export const ADD_TO_CART_PRODUCT_EXISTS = 'PRODUCT_EXIST_IN_CART';
export const ADD_TO_CART_OTHER_ERROR = 'ADD_TO_CART_OTHER_ERROR';

//update quantity
export const NOT_ENOUGH_STOCK = 'NOT_ENOUGH_STOCK';
export const UPDATE_CART_OTHER_ERROR = 'update_any_error';

//remove cart Product isn't already in the cart
export const REMOVE_ISNT_ALREADY_CART = "rm_isn't_cart";
export const REMOVE_ALL_EMPTY_CART = 'rm_all_empty_cart';
export const REMOVE_OTHER_ERROR = 'rm_other_error';
//checked
export const UPDATE_CART_CHECKED_FAILED = 'UPDATE_CART_CHECKED_FAILED';
//delivery
export const UPDATE_CART_DELIVERY_FAILED = 'UPDATE_CART_DELIVERY_FAILED';
/* ------ checkout ------ */
export const CHECKOUT_NOT_ENOUGH_STOCK = 'CHECKOUT_NOT_ENOUGH_STOCK';
export const CHECKOUT_OTHER_ERROR = 'checkout_other_error';
export const CHECKOUT_SUCCESS = 'CHECKOUT_SUCCESS';
export const CHECKOUT_NOT_EQUAL_PRICES = 'CHECKOUT_NOT_EQUAL_PRICES';
export const NOT_CHECKOUT = 'NOT_CHECKOUT';
export const CHECKOUT_TELEPHONE_NOT_CONFIRM = 'TELEPHONE_NOT_CONFIRM';

/* ------ LoyalPoint ------*/
export const CUSTOMER_NOT_ACCUMULATED = 'customer_not_accumulated';

/* ------ register ------ */
export const REGISTER_SUCCESS = 'register_success';
export const REGISTER_EXISTS_TELEPHONE = 'register_exists_telephone';
export const REGISTER_OTHER_ERROR = 'register_other_error';

/* ------ authentication ------ */
export const AUTH_INVALID_GRANT = 'invalid_grant';
export const AUTH_SOCIAL_EXISTS_EMAIL = 'exit_email';
export const AUTH_USER_DELETED = 'user_deleted';
export const AUTH_OTHER_ERROR = 'other_error';

/* ------ account and verify info ------ */
//--phone verify
export const VERIFY_SMS_NOT_SEND = 'sms_not_send';
export const VERIFY_PHONE_CODE_INVALID = 'verify_invalid_phone_code';
export const VERIFY_PHONE_CODE_EXPIRED = 'verify_expired_phone_code';
export const VERIFY_MANY_REQUEST_SMS = 'verify_many_request_sms';
//--email verify
export const VERIFY_EMAIL_NOT_SEND = 'account_send_email_failed';
export const VERIFY_EMAIL_CODE_EXPIRED = 'account_email_code_expired';
export const VERIFY_EMAIL_CODE_FAILED = 'account_email_code_verify_failed';
export const VERIFY_EMAIL_CODE_INVALID = 'account_invalid_email_code';
//--verified
export const VERIFY_EMAIL_CANNOT_EDIT = 'verify_email_cannot_edit';
export const VERIFY_TELEPHONE_CANNOT_EDIT = 'verify_telephone_cannot_edit';
//account
export const ACCOUNT_UPDATE_SUCCESS = 'ACCOUNT_UPDATE_SUCCESS';
export const ACCOUNT_UPDATE_FAILED = 'ACCOUNT_UPDATE_FAILED';

//-- link with social
export const ACCOUNT_GOOGLE_LINK_EXISTS = 'GOOGLE_EXISTS';
export const ACCOUNT_FACEBOOK_LINK_EXISTS = 'FACEBOOK_EXISTS';
export const ACCOUNT_APPLE_LINK_EXISTS = 'APPLE_EXISTS';
export const ACCOUNT_SOCIAL_LINK_FAILED = 'account_social_link_failed';
//--telephone
export const ACCOUNT_TELEPHONE_HAS_CONFIRM = 'TELEPHONE_CONFIRMED';
export const ACCOUNT_TELEPHONE_EXISTS = 'TELEPHONE_EXISTS';
export const ACCOUNT_INVALID_TELEPHONE = 'INVALID_TELEPHONE';
//--email
export const ACCOUNT_EDIT_EMAIL_FAILED = 'account_edit_email_failed';
export const ACCOUNT_EMAIL_EXISTS = 'EMAIL_EXISTS';
//--username
export const ACCOUNT_CANNOT_EDIT_USERNAME = 'account_no_edit_username';
export const ACCOUNT_EDIT_USERNAME_SUCCESS = 'account_edit_username_success';
export const ACCOUNT_EDIT_USERNAME_FAILED = 'account_edit_username_failed';
//--personal
export const ACCOUNT_EDIT_PROFILE_FAILED = 'account_edit_profile_failed';
//--image
export const ACCOUNT_INVALID_IMAGE = 'INVALID_IMAGE';
//--input error
export const INPUT_TELEPHONE_NOT_REGEX = 'input_telephone_not_regex';
export const INPUT_EMAIL_NOT_REGEX = 'input_email_not_regex';
export const INPUT_USERNAME_NOT_REGEX = 'input_username_not_regex';
export const INPUT_EMPTY_VALUE = 'input_empty_value';
//--delete account
export const ACCOUNT_DELETE_SUCCESS = 'ACCOUNT_DELETE_SUCCESS';
export const ACCOUNT_DELETE_FAILED = 'ACCOUNT_DELETE_FAILED';
export const ACCOUNT_DELETE_EXISTS_ORDERS = 'DELETE_EXISTS_ORDERS';
/* ------ password ------ */
// password
//--forgot
export const PASSWORD_FORGOT_UPDATE_FAILED = 'password_forgot_update_failed';
//--change
export const PASSWORD_EDIT_SUCCESS = 'password_edit_success';
export const PASSWORD_EDIT_FAILED = 'password_edit_failed';
export const PASSWORD_EDIT_INVALID_PASSWORD = 'INVALID_PASSWORD';
/* ------ address ------ */
export const ADDRESS_NOT_SET = 'ADDRESS_NOT_SET';
export const ADDRESS_NOT_FOUND_CART = 'ADDRESS_NOT_FOUND_CART';
export const ADDRESS_OTHER_ERROR = 'ADDRESS_OTHER_ERROR';
export const ADDRESS_NOT_FOUND_CUSTOMER = 'ADDRESS_NOT_FOUND_CUSTOMER';
export const ADDRESS_NOT_ADD = 'ADDRESS_NOT_ADD';
export const ADDRESS_ADD_SUCCESS = 'ADDRESS_ADD_SUCCESS';
export const ADDRESS_UPDATE_SUCCESS = 'ADDRESS_UPDATE_SUCCESS';
export const ADDRESS_NOT_UPDATE = 'ADDRESS_NOT_UPDATE';
export const ADDRESS_INVALID_UPDATE_TYPE = 'ADDRESS_INVALID_UPDATE_TYPE';
export const ADDRESS_NOT_FOUND = 'ADDRESS_NOT_FOUND';
export const ADDRESS_CANNOT_DELETE_DEFAULT = 'CANNOT_DELETE_DEFAULT_ADDRESS';
export const ADDRESS_NOT_DELETE = 'NOT_DELETE_ADDRESS';
export const ADDRESS_DELETE_SUCCESS = 'ADDRESS_DELETE_SUCCESS';
/*----- order ------*/
export const CANCEL_ORDER_SUCCESS = 'CANCEL_ORDER_SUCCESS';
export const CANCEL_ORDER_FAILED = 'CANCEL_ORDER_FAILED';
export const REPURCHASE_ORDER_FAILED = 'REPURCHASE_ORDER_FAILED';
export const RETURNS_ORDER_SUCCESS = 'RETURNS_ORDER_SUCCESS';
export const RETURNS_ORDER_FAILED = 'RETURNS_ORDER_FAILED';
/*----- Event qr code ------*/
export const NOT_ENOUGH_TIME = 'NOT_ENOUGH_TIME';
export const INVALID_QR_CODE = 'INVALID_QR_CODE';
export const INVALID_EVENT_QR_UPDATE_ACTION = 'INVALID_EVENT_QR_UPDATE_ACTION';
export const INVALID_DATA = 'INVALID DATA';
export const EVENT_QR_CODE_SUCCESS = 'CHECK_EVENT_QR_SUCCESS';
export const EVENT_QR_CODE_FAILED = 'EVENT_QR_CODE_FAILED';
/*----- Pos link ------*/
export const NOT_FOUND_CUSTOMER = 'NOT_FOUND_CUSTOMER';
export const CONNECTED_CUSTOMER = 'CONNECTED_CUSTOMER';
export const NO_PHONE = 'NO_PHONE';
export const NOT_CONFIRM_PHONE = 'NOT_CONFIRM_PHONE';
export const NOT_FOUND_CUSTOMER_POS = 'NOT_FOUND_CUSTOMER_POS';
export const MULTI_CUSTOMER_POS_SAME_PHONE = 'MULTI_CUSTOMER_POS_SAME_PHONE';
export const CONNECT_CUSTOMER_POS_SUCCESS = 'CONNECT_POS_SUCCESS';
export const CONNECTED_OTHER_CUSTOMER = 'CONNECTED_OTHER_CUSTOMER';
export const ERROR_CONNECTED = 'ERROR_CONNECTED';
/*----- referral ------*/
export const REFERRAL_CODE_NOT_EXIST = 'REFERRAL_CODE_NOT_EXIST';
export const CLIENT_NOT_ADD_DATA = 'CLIENT_NOT_ADD_DATA';
export const DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND';
export const DEVICE_EXPIRED = 'DEVICE_EXPIRED';
export const SHARER_NOT_FOUND = 'SHARER_NOT_FOUND';
export const REFERRAL_CODE_INCORRECT = 'REFERRAL_CODE_INCORRECT';
export const INVALID_REFERRAL_CODE = 'INVALID_REFERRAL_CODE';
export const REFERRED_CUSTOMER = 'REFERRED_CUSTOMER';

//common
export const SUCCESS = 'SUCCESS';
export const FAILED = 'FAILED';
