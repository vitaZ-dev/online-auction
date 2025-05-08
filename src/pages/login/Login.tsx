import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../stores/useAuthStore";
import { Link } from "react-router-dom";
import { LoginPageLayout } from "../../styles/LoginPageStyle";
import CommonButton from "../../components/common/CommonButton";
import CommonInput from "../../components/common/CommonInput";
import CommonCheckbox from "../../components/common/CommonCheckbox";
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../libs/firebase";
import Loading from "../../components/Loading";
import { UserInfoType } from "../../types/user";
import { USER_DB } from "../../constants/firebase";
import { getDocs, query, where } from "firebase/firestore";

export default function Login() {
  const authStore = useAuthStore();

  const [loading, setLoading] = useState<boolean>(false);
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

  const signIn = async () => {
    if (!email) {
      alert("이메일을 입력하십시오");
      return false;
    }
    if (!password) {
      alert("비밀번호를 입력하십시오");
      return false;
    }

    setLoading(true);
    try {
      await setPersistence(auth, browserSessionPersistence);

      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (rememberID) {
        localStorage.setItem("remember_id", email);
      } else {
        localStorage.removeItem("remember_id");
      }

      const loginUserInfo = await findUserInfo(user.uid);
      authStore.login({
        email: loginUserInfo.email,
        id: loginUserInfo.id,
        nickname: loginUserInfo.nickname,
        role: loginUserInfo.role,
        uuid: loginUserInfo.uuid,
      });

      setLoading(false);
      navigate("/");
    } catch (error: any) {
      switch (error.code) {
        case "auth/invalid-email":
          alert("이메일 형식이 올바르지 않습니다.");
          break;
        case "auth/user-disabled":
          alert("이 계정은 비활성화되어 있습니다.");
          break;
        case "auth/user-not-found":
        case "auth/invalid-credential":
          alert("존재하지 않는 계정입니다.");
          break;
        case "auth/wrong-password":
          alert("비밀번호가 올바르지 않습니다.");
          break;
        case "auth/too-many-requests":
          alert("로그인 시도가 너무 많습니다. 나중에 다시 시도해주세요.");
          break;
        case "auth/network-request-failed":
          alert("네트워크 오류가 발생했습니다. 연결을 확인해주세요.");
          break;
        default:
          alert("로그인 중 알 수 없는 오류가 발생했습니다.");
          console.error(error);
          break;
      }
      setLoading(false);
      return false;
    }
  };

  // userInfo 찾기
  const findUserInfo = async (uuid: string): Promise<UserInfoType> => {
    const q = query(USER_DB, where("uuid", "==", uuid));
    const snapshot = await getDocs(q);
    return snapshot.docs[0].data() as UserInfoType;
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

        <div style={{ marginTop: 4 }}>
          <CommonCheckbox
            id="rememberID"
            name="rememberID"
            checked={rememberID}
            onChange={(e) => setRememberID(e.target.checked)}
            text="아이디 기억"
          />
        </div>

        <CommonButton text="로그인" btnType="large" onClick={() => signIn()} />
      </div>

      <ul className="find_area">
        <li onClick={preparing}>비밀번호 찾기</li>
        <li onClick={preparing}>아이디 찾기</li>
        <li>
          <Link to="register">회원가입</Link>
        </li>
      </ul>

      {loading && <Loading />}
    </LoginPageLayout>
  );
}
