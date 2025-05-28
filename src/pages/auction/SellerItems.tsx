import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { MypageLayout } from "../../styles/MypageStyle";
import { CommonNodataBox } from "../../styles/CommonStyle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CommonTitle from "../../components/common/CommonTitle";
import CommonRadioBtn from "../../components/common/CommonRadioBtn";
import CommonList from "../../components/common/CommonList";
import CommonListItem from "../../components/common/CommonListItem";
import DataLoading from "../../components/UI/DataLoading";
import { findCategory } from "../../constants/category";
import { DocumentData } from "firebase/firestore";
import { getOtherList } from "../../apis/libs";
import { useInView } from "react-intersection-observer";

export default function SellerItems() {
  const { sellerID } = useParams<{ sellerID: string }>();
  const { state } = useLocation();
  const navigate = useNavigate();

  const CONTENTS_COUNT = 10;

  const [isOpen, setIsOpen] = useState<string>("all"); // "all" | "1" | "0"
  const [sellerList, setSellerList] = useState<Array<DocumentData>>([]);
  const [lastItem, setLastItem] = useState<DocumentData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [empty, isEmpty] = useState<boolean>(false);

  const goPrevPage = () => {
    navigate(-1);
  };

  const searchIsOpen = (value: string) => {
    // TODO 초기화
    setLastItem(null);
    setSellerList([]);
    setPage(1);
    setPageLoading(true);
    // isOpen
    setIsOpen(value);
  };

  const getSellerList = async (page: number, isOpen: string) => {
    setLoading(true);

    try {
      const result = await getOtherList(
        sellerID!,
        page,
        CONTENTS_COUNT,
        lastItem,
        isOpen
      );

      isEmpty(result.empty);
      setLastItem(result.lastItem);
      setSellerList((prev) => [...prev, ...result.docs]);
      setHasNextPage(result.page < result.totalPage);

      if (page === 1) setPageLoading(false);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      // setLastItem(null);
      // setSellerList([]);
      // setPage(1);
      // setPageLoading(true);
      await getSellerList(1, isOpen);
    };

    fetch();
  }, [isOpen]);

  const { ref, inView } = useInView({
    threshold: 0.8,
  });
  useEffect(() => {
    if (inView && hasNextPage && !loading) {
      setPage((p) => p + 1);
      getSellerList(page + 1, isOpen);
    }
  }, [inView]);

  return (
    <MypageLayout>
      <div className="mypage_title">
        <ArrowBackIosNewIcon
          className="back_icon"
          onClick={() => goPrevPage()}
        />
        <CommonTitle
          type={1}
          title={`${state?.nickname} 님이 판매한 물품 목록`}
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
        <>
          <CommonList loading={pageLoading}>
            {sellerList?.map((item, idx) => (
              <Link to={`/auction/${item?.id}`} key={idx}>
                <CommonListItem
                  src={item?.src}
                  category={findCategory(item?.category_id)}
                  title={item?.title}
                  startPrice={item?.start_price}
                  isOpen={Boolean(item.is_open)}
                />
              </Link>
            ))}
          </CommonList>

          <div ref={ref}>{hasNextPage ? <DataLoading /> : <></>}</div>
        </>
      </section>
      {empty && <CommonNodataBox>판매한 물품이 없습니다</CommonNodataBox>}
    </MypageLayout>
  );
}
