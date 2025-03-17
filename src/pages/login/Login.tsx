import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { Link } from "react-router-dom";
import { LoginPageLayout } from "../../styles/LoginPageStyle";
import CommonButton from "../../components/common/CommonButton";
import CommonInput from "../../components/common/CommonInput";

export default function Login() {
  const auth = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberID, setRememberID] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const ID = localStorage.getItem("remember_id");
    if (ID) {
      setRememberID(true);
      setEmail(ID);
    }
  }, []);

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

        if (rememberID) {
          localStorage.setItem("remember_id", email);
        } else {
          localStorage.removeItem("remember_id");
        }

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

  const preparing = () => alert("준비중인 서비스 입니다!");

  return (
    <LoginPageLayout>
      <h1>로그인</h1>
      <div className="login_form">
        <CommonInput
          type="text"
          id="username"
          value={email}
          setValue={(e) => setEmail(e.target.value)}
          length="full"
          placeholder="이메일"
        />

        <CommonInput
          type="password"
          id="password"
          value={password}
          setValue={(e) => setPassword(e.target.value)}
          length="full"
          placeholder="비밀번호"
        />

        <div>
          <input
            type="checkbox"
            id="rememberID"
            checked={rememberID}
            onChange={(e) => setRememberID(e.target.checked)}
          />
          <label htmlFor="rememberID">아이디 기억</label>
        </div>

        <CommonButton text="로그인" btnType="large" onClick={() => login()} />
      </div>

      <ul className="find_area">
        <li onClick={preparing}>비밀번호 찾기</li>
        <li onClick={preparing}>아이디 찾기</li>
        <li>
          <Link to="register">회원가입</Link>
        </li>
      </ul>
    </LoginPageLayout>
  );
}
