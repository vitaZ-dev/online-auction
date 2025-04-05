import {
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import firebaseDB from "../../../firebase";
import { POSTS_DB } from "../../modules/firebase";

export const getDetailPost = async (post_id: string, cnt_update: boolean) => {
  const detailRef = doc(firebaseDB, "posts", post_id);
  // try {
  //   const detailRef = doc(firebaseDB, "posts", post_id);
  //   const detailSnap = await getDoc(detailRef);
  //   return detailSnap.data();
  // } catch (error) {
  //   console.log(error);
  //   return [];
  // }

  try {
    const detailRes = await runTransaction(firebaseDB, async (transaction) => {
      const detailDoc = await transaction.get(detailRef);
      // 해당 게시글 없을 때 추가 표시 필?
      if (!detailDoc.exists()) {
        // throw "Document does not exist!";
        return {};
      }

      const newPop = detailDoc.data().cnt + +cnt_update;
      if (cnt_update && newPop <= 1000000) {
        transaction.update(detailRef, { cnt: newPop });
      }

      return detailDoc.data();
    });

    return detailRes;
  } catch (error) {
    // This will be a "population is too big" error.
    console.error(error);
    return {};
  }
};

export const getOtherPosts = async (author_id: string) => {
  try {
    const otherQuery = query(
      POSTS_DB,
      where("user_id", "==", author_id),
      orderBy("created_at", "desc"),
      limit(4)
    );
    const { docs } = await getDocs(otherQuery);
    return docs.map((item) => item.data());
  } catch (error) {
    console.log(error);
    return [];
  }
};
