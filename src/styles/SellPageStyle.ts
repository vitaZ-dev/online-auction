import styled from "@emotion/styled";

export const WritepageLayout = styled.div`
  .bid_close {
    font-size: 14px;
    font-weight: 600;
    margin-left: 2px;
    color: var(--main-red-color);
  }
  .write_area {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 12px 16px 24px;
  }

  .flex_seperate {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    & > div {
      flex: 0 1 calc(50% - 12px); /* flex-grow: 0, flex-shrink: 1, flex-basis: 50% */
      box-sizing: border-box;
    }
    .price_edit_no {
      display: block;
      margin-top: 4px;
      font-size: 12px;
      font-weight: 500;
      color: var(--main-red-color);
    }
  }

  select {
    outline: none;
    border: 1px solid var(--main-gray-01-color);
    border-radius: 5px;
    padding: 5px 25px 5px 15px;
    height: 40px;
    font-size: 15px;
    font-weight: 400;

    appearance: none;
    background-color: var(--white);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M11 1L6.19856 6L1 1' stroke='%231E1E1E' stroke-width='1.5' stroke-miterlimit='10' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 6px center;
    background-size: 14px 8px;

    cursor: pointer;

    &:active,
    &:focus {
      background-color: var(--white);
      border: 1px solid var(--main-violet-00-color);
      box-shadow: 0 0 0 0.5px var(--main-violet-00-color);
    }
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 18px;
  }
  .text_length {
    display: block;
    margin-top: 4px;
    padding-right: 6px;
    font-size: 14px;
    font-weight: 500;
    text-align: right;
  }

  label.img_btn {
    display: inline-block;
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 5px;
    border: 1px solid var(--main-violet-00-color);
    background-color: var(--white);
    cursor: pointer;
  }
  .item_img {
    position: relative;
    overflow: hidden;
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
    .img_notice {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border: 1px solid var(--main-gray-01-color);
      text-align: center;
      cursor: pointer;
    }
  }

  .page_btn {
    width: 100%;
    margin-top: 12px;
    padding: 12px;
    border-radius: 5px;
    border: 1px solid var(--main-gray-01-color);
  }
`;
