import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-black text-white flex justify-between items-center h-20 px-10">
      <Link to="/home" className="font-bold">
        4ᴛʜ ᴡᴀʟʟ¨̮
      </Link>
      <div className="p-2 flex gap-4">
        <Link to="/forum">Forum</Link>
        <Link to="/profile">profile</Link>
      </div>
    </header>
  );
}

export default Header;
