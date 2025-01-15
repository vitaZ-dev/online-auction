import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import axios from "axios";

export default function Register() {
  const auth = useAuthStore();

  const [userInfo, setUserInfo] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

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

  const register = () => {
    console.log("info", email, password, nickname);
    /**
      "token": "pewdksmfwoeifdk123mweo2",
      "email": "jsonserver@a.com",
      "password": "1234",
      "nickname": "A",
      "role": "USER"
     */

    try {
      axios.post("http://localhost:4000/user", {
        token: "pewdksmfwoeifdk123mweo2",
        email,
        password,
        nickname,
        role: "USER",
      });
      alert("ok");
    } catch (err) {
      console.log(err);
      alert("error 발생-등록 실패");
    }
  };

  return (
    <>
      <h1>회원가입</h1>

      <form className="login-form" onSubmit={() => register()}>
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

        <label htmlFor="nickname">닉네임</label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </form>
      <button onClick={() => register()}>회원가입</button>
    </>
  );
}
