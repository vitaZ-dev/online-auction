import { useState } from "react";
import api from "../../apis/api";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import { LoginPageLayout } from "../../styles/LoginPageStyle";
import CommonInput from "../../components/common/CommonInput";
import CommonButton from "../../components/common/CommonButton";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import firebaseDB, { auth } from "../../../firebase";
import { doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { USER_DB } from "../../modules/firebase";
import Loading from "../../components/Loading";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>("");
  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [checkPassword, setCheckPassword] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>("");
  const [checkNickname, setCheckNickname] = useState<boolean>(false);

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

    const { data } = await api.get(`user?email=${email}`);
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

    const { data: nick } = await api.get(`user?nickname=${nickname}`);
    if (nick.length) {
      alert("중복된 닉네임이 있습니다!");
      setCheckNickname(true);
      return false;
    } else setCheckNickname(false);

    try {
      api.post("user", {
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

  const createUser = async () => {
    setLoading(true);
    setCheckEmail(false);
    setCheckPassword(false);
    setCheckNickname(false);

    if (!email) {
      alert("이메일을 입력해 주세요!");
      setLoading(false);
      return false;
    }
    if (!password) {
      alert("비밀번호를 입력해 주세요!");
      setLoading(false);
      return false;
    }
    if (!nickname) {
      alert("닉네임을 입력해 주세요!");
      setLoading(false);
      return false;
    }

    const check = await isNicknameExist(nickname);
    if (check) {
      alert("중복된 닉네임이 있습니다!");
      setCheckNickname(true);
      setLoading(false);
      return false;
    }

    try {
      let uuid: string = "";
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;
          uuid = user.uid;
          // displayName 설정
          return updateProfile(user, {
            displayName: nickname,
          });
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/invalid-email":
              alert("유효하지 않은 이메일 형식입니다.");
              break;
            case "auth/email-already-in-use":
              alert("이미 사용 중인 이메일 입니다.");
              setCheckEmail(true);
              break;
            case "auth/weak-password":
              alert("6자리 이상의 비밀번호를 입력해주세요.");
              setCheckPassword(true);
              break;
            default:
              alert("유효하지 않은 형식입니다.");
              break;
          }
          setLoading(false);
          return false;
        });

      await setDoc(
        doc(firebaseDB, "user", uuid),
        {
          id: uuid,
          uuid,
          email,
          password,
          nickname,
          role: "USER",
        },
        { merge: true }
      );
      alert("회원가입이 완료되었습니다!");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
      alert("회원가입에 실패했습니다!");
      setLoading(false);
    }
  };

  // 닉네임 중복 체크
  const isNicknameExist = async (nickname: string): Promise<boolean> => {
    const q = query(USER_DB, where("nickname", "==", nickname));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
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
          <span>{checkPassword && "유효하지 않은 비밀번호입니다."}</span>
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
          <span>{checkNickname && "중복된 닉네임이 있습니다."}</span>
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
        <CommonButton
          text="회원가입FB"
          btnType="large"
          onClick={() => createUser()}
        />

        <div className="go_login_page">
          <Link to="/login">로그인 페이지로</Link>
        </div>
      </div>

      {loading && <Loading />}
    </LoginPageLayout>
  );
}
