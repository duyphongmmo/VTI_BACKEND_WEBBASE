import { FORMAT_CODE_PERMISSION } from '@constant/common';
import { StatusPermission } from '@utils/constant';

export const POSITION_GROUP_PERMISSION = {
  name: 'Quản lý chức vụ',
  code: FORMAT_CODE_PERMISSION + 'POSITION_GROUP',
  status: StatusPermission.ACTIVE,
};

export const SYNCHRONIZE_POSITION_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'SYNCHRONIZE_POSITION',
  name: 'Đồng bộ chức vụ',
  groupPermissionSettingCode: POSITION_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const LIST_POSITION_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'LIST_POSITION',
  name: 'Danh sách chức vụ',
  groupPermissionSettingCode: POSITION_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const SEARCH_POSITION_PERMISSION = {
  code: FORMAT_CODE_PERMISSION + 'SEARCH_POSITION',
  name: 'Tìm kiếm thông tin chức vụ',
  groupPermissionSettingCode: POSITION_GROUP_PERMISSION.code,
  status: StatusPermission.ACTIVE,
};

export const POSITION_PERMISSION = [
  SYNCHRONIZE_POSITION_PERMISSION,
  LIST_POSITION_PERMISSION,
  SEARCH_POSITION_PERMISSION,
];
