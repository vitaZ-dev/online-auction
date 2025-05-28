import styled from "@emotion/styled";

export const AuctionListLayout = styled.div`
  padding-bottom: 12px;

  .filter_box {
    padding: 16px;
  }
  .filter_area {
    padding: 0 8px;
    & > div {
      padding: 16px 0;
      border-bottom: 1px solid var(--main-gray-02-color);
    }
    p {
      margin-bottom: 8px;
      font-size: 18px;
      font-weight: 600;
    }

    .radio_wrap {
      display: flex;
      flex-wrap: wrap;
      column-gap: 6px;
      row-gap: 12px;
    }

    .filter_btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1px solid transparent;
    }
  }

  .data_btn {
    padding: var(--padding-size);
  }
`;

export const ItemDetailLayout = styled.article`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;
  margin-top: -8px;

  section {
    margin-top: 24px;
    &:first-of-type {
      margin-top: 0;
    }
  }

  .notice {
    margin: 6px 0;
    color: var(--main-red-color);
    font-size: 14px;
    font-weight: 500;
  }

  .item_img {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    &::after {
      content: "";
      display: block;
      padding-bottom: 100%;
    }
    .img_wrap {
      width: 100%;
      height: 100%;
      position: absolute;
      aspect-ratio: 1;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .user_info {
    min-height: 60px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    .user_prof {
      display: flex;
      align-items: center;
      gap: 4px;
      padding-left: 4px;
    }

    .user_utils {
      display: flex;

      .favorite {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: none;
        span {
          font-size: 11px;
        }
      }

      button {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--main-gray-01-color);
        border-radius: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 36px;
        height: 36px;
        padding: 0;
        margin: 0;
        margin-left: 12px;
        font-size: 12px;
      }
    }
  }

  .detail_info {
    padding: 8px 16px 0;
  }
  .contents_info {
    padding: 2px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    p {
      font-size: 14px;
      color: var(--main-gray-02-color);
    }
  }

  .item_info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 24px auto;
    div {
      width: calc(100% / 3);
      padding: 0 6px;
      border-left: 1px solid var(--main-input-placeholder-color);
      text-align: center;
      &:first-of-type {
        border-left: transparent;
      }

      p:first-of-type {
        margin-bottom: 8px;
        color: var(--main-gray-02-color);
        font-size: 14px;
        font-weight: 700;
      }
    }
  }

  .detail_table {
    & > p {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 8px;
      margin-bottom: 8px;
      &:last-of-type {
        margin-bottom: 0;
      }
    }
    .contents {
      color: var(--main-gray-04-color);
    }
  }

  .bid_input {
    display: flex;
    gap: 8px;

    button {
      flex: 1;
      height: 40px;
      font-size: 15px;
    }
    & > div {
      flex: 5;
    }

    @media (max-width: 482px) {
      flex-direction: column;
      button {
        font-size: 14px;
        line-height: 36px;
      }
    }
  }
`;

const itemDetailBoxStyle = `
  min-height: 100px;
  margin: 8px 0 16px;
  padding: 16px;
  border: 1px solid var(--main-gray-02-color);
  border-radius: 10px;
  background-color: var(--white);
  color: var(--main-gray-02-color);
  font-weight: 600;
  box-shadow: #0000000d 0px 2px 8px;
`;
export const ItemDetailBox = styled.div`
  ${itemDetailBoxStyle};
  .textarea {
    white-space: pre-wrap;
  }
`;
export const ItemDetailBidderBox = styled.div`
  position: relative;
  .icon {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    padding: 6px;
    border: 4px solid var(--white);
    border-radius: 50%;
    background-color: var(--main-green-color);
    color: var(--white);
  }
  .bidder_wrap {
    ${itemDetailBoxStyle};
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 4px solid var(--main-green-light-color);
    margin-top: 32px;
    min-height: 144px;

    p {
      color: var(--black);
      font-size: 36px;
      text-align: center;
      &.price {
        margin-top: 12px;
        color: var(--main-gray-02-color);
        font-size: 18px;
      }
      span {
        margin: 0 4px;
        color: var(--main-green-color);
      }
    }
  }
`;
