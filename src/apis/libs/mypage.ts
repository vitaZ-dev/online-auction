import {
  collection,
  CollectionReference,
  DocumentData,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  where,
} from "firebase/firestore";
import { POSTS_DB } from "../../modules/firebase";
import firebaseDB from "../../libs/firebase";
import { calTotalPage } from "../../utils";

// 마이페이지 최근 판매 물품 목록
export const mypageRecentList = async (user_id: string) => {
  try {
    const recentQuery = query(
      POSTS_DB,
      where("user_id", "==", user_id),
      orderBy("created_at", "desc"),
      limit(4)
    );
    const { docs } = await getDocs(recentQuery);
    return docs.map((item) => item.data());
  } catch (error) {
    console.log(error);
    return [];
  }
};

// 마이페이지 최근 입찰 물품 목록
export const mypageBidList = async (user_id: string) => {
  try {
    const bidQuery = query(
      collection(firebaseDB, "bid_list", user_id, "data"),
      orderBy("created_at", "desc"),
      limit(4)
    );
    const { docs } = await getDocs(bidQuery);
    return docs.map((item) => item.data());
  } catch (error) {
    console.log(error);
    return [];
  }
};

// 마이페이지 최근 낙찰 물품 목록
export const mypageAwardList = async (user_id: string) => {
  try {
    const awardQuery = query(
      collection(firebaseDB, "bid_award", user_id, "data"),
      orderBy("created_at", "desc"),
      limit(4)
    );
    const { docs } = await getDocs(awardQuery);
    return docs.map((item) => item.data());
  } catch (error) {
    console.log(error);
    return [];
  }
};

// 마이페이지 나의 좋아요 물품 목록
export const mypageFavorite = async (user_id: string) => {
  try {
    const favoriteQuery = query(
      collection(firebaseDB, "favorite", user_id, "data"),
      orderBy("created_at", "desc"),
      limit(4)
    );
    const { docs } = await getDocs(favoriteQuery);
    return docs.map((item) => item.data());
  } catch (error) {
    console.log(error);
    return [];
  }
};

// 마이페이지 상세 게시글 무한스크롤
export const getMypageList = async (
  collectionPath: CollectionReference<DocumentData>,
  constraints: QueryConstraint[],
  page: number = 1,
  CONTENTS_COUNT: number,
  lastItem: null | DocumentData,
  isOpen: string // all | 1(open) | 0(close)
) => {
  let totalPage: number = 1;
  try {
    if (page === 1) {
      const countQuery = query(
        collectionPath,
        // where("user_id", "==", user_id),
        ...constraints,
        ...(isOpen === "1" || isOpen === "0"
          ? [where("is_open", "==", +isOpen)]
          : [])
      );
      const snapshot = await getCountFromServer(countQuery);
      totalPage = calTotalPage(snapshot.data().count, CONTENTS_COUNT);
    }

    const listQuery = query(
      collectionPath,
      // where("user_id", "==", user_id),
      ...constraints,
      ...(isOpen === "1" || isOpen === "0"
        ? [where("is_open", "==", +isOpen)]
        : []),
      orderBy("created_at", "desc"),
      ...(lastItem ? [startAfter(lastItem)] : []),
      limit(CONTENTS_COUNT)
    );

    const { docs, empty } = await getDocs(listQuery);
    if (empty) {
      return {
        docs: [],
        lastItem: null,
        page,
        totalPage,
        empty: true,
      };
    }
    return {
      docs: docs.map((item) => item.data()),
      lastItem: docs[docs.length - 1],
      page,
      totalPage,
      empty: false,
    };
  } catch (error) {
    console.log(error);
    return {
      docs: [],
      lastItem: null,
      page,
      totalPage,
      empty: true,
    };
  }
};

// 마이페이지 게시글 별 나의 입찰 기록
export const getMyDetailBid = async (post_id: string, user_id: string) => {
  if (!post_id) return { data: null, err: `No Post ID Exist.` };

  try {
    const detailBidHistoryQuery = query(
      collection(firebaseDB, "posts", post_id, "bid_history"),
      where("uuid", "==", user_id),
      orderBy("amount", "desc"),
      orderBy("created_at", "desc")
    );
    const { docs } = await getDocs(detailBidHistoryQuery);

    return { data: docs.map((doc) => doc.data()), err: null };
  } catch (error) {
    console.log(error);
    return { data: null, err: error };
  }
};
