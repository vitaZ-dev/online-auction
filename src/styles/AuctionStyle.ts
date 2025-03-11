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
      border-bottom: 1px solid gray;
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
`;

export const ItemDetailLayout = styled.article`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;

  section {
    margin-top: 24px;
    &:first-of-type {
      margin-top: 0;
    }
  }

  .notice {
    color: #ff3c5a;
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
    height: 60px;
    padding: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .user_utils {
      display: flex;
      button {
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

  .item_info {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    margin: 24px auto;
    div {
      width: calc(100% / 3);
      padding: 0 6px;
      border-left: 1px solid lightgray;
      text-align: center;
      &:first-of-type {
        border-left: transparent;
      }

      p:first-of-type {
        margin-bottom: 8px;
        color: gray;
        font-size: 14px;
        font-weight: 700;
      }
    }
  }

  button {
    width: 100%;
    padding: 12px;
    margin: 24px 0;
    border: 1px solid silver;
  }
`;

export const ItemDetailBox = styled.div`
  margin: 16px 0;
  padding: 16px;
  border: 1px solid gray;
  border-radius: 10px;
  background-color: white;
  color: rgb(139, 139, 139);
  font-weight: 600;
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),
    0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(0 0 #0000, 0 0 #0000),
    var(--tw-shadow);
`;

export const FullImageLayout = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  overflow: hidden;
  z-index: 999;

  .wrap_box {
    width: 100vw;
    max-width: 1050px;
    height: 100vh;
    margin: 0 auto;

    .image_wrap {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        height: auto;
      }
    }

    button {
      width: 48px;
      height: 48px;
      color: white;
      position: absolute;
      top: 20px;
      right: 40px;
    }
  }
`;
