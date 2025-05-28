/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calTotalPage } from "../../utils";
import CommonTitle from "../../components/common/CommonTitle";
import CommonList from "../../components/common/CommonList";
import { useInfiniteTest } from "../../dev-only/hooks/useInfiniteTest";
import DataLoading from "../../components/UI/DataLoading";
import { useInView } from "react-intersection-observer";
import { POSTS_DB } from "../../constants/firebase";
import {
  DocumentData,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query as q,
  startAfter,
} from "firebase/firestore";
import CommonListItem from "../../components/common/CommonListItem";
import { findCategory } from "../../constants/category";
import { CommonNodataBox } from "../../styles/CommonStyle";
import { AuctionListLayout } from "../../styles/AuctionStyle";
import { getPostList } from "../../apis/libs";
import useInfiniteScroll from "../../dev-only/hooks/useInfiniteScroll";

export default function Infinite() {
  const CONTENTS_COUNT = 4;
  const [db, setDB] = useState<any[]>([]);
  const [isData, setIsData] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [totalPage2, setTotalPage2] = useState<number>(1);
  const [lastItem, setLastItem] = useState<any[] | null>(null);

  // const all = useInfiniteTest(getJsonServerData);
  const firebaseGet = async (page: number = 1, lastItem: any) => {
    let totalPages: number = totalPage;

    // 데이터 불러온 최초 1회만 실행하면 됨
    if (page === 1) {
      const snapshot = await getCountFromServer(POSTS_DB);
      totalPages = calTotalPage(snapshot.data().count, CONTENTS_COUNT);
      setTotalPage(calTotalPage(snapshot.data().count, CONTENTS_COUNT));
    }

    let fire = q(
      POSTS_DB,
      orderBy("created_at", "desc"),
      limit(CONTENTS_COUNT)
    );
    if (lastItem) {
      fire = q(
        POSTS_DB,
        orderBy("created_at", "desc"),
        startAfter(lastItem),
        limit(CONTENTS_COUNT)
      );
      // query 즉, 파이어스토어 저장된 날짜순으로 정렬된 데이터 중에
      // start로 정의된 데이터를 시작으로 마지막 까지의 데이터들을 query에 저장한다.
    }

    const { docs, empty } = await getDocs(fire);
    if (empty) {
      setIsData(false);
      return { docs: [], lastItem: null, page: 1, totalPages: 1 };
    }
    lastItem = docs[docs.length - 1];
    setLastItem(docs[docs.length - 1]);

    // docs.forEach((item) => console.log(item.data()));
    const doc: DocumentData[] = [];
    docs.forEach((item) => doc.push(item.data()));
    // console.log({ docs: doc, lastItem: lastItem.data(), page, totalPages });

    return { docs: doc, lastItem: lastItem.data(), page, totalPages };
  };

  const {
    data,
    isLoading,
    isFetching,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteTest(firebaseGet, lastItem);

  const firebaseWait = async (page: number = 1) => {
    const result = await getPostList(
      page,
      CONTENTS_COUNT,
      totalPage2,
      setTotalPage2,
      lastItem
    );
    return result;
  };
  const scroll = useInfiniteScroll(["fb-test"], firebaseWait);
  const goNextPage2 = async () => {
    await scroll.fetchNextPage();
    setPage(page + 1);
  };
  useEffect(() => {
    console.log("rq2", "data2=", scroll);
    /*
    data: data2,
    isLoading: isLoading2,
    isFetching: isFetching2,
    error: error2,
    fetchNextPage: fetchNextPage2,
    hasNextPage: hasNextPage2,
    isFetchingNextPage: isFetchingNextPage2,
    */
  }, [scroll]);

  const goNextPage = async () => {
    await fetchNextPage();
    setPage(page + 1);
    // if (hasNextPage && !isFetchingNextPage) {
    //   console.log("ik");
    // }
    // console.log(
    //   "data",
    //   data,
    //   `
    //   "status=" ${status}
    //   "isLoading=" ${isLoading}
    //   "isFetching=" ${isFetching}
    //   "hasNextPage=" ${hasNextPage}
    //   "isFetching=" ${!isFetching}
    //   "!isFetchingNextPage=" ${!isFetchingNextPage}`
    // );
  };

  useEffect(() => {
    console.log(
      "rq",
      "isLoading=",
      isLoading,
      "isFetchingNextPage=",
      isFetchingNextPage,
      "isFetching=",
      isFetching
    );
  }, [isLoading, isFetchingNextPage, isFetching]);

  useEffect(() => {
    console.log("rq", "data=", data?.pages);
    const allDocs = data?.pages?.flatMap((page) => page.docs) || [];
    console.log("allDocs", allDocs);
    if (data?.pages) {
      setDB((prev) => [...prev, ...(data?.pages?.at(-1)?.docs || [])]);
    }
  }, [data?.pages]);

  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0.5,
  });
  // useEffect(() => {
  //   console.log("inView", inView);
  //   if (inView && hasNextPage && !isFetching) {
  //     console.log("load data");
  //     goNextPage();
  //   }
  // }, [inView]);

  // tsx
  // if (error) {
  //   return (
  //     <AuctionListLayout>
  //       <CommonNodataBox>데이터 로딩 중 에러가 발생했습니다</CommonNodataBox>
  //     </AuctionListLayout>
  //   );
  // }
  return (
    <AuctionListLayout>
      <CommonTitle type={1} title="Infinite" />
      <button onClick={() => goNextPage2()}>goNextPage2</button>
      {isData ? (
        <>
          <CommonList loading={isLoading}>
            {db?.map((r, idx) => (
              <Link to={`/auction/${r?.id}`} key={idx}>
                <CommonListItem
                  src={r?.src}
                  category={findCategory(r?.category_id)}
                  title={r?.title}
                  startPrice={r?.start_price}
                  isOpen={Boolean(r.is_open)}
                />
              </Link>
            ))}
          </CommonList>

          {(hasNextPage || isFetchingNextPage || isFetching) && (
            <div ref={ref}>
              <DataLoading />
            </div>
          )}
        </>
      ) : (
        <CommonNodataBox>데이터가 없습니다</CommonNodataBox>
      )}
    </AuctionListLayout>
  );
}
