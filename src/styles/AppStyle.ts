import { css } from "@emotion/react";
import styled from "@emotion/styled";

const light = css`
  :root {
    --main-max-width: 640px;
    --header-height: 72px;
    --main-bg-color: #dff6ff;
    --main-border-color: rgba(41, 49, 65, 0.2);
    --side-bg-color: #293141;
    --title-txt-color: #1363df;
    --primary-color: #47b5ff;
    --primary-border-color: #cacaca;
    --negative-color: #ff6b6b;
    --table-border-color: #dae8ff;
    --table-outline-color: #a5c9f6;
    --form-table-bg-color: #f8f8f8;
    --form-table-odd-border-color: #61bfff;
    --form-table-even-border-color: #f2f2f2;
    --search-bg-color: #d9d9d9;
    --search-ph-color: #a6a6a6;
    --white: #fff;
    --black: #181818;
    --button-bar-txt-color: #7e7e7e;

    --padding-size: 16px;
  }
`;

const BaseLayout = styled.div`
  max-width: var(--main-max-width);
  margin: 0 auto;
`;

const HeaderLayout = styled.header`
  width: 100%;
  max-width: var(--main-max-width);
  height: 72px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  z-index: 10;

  .header_utils {
    display: flex;
    gap: 12px;
    button {
      width: 24px;
      height: 24px;
      &:first-of-type {
        padding: 2px;
      }
    }
  }
`;

const MainLayout = styled.main`
  min-height: calc(100vh - 100px);
  height: 100%;
  /* padding: 72px 32px 32px; */
  padding-top: calc(72px + 8px);
`;

export const FooterLayout = styled.footer`
  padding: 16px 32px 0;
  .icons {
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    a {
      width: 32px;
      height: 32px;
      svg,
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
`;

export { light, BaseLayout, HeaderLayout, MainLayout };
