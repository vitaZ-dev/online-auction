/* eslint-disable @typescript-eslint/no-explicit-any */
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query as q,
  startAfter,
} from "firebase/firestore";
import { POSTS_DB } from "../../constants/firebase";
import { calTotalPage } from "../../utils";

const fetchPosts = async (page: number = 1) => {
  let totalPages: number = 1;
  let lastItem: any = null;

  // 데이터 불러온 최초 1회만 실행하면 됨
  if (page === 1) {
    const snapshot = await getCountFromServer(POSTS_DB);
    totalPages = calTotalPage(snapshot.data().count, 2);
  }

  /**
   * posts의 아이템 총 갯수를 알고있는 상태.
   * 마지막 페이지도 알고있는 상태.
   * 마지막 페이지에 도달하면 무한스크롤 or 버튼 비활성화 처리?
   */
  // const lastItem = snapshot.docs[CONTENTS_COUNT * (page - 1) + 1];

  let fire = q(POSTS_DB, orderBy("created_at", "desc"), limit(2));

  if (lastItem) {
    fire = q(
      POSTS_DB,
      orderBy("created_at", "desc"),
      startAfter(lastItem),
      limit(2)
    );
    // query 즉, 파이어스토어 저장된 날짜순으로 정렬된 데이터 중에
    // start로 정의된 데이터를 시작으로 마지막 까지의 데이터들을 query에 저장한다.
  }

  const { docs } = await getDocs(fire);
  lastItem = docs[docs.length - 1];

  const doc = [];
  docs.forEach((item) => doc.push(item.data()));
  return { docs: doc, lastItem: lastItem.data(), page, totalPages };
};

export const useInfiniteTest = (getFn, lastItem) => {
  return useInfiniteQuery({
    queryKey: ["fb-posts-test"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return getFn(pageParam, lastItem); // API GET 함수;
    },
    getNextPageParam: (pageItems) => {
      // console.log("pageItems", pageItems); // 지난번 받아온 데이터 값
      // 리턴 값이 queryFn의 pageParam에 들어감
      return pageItems.page < pageItems.totalPages
        ? pageItems.page + 1
        : undefined;
    },
    // onSuccess: (newData) => {
    //   console.log("newData", newData);
    // },
  });
};

/*
const getJsonServerData = async (page: number) => {
  try {
    const { data } = await api.get(
      `posts?_sort=created_at&_order=desc&_page=${page}&_limit=${4}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};
export const useInfiniteTest = (getFn: (arg0: any) => void) => {
  return useInfiniteQuery({
    queryKey: ["json-posts-test"],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => {
      console.log("pageParam", pageParam);
      return getJsonServerData(pageParam); // API GET 함수;
    },
    getNextPageParam: (pageItems, pages) => {
      console.log("pageItems", pageItems, pages); // 지난번 받아온 데이터 값
      // 리턴 값이 queryFn의 pageParam에 들어감
      if (pageItems.page < pageItems.total_page) return pageItems.page + 1;
      return undefined;
    },
  });
};
*/
