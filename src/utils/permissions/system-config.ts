import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/constant';

export const SYSTEM_CONFIG_GROUP_PERMISSION = {
  name: 'Quản lý cài đặt hệ thống',
  code: FORMAT_CODE_PERMISSION + 'SYSTEM_CONFIG_GROUP',
  status: StatusPermission.ACTIVE,
};

export const CREATE_SYSTEM_CONFIG_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'CREATE_SYSTEM_CONFIG',
  name: 'Tạo/Sửa cài đặt hệ thống',
  groupPermissionSettingCode: SYSTEM_CONFIG_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const GET_LIST_SYSTEM_CONFIG_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'GET_LIST_SYSTEM_CONFIG',
  name: 'Danh sách cài đặt hệ thống',
  groupPermissionSettingCode: SYSTEM_CONFIG_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const SYSTEM_CONFIG_PERMISSION = [
  CREATE_SYSTEM_CONFIG_PERMISSION,
  GET_LIST_SYSTEM_CONFIG_PERMISSION,
];
