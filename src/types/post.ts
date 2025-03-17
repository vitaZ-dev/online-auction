export type postBidHistory = {
  id: string;
  amount: number;
  bidder: string;
  time: string;
  user_id: string;
  uuid: string;
};
type postFavoriteList = {
  id: string;
  uuid: string;
};

export type postType = {
  id?: string;
  title: string;
  category_id: number;
  user_info: string;
  user_id: string;
  start_date: string;
  end_date: string;
  price: number;
  start_price: number;
  now_price: number;
  is_open: 0 | 1;
  src: string;
  contents: string;
  created_at: string;
  favorite: number;
  favorite_list: Array<postFavoriteList> | [];
  bid: number;
  cnt: number;
  bid_count: number;
  bid_history: Array<postBidHistory> | [];
  last_bidder?: {
    id: string;
    amount: number;
    bidder: string;
    time: string;
    user_id: string;
    uuid: string;
  };
};
