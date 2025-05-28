import { LogoLayout } from "../../styles/AppStyle";

export default function Logo() {
  return (
    <LogoLayout>
      <div className="logo_wrap">
        <img src="/images/logo.svg" alt="Online Auction" />
        <span className="logo_text">Online Auction</span>
      </div>
    </LogoLayout>
  );
}
