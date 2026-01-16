export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export const toStringTrim = (obj: any): string =>
  obj ? obj.toString().trim() : null;

export const toStringTrimLowerCase = (obj: any): string =>
  toStringTrim(obj) ? toStringTrim(obj).toLowerCase() : null;

export function stringFormat(template: string, ...args: any[]) {
  return template.replace(/{(\d+)}/g, function (match, number) {
    return typeof args[number] != 'undefined' ? args[number] : match;
  });
}

export function dateFormat(inputDateStr: string): string {
  const inputDate = new Date(inputDateStr);

  const day = inputDate.getDate();
  let dayStr = day.toString();

  // day < 10 is returned without leading zero so it must be added a leading zero
  if (day < 10) dayStr = `0${dayStr}`;

  // getMonth() returns month between 0 and 11 so it must be added by 1
  const month = inputDate.getMonth() + 1;
  let monthStr = month.toString();

  // month < 10 is returned without leading zero so it must be added a leading zero
  if (month < 10) monthStr = `0${monthStr}`;

  return `${inputDate.getFullYear()}-${monthStr}-${dayStr}`;
}
