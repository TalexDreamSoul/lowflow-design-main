const c_character = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]

export function num2character(num: number): string {
  return num <= 10 ? c_character[num] : (parseInt(`${num / 10}`) != 1 ? c_character[parseInt(`${num / 10}`)] : "" + c_character[10] + num2character(num % 10))
}

// export function randomStr(length: number = 6): string {
//   if (!length) return ''

//   return (100000 + Math.random() * 1000000).toString(16).slice(length) + (length == 6 ? '' : randomStr(length - 6))
// }

/**
 * Fake random string => uuid
 * @param length fake
 */
export function randomStr(length: number = 36) {
  return 'xxxxxxxx-xxxx-9xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {

    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

    return v.toString(16);

  });
}

const isNil = (v: unknown): boolean => {
  return v === undefined || v === null;
};

export const checkStringEqual = (v1: string | number, v2: string | number, ...rest: (string | number)[]): boolean => {
  if (rest?.length > 0) {
    const list = [`${v2}`, ...rest.map(item => `${item}`)];
    return list.includes(`${v1}`);
  }
  if (isNil(v1) || isNil(v2)) {
    return false;
  }
  return `${v1}` === `${v2}`;
};

export const debounce = (fun: any, wait = 3000) => {
  let timerId: any = null;

  return (...rest: any) => {
    let args = rest;
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fun(...args);
    }, wait);
  };
};


export const materialType = [
  { value: "all", name: "模版总览" },
  { value: "sms", name: "短信" },
  { value: "appPush", name: "APP PUSH" },
  { value: "digital", name: "企微" },
  { value: "outbound", name: "智能外呼" },
  { value: "znx", name: "站内信" }
];

export function sleep(num: number = 200) {
  return new Promise(resolve => {
    setTimeout(resolve, num)
  })
}

export const formatNumToThousandth = (val: number | string): string => {
  if(!['string', 'number'].includes(typeof(val))) {
    return val as any;
  }
  if (isNaN(Number(val))) {
    // console.warn('请输入数字的number或string格式');
    return '';
  }
  const _str = `${val}`;
  const [int, decimal] = _str.split('.');
  const _int = int
    .split('')
    .reverse()
    .reduce((cur, item, index, arr) => {
      if ((index + 1) % 3 === 0 && index + 1 !== arr.length) {
        return `${cur}${item},`;
      }
      return `${cur}${item}`;
    }, '')
    .split('')
    .reverse()
    .join('');
  const _decimal =
    decimal?.length > 3
      ? decimal.split('').reduce((cur, item, index) => ((index + 1) % 3 === 0 ? `${cur}${item},` : `${cur}${item}`), '')
      : decimal;
  return `${_int}${_decimal ? '.' + _decimal : ''}`;
};