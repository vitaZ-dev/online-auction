import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import { MypageLayout } from "../../styles/MypageStyle";
import api from "../../apis/api";
import { findCategory } from "../../modules/category";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import CommonList from "../../components/UI/CommonList";
import CommonListItem from "../../components/UI/CommonListItem";
import CommonTitle from "../../components/UI/CommonTitle";
import { CommonNodataBox } from "../../styles/CommonStyle";
import CommonRadioBtn from "../../components/common/CommonRadioBtn";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MUIPagination from "../../components/common/MUIPagination";
import { postType } from "../../types/post";

export default function MySellList() {
  const [userPostAll, setUserPostAll] = useState<Array<postType> | []>([]);

  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<string>("all"); // "all" | "0" | "1"

  const { userInfo } = useAuthStore();
  const navigate = useNavigate();

  const [query, setQuery] = useSearchParams();
  const { state, search } = useLocation();
  const USER_ID = state?.uuid ?? userInfo?.uuid;

  useEffect(() => {
    getUserPostList(page, search.slice(-1));
  }, [page, search]);

  const getUserPostList = async (page: number, search: string = "") => {
    let query = `user_id=${USER_ID}&_sort=-created_at&_page=${page}&_per_page=16`;
    if (search) query += `&is_open=${search}`;
    const { data } = await api.get("posts?" + query);
    setUserPostAll(data.data);
    setTotalPage(data.pages);
  };

  const goPrevPage = () => {
    if (state) navigate(-1);
    else navigate("/mypage");
  };

  const searchIsOpen = async (value: string) => {
    setIsOpen(value);

    if (value === "all") query.delete("is_open");
    else query.set("is_open", value);
    setQuery(query);

    if (page !== 1) setPage(1);
  };

  return (
    <MypageLayout>
      <div className="mypage_title">
        <ArrowBackIosNewIcon
          className="back_icon"
          onClick={() => goPrevPage()}
        />
        <CommonTitle
          type={1}
          title={`${
            state?.nickname ?? userInfo?.nickname
          } 님이 판매한 물품 목록`}
        />
      </div>

      <div className="sell_list_filter">
        <CommonRadioBtn
          text="all"
          id="all"
          name="open_filter"
          value="all"
          onChange={(e) => searchIsOpen(e.target.value)}
          checked={isOpen === "all"}
        />
        <CommonRadioBtn
          text="open"
          id="open"
          name="open_filter"
          value="1"
          onChange={(e) => searchIsOpen(e.target.value)}
          checked={isOpen === "1"}
        />
        <CommonRadioBtn
          text="close"
          id="close"
          name="open_filter"
          value="0"
          onChange={(e) => searchIsOpen(e.target.value)}
          checked={isOpen === "0"}
        />
      </div>

      <section>
        {userPostAll.length ? (
          <>
            <CommonList grid={4}>
              {userPostAll?.map((post) => {
                return (
                  <Link to={`/auction/${post?.id}`} key={post?.id}>
                    <CommonListItem
                      src={post?.src}
                      category={findCategory(post?.category_id)}
                      title={post?.title}
                      startPrice={post?.start_price}
                      isOpen={Boolean(post.is_open)}
                    />
                  </Link>
                );
              })}
            </CommonList>
            <MUIPagination totalPage={totalPage} setPage={setPage} />
          </>
        ) : (
          <CommonNodataBox>판매한 물품이 없습니다.</CommonNodataBox>
        )}
      </section>
    </MypageLayout>
  );
}
