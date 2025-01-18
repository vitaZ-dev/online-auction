import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const nav = useNavigate();

  return (
    <div>
      <p>404 not found</p>
      <button onClick={() => nav("/")}>홈화면으로</button>
    </div>
  );
}
