import styled from "@emotion/styled";

export const AuctionListLayout = styled.div`
  display: grid;
  grid-template-columns: ${({ grid }) => `repeat(${grid || 2}, 1fr)`};
  column-gap: 15px;
  row-gap: ${({ grid }) => (grid === 2 ? "32px" : "20px")};
  @media (max-width: 475px) {
    grid-template-columns: repeat(2, 1fr);
    column-gap: 16px;
    row-gap: 32px;
  }
  @media (max-width: 280px) {
    grid-template-columns: 1fr;
    column-gap: 8px;
    row-gap: 16px;
  }
  padding: 0 var(--padding-size);

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
      .category_badge {
        display: inline-block;
        padding: 4px 8px;
        margin-bottom: 4px;
        border-radius: 12px;
        background-color: lightblue;
        font-size: 12px;
      }
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

export const PaginationLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  height: 40px;
`;

// common UI
export const CommonTitleStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px var(--padding-size);

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
  }
  .link_text {
    display: flex;
    align-items: center;
  }
`;
