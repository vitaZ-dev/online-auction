import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import { LoginPageLayout } from "../../styles/LoginPageStyle";
import CommonInput from "../../components/common/CommonInput";
import CommonButton from "../../components/common/CommonButton";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState(false);
  const [nickname, setNickname] = useState("");
  const [checkNickname, setCheckNickname] = useState(false);

  const register = async () => {
    if (!email) {
      alert("이메일을 입력해 주세요!");
      return false;
    }
    if (!password) {
      alert("비밀번호를 입력해 주세요!");
      return false;
    }
    if (!nickname) {
      alert("닉네임을 입력해 주세요!");
      return false;
    }

    const { data } = await axios.get(
      `http://localhost:4000/user?email=${email}`
    );
    if (data.length) {
      alert("중복된 이메일이 있습니다!");
      setCheckEmail(true);
      return false;
    } else setCheckEmail(false);

    if (password.length < 6) {
      alert("6자리 이상의 비밀번호를 입력해주세요!");
      setCheckPassword(true);
      return false;
    } else setCheckPassword(false);

    const { data: nick } = await axios.get(
      `http://localhost:4000/user?nickname=${nickname}`
    );
    if (nick.length) {
      alert("중복된 닉네임이 있습니다!");
      setCheckNickname(true);
      return false;
    } else setCheckNickname(false);

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
      alert("회원가입에 실패했습니다!");
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
          <span>{checkEmail && "중복된 이메일이 있습니다!"}</span>
        </div>

        <div>
          <CommonInput
            type="password"
            id="password"
            value={password}
            setValue={(e) => setPassword(e.target.value)}
            length="full"
            placeholder="비밀번호"
          />
          <span>{checkPassword && "6자리 이상 비밀번호를 입력해주세요!"}</span>
        </div>

        <div>
          <CommonInput
            type="text"
            id="nickname"
            value={nickname}
            setValue={(e) => setNickname(e.target.value)}
            length="full"
            placeholder="닉네임"
          />
          <span>{checkNickname && "중복된 닉네임이 있습니다!"}</span>
        </div>

        {/* <div>
          <div>
            <input type="checkbox" name="agree" id="agreeAll" />
            <label htmlFor="agreeAll">모두 동의합니다</label>
          </div>
          <div>
            <input type="checkbox" name="agree" id="agree1" />
            <label htmlFor="agree1">[필수] 이용약관 동의</label>
          </div>
          <div>
            <input type="checkbox" name="agree" id="agree2" />
            <label htmlFor="agree2">[필수] 개인정보 제공 및 이용 동의</label>
          </div>
          <div>
            <input type="checkbox" name="agree" id="agree3" />
            <label htmlFor="agree3">
              [선택] 광고성 정보 수신 및 마케팅 활용 동의
            </label>
          </div>
        </div> */}

        <CommonButton
          text="회원가입"
          btnType="large"
          onClick={() => register()}
        />

        <div className="go_login_page">
          <Link to="/login">로그인 페이지로</Link>
        </div>
      </div>
    </LoginPageLayout>
  );
}
