import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/constant';

export const USER_GROUP_PERMISSION = {
  name: 'Quản lý người dùng',
  code: FORMAT_CODE_PERMISSION + 'USER_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_USER',
  name: 'Tạo người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const UPDATE_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_USER',
  name: 'Sửa người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DELETE_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_USER',
  name: 'Xóa người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CONFIRM_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CONFIRM_USER',
  name: 'Xác nhận người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const REJECT_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'REJECT_USER',
  name: 'Từ chối người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DETAIL_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_USER',
  name: 'Chi tiết người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_USER',
  name: 'Danh sách người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const SEARCH_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'SEARCH_USER',
  name: 'Tìm kiếm danh sách người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const IMPORT_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_USER',
  name: 'Nhập dữ liệu người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const EXPORT_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_USER',
  name: 'Xuất dữ liệu người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CHANGE_PASSWORD_USER_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CHANGE_PASSWORD_USER',
  name: 'Thay đổi mật khẩu tài khoản người dùng',
  groupPermissionSettingCode: USER_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const USER_PERMISSION = [
  CREATE_USER_PERMISSION,
  UPDATE_USER_PERMISSION,
  DELETE_USER_PERMISSION,
  DETAIL_USER_PERMISSION,
  LIST_USER_PERMISSION,
  SEARCH_USER_PERMISSION,
  IMPORT_USER_PERMISSION,
  EXPORT_USER_PERMISSION,
  CHANGE_PASSWORD_USER_PERMISSION,
];
