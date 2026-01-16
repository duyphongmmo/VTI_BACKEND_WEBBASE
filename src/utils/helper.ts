import Big from 'big.js';
import * as moment from 'moment';

export default function isEmpty(obj) {
  if (obj === null || obj === undefined) return true;
  return Object.keys(obj).length === 0;
}

export const plus = (first: number, second: number): number => {
  return Number(new Big(first).plus(new Big(second)));
};

export function serilize(data) {
  if (data.length > 0) {
    const serilizeData = [];
    data.forEach((record) => {
      serilizeData[record.id] = record;
    });
    return serilizeData;
  }
  return data;
}

export const isDevMode = () => {
  return (
    process.env.NODE_ENV.startsWith('dev') ||
    process.env.NODE_ENV.startsWith('local')
  );
};

export function getWorkingDaysAndTotalOfMonth(month: number, year: number): number[] {
  let workingDay = 0;
  let total = 0;
  month < 10 ? '0' + month : month
  let startDate = moment(year + "" + month, "YYYYMM").subtract(1, 'month').date(21);
  const endDate = moment(year + "" + month, "YYYYMM").date(20);
  while (startDate <= endDate) {
    if (startDate.day() != 0 && startDate.day() != 6) {
      workingDay++;
    }
    total++;
    startDate.add('1', 'day');
  }
  return [workingDay, total];
}
