import { useEffect, useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { LoginPageLayout } from "../../styles/LoginPageStyle";
import CommonInput from "../../components/common/CommonInput";
import CommonButton from "../../components/common/CommonButton";

export default function Register() {
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
        uuid: uuidv4(),
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
    <LoginPageLayout>
      <h1>회원가입</h1>

      <div className="login_form">
        <div>
          <CommonInput
            type="text"
            id="username"
            value={email}
            setValue={(e) => setEmail(e.target.value)}
            length="full"
            placeholder="이메일"
          />
        </div>

        <CommonInput
          type="password"
          id="password"
          value={password}
          setValue={(e) => setPassword(e.target.value)}
          length="full"
          placeholder="비밀번호"
        />

        <div>
          <CommonInput
            type="text"
            id="nickname"
            value={nickname}
            setValue={(e) => setNickname(e.target.value)}
            length="full"
            placeholder="닉네임"
          />
        </div>

        <div></div>

        <CommonButton
          text="회원가입"
          btnType="large"
          onClick={() => register()}
        />
      </div>
    </LoginPageLayout>
  );
}
