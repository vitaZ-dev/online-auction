import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  startAfter,
  where,
} from "firebase/firestore";
import firebaseDB from "../../libs/firebase";
import { POSTS_DB } from "../../constants/firebase";
import { setDateTemp } from "../../utils";
import { calTotalPage } from "../../utils";

// 게시글 리스트 무한스크롤 호출
export const getPostList = async (
  page: number = 1,
  CONTENTS_COUNT: number,
  totalPage: number,
  setTotalPage: any,
  lastItem: null | DocumentData,
  // 필터값
  isOpen: boolean,
  categoryId: number,
  sortBy: string // 1_최신순 2_좋아요
) => {
  let totalPages: number = totalPage;
  const filter = {
    is_open: isOpen,
    category_id: categoryId,
    sort: sortBy,
  };

  try {
    // 데이터 불러온 최초 1회만 실행하면 됨
    // const meta = queryClient.getQueryData<{ totalPages: number }>(["fb-meta"]);
    // if (meta) {
    //   totalPages = meta?.totalPages ?? 1;
    // } else {
    //   const countQuery = query(
    //     POSTS_DB,
    //     ...(isOpen ? [where("is_open", "==", 1)] : []),
    //     ...(categoryId !== 0 ? [where("category_id", "==", categoryId)] : [])
    //   );
    //   const snapshot = await getCountFromServer(countQuery);
    //   setTotalPage(calTotalPage(snapshot.data().count, CONTENTS_COUNT));
    //   totalPages = calTotalPage(snapshot.data().count, CONTENTS_COUNT);
    // }
    if (page === 1) {
      const countQuery = query(
        POSTS_DB,
        ...(isOpen ? [where("is_open", "==", 1)] : []),
        ...(categoryId !== 0 ? [where("category_id", "==", categoryId)] : [])
      );
      const snapshot = await getCountFromServer(countQuery);
      setTotalPage(calTotalPage(snapshot.data().count, CONTENTS_COUNT));
      totalPages = calTotalPage(snapshot.data().count, CONTENTS_COUNT);
    }
    // else {
    //   // 1페이지가 아닌 경우 저장된 totalPages를 가져옴
    //   const meta = queryClient.getQueryData<{ totalPages: number }>([
    //     "fb-meta",
    //   ]);
    //   totalPages = meta?.totalPages ?? 1;
    // }

    const listQuery = query(
      POSTS_DB,
      ...(isOpen ? [where("is_open", "==", 1)] : []),
      ...(categoryId !== 0 ? [where("category_id", "==", categoryId)] : []),
      ...(sortBy === "2" ? [orderBy("favorite", "desc")] : []),
      orderBy("created_at", "desc"),
      ...(lastItem ? [startAfter(lastItem)] : []),
      limit(CONTENTS_COUNT)
    );

    const { docs, empty } = await getDocs(listQuery);
    if (empty) {
      return {
        docs: [],
        lastItem: null,
        page,
        totalPages,
        empty: true,
        filter: null,
      };
    }
    return {
      docs: docs.map((item) => item.data()),
      lastItem: docs[docs.length - 1],
      page,
      totalPages,
      empty: false,
      filter,
    };
  } catch (error) {
    console.log(error);
    return {
      docs: [],
      lastItem: null,
      page,
      totalPages,
      empty: true,
      filter: null,
    };
  }
};

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
      // 해당 게시글 없을 때
      if (!detailDoc.exists()) {
        return { data: null, err: `Document doesn't exist.` };
      }

      const newPop = detailDoc.data().cnt + +cnt_update;
      if (cnt_update && newPop <= 1000000) {
        transaction.update(detailRef, { cnt: newPop });
      }

      return { data: detailDoc.data(), err: null };
    });

    return detailRes;
  } catch (error) {
    console.error(error);
    return { data: null, err: error };
  }
};

// 게시글 상세 입찰내역 확인
export const getDetailBidHistory = async (
  post_id: string,
  limits: number = 10
) => {
  try {
    const detailBidHistoryQuery = query(
      collection(firebaseDB, "posts", post_id, "bid_history"),
      orderBy("amount", "desc"),
      orderBy("created_at", "desc"),
      limit(limits)
    );
    const querySnapshot = await getDocs(detailBidHistoryQuery);
    const data: DocumentData[] = [];
    querySnapshot.forEach((doc) => data.push(doc.data()));
    return { data, err: null };
  } catch (error) {
    console.log(error);
    return { data: null, err: error };
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

// 게시글 작성자의 다른 게시글 무한스크롤
export const getOtherList = async (
  author_id: string,
  page: number = 1,
  CONTENTS_COUNT: number,
  lastItem: null | DocumentData,
  isOpen: string // all | 1(open) | 0(close)
) => {
  let totalPage: number = 1;
  try {
    if (page === 1) {
      const countQuery = query(
        POSTS_DB,
        ...(isOpen === "1" || isOpen === "0"
          ? [where("is_open", "==", +isOpen)]
          : []),
        where("user_id", "==", author_id)
      );
      const snapshot = await getCountFromServer(countQuery);
      totalPage = calTotalPage(snapshot.data().count, CONTENTS_COUNT);
    }

    const listQuery = query(
      POSTS_DB,
      ...(isOpen === "1" || isOpen === "0"
        ? [where("is_open", "==", +isOpen)]
        : []),
      where("user_id", "==", author_id),
      orderBy("created_at", "desc"),
      ...(lastItem ? [startAfter(lastItem)] : []),
      limit(CONTENTS_COUNT)
    );

    const { docs, empty } = await getDocs(listQuery);
    if (empty) {
      return {
        docs: [],
        lastItem: null,
        page,
        totalPage,
        empty: true,
      };
    }
    return {
      docs: docs.map((item) => item.data()),
      lastItem: docs[docs.length - 1],
      page,
      totalPage,
      empty: false,
    };
  } catch (error) {
    console.log(error);
    return {
      docs: [],
      lastItem: null,
      page,
      totalPage,
      empty: true,
    };
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
    const favoriteRef = doc(firebaseDB, "favorite", uuid, "data", post_id);

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
        transaction.delete(favoriteRef);
      } else {
        // 좋아요 클릭
        transaction.update(detailRef, {
          favorite: newPop,
          favorite_list: arrayUnion(uuid),
        });
        transaction.set(
          favoriteRef,
          {
            ...add_item,
            created_at: setDateTemp(),
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

interface HistoryPropsType {
  item_id: string;
  uuid: string;
  bidder: string;
  amount: number;
  time: string;
}
interface BidPropsType {
  item_id: string;
  title: string;
  category_id: number;
  src: string;
  start_price: number;
}
// 게시글 입찰 등록
export const auctionBidding = async (
  post_id: string,
  history_item: HistoryPropsType,
  bid_item: BidPropsType,
  update_price: number,
  uuid: string
) => {
  try {
    const detailRes = await runTransaction(firebaseDB, async (transaction) => {
      // ref
      const detailRef = doc(firebaseDB, "posts", post_id);
      const detailBidHistoryRef = doc(
        collection(firebaseDB, "posts", post_id, "bid_history")
      );
      const bidListRef = doc(firebaseDB, "bid_list", uuid, "data", post_id);

      const detailDoc = await transaction.get(detailRef);
      if (!detailDoc.exists()) {
        return { data: null, err: `Document doesn't exist.` };
      }

      if (!detailDoc.data().is_open) {
        return { res: false, err: `Auction is closed.` };
      }

      const newPop = detailDoc.data().bid_count + 1;

      transaction.update(detailRef, {
        bid_count: newPop,
        now_price: update_price,
      });
      transaction.set(
        detailBidHistoryRef,
        {
          ...history_item,
          created_at: setDateTemp(),
        },
        { merge: true }
      );
      transaction.set(bidListRef, {
        ...bid_item,
        created_at: setDateTemp(),
      });

      return { res: true, err: null };
    });

    return detailRes;
  } catch (error) {
    console.error(error);
    return { res: false, err: error };
  }
};

// 게시글 입찰 마감 처리
export const closeAuction = async (post_id: string, award_check: boolean) => {
  // 총 입찰이 0이면 입찰자 없이 마감
  // 총 입찰이 1이상 이면 입찰자 설정
  try {
    // 낙찰자 정보 불러옴
    const { data: bid_info, err } = await getDetailBidHistory(post_id, 1);

    if (err) {
      return { res: false, err };
    }

    const closeRes = await runTransaction(firebaseDB, async (transaction) => {
      // ref
      const detailRef = doc(firebaseDB, "posts", post_id);
      const bidAwardRef = doc(
        firebaseDB,
        "bid_award",
        bid_info![0].uuid!,
        "data",
        post_id
      );

      const detailDoc = await transaction.get(detailRef);
      if (!detailDoc.exists()) {
        return { res: false, err: `Document doesn't exist.` };
      }

      const nowTime = setDateTemp();

      transaction.update(detailRef, {
        is_open: 0,
        end_date: nowTime,
        last_bidder: bid_info?.[0] ?? null,
      });
      // 입찰자가 있을 때만 낙찰내역 collection에 추가
      if (award_check) {
        transaction.set(
          bidAwardRef,
          {
            // amount /  bidder / created_at / item_id / time / uuid
            ...bid_info?.[0],
            user_id: bid_info?.[0].uuid,
            title: detailDoc.data().title,
            category_id: detailDoc.data().category_id,
            src: detailDoc.data().src,
            created_at: nowTime,
          },
          { merge: true }
        );
      }

      return { res: true, err: null };
    });

    return closeRes;
  } catch (error) {
    console.error(error);
    return { res: false, err: error };
  }
};
