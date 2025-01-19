import styled from "@emotion/styled";

export const ItemListLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 15px;
  row-gap: 32px;

  article {
    padding: 4px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

    &:hover .img_wrap {
      transform: scale(1.06);
    }

    .post_img {
      position: relative;
      border-radius: 10px;
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
        transition: all 0.5s ease;
        aspect-ratio: 1;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 10px;
      }
    }
    .post_info {
      width: 100%;
      h5 {
        margin-bottom: 8px;
      }
    }
  }

  .ellipsis {
    &-1 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-2 {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
