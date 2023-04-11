import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setUserInfo } from '../../redux/reducers/authSlice';

function Header() {
  const auth = getAuth();
  const userName = useAppSelector((state) => state.auth.userName);
  const dispatch = useAppDispatch();

  return (
    <header className="bg-black text-white flex justify-between items-center h-20 px-10">
      <Link to="/home" className="font-bold">
        4ᴛʜ ᴡᴀʟʟ¨̮
      </Link>
      <div className="p-2 flex gap-4">
        {userName && <div>Hello, {userName}</div>}
        <Link to="/forum/TaiwanDrama">Forum</Link>
        <Link to="/profile">profile</Link>
        <button
          onClick={() => {
            signOut(auth);
            dispatch(
              setUserInfo({ avatar: null, email: null, userName: null })
            );
          }}
        >
          logout
        </button>
      </div>
    </header>
  );
}

export default Header;
