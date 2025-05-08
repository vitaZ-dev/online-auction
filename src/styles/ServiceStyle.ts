import styled from "@emotion/styled";

export const GuideLayout = styled.div`
  padding-bottom: var(--padding-size);

  section {
    margin: var(--padding-size) 0;
    padding: 0 var(--padding-size);

    .head_title {
      font-size: 17px;
      margin-bottom: 4px;
      &::before {
        content: "";
        display: block;
        width: 20px;
        height: 3px;
        margin-bottom: 3px;
        background: var(--main-violet-02-color);
      }
    }
    p {
      line-height: 1.4;
      &.in {
        padding-left: 4px;
      }
    }
  }
`;

export const ServiceLayout = styled.div`
  padding: 0 var(--padding-size);
  margin-bottom: 24px;

  h2 {
    font-size: 18px;
  }
  img.logo {
    display: block;
    width: 100%;
    height: 100%;
  }
  p {
    margin-top: 16px;
  }
`;

export const FAQLayout = styled.div``;

export const NoticeLayout = styled.div``;
