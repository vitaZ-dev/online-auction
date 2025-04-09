import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
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

// 게시글 상세 내용 호출
export const getDetailPost = async (post_id: string, cnt_update: boolean) => {
  // try {
  //   const detailRef = doc(firebaseDB, "posts", post_id);
  //   const detailSnap = await getDoc(detailRef);
  //   return detailSnap.data();
  // } catch (error) {
  //   console.log(error);
  //   return [];
  // }

  try {
    const detailRef = doc(firebaseDB, "posts", post_id);

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

// 게시글 작성자의 다른 게시글 호출
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

interface addItemPropsType {
  id: string;
  item_id: string;
  user_id: string;
  uuid: string;
  title: string;
  src: string;
  category_id: number;
  start_price: number;
}
// 게시글 좋아요 이벤트
export const updateFavorite = async (
  post_id: string,
  uuid: string,
  is_favorite: boolean,
  add_item: addItemPropsType
) => {
  try {
    const detailRef = doc(firebaseDB, "posts", post_id);
    const favoriteRef = doc(firebaseDB, "favorite", uuid);

    const res = await runTransaction(firebaseDB, async (transaction) => {
      const detailDoc = await transaction.get(detailRef);
      if (!detailDoc.exists()) {
        return { success: false, res: [] };
      }
      const newPop = detailDoc.data().favorite + (is_favorite ? -1 : 1);

      if (is_favorite) {
        // 좋아요 해제
        transaction.update(detailRef, {
          favorite: newPop,
          favorite_list: arrayRemove(uuid),
        });
        transaction.set(
          favoriteRef,
          {
            data: arrayRemove(add_item),
          },
          { merge: true }
        );
      } else {
        // 좋아요 클릭
        transaction.update(detailRef, {
          favorite: newPop,
          favorite_list: arrayUnion(uuid),
        });
        transaction.set(
          favoriteRef,
          {
            data: arrayUnion(add_item),
          },
          { merge: true }
        );
      }
      return { success: true, res: [!is_favorite, newPop] };
    });

    return res;
  } catch (error) {
    console.error(error);
    return { success: false, res: [] };
  }
};

// 게시글 삭제
export const deletePost = async (post_id: string) => {
  try {
    await deleteDoc(doc(firebaseDB, "posts", post_id));
  } catch (error) {
    return error;
  }
};
