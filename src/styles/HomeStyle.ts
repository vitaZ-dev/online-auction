import styled from "@emotion/styled";

export const HomeLayout = styled.div`
  .auction_guide {
    width: 100%;
    /* background: #fafafa; */

    .guide_wrap {
      display: flex;
      @media (max-width: 482px) {
        flex-direction: column;
      }

      & > div {
        flex-grow: 1;
        margin-top: 8px;
        padding: 16px;
        min-height: 160px;
        background-color: lightgreen;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        &.left {
          background-color: pink;
          align-items: flex-end;
          text-align: right;
        }
      }

      .title {
        font-size: 15px;
        font-weight: 600;
      }
      .desc {
        margin: 4px 0 6px;
        font-size: 14px;
      }
      a {
        position: relative;
        display: inline-block;
        margin-right: 9px;
        font-size: 14px;
        text-decoration: underline;
        &::after {
          content: "";
          position: absolute;
          display: inline-block;
          top: 4px;
          width: 5px;
          height: 5px;
          border-top: 1.5px solid var(--black);
          border-right: 1.5px solid var(--black);
          transform: rotate(45deg);
        }
      }
    }
  }

  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 24px;
`;

export const SwiperLayout = styled.div`
  position: relative;
  padding: 16px;
  button.swiper-btn {
    position: absolute;
    top: 50%;
    transform: translateY(calc(-50% - 11px));
    @media (max-width: 280px) {
      width: 30px;
      height: 30px;
    }
    width: 40px;
    height: 40px;
    background-color: var(--white);
    border: 1px solid var(--main-gray-04-color);
    border-radius: 50%;
    opacity: 0.35;
    z-index: 50;
    svg {
      width: 100%;
      height: 100%;
      position: relative;
      padding: 4px;
    }

    &:disabled {
      opacity: 0.2;
      cursor: default;
    }

    &.prev {
      left: calc(var(--padding-size) / 2);
      svg {
        left: -2px;
      }
    }
    &.next {
      left: calc(100% - 50px + calc(var(--padding-size) / 2));
      svg {
        right: -2px;
      }
    }

    @media (max-width: 280px) {
      &.prev {
        left: calc(var(--padding-size) / 2 - 4px);
      }
      &.next {
        left: calc(100% - 50px + calc(var(--padding-size) / 2) + 4px);
      }
    }
  }
`;

export const SwiperItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;

  .category_img {
    width: 100%;
    position: relative;
    border-radius: 50%;
    background-color: var(--main-gray-01-color);
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

  .category_title {
    font-size: 14px;
    font-weight: 700;
  }
`;
