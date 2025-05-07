import {
  collection,
  DocumentData,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import firebaseDB from "../../../libs/firebase";
import { useCallback, useEffect, useState } from "react";
import { MypageLayout } from "../../../styles/MypageStyle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CommonTitle from "../../UI/CommonTitle";
import CommonRadioBtn from "../../common/CommonRadioBtn";
import CommonList from "../../UI/CommonList";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CommonListItem from "../../UI/CommonListItem";
import { findCategory } from "../../../modules/category";
import DataLoading from "../../DataLoading";
import { CommonNodataBox } from "../../../styles/CommonStyle";
import { useInView } from "react-intersection-observer";
import { getMypageList, getOtherList } from "../../../apis/libs";
import useAuthStore from "../../../stores/useAuthStore";

const CONTENTS_COUNT = 10;

export default function MypageList() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [pageType, setPageType] = useState<string>("");

  useEffect(() => {
    const title = pathname.split("/").at(-1);
    setPageType(title || "");
  }, [pathname]);

  const { userInfo } = useAuthStore();

  const [isOpen, setIsOpen] = useState<string>("all"); // "all" | "1" | "0"
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [lastItem, setLastItem] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [empty, isEmpty] = useState<boolean>(false);

  /*
  const base = query(
    collection(firebaseDB, "posts"),
    where("authorId", "==", "CURRENT_USER_ID"), // 실제 uid로 대체
    orderBy("created_at", "desc"),
    ...(lastItem ? [startAfter(lastItem)] : []),
    limit(CONTENTS_COUNT)
  );
  */

  const fetchPost = async (page: number, isOpen: string) => {
    // if (!hasNextPage || !userInfo) return;
    if (!userInfo) return;

    setLoading(true);
    try {
      const result = await getMypageList(
        userInfo.uuid!,
        page,
        CONTENTS_COUNT,
        lastItem,
        isOpen
      );

      isEmpty(result.empty);
      setLastItem(result.lastItem);
      setPosts((prev) => [...prev, ...result.docs]);
      setHasNextPage(result.page < result.totalPage);

      if (page === 1) setPageLoading(false);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchPost(1, isOpen);
    };

    fetch();
  }, [isOpen]);

  const goPrevPage = () => {
    navigate("/mypage");
  };

  const searchIsOpen = async (value: string) => {
    setIsOpen(value);
    setPage(1);
    setLastItem(null);
    setPosts([]);
    setPageLoading(true);
  };

  const { ref, inView } = useInView({
    threshold: 0.8,
  });
  useEffect(() => {
    if (inView && hasNextPage && !loading) {
      setPage((p) => p + 1);
      fetchPost(page + 1, isOpen);
    }
  }, [inView]);

  return (
    <MypageLayout>
      <div className="mypage_title">
        <ArrowBackIosNewIcon
          className="back_icon"
          onClick={() => goPrevPage()}
        />
        <CommonTitle
          type={1}
          title={`${userInfo?.nickname || "USER"} 님의 판매 물품 목록`}
        />
      </div>

      <div className="sell_list_filter">
        <CommonRadioBtn
          text="all"
          id="all"
          name="open_filter"
          value="all"
          onChange={(e) => searchIsOpen(e.target.value)}
          checked={isOpen === "all"}
        />
        <CommonRadioBtn
          text="open"
          id="open"
          name="open_filter"
          value="1"
          onChange={(e) => searchIsOpen(e.target.value)}
          checked={isOpen === "1"}
        />
        <CommonRadioBtn
          text="close"
          id="close"
          name="open_filter"
          value="0"
          onChange={(e) => searchIsOpen(e.target.value)}
          checked={isOpen === "0"}
        />
      </div>

      <section>
        <CommonList loading={pageLoading}>
          {posts?.map((post, idx) => (
            <Link to={`/auction/${post?.id}`} key={idx}>
              <CommonListItem
                src={post?.src}
                category={findCategory(post?.category_id)}
                title={post?.title}
                startPrice={post?.start_price}
                isOpen={Boolean(post.is_open)}
              />
            </Link>
          ))}
        </CommonList>

        <div ref={ref}>{hasNextPage ? <DataLoading /> : <></>}</div>
      </section>
      {empty && <CommonNodataBox>판매한 물품이 없습니다</CommonNodataBox>}
    </MypageLayout>
  );
}
