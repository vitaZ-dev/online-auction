export const CATEGORY = [
  {
    category_name: "디지털기기",
    category_id: 1,
  },
  {
    category_name: "생활가전",
    category_id: 2,
  },
  {
    category_name: "가구/인테리어",
    category_id: 3,
  },
  {
    category_name: "생활/주방",
    category_id: 4,
  },
  {
    category_name: "유아동",
    category_id: 5,
  },
  {
    category_name: "유아도서",
    category_id: 6,
  },
  {
    category_name: "여성의류",
    category_id: 7,
  },
  {
    category_name: "여성잡화",
    category_id: 8,
  },
  {
    category_name: "남성패션/잡화",
    category_id: 9,
  },
  {
    category_name: "뷰티/미용",
    category_id: 10,
  },
  {
    category_name: "스포츠/레저",
    category_id: 11,
  },
  {
    category_name: "취미/게임/음반",
    category_id: 12,
  },
  {
    category_name: "도서",
    category_id: 13,
  },
  {
    category_name: "티켓/교환권",
    category_id: 14,
  },
  {
    category_name: "가공식품",
    category_id: 15,
  },
  {
    category_name: "건강기능식품",
    category_id: 16,
  },
  {
    category_name: "반려동물용품",
    category_id: 17,
  },
  {
    category_name: "식물",
    category_id: 18,
  },
  {
    category_name: "기타 중고물품",
    category_id: 19,
  },
];

export const findCategory = (id: number) => {
  return (
    CATEGORY.find((cate) => cate.category_id === id)?.category_name || "ECT"
  );
};
