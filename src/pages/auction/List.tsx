import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Pagination, Stack } from "@mui/material";
import { CATEGORY, findCategory } from "../../modules/category";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { CommonNodataBox } from "../../styles/CommonStyle";
// import Pagination from "../../components/common/Pagination";

type searchQueryType = {
  is_open?: boolean;
  category_id?: string;
  sort_by?: "recent" | "favorite";
  start_price_gte?: number;
  start_price_lte?: number;
};

export default function List() {
  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const [filterCheck, setFilterCheck] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const [filterSort, setFilterSort] = useState<"" | "1" | "2">("");
  const [filterStartPrice, setFilterStartPrice] = useState(0);
  const [filterEndPrice, setFilterEndPrice] = useState(0);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [isData, setIsData] = useState(true);
  const [posts, setPosts] = useState<Array<any>>([]);
  const [pageLoading, setPageLoading] = useState(true);
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
    const query: { [key: string]: string } = {};
    search
      .slice(1)
      .split("&")
      .forEach((item) => (query[item.split("=")[0]] = item.split("=")[1]));

    fetchPosts(page, query);
  }, [page, search]);

  const fetchPosts = async (page: number, query: searchQueryType = {}) => {
    setPageLoading(true);

    let url = `http://localhost:4000/posts?&_page=${page}&_per_page=10`;
    query?.sort_by && query.sort_by === "favorite"
      ? (url += "&_sort=-favorite,-created_at")
      : (url += "&_sort=-created_at");

    if (Object.keys(query).length !== 0) {
      Object.keys(query).forEach((key) => {
        if (key !== "sort_by") url += `&${key}=${query[key]}`;
      });
    }

    const { data } = await axios.get(url);
    setPosts(data.data);
    // setPosts((prev: Array<any>) => [...prev, ...data.data]);
    setTotalPage(data.pages);
    // setShowLoadBtn(Boolean(data.next));

    // setPagination({
    //   now_page: data.first,
    //   last_page: data.last,
    //   prev_page: data.prev,
    //   next_page: data.next,
    //   total_count: data.items,
    //   total_pages: data.pages,
    // });
    setPageLoading(false);

    if (data.data.length === 0) setIsData(false);
  };

  // const loadingNextPage = () => setPage(page + 1);

  const filterSearchPosts = async () => {
    filterIsOpen ? query.set("is_open", "1") : query.delete("is_open");
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
    <>
      <h1>List</h1>
      <div>
        <p>카테고리 별 검색</p>
        <button onClick={() => setFilterCheck(!filterCheck)}>필터</button>
        {filterCheck && (
          <div>
            <p>(filter area)</p>
            <div>is_open</div>
            <input
              type="checkbox"
              id="able"
              checked={filterIsOpen}
              onChange={(e) => setFilterIsOpen(e.target.checked)}
            />
            <label htmlFor="able">거래 가능만 보기</label>
            <div>category_id</div>
            <CommonList grid={3}>
              {CATEGORY.map((item) => (
                <div key={item.category_id}>
                  <input
                    type="radio"
                    name="category_filter"
                    id={String(item.category_id)}
                    value={item.category_id}
                    onChange={(e) => setFilterCategory(+e.target.value)}
                    checked={filterCategory === item.category_id}
                  />
                  <label htmlFor={String(item.category_id)}>
                    {item.category_name}
                  </label>
                </div>
              ))}
            </CommonList>
            <div>sort_by</div>
            <div>
              <input
                type="radio"
                name="sort_filter"
                id="recent"
                value="1"
                onChange={(e) => setFilterSort(e.target.value)}
                checked={filterSort === "1"}
              />
              <label htmlFor="recent">최신순</label>
              <input
                type="radio"
                name="sort_filter"
                id="favorite"
                value="2"
                onChange={(e) => setFilterSort(e.target.value)}
                checked={filterSort === "2"}
              />
              <label htmlFor="favorite">인기순</label>
            </div>
            <div>price</div>
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
            <br />
            <button onClick={filterSearchPosts}>검색</button>
            <button onClick={clearAllFilter}>전체해제</button>
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
                    isOpen={post.is_open}
                  />
                </Link>
              );
            })}
          </CommonList>
          {/* <Pagination pageInfo={pagination} /> */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "12px",
            }}
          >
            <Stack spacing={2}>
              <Pagination
                count={totalPage}
                variant="outlined"
                color="secondary"
                onChange={(_, changePage) => setPage(changePage)}
              />
            </Stack>
          </div>
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
    </>
  );
}
