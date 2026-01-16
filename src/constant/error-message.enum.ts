export enum ErrorMessageEnum {
  // ================= General error message ===============================
  NOT_FOUND = 'Data not found',
  INTERNAL_SERVER_ERROR = 'Internal server error',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Access denied',
  BAD_REQUEST = 'Bad request',
  SUCCESS = 'Success',
  TOKEN_EXPIRED = 'Token expired',

  // ================= General User error message ===============================
  UNIQUE_DATA_USERNAME = 'Dữ liệu Tên Đăng Nhập đã tồn tại',
  UNIQUE_DATA_CODE = 'Dữ liệu Mã đã tồn tại',
  UNIQUE_DATA_EMAIL = 'Dữ liệu Email đã tồn tại',
  USER_ROLE_NOT_FOUND = 'Dữ liệu Quyền không tồn tại',
  USER_NOT_FOUND = 'Dữ liệu Người Dùng không tồn tại',
  COMPANY_NOT_FOUND = 'Dữ liệu Công Ty không tồn tại',
  DEPARTMENT_NOT_FOUND = 'Dữ liệu Phòng Ban không tồn tại',
  FACTORY_NOT_FOUND = 'Dữ liệu Nhà Máy không tồn tại',
  WAREHOUSE_NOT_FOUND = 'Dữ liệu Kho không tồn tại',
  CODE_ALREADY_EXISTS = 'Dữ liệu Mã đã tồn tại',
  NAME_ALREADY_EXISTS = 'Dữ liệu Tên đã tồn tại',
  OTP_CODE_NOT_CORRECT = 'Mã OTP không chính xác',
  OTP_CODE_EXPIRED = 'Mã OTP đã hết hạn',
  CAN_NOT_DELETE = 'Dữ liệu này không thể xóa',

  // ================= General mail error message ===============================
  SEND_MAIL_FAIL = 'Gửi email thất bại',
}
