import styled from "@emotion/styled";

export const MypageLayout = styled.div`
  .mypage_title {
    padding: 0 16px;
    margin: 8px auto 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    .back_icon {
      cursor: pointer;
    }

    & > div {
      padding-left: 0;
    }
  }

  .sell_list_filter {
    margin: 16px auto 8px;
    padding: 0 16px;
    display: flex;
    gap: 12px;
  }
`;
