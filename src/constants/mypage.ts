import { collection, where } from "firebase/firestore";
import firebaseDB from "../libs/firebase";

export const MYPAGE_META = {
  posts: {
    title: (nickname: string) => `${nickname}님의 최근 판매 물품 목록`,
    path: (user_id: string) => [
      collection(firebaseDB, "posts"),
      where("user_id", "==", user_id),
    ],
  },
  bid_list: {
    title: (nickname: string) => `${nickname}님의 입찰 내역`,
    path: (user_id: string) => [
      collection(firebaseDB, "bid_list", user_id, "data"),
    ],
  },
  bid_award: {
    title: (nickname: string) => `${nickname}님의 낙찰 내역`,
    path: (user_id: string) => [
      collection(firebaseDB, "bid_award", user_id, "data"),
    ],
  },
  favorite: {
    title: (nickname: string) => `${nickname}님의 좋아요 목록`,
    path: (user_id: string) => [
      collection(firebaseDB, "favorite", user_id, "data"),
    ],
  },
};
