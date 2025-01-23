import { useEffect, useState } from "react";
import axios from "axios";
import { ItemListLayout } from "../../styles/CommonStyle";
import { Link } from "react-router-dom";
import { Pagination, Stack } from "@mui/material";
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
          <ItemListLayout>
            {posts?.map((post) => {
              return (
                <Link to={`${post.id}`} key={post.id}>
                  <article>
                    <div className="post_img">
                      <div className="img_wrap">
                        <img src={post.src} alt="img" />
                      </div>
                    </div>
                    <div className="post_info">
                      <h5 className="ellipsis-1">
                        {post.title} / {post.id}
                      </h5>
                      <p className="ellipsis-1">{post.contents}</p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </ItemListLayout>
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
