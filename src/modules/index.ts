/**
 * 현재 날짜 불러옴 / 해당 날짜보다 14일 뒤의 날짜
 */
export const setDateTemp = (format: string = ".") => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${format}${month}${format}${day} ${hour}:${minutes}:${seconds}`;
};
export const setDate14Temp = (date: string) => {
  const day14 = new Date(date.replace(/\./g, "-"));
  day14.setDate(day14.getDate() + 15);

  const year = day14.getFullYear();
  const month = String(day14.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(day14.getDate()).padStart(2, "0");

  return `${year}.${month}.${day} 00:00:00`;
};

/**
 * 날짜 형식 지정
 */
// const setDateFormat = (date: Date | string, format: string = "-") => {
//   return new Date(date);
// };

/**
 * 카테고리 목록
 */
