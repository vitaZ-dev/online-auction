import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import { findCategory } from "../../modules/category";
import CommonTitle from "../../components/UI/CommonTitle";
import axios from "axios";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MUIPagination from "../../components/common/MUIPagination";
import { CommonNodataBox } from "../../styles/CommonStyle";

export default function MyFavoriteList() {
  const { userInfo } = useAuthStore();
  const navigate = useNavigate();

  const [userFavorite, setUserFavorite] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    getFavorite();
  }, [page]);

  const getFavorite = async () => {
    const { data } = await axios.get(
      `http://localhost:4000/favorite?uuid=${userInfo?.uuid}&_sort=-created_at&_page=${page}&_per_page=16`
    );
    setUserFavorite(data.data);
    setTotalPage(data.pages);
  };

  return (
    <MypageLayout>
      <div className="mypage_title">
        <ArrowBackIosNewIcon
          className="back_icon"
          onClick={() => navigate("/mypage")}
        />
        <CommonTitle
          type={1}
          title={`${userInfo?.nickname} 님의 좋아요 리스트`}
        />
      </div>

      <section>
        {userFavorite?.length ? (
          <>
            <CommonList grid={4}>
              {userFavorite?.map((post) => {
                return (
                  <Link to={`/auction/${post?.item_id}`} key={post?.item_id}>
                    <CommonListItem
                      src={post?.src}
                      category={findCategory(post?.category_id)}
                      title={post?.title}
                      startPrice={post?.start_price}
                      isOpen={post.is_open}
                    />
                  </Link>
                );
              })}
            </CommonList>
            <MUIPagination totalPage={totalPage} setPage={setPage} />
          </>
        ) : (
          <CommonNodataBox>내가 좋아요 한 물품이 없습니다</CommonNodataBox>
        )}
      </section>
    </MypageLayout>
  );
}
