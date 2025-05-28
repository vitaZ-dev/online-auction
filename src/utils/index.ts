/**
 * 숫자 포맷 설정
 */
export const numberFormat = (num: number | string) => {
  return num?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

export const moneyFormatLocaleString = (
  num: number | string,
  unit: string = "won"
) => {
  if (unit === "dollar") {
    return (
      "＄" +
      +num.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      })
    );
  }

  // if (unit === 'yen') {
  //   return '￥' +

  // }

  return (
    +num.toLocaleString("ko-KR", {
      style: "currency",
      currency: "KRW",
    }) + "원"
  );
};

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
 * 페이지네이션 최대 페이지 계산
 */
export const calTotalPage = (total_cnt: number, contents_cnt: number) => {
  return total_cnt > contents_cnt ? Math.ceil(total_cnt / contents_cnt) : 1;
};
