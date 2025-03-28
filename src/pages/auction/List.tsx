import { useEffect, useState } from "react";
import api from "../../apis/api";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CATEGORY, findCategory } from "../../modules/category";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { CommonNodataBox } from "../../styles/CommonStyle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import CommonRadioBtn from "../../components/common/CommonRadioBtn";
import CommonButton from "../../components/common/CommonButton";
import CommonTitle from "../../components/UI/CommonTitle";
import { AuctionListLayout } from "../../styles/AuctionStyle";
import MUIPagination from "../../components/common/MUIPagination";
import { postType } from "../../types/post";
import CommonCheckbox from "../../components/common/CommonCheckbox";

// type searchQueryType = {
//   is_open?: "0" | "1";
//   category_id?: string;
//   sort_by?: "recent" | "favorite";
//   start_price_gte?: number;
//   start_price_lte?: number;
// };

export default function List() {
  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const [filterCheck, setFilterCheck] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const [filterSort, setFilterSort] = useState<string>("");
  // const [filterStartPrice, setFilterStartPrice] = useState(0);
  // const [filterEndPrice, setFilterEndPrice] = useState(0);

  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isData, setIsData] = useState<boolean>(true);
  const [posts, setPosts] = useState<Array<postType> | []>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  // const [showLoadBtn, setShowLoadBtn] = useState(true);
  // const [pagination, setPagination] = useState({});

  const [query, setQuery] = useSearchParams();
  const { search } = useLocation();

  useEffect(() => {
    if (query.get("is_open")) {
      setFilterIsOpen(true);
    }
    if (query.get("category_id")) {
      setFilterCategory(Number(query.get("category_id")));
    }
    if (query.get("sort_by")) {
      const sortId =
        query.get("sort_by") === "recent"
          ? "1"
          : query.get("sort_by") === "favorite"
          ? "2"
          : "";
      setFilterSort(sortId);
    }
  }, []);

  useEffect(() => {
    const query: { [key: string]: string | number } = {};
    search
      .slice(1)
      .split("&")
      .forEach((item) => (query[item.split("=")[0]] = item.split("=")[1]));

    fetchPosts(page, query);
  }, [page, search]);

  const fetchPosts = async (
    page: number,
    query: { [key: string]: string | number } = {}
  ) => {
    setPageLoading(true);

    /* 검색 조건 하위 쿼리 값 처리 */
    let url = `posts?&_page=${page}&_limit=10`;
    if (query?.sort_by && query.sort_by === "favorite") {
      url += "&_sort=favorite,created_at&_order=desc,desc";
    } else {
      url += "&_sort=created_at&_order=desc";
    }

    if (Object.keys(query).length !== 0) {
      Object.keys(query).forEach((key) => {
        if (key !== "sort_by") url += `&${key}=${query[key]}`;
      });
    }

    const { data, headers } = await api.get(url);
    // setPosts((prev: Array<any>) => [...prev, ...data.data]);
    setPosts(data);
    const totalPageCal =
      +headers["x-total-count"] > 10
        ? Math.ceil(+headers["x-total-count"] / 10)
        : 1;
    setTotalPage(totalPageCal);

    setPageLoading(false);

    /**
     * TODO 필터 검색 시 오류 수정
     * 1. 카테고리 검색 후 조건에 맞는 결과가 없음
     * 2. 다른 카테고리 검색 시 결과가 있어도 '게시글 없음' 결과가 뜸
     * 3. 아래 영역에서 조건 처리
     */
    setIsData(data?.length && data?.length !== 0);
  };

  // const loadingNextPage = () => setPage(page + 1);

  const filterSearchPosts = async () => {
    if (filterIsOpen) query.set("is_open", "1");
    else query.delete("is_open");

    if (filterCategory) query.set("category_id", filterCategory.toString());

    if (filterSort) {
      const sortText =
        filterSort === "1" ? "recent" : filterSort === "2" ? "favorite" : "";
      query.set("sort_by", sortText);
    }
    setQuery(query);
  };

  const clearAllFilter = async () => {
    setFilterCheck(false);
    setFilterIsOpen(false);
    setFilterCategory(0);
    setFilterSort("");
    window.scrollTo(0, 0);
    setQuery({});
    // await fetchPosts(1);
  };

  return (
    <AuctionListLayout>
      <CommonTitle type={1} title="경매 물품" />
      <div className="filter_box">
        <CommonButton
          btnType="medium"
          onClick={() => setFilterCheck(!filterCheck)}
        >
          <TuneIcon />
          <span>필터</span>
          {filterCheck ? <ExpandMore /> : <ExpandLess />}
        </CommonButton>
        {filterCheck && (
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
      {isData ? (
        <>
          <CommonList loading={pageLoading}>
            {posts?.map((post) => {
              return (
                <Link to={`${post.id}`} key={post.id}>
                  <CommonListItem
                    src={post.src}
                    category={findCategory(post?.category_id)}
                    title={post.title}
                    startPrice={post.start_price}
                    isOpen={Boolean(post.is_open)}
                  />
                </Link>
              );
            })}
          </CommonList>
          <MUIPagination totalPage={totalPage} setPage={setPage} />
          {/* {showLoadBtn && (
            <button
              style={{
                width: "100%",
                height: "40px",
                margin: "10px 0",
                border: "1px solid gray",
              }}
              onClick={() => loadingNextPage()}
            >
              더보기
            </button>
          )} */}
        </>
      ) : (
        <CommonNodataBox>게시글이 없습니다</CommonNodataBox>
      )}
    </AuctionListLayout>
  );
}
