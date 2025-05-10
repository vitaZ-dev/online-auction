import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "../../stores/useAuthStore";
import { getMyDetailBid } from "../../apis/libs";
import CallMadeIcon from "@mui/icons-material/CallMade";
import CommonModal from "../../components/common/CommonModal";
import CommonButton from "../../components/common/CommonButton";
import ShowListTable from "../../components/common/ShowListTable";
import MypageList from "../../components/pages/mypage/MypageList";

export default function MyBidList() {
  const navigate = useNavigate();
  const { userInfo } = useAuthStore();

  const [toggle, setToggle] = useState<boolean>(false);
  const [detailID, setDetailId] = useState<string>("");
  const [detailTitle, setDetailTitle] = useState<string>("");

  const { data: bidList, isFetching } = useQuery({
    queryKey: ["mypage", "bid_list", "detail", detailID],
    queryFn: () => getMyDetailBid(detailID, userInfo!.uuid!),
    enabled: !!detailID,
  });

  const handleDetailBid = (item_id: string, title: string) => {
    setDetailId(item_id);
    setDetailTitle(title);
    setToggle(true);
  };

  return (
    <>
      <MypageList
        collectionPath="bid_list"
        filterOpen={false}
        setDetailId={setDetailId}
        handleDetailBid={handleDetailBid}
      />

      <CommonModal
        isOpen={toggle}
        modalTitle={detailTitle}
        setDisplay={setToggle}
      >
        <ShowListTable
          tableGrid={[2, 4]}
          tableHeader={["amount", "time"]}
          tableHeaderText={["입찰가", "입찰 시간"]}
          tableList={bidList?.data}
          tableLoading={isFetching}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <CommonButton
            btnType="small"
            textColor="#181818"
            onClick={() => navigate(`/auction/${detailID}`)}
          >
            <div style={{ fontSize: 14 }}>사이트로</div>
            <CallMadeIcon style={{ fontSize: 18 }} />
          </CommonButton>
        </div>
      </CommonModal>
    </>
  );
}
