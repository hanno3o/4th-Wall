import styled from 'styled-components';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { BsGoogle } from 'react-icons/bs';
import { RiEyeCloseLine } from 'react-icons/ri';
import { IoEye } from 'react-icons/io5';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import { XXLText, SMText, SMGreyText, LGText } from '../../style/Text';
import Swal from 'sweetalert2';
import { FirebaseError } from 'firebase/app';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';

const LoginPageWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DividerLine = styled.div`
  border-bottom: solid 0.5px ${(props) => props.theme.white};
  margin: 10px 4px;
`;

const LoginButton = styled.button`
  font-size: 16px;
  padding: 10px 20px;
  height: 40px;
  font-weight: 500;
  border: solid 1px ${(props) => props.theme.white};
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  gap: 4px;
  align-items: center;
  background: transparent;
  &:hover {
    scale: 1.05;
    transition: ease-in-out 0.25s;
    background-color: rgba(255, 255, 255, 0.25);
    border: solid 1px rgba(255, 255, 255, 0.25);
  }
`;

const GoogleButton = styled(LoginButton)`
  color: ${(props) => props.theme.white};
`;

const LoginAndSignUpCard = styled.div`
  gap: 16px;
  display: flex;
  flex-direction: column;
  width: 465px;
  border-radius: 5px;
  border: solid 0.5px ${(props) => props.theme.lightGrey};
  padding: 40px 30px;
  z-index: 0;
  position: relative;
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.1);
`;

const InputField = styled.input`
  height: 40px;
  border-radius: 20px;
  padding-left: 16px;
  font-size: 14px;
  line-height: 32px;
  color: ${(props) => props.theme.darkGrey};
  outline: solid 1px rgba(255, 255, 255, 0.1);
  &:focus {
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.1),
      0 0 0 6px rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.25s;
  }
`;

const SignUpButton = styled.button`
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  text-decoration: underline;
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
  &:hover {
    font-weight: 700;
    transition: ease-in-out 0.25s;
  }
`;

const ShowOrHidePasswordButton = styled.button`
  position: absolute;
  color: ${(props) => props.theme.darkGrey};
  font-weight: 900;
  top: 50%;
  right: 20px;
  font-size: 22px;
`;

export default function Login() {
  const backgroundImageURL =
    'https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Floginbackground_compressed.png?alt=media&token=478a71e3-3273-4e15-9e3b-1fd1de188460';
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState('user@gmail.com');
  const [password, setPassword] = useState('1234567');
  const [isShowOrHidePassword, setIsShowOrHidePassword] = useState(true);
  const [isSignInState, setIsSignInState] = useState(true);
  const id = useAppSelector((state) => state.user.id);

  const nativeAuthErrorHandlingMessages: {
    [key: string]: string;
  } = {
    'auth/invalid-email': '輸入的電子郵件地址無效，請檢查後重新輸入',
    'auth/missing-email': '尚未輸入電子郵件',
    'auth/missing-password': '尚未輸入密碼',
    'auth/email-already-in-use':
      '該電子郵件地址已被使用，請使用其他電子郵件地址',
    'auth/weak-password': '密碼強度太弱，請輸入至少7位數密碼',
    'auth/wrong-password': '密碼錯誤，請確認後重新輸入',
    'auth/user-not-found': '找不到使用者，請檢查您輸入的資訊是否正確',
  };

  const showNativeAuthErrorMessage = (errorCode: string) => {
    if (nativeAuthErrorHandlingMessages.hasOwnProperty(errorCode)) {
      const errorMessage = nativeAuthErrorHandlingMessages[errorCode];
      Swal.fire({
        text: errorMessage,
        width: 350,
        icon: 'warning',
        iconColor: '#bbb',
        confirmButtonColor: '#555',
      });
    } else {
      console.log('Unknown error');
    }
  };

  const signInWithGoogle = async () => {
    setAuthing(true);
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log(res.user.uid);
      navigate('/');
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'success',
        title: '登入成功！🥳',
        width: '260',
        iconColor: '#bbb',
        confirmButtonColor: '#555',
      });
    } catch (error) {
      console.log(error);
      setAuthing(false);
    }
  };

  const nativeSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      navigate('/');
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'success',
        title: '登入成功！🥳',
        width: '260',
        iconColor: '#bbb',
        confirmButtonColor: '#555',
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log('native login error:', error);
        const errorCode = error.code;
        showNativeAuthErrorMessage(errorCode);
      }
    }
  };

  const SignUp = async () => {
    try {
      const userCredential = createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential);
      navigate('/');
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer);
          toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: 'success',
        title: '註冊成功，期待與您一起探索更多有趣的內容！🥳',
        iconColor: '#bbb',
        confirmButtonColor: '#555',
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log('native signup error:', error);
        const errorCode = error.code;
        showNativeAuthErrorMessage(errorCode);
      }
    }
  };

  if (!id) {
    return (
      <LoginPageWrapper
        style={{
          backgroundImage: `linear-gradient(to top, rgb(0, 0, 0), rgb(255, 255, 255, 0) 100%), url(${backgroundImageURL})`,
        }}
      >
        {isSignInState ? (
          <LoginAndSignUpCard>
            <XXLText style={{ marginBottom: '10px' }}>Login</XXLText>
            <GoogleButton onClick={() => signInWithGoogle()} disabled={authing}>
              <BsGoogle />
              <LGText>Google註冊/登入</LGText>
            </GoogleButton>
            <RowFlexbox alignItems="center" justifyContent="space-between">
              <DividerLine style={{ width: '45%' }} />
              <SMText>or</SMText>
              <DividerLine style={{ width: '45%' }} />
            </RowFlexbox>
            <ColumnFlexbox gap="8px" tabletGap="6px">
              <SMText>Email</SMText>
              <InputField
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="請輸入電子郵件"
                required
                name="email"
              />
            </ColumnFlexbox>
            <ColumnFlexbox
              gap="8px"
              tabletGap="6px"
              style={{ position: 'relative' }}
            >
              <SMText>密碼</SMText>
              <InputField
                type={isShowOrHidePassword ? 'password' : 'text'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                required
                name="password"
              />
              <ShowOrHidePasswordButton
                onClick={() => setIsShowOrHidePassword(!isShowOrHidePassword)}
              >
                {isShowOrHidePassword ? <RiEyeCloseLine /> : <IoEye />}
              </ShowOrHidePasswordButton>
            </ColumnFlexbox>
            <LoginButton onClick={nativeSignIn} disabled={authing}>
              <FaUser />
              <LGText>會員登入</LGText>
            </LoginButton>
            <RowFlexbox>
              <SMGreyText>還沒有帳號嗎？</SMGreyText>
              <SignUpButton onClick={() => setIsSignInState(false)}>
                註冊
              </SignUpButton>
            </RowFlexbox>
          </LoginAndSignUpCard>
        ) : (
          <LoginAndSignUpCard>
            <XXLText style={{ marginBottom: '10px' }}>SignUp</XXLText>
            <ColumnFlexbox gap="8px" tabletGap="6px">
              <SMText>Email</SMText>
              <InputField
                type="text"
                defaultValue="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="請輸入電子郵件"
                required
                name="email"
              />
            </ColumnFlexbox>
            <ColumnFlexbox
              gap="8px"
              tabletGap="6px"
              style={{ position: 'relative' }}
            >
              <SMText>密碼</SMText>
              <InputField
                type={isShowOrHidePassword ? 'password' : 'text'}
                defaultValue="1234567"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
                required
                name="password"
              />
              <ShowOrHidePasswordButton
                onClick={() => setIsShowOrHidePassword(!isShowOrHidePassword)}
              >
                {isShowOrHidePassword ? <RiEyeCloseLine /> : <IoEye />}
              </ShowOrHidePasswordButton>
            </ColumnFlexbox>
            <LoginButton onClick={SignUp}>
              <FaUser />
              <LGText>註冊會員</LGText>
            </LoginButton>
            <RowFlexbox>
              <SMGreyText>已經有帳號了嗎？</SMGreyText>
              <SignUpButton onClick={() => setIsSignInState(true)}>
                登入
              </SignUpButton>
            </RowFlexbox>
          </LoginAndSignUpCard>
        )}
      </LoginPageWrapper>
    );
  } else {
    navigate('/');
    return <></>;
  }
}
