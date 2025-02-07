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

  login: (userInfo: ObjectType) => void;
  logout: () => void;
  updateUserInfo: (newUserInfo: ObjectType) => void;
  updateUserFavorite: (favorite: Array<ObjectType>) => void;
};

const useAuthStore = create(
  persist<AuthStoreType>(
    (set, get) => ({
      isLogin: false,
      userInfo: null,
      token: null,
      favorite: [],

      login: (userInfo) => set({ isLogin: true, userInfo }),
      logout: () => set({ isLogin: false, userInfo: null, favorite: [] }),
      // 유저 정보 업데이트
      updateUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),
      updateUserFavorite: (favorite) => set({ favorite }),
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
