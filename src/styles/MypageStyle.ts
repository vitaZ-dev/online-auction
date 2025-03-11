import styled from "@emotion/styled";

export const MypageLayout = styled.div`
  .go_back {
    padding: 0 16px;
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
    padding: 16px 16px 8px;
    display: flex;
    gap: 12px;
  }
`;
