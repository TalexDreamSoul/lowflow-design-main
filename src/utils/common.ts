const c_character = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"]

export function num2character(num: number): string {
  return num <= 10 ? c_character[num] : (parseInt(`${num / 10}`) != 1 ? c_character[parseInt(`${num / 10}`)] : "" + c_character[10] + num2character(num % 10))
}