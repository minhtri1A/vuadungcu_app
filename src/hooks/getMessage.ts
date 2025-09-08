import { Message } from 'const/index';

export interface ArgsMessageType {
    telephone?: string;
    qtyMaxStock?: number;
    qrScanScore?: string;
}

export default function getMessage(message?: string, args?: ArgsMessageType) {
    const { telephone, qtyMaxStock, qrScanScore } = args || {};
    switch (message) {
        /* ------ account ------ */
        case Message.ACCOUNT_UPDATE_SUCCESS: {
            return 'Cập nhật thông tin cá nhân thành công!';
        }
        case Message.ACCOUNT_UPDATE_FAILED: {
            return 'Cập nhật thông tin thất bại. vui lòng thử lại!';
        }
        //email
        case Message.ACCOUNT_EDIT_EMAIL_FAILED: {
            return 'Chỉnh sửa email thất bại xin quý khách vui lòng thử lại';
        }
        case 'EMAIL_EXISTS': {
            return 'email đã tồn tại trong hệ thống, quý khách vui lòng chọn email khác!';
        }
        //profile
        case Message.ACCOUNT_EDIT_PROFILE_FAILED: {
            return 'Chỉnh sửa thông tin cá nhân thất bại, xin quý khách vui lòng thử lại!';
        }
        //link social
        case 'FACEBOOK_EXISTS': {
            return 'Tài khoản facebook của bạn đã liên kết với một tài khoản khác trong hệ thống!';
        }
        case Message.ACCOUNT_GOOGLE_LINK_EXISTS: {
            return 'Tài khoản google của bạn đã liên kết với một tài khoản khác trong hệ thống!';
        }
        case Message.ACCOUNT_APPLE_LINK_EXISTS: {
            return 'Tài khoản apple của bạn đã liên kết với một tài khoản khác trong hệ thống!';
        }
        case Message.ACCOUNT_SOCIAL_LINK_FAILED: {
            return 'Đã xảy ra lỗi khi liên kết tài khoản mạng xã hội , xin quý khách vui lòng thử lại!';
        }
        //username
        case Message.ACCOUNT_CANNOT_EDIT_USERNAME: {
            return 'Mỗi tài khoản chỉ được chỉnh sửa duy nhất một lần, mọi chi tiết liên hệ 1900 8085 để được hỗ trợ tốt hơn!';
        }
        case Message.ACCOUNT_EDIT_USERNAME_FAILED: {
            return 'Tài khoản của bạn không hợp lệ hoặc đã tồn tại xin quý khách vui lòng thử lại!';
        }
        case Message.ACCOUNT_EDIT_USERNAME_SUCCESS: {
            return 'ACCOUNT_EDIT_USERNAME_SUCCESS';
        }
        //telephone
        case Message.ACCOUNT_TELEPHONE_HAS_CONFIRM: {
            return 'Số điện thoại này đã được xác minh!';
        }
        case Message.ACCOUNT_TELEPHONE_EXISTS: {
            return 'Số điện thoại đã được sử dụng, xin quý khách vui lòng chọn số khác!';
        }
        case Message.ACCOUNT_INVALID_TELEPHONE: {
            return 'Số điện thoại không hợp lệ, xin quý khách vui lòng chọn số khác!';
        }
        //image
        case Message.ACCOUNT_INVALID_IMAGE:
            return 'Cập nhật hình ảnh thất bại, xin vui lòng thử lại!';
        //delete account
        case Message.ACCOUNT_DELETE_SUCCESS:
            return 'Xoá tài khoản thành công, khách hàng sẽ được đang xuất khỏi tài khoản';
        case Message.ACCOUNT_DELETE_FAILED:
            return 'Đã xảy ra lỗi khi xoá tài khoản, Xin quý khách vui lòng thử lại!';
        case Message.ACCOUNT_DELETE_EXISTS_ORDERS:
            return 'Quý khách tồn tại đơn hàng đang chưa hoàn thành, không thể xoá tài khoản!';
        /* ------ cart ------ */
        ///add
        case Message.ADD_TO_CART_SUCCESS: {
            return 'Thêm sản phẩm vào giỏ hàng thành công!';
        }
        case Message.ADD_TO_CART_PRODUCT_EXISTS: {
            return 'Sản phẩm đã tồn tại trong giỏ hàng, quý khách vui lòng vào giỏ hàng để xem chi tiết!';
        }
        case 'NOT_IN_STOCK':
            return 'Vui lòng kiểm tra lại số lượng sản phẩm!';
        case Message.ADD_TO_CART_OTHER_ERROR: {
            return 'Thêm sản phẩm vào giỏ hàng thất bại quý khách vui lòng kiểm tra lại số lượng sản phẩm!';
        }
        case Message.ADDRESS_NOT_FOUND_CART: {
            return 'Bạn chưa có sản phẩm trong giỏ hàng, vui lòng thêm sản phẩm vào giỏ hàng trước khi thêm địa chỉ giao hàng!';
        }
        case 'NOT_FOUND_PRODUCT': {
            return 'Không tìm thấy sản phẩm. Xin vui lòng thử lại!';
        }
        ///remove
        case Message.REMOVE_ALL_EMPTY_CART: {
            return 'REMOVE_ALL_EMPTY_CART';
        }
        case Message.REMOVE_ISNT_ALREADY_CART: {
            return 'REMOVE_ISNT_ALREADY_CART';
        }
        case Message.REMOVE_OTHER_ERROR: {
            return 'Xoá sản phẩm thất bại, quý khách vui lòng thử lại sau!';
        }
        ///update
        case Message.NOT_ENOUGH_STOCK: {
            return `Còn lại ${qtyMaxStock} sản phẩm`;
        }
        case Message.UPDATE_CART_OTHER_ERROR: {
            return 'Cập nhật số lượng sản phẩm thất bại, xin quý khách vui lòng thử lại!';
        }
        /* ------ address ------ */
        case Message.ADDRESS_CANNOT_DELETE_DEFAULT:
            return 'Bạn không thể xoá địa chỉ mặc đinh. Xin vui lòng thử lại!';
        /* ------ auth ------ */
        case Message.AUTH_SOCIAL_EXISTS_EMAIL: {
            return 'Email đã tồn tại trong hệ thống, quý khách vui lòng liên kết tài khoản tồn tại email trên với tài khoản mạng xã hội!';
        }
        case Message.AUTH_INVALID_GRANT: {
            return 'Tài khoản hoặc mật khẩu không chính xác, xin quý khách vui lòng thử lại!';
        }
        case Message.AUTH_USER_DELETED: {
            return 'Tài khoản của bạn đã được xoá khỏi hệ thống. Mọi thông tin vui lòng liên hệ 1900 8085';
        }
        case Message.AUTH_OTHER_ERROR: {
            return 'Đăng nhập thất bại, quý khách vui lòng thử lại!';
        }
        case 'NOT_FOUND_CART': {
            return 'Không tìm thấy giỏ hàng, xin vui lòng thử lại!';
        }
        case 'NOT_EXISTS_PROVINCE': {
            return 'Không tìm thấy tỉnh thành, xin vui lòng thử lại!';
        }
        case 'NOT_EXISTS_DISTRICT': {
            return 'Không tìm thấy quận huyện, xin vui lòng thử lại!';
        }
        case 'NOT_EXISTS_WARD': {
            return 'Không tìm thấy xã phường, xin vui lòng thử lại!';
        }
        case 'NOT_UPDATE_ADDRESS': {
            return 'Không thể cập nhật địa chỉ giao hàng, xin vui lòng thử lại!';
        }
        /*------ checkout ------ */
        case Message.CHECKOUT_NOT_ENOUGH_STOCK: {
            return 'Tồn tại sản phẩm hết số hàng, không thể tạo đơn hàng, vui lòng kiểm tra lại!';
        }
        case Message.CHECKOUT_OTHER_ERROR: {
            return 'Tạo đơn hàng thất bại, quý khách vui lòng liên hệ 1900 8085 để được hỗ trợ tốt hơn!';
        }
        case Message.CHECKOUT_TELEPHONE_NOT_CONFIRM: {
            return 'Tài khoản của bạn chưa có số điện thoại hoặc số điện thoại chưa được xác minh nên không thể đặt hàng. Bấm vào để thêm số điện thoại!';
        }
        case 'ONLY_ONE_GIFT_SELLER':
            return 'Tài khoản của bạn chưa có số điện thoại hoặc số điện thoại chưa được xác minh nên không thể đặt hàng. Bấm vào để thêm số điện thoại!';

        /* ------ customer ------ */
        case Message.CUSTOMER_NOT_ACCUMULATED: {
            return 'CUSTOMER_NOT_ACCUMULATED';
        }
        /* ------ input ------ */
        case Message.INPUT_TELEPHONE_NOT_REGEX: {
            return 'Số điện thoại không hợp lệ, vui lòng thử lại!';
        }
        case Message.INPUT_EMAIL_NOT_REGEX: {
            return 'Email không hợp lệ, vui lòng thử lại!';
        }
        case Message.INPUT_USERNAME_NOT_REGEX: {
            return 'Tài khoản của bạn không hợp lệ, xin vui lòng thử lại!';
        }
        case Message.INPUT_EMPTY_VALUE: {
            return 'Email hoặc số điện thoại không được trống';
        }
        /* ------ password ------ */
        ///forgot
        case Message.PASSWORD_FORGOT_UPDATE_FAILED: {
            return 'Cập nhật mật khẩu thất bại, xin quý khách vui lòng thử lại!';
        }
        ///edit
        case Message.PASSWORD_EDIT_SUCCESS: {
            return 'Chỉnh sửa mật khẩu thành công, bạn có thể đăng nhập bằng mật khẩu mới!';
        }
        case Message.PASSWORD_EDIT_FAILED: {
            return 'Chỉnh sửa mật khẩu thất bại, xin quý khách vui lòng thử lại!';
        }
        case Message.PASSWORD_EDIT_INVALID_PASSWORD: {
            return 'Mật khẩu hiện tại của quý khách không chính xác, xin quý khách vui lòng thử lại!';
        }
        /* ------ register ------ */
        case Message.REGISTER_SUCCESS: {
            return `Số điện thoại ${telephone} đã đăng ký thành công, quý khách có thể đăng nhập sử dụng dịch vụ của Vua Dụng Cụ!`;
        }
        case Message.REGISTER_EXISTS_TELEPHONE: {
            return 'Số điện thoại của quý khách đã tồn tại, xin vui lòng chọn số điện thoại khác!';
        }
        case Message.REGISTER_OTHER_ERROR: {
            return 'Lỗi đăng ký tài khoản, quý khách vui lòng thử lại sau!';
        }
        /* ------- verify ------- */
        ///email
        case Message.VERIFY_EMAIL_NOT_SEND: {
            return 'Gửi mã xác minh thất bại, xin quý khách vui lòng thử lại!';
        }
        case Message.VERIFY_EMAIL_CODE_EXPIRED: {
            return 'Mã xác minh của bạn đã hết hạn, vui lòng nhấn vào gửi lại mã xác nhận để tiếp tục!';
        }
        case Message.VERIFY_EMAIL_CODE_FAILED: {
            return 'Xác minh thất bại, quý khách vui lòng kiểm tra lại mã xác minh!';
        }
        case Message.VERIFY_EMAIL_CODE_INVALID: {
            return 'Mã xác minh không đúng, xin quý khách vui lòng thử lại!';
        }
        case Message.VERIFY_EMAIL_CANNOT_EDIT: {
            return '* Email của bạn đã được xác minh, bạn không thể thay đổi email, mọi chi tiết liên hệ 1900 8085 để đươc hỗ trợ tốt hơn!';
        }
        case Message.VERIFY_TELEPHONE_CANNOT_EDIT: {
            return '* Số điện thoại của bạn đã được xác minh, bạn không thể thay đổi số điện thoại, mọi chi tiết liên hệ 1900 8085 để đươc hỗ trợ tốt hơn!';
        }
        ///phone
        case Message.VERIFY_SMS_NOT_SEND: {
            return 'Gửi tin nhắn xác minh thất bại xin quý khách vui lòng thử lại!';
        }
        case Message.VERIFY_MANY_REQUEST_SMS: {
            return 'Quý khách gửi quá nhiều yêu cầu nhận mã xác minh, xin vui lòng thử lại sau!';
        }
        case Message.VERIFY_PHONE_CODE_EXPIRED: {
            return 'Mã xác minh của bạn đã hết hạn, vui lòng nhấn vào gửi lại mã xác nhận để tiếp tục!';
        }
        case Message.VERIFY_PHONE_CODE_INVALID: {
            return 'Mã xác minh không đúng, xin quý khách vui lòng thử lại!';
        }

        /* ------ order ------ */
        case Message.CANCEL_ORDER_SUCCESS: {
            return 'Huỷ đơn hàng thành công!';
        }
        case Message.CANCEL_ORDER_FAILED: {
            return 'Huỷ đơn hàng thất bại, xin quý khách vui lòng thử lại!';
        }
        case Message.REPURCHASE_ORDER_FAILED: {
            return 'Đã xảy ra lỗi khi mua lại đơn hàng, xin quý khách vui lòng thử lại!';
        }
        case Message.RETURNS_ORDER_SUCCESS: {
            return 'Yêu cầu trả hàng thành công!';
        }
        case Message.RETURNS_ORDER_FAILED: {
            return 'Yêu cầu trả hàng thất bại. Xin quý khách vui lòng thử lại sau!';
        }
        /* ------ Event qr code ------ */
        case Message.EVENT_QR_CODE_SUCCESS:
            return `Quét mã thành công, Bạn đã nhận được '${qrScanScore}' điểm tích luỹ QR code!`;
        case Message.EVENT_QR_CODE_FAILED:
            return 'Đã xảy ra lỗi khi quét mã. xin vui lòng thử lại!';
        case Message.NOT_ENOUGH_TIME:
            return 'Thời gian chờ chưa đủ để quét mã tiếp theo. Xin vui lòng thử lại sau!';
        case Message.INVALID_QR_CODE:
            return 'Mã QR không hợp lệ, xin quý khách vui lòng thử lại!';
        /* ------ Link customer pos ------ */
        case Message.CONNECT_CUSTOMER_POS_SUCCESS:
            return 'Liết kết tài khoản pos thành công!';
        case Message.NOT_FOUND_CUSTOMER:
            return 'Không tìm thấy khách hàng trên hệ thông, xin quý khách vui lòng thử lại!';
        case Message.CONNECTED_CUSTOMER:
            return 'Tài khoản của bạn đã được liên kết với pos!';
        case Message.NO_PHONE:
            return 'Tài khoản của bạn chưa có số điện thoại!';
        case Message.NOT_CONFIRM_PHONE:
            return 'Số điện thoại của bạn chưa được xác thực!';
        case Message.NOT_FOUND_CUSTOMER_POS:
            return 'Không tìm thấy khách hàng trên hệ thống pos, xin quý khách vui lòng thử lại!';
        case Message.MULTI_CUSTOMER_POS_SAME_PHONE:
            return 'Số điện thoại đã bị trùng lặp trên hệ thống, vui lòng liên hệ 1900 8085 để được hỗ trợ xử lý!';
        case Message.CONNECTED_OTHER_CUSTOMER:
            return 'Số điện thoại của bạn đã được liên kết với một tài khoản pos khác!';
        case Message.ERROR_CONNECTED:
            return 'Đã có lỗi xảy ra khi liên kết tài khoản, xin quý khách vui lòng thử lại!';
        /* ------- referral ------- */
        case Message.CLIENT_NOT_ADD_DATA: {
            return 'Thiết bị hiện tại không hỗ trợ tải app qua mã giới thiệu !';
        }
        case Message.REFERRAL_CODE_NOT_EXIST: {
            return 'Liên kết mã giới thiệu không đúng, xin quý khách vui lòng thử lại!';
        }
        /* ------- @POS ------- */
        case 'CUSTOMER_NOT_PHONE':
            return 'Tài khoản chưa có số điên thoại, xin vui lòng thử lại!';
        case 'SELLER_NOT_POS':
            return 'Bạn chưa có thông tin Pos trên cửa hàng này!';
        case 'POS_IS_CONNECTED':
            return 'Bạn đã kết nối với Pos này!';
        case 'NOT_FOUND_CONNECT':
            return 'Không tìm thấy khách hàng Pos để kết nối!';
        case 'MULTI_SAME_PHONE':
            return 'Có nhiều khách hàng Pos trùng với số điện thoại của ban!';
        case 'CONNECTED_OTHER_CUSTOMER':
            return 'Khách hàng Pos đã liên kết với tài khoản khác';
        case 'ERROR_SAVE_CONNECT':
            return 'Lỗi kết nối, xin vui lòng thử lại sau';
        case 'POS_IS_NOT_CONNECTED':
            return 'Tài khoản chưa được liên kết với cửa hàng này, vui lòng thử lại sau!';
        case 'CONNECT_NOT_ACTIVE':
            return 'Liên kết với cửa hàng này chưa được kích hoạt, vui lòng thử lại sau!';
        case 'ERROR_CONNECT_POS':
            return 'Đã xảy ra lỗi với cửa hàng này, vui lòng thử lại sau!';
        case 'ERROR_SAVE_INFO':
            return 'Không thể chỉnh sửa thông tin, vui lòng thử lại sau!';
        case 'SCORE_NOT_ACTIVE':
            return 'Quý khách chưa được cấp quyền đổi điểm, vui lòng liên hệ 1900 8085 để được hỗ trợ!';
        case 'SCORE_NOT_ENOUGH':
            return 'Điểm tích luỹ của quý khách không đủ để đổi điểm, vui lòng thử lại sau!';
        case 'SCORE_NOT_ENOUGH':
            return 'Đã xảy ra lỗi khi đổi điểm, vui lòng thử lại sau!';

        //system
        case Message.SYSTEMS_ERROR: {
            return 'Đã có lỗi xảy ra, xin quý khách vui lòng thử lại sau!';
        }
        default: {
            return '';
        }
    }
}
