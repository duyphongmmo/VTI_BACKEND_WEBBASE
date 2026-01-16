export const EXCEL_STYLE = {
  SHEET_FONT: {
    size: 13,
    color: { argb: '000000' },
    bold: false,
    name: 'Times New Roman',
  },
  TOTAL_FONT: {
    color: { argb: 'FF0000' },
    size: 13,
    bold: true,
  },
  TITLE_FONT: {
    size: 13,
    bold: true,
    name: 'Times New Roman',
  },
  DEFAULT_FONT: {
    size: 12,
    bold: false,
    name: 'Times New Roman',
  },
  HEADER_FILL: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'c0c0c0' },
  },
  HIGHT_LIGHT: {
    color: { argb: 'FF0000' },
    name: 'Times New Roman',
    size: 13,
  },
  ALIGN_CENTER: {
    vertical: 'middle',
    horizontal: 'center',
    wrapText: true,
  },
  ALIGN_LEFT_MIDDLE: {
    vertical: 'middle',
    horizontal: 'left',
    wrapText: true,
  },
  ALIGN_RIGHT_MIDDLE: {
    vertical: 'middle',
    horizontal: 'right',
    wrapText: true,
  },
  ALIGN_BOTTOM: {
    vertical: 'bottom',
    horizontal: 'center',
    wrapText: true,
  },
  BORDER_ALL: {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  },
  BORDER_TOP: {
    top: { style: 'thin' },
  },
  DDMMYYYY: 'dd-mm-yyyy',
  DDMMYYYYHHMMSS: 'dd-mm-yyyy HH:MM:SS',
};

export const ROW = {
  COUNT_START_ROW: 1,
  COUNT_END_ROW: 1001,
  LIMIT_EXPORT: 10000,
  LIMIT_EXPORT_ON_SHEET: 1000,
};

export const SHEET = {
  START_SHEET: 1,
  NAME: 'Sheet',
};

export enum ExportTypeEnum {
  DASHBOARD = 1,
}

export const MAX_NUMBER_PAGE = 100;

export const EXCEL_CONVERT_UNIT = 10.2862254025;

export const formatDate = (date: Date): Date => {
  const originalTime = new Date(date);
  const newTime = new Date(originalTime.getTime() + 7 * 60 * 60 * 1000);
  const seconds = Math.floor(newTime.getSeconds());
  newTime.setSeconds(seconds, 0);
  return newTime;
};
