import styled from 'styled-components';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { BsGoogle } from 'react-icons/bs';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import { XXLText, SMText, SMGreyText, LGText } from '../../style/Text';
import Swal from 'sweetalert2';

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

const LoginCard = styled.div`
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

const Input = styled.input`
  height: 40px;
  border-radius: 20px;
  padding-left: 12px;
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

function Login() {
  const backgroundImageURL =
    'https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Floginbackground_compressed.png?alt=media&token=478a71e3-3273-4e15-9e3b-1fd1de188460';
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);
  const signInWithGoogle = async () => {
    setAuthing(true);
    signInWithPopup(auth, new GoogleAuthProvider())
      .then((res) => {
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
          title: '登入成功！',
          iconColor: '#bbb',
          confirmButtonColor: '#555',
        });
      })
      .catch((err) => {
        console.log(err);
        setAuthing(false);
      });
  };

  return (
    <LoginPageWrapper
      style={{
        backgroundImage: `linear-gradient(to top, rgb(0, 0, 0), rgb(255, 255, 255, 0) 100%), url(${backgroundImageURL})`,
      }}
    >
      <LoginCard>
        <XXLText style={{ marginBottom: '10px' }}>Login</XXLText>
        <GoogleButton onClick={() => signInWithGoogle()} disabled={authing}>
          <BsGoogle />
          <LGText>Google登入</LGText>
        </GoogleButton>
        <RowFlexbox alignItems="center" justifyContent="space-between">
          <DividerLine style={{ width: '45%' }} />
          <SMText>or</SMText>
          <DividerLine style={{ width: '45%' }} />
        </RowFlexbox>
        <ColumnFlexbox gap="8px" tabletGap="6px">
          <SMText>Email</SMText>
          <Input type="text" required name="email" />
        </ColumnFlexbox>
        <ColumnFlexbox gap="8px" tabletGap="6px">
          <SMText>密碼</SMText>
          <Input type="password" required name="password" />
        </ColumnFlexbox>
        <LoginButton>
          <FaUser style={{ fontSize: '16px' }} />
          <LGText>會員登入</LGText>
        </LoginButton>
        <RowFlexbox>
          <SMGreyText>還沒有帳號嗎？</SMGreyText>
          <SignUpButton>註冊</SignUpButton>
        </RowFlexbox>
      </LoginCard>
    </LoginPageWrapper>
  );
}

export default Login;
