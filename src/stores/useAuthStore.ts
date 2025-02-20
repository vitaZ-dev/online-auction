import { create } from "zustand";
import { persist } from "zustand/middleware";

type ObjectType = {
  [key: string]: unknown;
};

type AuthStoreType = {
  isLogin: boolean;
  userInfo: ObjectType | null;
  token: string | null;
  favorite: Array<ObjectType> | [];
  bidHistory: Array<ObjectType> | [];
  bidList: Array<ObjectType> | [];
  bidAward: Array<ObjectType> | [];

  login: (userInfo: ObjectType) => void;
  logout: () => void;
  updateUserInfo: (newUserInfo: ObjectType) => void;
  updateUserFavorite: (favorite: Array<ObjectType>) => void;
  updateBidHistory: (bidHistory: Array<ObjectType>) => void;
  updateBidList: (bidList: Array<ObjectType>) => void;
  updateBidAward: (bidAward: Array<ObjectType>) => void;
};

const useAuthStore = create(
  persist<AuthStoreType>(
    (set, get) => ({
      isLogin: false,
      userInfo: null,
      token: null,
      favorite: [],
      bidHistory: [],
      bidList: [],
      bidAward: [],

      login: (userInfo) => set({ isLogin: true, userInfo }),
      logout: () =>
        set({
          isLogin: false,
          userInfo: null,
          favorite: [],
          bidHistory: [],
          bidList: [],
          bidAward: [],
        }),
      // 유저 정보 업데이트
      updateUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),
      updateUserFavorite: (favorite) => set({ favorite }),
      updateBidHistory: (bidHistory) => set({ bidHistory }),
      updateBidList: (bidList) => set({ bidList }),
      updateBidAward: (bidAward) => set({ bidAward }),

      checkSignIn: () => get().isLogin,
      // checkLogin: () => {
      //   const accessToken = getCookie("accessToken");
      //   const refreshToken = getCookie("refreshToken");
      //   if (accessToken && refreshToken) {
      //     set({ isLogin: true });
      //   } else {
      //     set({ user: null, isLogin: false });
      //   }
      // },
    }),
    {
      name: "online_auction", // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
