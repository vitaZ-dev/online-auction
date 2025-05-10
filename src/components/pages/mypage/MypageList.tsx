import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DocumentData } from "firebase/firestore";
import { useInView } from "react-intersection-observer";
import { getMypageList } from "../../../apis/libs";
import useAuthStore from "../../../stores/useAuthStore";
import { MYPAGE_META } from "../../../constants/mypage";
import { MypageLayout } from "../../../styles/MypageStyle";
import { CommonNodataBox } from "../../../styles/CommonStyle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DataLoading from "../../UI/DataLoading";
import CommonRadioBtn from "../../common/CommonRadioBtn";
import CommonTitle from "../../common/CommonTitle";
import CommonList from "../../common/CommonList";
import CommonListItem from "../../common/CommonListItem";
import { findCategory } from "../../../constants/category";

const CONTENTS_COUNT = 10;

interface MypageListProps {
  collectionPath: string;
  filterOpen?: boolean;
  setDetailId?: React.Dispatch<React.SetStateAction<string>> | null;
  handleDetailBid?: (id: string, title: string) => void;
}

export default function MypageList({
  collectionPath,
  filterOpen = true,
  setDetailId = null,
  handleDetailBid,
}: MypageListProps) {
  const navigate = useNavigate();

  const { userInfo } = useAuthStore();

  const [colPath, ...constraints] = MYPAGE_META[collectionPath].path(
    userInfo?.uuid || ""
  );

  const [isOpen, setIsOpen] = useState<string>("all"); // "all" | "1" | "0"
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<DocumentData[]>([]);
  const [lastItem, setLastItem] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [empty, isEmpty] = useState<boolean>(false);

  const fetchPost = async (page: number, isOpen: string) => {
    // if (!hasNextPage || !userInfo) return;
    if (!userInfo) return;

    setLoading(true);
    try {
      const result = await getMypageList(
        colPath,
        constraints,
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

  const goDetailPage = (id: string, title: string) => {
    if (setDetailId) {
      setDetailId(id);
      handleDetailBid?.(id, title);
    } else navigate(`/auction/${id}`);
  };

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
          title={MYPAGE_META[collectionPath].title(
            userInfo?.nickname || "USER"
          )}
        />
      </div>

      {filterOpen && (
        <div className="sell_list_filter">
          <CommonRadioBtn
            text="all"
            id="all"
            name="open_filter"
            value="all"
            onChange={(e) => searchIsOpen(e.target.value)}
            checked={isOpen === "all"}
            disabled={loading}
          />
          <CommonRadioBtn
            text="open"
            id="open"
            name="open_filter"
            value="1"
            onChange={(e) => searchIsOpen(e.target.value)}
            checked={isOpen === "1"}
            disabled={loading}
          />
          <CommonRadioBtn
            text="close"
            id="close"
            name="open_filter"
            value="0"
            onChange={(e) => searchIsOpen(e.target.value)}
            checked={isOpen === "0"}
            disabled={loading}
          />
        </div>
      )}

      <section>
        <CommonList loading={pageLoading}>
          {posts?.map((post, idx) => (
            <div
              onClick={() =>
                goDetailPage(post?.id ?? post?.item_id, post?.title)
              }
              key={`${collectionPath}` + idx}
            >
              <CommonListItem
                src={post?.src}
                category={findCategory(post?.category_id)}
                title={post?.title}
                startPrice={post?.start_price}
                isOpen={Boolean(post.is_open) || !filterOpen}
              />
            </div>
          ))}
        </CommonList>

        <div ref={ref}>{hasNextPage ? <DataLoading /> : <></>}</div>
      </section>
      {empty && <CommonNodataBox>게시글이 없습니다.</CommonNodataBox>}
    </MypageLayout>
  );
}
