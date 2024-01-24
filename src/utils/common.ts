const c_character = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]

export function num2character(num: number): string {
  return num <= 10 ? c_character[num] : (parseInt(`${num / 10}`) != 1 ? c_character[parseInt(`${num / 10}`)] : "" + c_character[10] + num2character(num % 10))
}

export function randomStr(length: number = 6): string {
  if (!length) return ''

  return (100000 + Math.random() * 1000000).toString(16).slice(length) + (length == 6 ? '' : randomStr(length - 6))
}