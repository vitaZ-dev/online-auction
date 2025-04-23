import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getPostList } from "../../apis/libs";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { CATEGORY, findCategory } from "../../modules/category";
import { AuctionListLayout } from "../../styles/AuctionStyle";
import { CommonNodataBox } from "../../styles/CommonStyle";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CommonTitle from "../../components/UI/CommonTitle";
import CommonButton from "../../components/common/CommonButton";
import CommonCheckbox from "../../components/common/CommonCheckbox";
import CommonRadioBtn from "../../components/common/CommonRadioBtn";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import DataLoading from "../../components/DataLoading";
import { DocumentData } from "firebase/firestore";
import { useInView } from "react-intersection-observer";
import queryClient from "../../libs/queryClient";

export default function ListTest() {
  // const { pathname } = useLocation();

  const CONTENTS_COUNT = 4;
  // 필터
  const [filterShow, setFilterShow] = useState<boolean>(false);
  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const [filterSort, setFilterSort] = useState<string>("1");

  const filterSearchPosts = async () => {
    setLastItem(null);
    setPage(1);
    queryClient.removeQueries(["fb-test"]);

    // queryClient.refetchQueries();
  };

  const clearAllFilter = async () => {
    setFilterIsOpen(false);
    setFilterCategory(0);
    setFilterSort("1");
    window.scrollTo(0, 0);
  };

  // 메인 무한스크롤 리스트
  // const [list, setList] = useState<DocumentData[]>([]); // 무한스크롤 리스트
  const [lastItem, setLastItem] = useState<DocumentData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  const firebaseWait = async (page: number = 1) => {
    const result = await getPostList(
      page,
      CONTENTS_COUNT,
      totalPage,
      setTotalPage,
      lastItem,
      // 필터값
      filterIsOpen, // 거래 가능만 보기
      filterCategory, // 카테고리 id
      filterSort // 정렬기준_최신(1), 좋아요(2)
    );
    return result;
  };

  const scroll = useInfiniteScroll(["fb-test"], firebaseWait);

  useEffect(() => {
    if (scroll.data?.pages && scroll.data?.pages[0]?.filter) {
      const filter = scroll.data?.pages[0]?.filter;
      setFilterCategory(filter.category_id);
      setFilterIsOpen(filter.is_open);
      setFilterSort(filter.sort);
    }
  }, []);

  const goNextPage = async () => {
    await scroll.fetchNextPage();
  };

  useEffect(() => {
    if (!scroll.data) return;

    const latestPage = scroll.data.pages.at(-1);

    if (!latestPage?.docs) return;
    setPage(page + 1);
    setTotalPage(latestPage?.totalPages);
    setLastItem(latestPage?.lastItem);

    // setList((prev) => [...prev, ...latestPage.docs]);
    // // 새로 페이지를 시작할 때 리스트 초기화
    // if (page === 1) {
    //   setList(latestPage.docs); // 첫 페이지는 초기화
    // } else {
    //   setList((prev) => [...prev, ...latestPage.docs]); // 그 외 페이지는 추가
    // }
  }, [scroll.data]);

  const list = useMemo(() => {
    return scroll.data?.pages.flatMap((page) => page.docs) ?? [];
  }, [scroll.data]);

  const { ref, inView } = useInView({
    threshold: 0.8,
  });
  useEffect(() => {
    if (inView && scroll.hasNextPage && !scroll.isFetching) {
      goNextPage();
    }
  }, [inView]);

  // tsx
  return (
    <AuctionListLayout>
      <CommonTitle type={1} title="경매 물품" />
      <div className="filter_box">
        <CommonButton
          btnType="medium"
          onClick={() => setFilterShow(!filterShow)}
        >
          <TuneIcon />
          <span>필터</span>
          {filterShow ? <ExpandMore /> : <ExpandLess />}
        </CommonButton>
        {filterShow && (
          <div className="filter_area">
            <CommonCheckbox
              id="able"
              name="able"
              checked={filterIsOpen}
              onChange={(e) => setFilterIsOpen(e.target.checked)}
              text="거래 가능만 보기"
            />

            <div>
              <p>카테고리</p>
              <div className="radio_wrap">
                <CommonRadioBtn
                  text="전체"
                  id="0"
                  name="category_filter"
                  value={0}
                  onChange={(e) => setFilterCategory(+e.target.value)}
                  checked={filterCategory === 0}
                />
                {CATEGORY.map((item) => (
                  <CommonRadioBtn
                    key={item.category_id}
                    text={item.category_name}
                    id={String(item.category_id)}
                    name="category_filter"
                    value={item.category_id}
                    onChange={(e) => setFilterCategory(+e.target.value)}
                    checked={filterCategory === item.category_id}
                  />
                ))}
              </div>
            </div>

            <div>
              <p>정렬</p>
              <div className="radio_wrap">
                <CommonRadioBtn
                  text="최신순"
                  id="recent"
                  name="sort_filter"
                  value="1"
                  onChange={(e) => setFilterSort(e.target.value)}
                  checked={filterSort === "1"}
                />
                <CommonRadioBtn
                  text="인기순"
                  id="favorite"
                  name="sort_filter"
                  value="2"
                  onChange={(e) => setFilterSort(e.target.value)}
                  checked={filterSort === "2"}
                />
              </div>
            </div>

            {/* <div>
              <p>가격</p>
              <input
                type="number"
                id="start_price"
                value={filterStartPrice}
                onChange={(e) => setFilterStartPrice(+e.target.value)}
                min={0}
              />
              <input
                type="number"
                id="end_price"
                value={filterEndPrice}
                onChange={(e) => setFilterEndPrice(+e.target.value)}
                min={0}
              />
            </div> */}

            <div className="filter_btns">
              <CommonButton
                text="전체해제"
                btnType="medium"
                onClick={clearAllFilter}
              />
              <CommonButton
                text="검색"
                btnType="medium"
                onClick={filterSearchPosts}
              />
            </div>
          </div>
        )}
      </div>
      {/* 게시글 리스트 */}
      <>
        <CommonList loading={scroll.isLoading}>
          {list?.map((item, idx) => (
            <Link to={`/auction/${item?.id}`} key={idx}>
              <CommonListItem
                src={item?.src}
                category={findCategory(item?.category_id)}
                title={item?.title}
                startPrice={item?.start_price}
                isOpen={Boolean(item.is_open)}
              />
            </Link>
          ))}
        </CommonList>

        {(scroll.hasNextPage ||
          scroll.isFetchingNextPage ||
          scroll.isFetching) && (
          <div ref={ref}>
            <DataLoading />
          </div>
        )}
      </>
      {scroll?.data?.pages?.[0]?.empty && (
        <CommonNodataBox>데이터가 없습니다</CommonNodataBox>
      )}
    </AuctionListLayout>
  );
}
