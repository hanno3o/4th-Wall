import styled from 'styled-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setUserInfo } from '../../redux/reducers/userSlice';
import { FaUser } from 'react-icons/fa';
import { HiOutlineCog8Tooth } from 'react-icons/hi2';
import { VscSignOut } from 'react-icons/vsc';
import { BsWechat } from 'react-icons/bs';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  padding: 0 30px 0 10px;
  position: fixed;
  width: 100%;
  z-index: 1;
  backdrop-filter: blur(3px);
  background-color: rgba(0, 0, 0, 0.5);
`;

const NavBar = styled.nav`
  display: flex;
  gap: 18px;
  align-items: center;
  ${MEDIA_QUERY_TABLET} {
    gap: 14px;
  }
`;

const LogoImage = styled.img`
  width: 180px;
  filter: brightness(0.9);
  &:hover {
    filter: brightness(1.01);
    scale: 1.02;
    transition: ease-in-out 0.5s;
  }
`;

const NavIconButton = styled.button`
  font-size: 32px;
  filter: brightness(0.9);
  &:hover {
    filter: brightness(1.05);
    scale: 1.1;
    transition: ease-in-out 0.25s;
  }

  ${MEDIA_QUERY_TABLET} {
    font-size: 24px;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  &:hover {
    box-shadow: 0 0 0 5px ${(props) => props.theme.darkBlack},
      0 0 0 6px rgba(255, 255, 255, 0.25);
    transition: ease-in-out 0.5s;
  }

  ${MEDIA_QUERY_TABLET} {
    width: 36px;
    height: 36px;
  }
`;

const MoreButton = styled.div`
  cursor: pointer;
  font-size: 20px;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 50%;
  padding: 0 5px 10px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.5s;
  }
`;

const SettingOptions = styled.div`
  cursor: pointer;
  width: 80px;
  flex-direction: column;
  font-size: 14px;
  background-color: ${(props) => props.theme.white};
  border: solid 1px ${(props) => props.theme.lightGrey};
  border-radius: 5px;
  position: absolute;
  top: 50px;
  right: 30px;
  color: ${(props) => props.theme.grey};
`;

const SettingOption = styled.button`
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  height: 42px;
  line-height: 42px;
  z-index: 2;

  &:hover {
    background-color: #e8e8e8;
  }
`;

function Header() {
  const auth = getAuth();
  const userName = useAppSelector((state) => state.user.userName);
  const avatar = useAppSelector((state) => state.user.avatar);
  const dispatch = useAppDispatch();
  const [settingsMenu, setSettingsMenu] = useState(false);

  return (
    <HeaderWrapper>
      <Link to="/home">
        <LogoImage
          src="https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Flogo.png?alt=media&token=c662b230-56af-4667-a245-0dd57d2f7ad5"
          alt=""
        />
      </Link>
      <NavBar>
        <Link to="/forum/TaiwanDrama">
          <NavIconButton>
            <BsWechat />
          </NavIconButton>
        </Link>
        {avatar && (
          <Link to="/profile">
            <Avatar src={avatar} alt="" />
          </Link>
        )}
        {userName ? (
          <>
            <MoreButton onClick={() => setSettingsMenu((prev) => !prev)}>
              ...
            </MoreButton>
            <SettingOptions
              style={{
                display: settingsMenu ? 'flex' : 'none',
              }}
            >
              <SettingOption>
                <HiOutlineCog8Tooth
                  style={{
                    fontSize: '18px',
                    color: '#bbb',
                  }}
                />
                設定
              </SettingOption>
              <SettingOption
                onClick={() => {
                  setSettingsMenu((prev) => !prev);
                  signOut(auth);
                  dispatch(
                    setUserInfo({
                      id: null,
                      avatar: null,
                      email: null,
                      userName: null,
                      registrationDate: null,
                      dramaList: null,
                    })
                  );
                }}
              >
                <VscSignOut
                  style={{
                    fontSize: '18px',
                    color: '#bbb',
                  }}
                />
                登出
              </SettingOption>
            </SettingOptions>
          </>
        ) : (
          <Link to="/login">
            <NavIconButton>
              <FaUser style={{ fontSize: '24px' }} />
            </NavIconButton>
          </Link>
        )}
      </NavBar>
    </HeaderWrapper>
  );
}

export default Header;
