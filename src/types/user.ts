import { postType } from "./post";

export type UserInfoType = {
  id: string;
  uuid: string;
  token?: string;
  email: string;
  password: string;
  nickname: string;
  role: string;
};

export type FavoriteType = {
  id: string;
  item_id: string;
  user_id: string;
  uuid: string;
  title: string;
  src: string;
  category_id: number;
  start_price: number;
};

export type BidListHistoryType = {
  item_id: string;
  user_id: string;
  uuid: string;
  amount: number;
  bidder: string;
  time: string;
};
export type BidListType = {
  id: string;
  item_id: string;
  user_id: string;
  uuid: string;
  bidder: string;
  amount: number;
  time: string;
  title: string;
  src: string;
  category_id: number;
  start_price: number;
  history: Array<BidListHistoryType> | [];
};

export type BidAwardType = {
  id: string;
  item_id: string;
  user_id: string;
  uuid: string;
  award_date: string;
  time: string;
  amount: number;
  title: string;
  category_id: number;
  src: string;
};

export type AuthStoreType = {
  isLogin: boolean;
  userInfo: UserInfoType | null;
  token: string | null;
  salesHistory: Array<postType> | null;
  favorite: Array<FavoriteType> | null;
  bidList: Array<BidListType> | null;
  bidAward: Array<BidAwardType> | null;

  login: (userInfo: UserInfoType) => void;
  logout: () => void;
  updateUserInfo: (newUserInfo: UserInfoType) => void;
  updateSalesHistory: (salesHistory: Array<postType> | null) => void;
  updateUserFavorite: (favorite: Array<FavoriteType>) => void;
  updateBidList: (bidList: Array<BidListType> | null) => void;
  updateBidAward: (bidAward: Array<BidAwardType> | null) => void;
};
