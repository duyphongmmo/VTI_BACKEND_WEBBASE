import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/constant';

export const USER_ROLE_SETTING_GROUP_PERMISSION = {
  name: 'Quản lý vai trò',
  code: FORMAT_CODE_PERMISSION + 'USER_ROLE_SETTING_GROUP',
  status: StatusPermission.ACTIVE,
};
export const CREATE_USER_ROLE_SETTING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_USER_ROLE_SETTING',
  name: 'Tạo vai trò',
  groupPermissionSettingCode: USER_ROLE_SETTING_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const UPDATE_USER_ROLE_SETTING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'UPDATE_USER_ROLE_SETTING',
  name: 'Sửa vai trò',
  groupPermissionSettingCode: USER_ROLE_SETTING_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DELETE_USER_ROLE_SETTING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DELETE_USER_ROLE_SETTING',
  name: 'Xóa vai trò',
  groupPermissionSettingCode: USER_ROLE_SETTING_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const DETAIL_USER_ROLE_SETTING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'DETAIL_USER_ROLE_SETTING',
  name: 'Chi tiết vai trò',
  groupPermissionSettingCode: USER_ROLE_SETTING_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_USER_ROLE_SETTING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_USER_ROLE_SETTING',
  name: 'Danh sách vai trò',
  groupPermissionSettingCode: USER_ROLE_SETTING_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const SEARCH_USER_ROLE_SETTING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'SEARCH_USER_ROLE_SETTING',
  name: 'Tìm kiếm danh sách vai trò',
  groupPermissionSettingCode: USER_ROLE_SETTING_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const IMPORT_USER_ROLE_SETTING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'IMPORT_USER_ROLE_SETTING',
  name: 'Nhập dữ liệu vai trò',
  groupPermissionSettingCode: USER_ROLE_SETTING_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const EXPORT_USER_ROLE_SETTING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'EXPORT_USER_ROLE_SETTING',
  name: 'Xuất dữ liệu vai trò',
  groupPermissionSettingCode: USER_ROLE_SETTING_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const CHANGE_STATUS_USER_ROLE_SETTING_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CHANGE_STATUS_USER_ROLE_SETTING',
  name: 'Cập nhật trạng thái vai trò',
  groupPermissionSettingCode: USER_ROLE_SETTING_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const USER_ROLE_SETTIING_PERMISSION = [
  CREATE_USER_ROLE_SETTING_PERMISSION,
  UPDATE_USER_ROLE_SETTING_PERMISSION,
  DELETE_USER_ROLE_SETTING_PERMISSION,
  DETAIL_USER_ROLE_SETTING_PERMISSION,
  LIST_USER_ROLE_SETTING_PERMISSION,
  SEARCH_USER_ROLE_SETTING_PERMISSION,
  IMPORT_USER_ROLE_SETTING_PERMISSION,
  EXPORT_USER_ROLE_SETTING_PERMISSION,
  CHANGE_STATUS_USER_ROLE_SETTING_PERMISSION,
];
