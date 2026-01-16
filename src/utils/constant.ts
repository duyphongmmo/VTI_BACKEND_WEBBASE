export const LANG = {
  EN: 'en',
  VI: 'vi',
};

export const DEFAULT_LANG = LANG.VI;

export enum StatusPermission {
  ACTIVE = 1,
  INACTIVE = 0,
}

export const FIELD_VALIDATE = {
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 20,
  },
  CODE: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 20,
  },
  NAME: {
    MAX_LENGTH: 255,
  },
  DESCRIPTION: {
    MAX_LENGTH: 255,
  },
};

export enum ROLE {
  ADMIN,
  FACTORY_MANAGER,
  LEADER,
  MEMBER,
  OTHER,
}
