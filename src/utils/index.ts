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
 * 페이지네이션 최대 페이지 계산
 */
export const calTotalPage = (total_cnt: number, contents_cnt: number) => {
  return total_cnt > contents_cnt ? Math.ceil(total_cnt / contents_cnt) : 1;
};
