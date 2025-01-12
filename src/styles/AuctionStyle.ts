import styled from "@emotion/styled";

export const ItemDetailLayout = styled.article`
  display: block;
  .item_img {
    width: 100%;
    height: auto;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .item_info {
    display: flex;
    margin: 24px auto;
    div {
      padding: 0 24px;
      border-left: 1px solid black;
      &:first-of-type {
        padding-left: 0;
        border-left: none;
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
