import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { Link } from "react-router-dom";

export default function Login() {
  const auth = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    if (!email) {
      alert("이메일을 입력하십시오");
      return;
    }
    if (!password) {
      alert("비밀번호를 입력하십시오");
      return;
    }

    try {
      const { data } = await axios.get(
        `http://localhost:4000/user?email=${email}&password=${password}`
      );
      if (data?.length) {
        auth.login(data[0]);
        navigate("/");
      } else {
        console.log("login fail");
        alert("일치하는 회원 정보가 없습니다.");
      }
    } catch (error) {
      console.log(error);
      alert("에러가 발생했습니다.");
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form className="login-form" onSubmit={() => login()}>
        <label htmlFor="username">이메일</label>
        <input
          type="text"
          id="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </form>
      <button onClick={() => login()}>로그인</button>

      <button style={{ border: "2px solid red" }}>
        <Link to="register">회원가입</Link>
      </button>
    </>
  );
}
