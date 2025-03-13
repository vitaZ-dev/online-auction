import styled from "@emotion/styled";

export const MypageLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;

  .mypage_user {
    padding: 0 var(--padding-size);
    display: flex;
    align-items: center;
    gap: 12px;

    img {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      @media (max-width: 280px) {
        width: 75px;
        height: 75px;
      }
    }

    & > div {
      flex: 1;
      display: flex;
      justify-content: space-between;
      @media (max-width: 280px) {
        flex-direction: column;
      }

      .user_info {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .nickname {
          font-size: 24px;
          font-weight: 700;
        }
        .email {
          margin-top: 4px;
          font-size: 14px;
          color: gray;
          font-weight: 500;
        }
      }
      .btns {
        margin-top: 8px;
      }
    }
  }

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
