import { getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { POSTS_DB } from "../../modules/firebase";

// 마이페이지 최근 판매 물품 목록록
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
