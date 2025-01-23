import { useEffect, useState } from "react";
import axios from "axios";
import { AuctionListLayout } from "../../styles/CommonStyle";
import { Link } from "react-router-dom";
import { Pagination, Stack } from "@mui/material";
import { findCategory } from "../../modules/category";
import ListItem from "../../components/ListItem";
// import Pagination from "../../components/common/Pagination";

export default function List() {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [posts, setPosts] = useState<Array<any>>([]);
  // const [showLoadBtn, setShowLoadBtn] = useState(true);
  // const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const fetchPosts = async (page: number) => {
    const { data } = await axios.get(
      `http://localhost:4000/posts?_sort=-created_at&_page=${page}&_per_page=10`
    );
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
  };

  // const loadingNextPage = () => setPage(page + 1);

  return (
    <>
      <h1>List</h1>
      {posts.length ? (
        <>
          <AuctionListLayout>
            {posts?.map((post) => {
              return (
                <Link to={`${post.id}`} key={post.id}>
                  <ListItem
                    src={post.src}
                    category={findCategory(post?.category_id)}
                    title={post.title}
                    contents={post.contents}
                  />
                </Link>
              );
            })}
          </AuctionListLayout>
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
        <p>게시글이 없습니다</p>
      )}
    </>
  );
}
