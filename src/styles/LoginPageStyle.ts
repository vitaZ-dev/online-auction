import styled from "@emotion/styled";

export const LoginPageLayout = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  h1 {
    margin: 40px 0 20px;
    font-size: 36px;
    text-align: center;
    font-weight: 500;
  }

  .login_form {
    display: flex;
    flex-direction: column;
    gap: 4px;
    span {
      font-size: 12px;
      line-height: 1;
      padding-left: 6px;
      color: #ff3c5a;
    }

    button {
      margin-top: 10px;
    }
  }

  .find_area {
    padding-top: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 28px;

    li,
    li > * {
      position: relative;
      font-size: 14px;
      color: #7a7575;
      cursor: pointer;
    }
    li::before {
      content: "";
      position: absolute;
      top: 3px;
      left: -12px;
      width: 1px;
      height: 12px;
      border-radius: 0.5px;
      background-color: #dadada;
    }
    li:first-of-type::before {
      background-color: transparent;
    }
  }
  .go_login_page {
    padding-top: 16px;
    text-align: center;
    & > a {
      color: #7a7575;
      font-size: 14px;
      text-decoration: underline;
    }
  }
`;
