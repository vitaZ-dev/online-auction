import { useEffect, useState } from "react";
import axios from "axios";

export default function List() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get("http://localhost:4000/posts");
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <h1>List</h1>
      <ul>
        {posts?.map((post) => {
          return <li key={post.id}>{post.title}</li>;
        })}
      </ul>
    </>
  );
}
