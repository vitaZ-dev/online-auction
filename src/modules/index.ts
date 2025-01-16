/**
 * 현재 날짜 불러옴+임시 / 해당 날짜보다 30일 뒤의 날짜
 */
export const setDateTemp = (format: string = "-") => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${format}${month}${format}${day}`;
};
export const setDate30Temp = (date: Date | string) => {
  const day30 = new Date(date);
  day30.setDate(day30.getDate() + 30);

  const year = day30.getFullYear();
  const month = String(day30.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1
  const day = String(day30.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * 날짜 형식 지정
 */
const setDateFormat = (date: Date | string, format: string = "-") => {
  return new Date(date);
};

/**
 * 카테고리 목록
 */
