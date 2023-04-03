import styled from 'styled-components';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 160px;
  justify-content: center;
  align-items: center;
`;

const LogButton = styled.button`
  margin-top: 24px;
  width: 100%;
  height: 40px;
  font-size: 16px;
  color: #3f3a3a;
  font-weight: 500;
  background: #ececec;
  border-radius: 5px;
  cursor: pointer;
`;

const GoogleButton = styled(LogButton)`
  border: solid 1px #b0b0b0;
  background: transparent;
`;

const FbButton = styled(LogButton)`
  background-color: #3b5998;
  color: #fff;
`;

const LoginWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  border-radius: 5px;

  border: solid 1px #979797;
  padding: 40px 30px;
  margin-top: -70px;
`;

const SectionTitle = styled.h1`
  font-weight: 700;
  font-size: 24px;
  color: ${(props) => props.theme.textColor};
  margin-bottom: 32px;
`;

const Form = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const Input = styled.input`
  height: 40px;
  width: 576px;
  border-radius: 5px;
  border: 1px solid #979797;
  padding-left: 12px;
  font-size: 14px;
  line-height: 32px;
  color: #3f3a3a;
  ::placeholder {
    color: #d3d3d3;
  }
`;

const HaveAccountAlready = styled.a`
  margin-top: 20px;
  display: flex;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
`;

const Text = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  margin-bottom: 5px;
`;

function Login() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [authing, setAuthing] = useState(false);
  const signInWithGoogle = async () => {
    setAuthing(true);
  };
  signInWithPopup(auth, new GoogleAuthProvider())
    .then((res) => {
      console.log(res.user.uid);
      navigate('/');
    })
    .catch((err) => {
      console.log(err);
      setAuthing(false);
    });
  return (
    <Wrapper>
      <LoginWrap>
        <SectionTitle>Log in</SectionTitle>
        <Text>Email</Text>
        <Form>
          <Input type="text" required name="email" />
        </Form>
        <Text>密碼</Text>
        <Form>
          <Input type="password" required name="password" />
        </Form>
        <LogButton>登入</LogButton>
        <GoogleButton onClick={() => signInWithGoogle()} disabled={authing}>
          以 Google 登入
        </GoogleButton>
        <FbButton>以 Facebook 登入</FbButton>
        <HaveAccountAlready>還沒有帳號嗎？</HaveAccountAlready>
      </LoginWrap>
    </Wrapper>
  );
}

export default Login;
