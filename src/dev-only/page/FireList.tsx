import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CATEGORY, findCategory } from "../../constants/category";
import CommonList from "../../components/common/CommonList";
import CommonListItem from "../../components/common/CommonListItem";
import { CommonNodataBox } from "../../styles/CommonStyle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import TuneIcon from "@mui/icons-material/Tune";
import CommonRadioBtn from "../../components/common/CommonRadioBtn";
import CommonButton from "../../components/common/CommonButton";
import CommonTitle from "../../components/common/CommonTitle";
import { AuctionListLayout } from "../../styles/AuctionStyle";
import MUIPagination from "../../components/common/MUIPagination";
import CommonCheckbox from "../../components/common/CommonCheckbox";
import {
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query as q,
  startAfter,
} from "firebase/firestore";
import { calTotalPage } from "../../utils";
import { POSTS_DB } from "../../constants/firebase";
import DataLoading from "../../components/UI/DataLoading";

export default function FireList() {
  /**
   * 남은 숙제
   * ㅁ 마지막 페이지에서는 버튼 비활성화or삭제
   * - 필터 값에 따른 검색
   * - 무한스크롤 데이터 불러오는 속도가 빨라 깜빡거리는 것 처럼 보임: 로딩창 필요
   * ㄴ 최초 로딩시엔 스켈레톤, 그 이후엔 원형loading 처리
   */
  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  const [filterCheck, setFilterCheck] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<number>(0);
  const [filterSort, setFilterSort] = useState<string>("");
  // const [filterStartPrice, setFilterStartPrice] = useState(0);
  // const [filterEndPrice, setFilterEndPrice] = useState(0);

  const CONTENTS_COUNT = 4;
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [isData, setIsData] = useState<boolean>(true);
  const [posts, setPosts] = useState<Array<any> | []>([]);
  const [lastItem, setLastItem] = useState<Array<any> | []>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [itemLoading, setItemLoading] = useState<boolean>(false);
  const [disableNextBtn, setDisableNextBtn] = useState<boolean>(false);
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
    fetchPosts(page);
  }, [search]);

  const fetchPosts = async (page: number = 1) => {
    console.time();
    setItemLoading(true);
    let totalPages: number = totalPage;

    // 데이터 불러온 최초 1회만 실행하면 됨
    if (page === 1) {
      setPageLoading(true);
      const snapshot = await getCountFromServer(POSTS_DB);
      setTotalPage(calTotalPage(snapshot.data().count, CONTENTS_COUNT));
      totalPages = calTotalPage(snapshot.data().count, CONTENTS_COUNT);
    }

    /**
     * posts의 아이템 총 갯수를 알고있는 상태.
     * 마지막 페이지도 알고있는 상태.
     * 마지막 페이지에 도달하면 무한스크롤 or 버튼 비활성화 처리?
     */
    // const lastItem = snapshot.docs[CONTENTS_COUNT * (page - 1) + 1];

    let fire = q(
      POSTS_DB,
      orderBy("created_at", "desc"),
      limit(CONTENTS_COUNT)
    );

    if (lastItem) {
      fire = q(
        POSTS_DB,
        orderBy("created_at", "desc"),
        startAfter(lastItem),
        limit(CONTENTS_COUNT)
      );
      // query 즉, 파이어스토어 저장된 날짜순으로 정렬된 데이터 중에
      // start로 정의된 데이터를 시작으로 마지막 까지의 데이터들을 query에 저장한다.
    }

    const { docs } = await getDocs(fire);
    setLastItem(docs[docs.length - 1]);
    console.log("docs", docs, docs[docs.length - 1]);

    docs.forEach((item) => console.log(item.data()));

    // setPosts(docs);
    setPosts((prev) => [...prev, ...docs]);

    setIsData(docs?.length !== 0);
    const a = console.timeEnd();
    console.log("a", a);

    setPageLoading(false);
    setItemLoading(false);

    // 무한스크롤 마지막 페이지일 시 다음페이지 이동 막기
    if (totalPages === page) {
      setDisableNextBtn(true);
      return;
    }
    setPage(++page);
  };

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
    setPage(1);
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
                    src={post.data().src}
                    category={findCategory(post.data()?.category_id)}
                    title={post.data().title}
                    startPrice={post.data().start_price}
                    isOpen={Boolean(post.data().is_open)}
                  />
                </Link>
              );
            })}
          </CommonList>
          {!disableNextBtn &&
            (itemLoading ? (
              <DataLoading />
            ) : (
              <div className="data_btn">
                <CommonButton
                  text="test"
                  btnType="large"
                  onClick={() => fetchPosts(page)}
                  disabled={disableNextBtn}
                />
              </div>
            ))}
          <MUIPagination totalPage={totalPage} setPage={setPage} />
        </>
      ) : (
        <CommonNodataBox>게시글이 없습니다</CommonNodataBox>
      )}
    </AuctionListLayout>
  );
}
