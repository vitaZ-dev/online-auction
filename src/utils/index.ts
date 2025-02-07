export const moneyFormat = (num: number | string) => {
  return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
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
