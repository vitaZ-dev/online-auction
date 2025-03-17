import { useNavigate } from "react-router-dom";
import { NotFoundLayout } from "../styles/AppStyle";

export default function NotFound() {
  const nav = useNavigate();

  return (
    <NotFoundLayout>
      <p>
        404
        <br />
        not found
      </p>
      <button onClick={() => nav("/")}>홈화면으로</button>
    </NotFoundLayout>
  );
}
