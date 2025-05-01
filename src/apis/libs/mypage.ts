import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { POSTS_DB } from "../../modules/firebase";
import firebaseDB from "../../libs/firebase";

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
