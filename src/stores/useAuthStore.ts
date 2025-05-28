import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthStoreType } from "../types/user";

const useAuthStore = create(
  persist<AuthStoreType>(
    (set, get) => ({
      isLogin: false,
      userInfo: null,
      salesHistory: null,
      favorite: null,
      bidList: null,
      bidAward: null,

      loginStatus: (isLogin) => set({ isLogin }),
      login: (userInfo) => set({ isLogin: true, userInfo }),
      logout: () =>
        set({
          isLogin: false,
          userInfo: null,
          salesHistory: null,
          favorite: null,
          bidList: null,
          bidAward: null,
        }),
      // 유저 정보 업데이트
      updateUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),
      updateSalesHistory: (salesHistory) => set({ salesHistory }),
      updateUserFavorite: (favorite) => set({ favorite }),
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
      name: "online_auction",
    }
  )
);

export default useAuthStore;
