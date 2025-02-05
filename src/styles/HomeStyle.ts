import styled from "@emotion/styled";

export const HomeLayout = styled.div`
  .h200 {
    height: 200px;
    background-color: lightblue;
  }
  .auction_guide {
    width: "100%";
    background: "rgb(250, 250, 250)";

    .guide_wrap > div {
      margin-top: 12px;
      height: 160px;
      background-color: lightgreen;
    }
  }
`;

export const SwiperLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;

  /* .category_img {
    width: 100%;
    border-radius: 50%;
    background-color: silver;
  } */
  .category_img {
    width: 100%;
    position: relative;
    border-radius: 50%;
    background-color: silver;
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
