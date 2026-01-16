import Big from 'big.js';
import * as path from 'path';
import { SRC_DIR } from 'src/main';

export const minus = (first: number, second: number): number => {
  return Number(new Big(first).minus(new Big(second)));
};

export const plus = (first: number, second: number): number => {
  return Number(new Big(first).plus(new Big(second)));
};

export const mul = (first: number, second: number): number => {
  return Number(new Big(first).mul(new Big(second)));
};

export const div = (first: number, second: number): number => {
  return Number(new Big(first).div(new Big(second)));
};

export const escapeCharForSearch = (str: string): string => {
  return str.toLowerCase().replace(/[?%\\_]/gi, function (x) {
    return '\\' + x;
  });
};

export enum EnumSort {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum RememberPassword {
  active = 1,
  inactive = 0,
}

export const getTemplate = (lang) => {
  return path.join(
    SRC_DIR,
    'static',
    'template',
    'import',
    `${lang}${path.sep}`,
  );
};

export const ACTIONS = [
  'Tạo',
  'Sửa',
  'Bỏ qua',
  'Create',
  'Edit',
  'Skip',
  '作成',
  '編集',
  'スキップ',
];

export const getDataDuplicate = (array: any[]): any => {
  return array.filter((value, index, arr) => {
    return arr.indexOf(value) !== index;
  });
};

export const getDiffDate = (startDate: Date, endDate: Date) => {
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
};

export const isWeekend = (date = new Date()) => {
  return date.getDay() === 6 || date.getDay() === 0;
};

export enum EnumStatus {
  YES = 1,
  NO = 0,
}
