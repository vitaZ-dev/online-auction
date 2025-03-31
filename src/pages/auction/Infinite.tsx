/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { calTotalPage } from "../../utils";
import CommonTitle from "../../components/UI/CommonTitle";
import CommonList from "../../components/UI/CommonList";
import { useInfiniteTest } from "../../hooks/useInfiniteTest";
import DataLoading from "../../components/DataLoading";
import { useInView } from "react-intersection-observer";
import { POSTS_DB } from "../../modules/firebase";
import {
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query as q,
  startAfter,
} from "firebase/firestore";
import CommonListItem from "../../components/UI/CommonListItem";
import { findCategory } from "../../modules/category";
import { CommonNodataBox } from "../../styles/CommonStyle";
import { AuctionListLayout } from "../../styles/AuctionStyle";

export default function Infinite() {
  const PER_PAGE = 4;
  const [db, setDB] = useState<any[]>([]);
  const [isData, setIsData] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [lastItem, setLastItem] = useState<any[] | null>(null);

  // const all = useInfiniteTest(getJsonServerData);
  const firebaseGet = async (page: number = 1, lastItem) => {
    let totalPages: number = totalPage;

    // 데이터 불러온 최초 1회만 실행하면 됨
    if (page === 1) {
      const snapshot = await getCountFromServer(POSTS_DB);
      totalPages = calTotalPage(snapshot.data().count, PER_PAGE);
      setTotalPage(calTotalPage(snapshot.data().count, PER_PAGE));
    }

    let fire = q(POSTS_DB, orderBy("created_at", "desc"), limit(PER_PAGE));
    if (lastItem) {
      fire = q(
        POSTS_DB,
        orderBy("created_at", "desc"),
        startAfter(lastItem),
        limit(PER_PAGE)
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
    const doc = [];
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

  // useEffect(() => {
  //   console.log(
  //     "rq",
  //     "data=",
  //     data?.pages[0],
  //     "isLoading=",
  //     isLoading,
  //     "isFetchingNextPage=",
  //     isFetchingNextPage,
  //     "isFetching=",
  //     isFetching
  //   );
  // }, [isLoading, isFetchingNextPage, isFetching]);
  // useEffect(() => {
  //   console.log(
  //     "rq",
  //     "data=",
  //     data?.pages[0],
  //     "isLoading=",
  //     isLoading,
  //     "isFetchingNextPage=",
  //     isFetchingNextPage,
  //     "isFetching=",
  //     isFetching
  //   );
  //   const allDocs = data?.pages?.flatMap((page) => page.docs) || [];
  //   console.log("allDocs", allDocs);
  // }, [isLoading, isFetchingNextPage, isFetching]);
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
    threshold: 0,
  });
  useEffect(() => {
    console.log("inView", inView);
    if (inView && hasNextPage && !isFetching) {
      console.log("load data");
      goNextPage();
    }
  }, [inView]);

  // useEffect(() => {
  //   // getJsonServerData(page);
  //   console.log("all", all);
  // }, [page]);
  // useEffect(() => {
  //   if (all.isLoading) {
  //     console.log("Loading...");
  //   } else if (all.isError) {
  //     console.log("Error:", all.error);
  //   } else {
  //     console.log("all", all);
  //   }
  // }, [all]);

  return (
    <AuctionListLayout>
      <CommonTitle type={1} title="Infinite" />
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
