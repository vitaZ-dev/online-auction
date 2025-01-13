import { create } from "zustand";
import { persist } from "zustand/middleware";

type ObjectType = {
  [key: string]: unknown;
};

type AuthStoreType = {
  loginCheck: boolean;
  userInfo: ObjectType | null;
  token: string | null;

  login: (userInfo: ObjectType) => void;
  logout: () => void;
  updateUserInfo: (newUserInfo: ObjectType) => void;
};

const useAuthStore = create(
  persist<AuthStoreType>(
    (set, get) => ({
      loginCheck: false,
      userInfo: null,
      token: null,

      login: (userInfo) => set({ loginCheck: true, userInfo }),
      logout: () => set({ loginCheck: false, userInfo: null }),
      // 유저 정보 업데이트
      updateUserInfo: (newUserInfo) => set({ userInfo: newUserInfo }),
      checkSignIn: () => get().loginCheck,
    }),
    {
      name: "online_auction", // name of the item in the storage (must be unique)
    }
  )
);

export default useAuthStore;
