import { Link } from "react-router-dom";
import { LogoProps } from "../../types/component";
import { LogoLayout } from "../../styles/AppStyle";

export default function Logo({ onClick }: LogoProps) {
  return (
    <LogoLayout>
      <Link to="/" onClick={onClick}>
        <img src="/images/logo.svg" alt="Online Auction" />
        <span className="logo_text">Online Auction</span>
      </Link>
    </LogoLayout>
  );
}
