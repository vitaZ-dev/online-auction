import axios from "axios";
import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";

export default function Login() {
  const auth = useAuthStore();

  const [userInfo, setUserInfo] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/user");
        setUserInfo(data);
      } catch (err) {
        console.log(err);
        setUserInfo([]);
      }
    };
    getUserInfo();
  }, []);

  const login = () => {
    if (!email) {
      alert("이메일을 입력하십시오");
      return;
    }
    if (!password) {
      alert("비밀번호를 입력하십시오");
      return;
    }

    const user = userInfo.find(
      (user) => user.email === email && user.password === password
    );
    if (user) {
      console.log("login ok");
      auth.login(user);

      // navigate("/"); // 로그인 성공시 홈으로 이동합니다.
    } else {
      console.log("login no");
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

      <div>로그인 후 정보</div>
      <div>{auth.userInfo?.id}</div>
      <div>{auth.userInfo?.token}</div>
      <div>{auth.userInfo?.email}</div>
      <div>{auth.userInfo?.password}</div>
      <div>{auth.userInfo?.nickname}</div>
      <div>{auth.userInfo?.role}</div>
    </>
  );
}
