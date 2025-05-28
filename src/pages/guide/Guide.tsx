import CommonTitle from "../../components/common/CommonTitle";
import { GuideLayout } from "../../styles/ServiceStyle";

export default function Guide() {
  return (
    <GuideLayout>
      <CommonTitle type={1} title="경매 가이드" />
      <section>
        <h3 className="head_title">Online Auction 안내</h3>
        <p>
          온라인 경매 <b>입찰</b> 및 <b>게시글 등록</b>은 홈페이지 가입 후
          본인인증이 완료된 고객만 참여가 가능합니다.
        </p>
        <p>홈페이지 회원 가입 절차에 따라 작성을 완료해 주시기 바랍니다.</p>
        <p>
          온라인 경매는 장소, 거리, 시간에 구애받지 않고 언제 어디서나 간편하게
          경매에 참여할 수 있습니다.
        </p>
        <p>
          온라인 경매 기간 중 24시간 홈페이지를 통해 응찰이 가능하며, 경매
          마감시간을 기준으로 순차적으로 마감됩니다.
        </p>
      </section>

      <section>
        <h3 className="head_title">How To Buy</h3>
        <div>
          <p>01. 입찰을 원하는 게시글 페이지에 들어갑니다.</p>
          <p>02. 원하는 값을 입력한 후 입찰하기 버튼을 누릅니다.</p>
          <p className="in">
            02-1. 현재 최대가 값 이상의 값만 입력할 수 있습니다.
          </p>
          <p className="in">
            02-2. 한 번 입찰하면 취소할 수 없으니 주의하세요!
          </p>
          <p>
            03. 게시글 작성자가 입찰 종료 전까지 입찰은 여러 번 할 수 있습니다.
          </p>
          <p>04. 제품은 가장 높은 금액을 입력한 입찰자에게 낙찰됩니다.</p>
        </div>
      </section>

      <section>
        <h3 className="head_title">How To Sell</h3>
        <div>
          <p>01. 게시글 등록</p>
          <p className="in">01-1. Sell 〉 경매출품 페이지로 이동합니다.</p>
          <p className="in">01-2. 해당 페이지의 내용을 전부 입력합니다.</p>
          <p className="in">
            01-3. 게시글 <b>수정</b> 및 <b>삭제</b>는 입찰 기록이 없을 때
            가능합니다.
          </p>
          <br />
          <p>02. 낙찰 처리</p>
          <p className="in">
            02-1. 낙찰 처리는 게시글 작성일로 부터 최소 2주 이후부터 할 수
            있습니다.
          </p>
          <p className="in">
            02-2. 입찰자가 없어도 낙찰 처리를 할 수 있습니다. 한 번 낙찰하면
            취소할 수 없으니 주의하세요.
          </p>
          <p className="in">
            02-3. 낙찰 처리 된 게시글은 수정 및 삭제가 불가능합니다.
          </p>
        </div>
      </section>
    </GuideLayout>
  );
}
