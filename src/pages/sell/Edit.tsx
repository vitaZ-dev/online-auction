import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

export default function Edit() {
  const [pageCheck, setPageCheck] = useState(true);
  const [userCheck, setUserCheck] = useState(false);
  const { pathname } = useLocation();
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get(
        `http://localhost:4000/posts?id=${pathname.split("/")[2]}`
      );
      setPageCheck(Boolean(data.length));
      setUserCheck(data[0]?.user_id === userInfo?.uuid);
    };

    fetchPosts();
  }, []);
  return (
    <>
      {pageCheck ? (
        userCheck ? (
          <div>edit</div>
        ) : (
          <div>해당 게시글에 접근 권한이 없습니다</div>
        )
      ) : (
        <div>페이지를 찾을 수 없어요</div>
      )}
    </>
  );
}
