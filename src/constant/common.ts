import * as dotenv from 'dotenv';
dotenv.config();

export enum IS_GET_ALL_FACTORY {
  NO = '0',
  YES = '1',
}

export enum IS_SUCCESS {
  NO,
  YES,
}

export enum IS_LOCK_ENUM {
  NO,
  YES,
}

export enum ACTIVE_ENUM {
  INACTIVE,
  ACTIVE,
}

export enum BINARY_ENUM {
  NO,
  YES,
}

export enum UNIT_LEVEL_ENUM {
  UNIT = 5,
  SECTION = 4,
  DEPARTMENT = 3,
  FACTORY = 2,
  DIVISION = 1,
}

export const jwtConstants = {
  acessTokenSecret: process.env.JWT_ACESS_TOKEN_SECRET,
  acessTokenExpiresIn: process.env.JWT_ACESS_TOKEN_EXPIRES_IN || 1800,
  refeshTokenSecret: process.env.JWT_RESFRESH_TOKEN_SECRET,
  refeshTokenExpiresIn: process.env.JWT_RESFRESH_TOKEN_EXPIRES_IN || 2000,
  refeshTokenExpiresMaxIn:
    process.env.JWT_RESFRESH_TOKEN_EXPIRES_MAX_IN || 432000,
};

export const SUPER_ADMIN = {
  id: 1,
  code: '000000001',
  username: 'admin',
  password: 'snp1234567',
  email: 'admin@ajinomoto.com.vn',
  fullName: 'Admin',
};

export const ROLE_SUPER_ADMIN = {
  code: '01',
  name: 'super-admin',
};

export const USERS_DEFAULT = [
  {
    id: 2,
    code: '000000002',
    username: 'lga1-avn',
    password: 'lgaAVN@123',
    email: 'lga-avn1@ajinomoto.com.vn',
    fullName: 'LGA 1',
  },
  {
    id: 3,
    code: '000000003',
    username: 'lga2-avn',
    password: 'lgaAVN@123',
    email: 'lga-avn2@ajinomoto.com.vn',
    fullName: 'LGA 2',
  },
  {
    id: 4,
    code: '000000004',
    username: 'lga3-avn',
    password: 'lgaAVN@123',
    email: 'lga-avn3@ajinomoto.com.vn',
    fullName: 'LGA 3',
  },
  {
    id: 5,
    code: '000000005',
    username: 'admin-unit1',
    password: 'adminUnit.avn@123',
    email: 'admin-staff1@ajinomoto.com.vn',
    fullName: 'Admin Unit 1',
  },
  {
    id: 6,
    code: '000000006',
    username: 'admin-unit22',
    password: 'adminUnit.avn@123',
    email: 'admin-staff2@ajinomoto.com.vn',
    fullName: 'Admin Unit 2',
  },
  {
    id: 7,
    code: '000000007',
    username: 'admin-unit3',
    password: 'adminUnit.avn@123',
    email: 'admin-staff3@ajinomoto.com.vn',
    fullName: 'Admin Unit 3',
  },
  {
    id: 8,
    code: '000000008',
    username: 'itavn1',
    password: 'itAVN@123',
    email: 'it-avn1@ajinomoto.com.vn',
    fullName: 'IT 1',
  },
  {
    id: 9,
    code: '000000009',
    username: 'itavn2',
    password: 'itAVN@123',
    email: 'it-avn2@ajinomoto.com.vn',
    fullName: 'IT 2',
  },
  {
    id: 10,
    code: '000000010',
    username: 'itavn3',
    password: 'itAVN@123',
    email: 'it-avn3@ajinomoto.com.vn',
    fullName: 'IT 3',
  },
  {
    id: 11,
    code: '000000011',
    username: 'guard-avn1',
    password: 'guardAVN@123',
    email: 'guard-avn1@ajinomoto.com.vn',
    fullName: 'Guard 1',
  },
  {
    id: 12,
    code: '000000012',
    username: 'guard-avn2',
    password: 'guardAVN@123',
    email: 'guard-avn2@ajinomoto.com.vn',
    fullName: 'Guard 2',
  },
  {
    id: 13,
    code: '000000013',
    username: 'guard-avn3',
    password: 'guardAVN@123',
    email: 'guard-avn3@ajinomoto.com.vn',
    fullName: 'Guard 3',
  },
];

export const DEFAULT_ROLES = [
  {
    id: 1,
    code: 'lga-staff',
    name: 'LGA Staff',
    status: ACTIVE_ENUM.ACTIVE,
  },
  {
    id: 2,
    code: 'unit-admin',
    name: 'Unit Admin',
    status: ACTIVE_ENUM.ACTIVE,
  },
  {
    id: 3,
    code: 'it-staff',
    name: 'IT Staff',
    status: ACTIVE_ENUM.ACTIVE,
  },
  {
    id: 4,
    code: 'guard',
    name: 'Guard',
    status: ACTIVE_ENUM.ACTIVE,
  },
];

export const SET_USER_ROLE = [
  {
    userId: 2,
    roldId: 1,
  },
  {
    userId: 3,
    roldId: 1,
  },
  {
    userId: 4,
    roldId: 1,
  },
  {
    userId: 5,
    roldId: 2,
  },
  {
    userId: 6,
    roldId: 2,
  },
  {
    userId: 7,
    roldId: 2,
  },
  {
    userId: 8,
    roldId: 3,
  },
  {
    userId: 9,
    roldId: 3,
  },
  {
    userId: 10,
    roldId: 3,
  },
  {
    userId: 11,
    roldId: 4,
  },
  {
    userId: 12,
    roldId: 4,
  },
  {
    userId: 13,
    roldId: 4,
  },
];

export const DEFAUL_VEHIDLE_CATEGORY = [
  {
    code: 'X45',
    name: 'Xe 45 chỗ',
    totalSeat: 43,
    isActive: ACTIVE_ENUM.ACTIVE,
    description: '',
  },
  {
    code: 'X29',
    name: 'Xe 29 chỗ',
    totalSeat: 27,
    isActive: ACTIVE_ENUM.ACTIVE,
    description: '',
  },
  {
    code: 'X16',
    name: 'Xe 16 chỗ',
    totalSeat: 14,
    isActive: ACTIVE_ENUM.ACTIVE,
    description: '',
  },
  {
    code: 'X7',
    name: 'Xe 7 chỗ',
    totalSeat: 6,
    isActive: ACTIVE_ENUM.ACTIVE,
    description: '',
  },
];

export const DATA_NOT_CHANGE = {
  DEFAULT_USERS: [SUPER_ADMIN, ...USERS_DEFAULT],
  DEFAULT_ROLES: [ROLE_SUPER_ADMIN],
  DEFAUL_VEHIDLE_CATEGORY: DEFAUL_VEHIDLE_CATEGORY,
  DEFAULT_USERS_ROLES: SET_USER_ROLE,
};

export const FORMAT_CODE_PERMISSION = 'USER_';
export const REGEX_MAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const REGEX_PHONE =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const DEPARTMENT_ID = 3;

export enum UNAUTHORIZE_KEY {
  PROFILE_CUSTOM_UNAUTHORIZE = 'PROFILE_CUSTOM_UNAUTHORIZE',
  CAT_SHIFT_UNAUTHORIZE = 'CAT_SHIFT_UNAUTHORIZE',
  ORG_STRUCTURE_UNAUTHORIZE = 'ORG_STRUCTURE_UNAUTHORIZE',
  POSITION_UNAUTHORIZE = 'POSITION_UNAUTHORIZE',
  ATTENDANCE_UNAUTHORIZE = 'ATTENDANCE_UNAUTHORIZE',
  ROSTER_CALENDAR_UNAUTHORIZE = 'ROSTER_CALENDAR_UNAUTHORIZE',
  OVERTIME_PLAN_UNAUTHORIZE = 'OVERTIME_PLAN_UNAUTHORIZE',
  BUSSINESS_UNAUTHORIZE = 'BUSSINESS_UNAUTHORIZE',
  FACTORY_UNAUTHORIZE = 'FACTORY_UNAUTHORIZE',
  PICKUP_POINT_UNAUTHORIZE = 'PICKUP_POINT_UNAUTHORIZE',
  ROUTE_UNAUTHORIZE = 'ROUTE_UNAUTHORIZE',
  VEHICLE_CATEGORY_UNAUTHORIZE = 'VEHICLE_CATEGORY_UNAUTHORIZE',
  USER_MESSAGE_UNAUTHORIZE = 'USER_MESSAGE_UNAUTHORIZE',
  USER_ROLE_UNAUTHORIZE = 'USER_ROLE_UNAUTHORIZE',
  MANAGE_PERMISSION_UNAUTHORIZE = 'MANAGE_PERMISSION_UNAUTHORIZE',
  EXPORT_UNAUTHORIZE = 'EXPORT_UNAUTHORIZE',
  IMPORT_UNAUTHORIZE = 'IMPORT_UNAUTHORIZE',
  SEND_MAIL_UNAUTHORIZE = 'SEND_MAIL_UNAUTHORIZE',
  CRON_SETTING_UNAUTHORIZE = 'CRON_SETTING_UNAUTHORIZE',
  FEE_SETTING_UNAUTHORIZE = 'FEE_SETTING_UNAUTHORIZE',
  REPORT_UNAUTHORIZE = 'REPORT_UNAUTHORIZE',
  BUSINESS_REGISTRATION_UNAUTHORIZE = 'BUSINESS_REGISTRATION_UNAUTHORIZE',
  CHECKIN_UNAUTHORIZE = 'CHECKIN_UNAUTHORIZE',
}

export enum COORDINATES_STATUS {
  CHECKIN_COORDINATES_INVALID = 'CHECKIN_COORDINATES_INVALID',
  PP_COORDINATES_INVALID = 'PP_COORDINATES_INVALID',
  DISTANCE_INVALID = 'DISTANCE_INVALID',
  DISTANCE_VALID = 'DISTANCE_VALID',
}

export enum SYSTEM_CONFIG_CODE {
  AUTO_APPROVAL = 'AUTO_APPROVAL',
  DISTANCE_VALID = 'DISTANCE_VALID',
}

export enum SHIFT_TYPE {
  SHIFT = 'SHIFT',
  OFFICAL = 'OFFICAL',
}
