import { useEffect, useState } from "react";
import useAuthStore from "../../stores/useAuthStore";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const auth = useAuthStore();
  const navigate = useNavigate();

  const [userDB, setUserDB] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/user");
        setUserDB(data);
      } catch (err) {
        console.log(err);
        setUserDB([]);
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

    if (userDB.find((user) => user.email === email)) {
      alert("중복 이메일");
      return false;
    }
    if (userDB.find((user) => user.nickname === nickname)) {
      alert("중복 닉네임");
      return false;
    }

    try {
      axios.post("http://localhost:4000/user", {
        id: uuidv4(),
        token: Math.random().toString(36).substring(2, 11),
        email,
        password,
        nickname,
        role: "USER",
      });
      alert("ok");
      navigate("/login");
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
