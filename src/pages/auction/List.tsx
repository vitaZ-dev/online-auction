import { useEffect, useState } from "react";
import axios from "axios";
import { ItemListLayout } from "../../styles/CommonStyle";
import { Link } from "react-router-dom";

export default function List() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get(
        "http://localhost:4000/posts?_sort=-created_at"
      );
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <h1>List</h1>
      {posts.length ? (
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
      ) : (
        <p>게시글이 없습니다</p>
      )}
    </>
  );
}
