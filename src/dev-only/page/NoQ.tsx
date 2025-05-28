import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { getPostList } from "../../apis/libs";
import { CATEGORY, findCategory } from "../../constants/category";
import { AuctionListLayout } from "../../styles/AuctionStyle";
import { CommonNodataBox } from "../../styles/CommonStyle";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CommonTitle from "../../components/common/CommonTitle";
import CommonButton from "../../components/common/CommonButton";
import CommonCheckbox from "../../components/common/CommonCheckbox";
import CommonRadioBtn from "../../components/common/CommonRadioBtn";
import CommonList from "../../components/common/CommonList";
import CommonListItem from "../../components/common/CommonListItem";
import DataLoading from "../../components/UI/DataLoading";
import { DocumentData } from "firebase/firestore";
import { useInView } from "react-intersection-observer";

export default function NoQ() {
  const [query, setQuery] = useSearchParams();
  const { search } = useLocation();

  const CONTENTS_COUNT = 4;
  // 필터
  const [filterShow, setFilterShow] = useState<boolean>(false);
  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const [filterSort, setFilterSort] = useState<string>("1");

  useEffect(() => {
    if (query.get("is_open")) setFilterIsOpen(true);
    else setFilterIsOpen(false);

    if (query.get("category_id"))
      setFilterCategory(Number(query.get("category_id")));
    else setFilterCategory(0);

    if (query.get("sort_by")) setFilterSort("2");
    else setFilterSort("1");
  }, [search]);

  const filterSearchPosts = async () => {
    if (filterIsOpen) query.set("is_open", "1");
    else query.delete("is_open");

    if (filterCategory) query.set("category_id", filterCategory.toString());
    else query.delete("category_id");

    if (filterSort === "2") query.set("sort_by", "favorite");
    else query.delete("sort_by");

    setQuery(query);
    setLastItem(null);
    setList([]);
    setPageLoading(true);
    setPage(1);
  };

  const clearAllFilter = async () => {
    setFilterIsOpen(false);
    setFilterCategory(0);
    setFilterSort("1");
    // setQuery({});
    window.scrollTo(0, 0);
  };

  // 메인 무한스크롤 리스트
  const [list, setList] = useState<DocumentData[]>([]); // 무한스크롤 리스트
  const [lastItem, setLastItem] = useState<DocumentData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [empty, isEmpty] = useState<boolean>(false);

  const filterQuery = useMemo(() => {
    const defaults = {
      is_open: false,
      category_id: 0,
      sort_by: "1",
    };

    const entries = search.slice(1)?.split("&");
    entries.forEach((entry) => {
      const [key, value] = entry.split("=");
      if (key === "is_open") {
        defaults.is_open = Boolean(Number(value) === 1);
      } else if (key === "category_id") {
        const num = Number(value);
        defaults.category_id = isNaN(num) || num > 19 ? 0 : num;
      } else if (key === "sort_by") {
        defaults.sort_by = value ? "2" : "1";
      }
    });

    return defaults;
  }, [search]);

  const getList = async (page: number) => {
    setLoading(true);

    try {
      const {
        is_open: _filterIsOpen,
        category_id: _filterCategory,
        sort_by: _filterSort,
      } = filterQuery;

      const result = await getPostList(
        page,
        CONTENTS_COUNT,
        totalPage,
        setTotalPage,
        lastItem,
        // 필터값
        _filterIsOpen, // 거래 가능만 보기
        _filterCategory, // 카테고리 id
        _filterSort // 정렬기준_최신(1), 좋아요(2)
      );

      isEmpty(result.empty);
      setLastItem(result.lastItem);
      setList((prev) => [...prev, ...result.docs]);
      setHasNextPage(result.page < result.totalPages);

      if (page === 1) setPageLoading(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getList(page);
  }, [search]);

  const { ref, inView } = useInView({
    threshold: 0.8,
  });
  useEffect(() => {
    if (inView && hasNextPage && !loading) {
      setPage((p) => p + 1);
      getList(page + 1);
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
                onClick={() => clearAllFilter()}
              />
              <CommonButton
                text="검색"
                btnType="medium"
                onClick={() => filterSearchPosts()}
              />
            </div>
          </div>
        )}
      </div>
      {/* 게시글 리스트 */}
      <>
        <CommonList loading={pageLoading}>
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

        <div ref={ref}>{hasNextPage ? <DataLoading /> : <></>}</div>
      </>
      {empty && <CommonNodataBox>데이터가 없습니다</CommonNodataBox>}
    </AuctionListLayout>
  );
}
