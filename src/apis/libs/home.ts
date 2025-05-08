import { getDocs, limit, orderBy, query } from "firebase/firestore";
import { POSTS_DB } from "../../constants/firebase";

export const getRecentList = async () => {
  try {
    const recentQuery = query(
      POSTS_DB,
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

export const getFavoriteList = async () => {
  try {
    const favoriteQuery = query(
      POSTS_DB,
      orderBy("favorite", "desc"),
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
