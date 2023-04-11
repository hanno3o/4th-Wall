import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { useNavigate } from 'react-router-dom';

export interface AuthRouteProps {
  children?: React.ReactNode;
}
interface IUserInfo {
  email?: string | null;
  username?: string | null;
  avatar?: string | null;
}

const AuthRoute: React.FunctionComponent<AuthRouteProps> = (props) => {
  const { children } = props;
  const auth = getAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfo>();

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo(userData);
        } else {
          const userData = {
            email: user.email,
            username: user.displayName,
            avatar: user.photoURL,
          };

          await setDoc(userRef, userData);
          setUserInfo(userData);
        }
        setIsLoading(false);
      } else {
        console.log('unauthorized');
        navigate('/login');
      }
    });

    return () => AuthCheck();
  }, [auth]);

  if (isLoading) return <p>loading...</p>;

  return <>{children}</>;
};

export default AuthRoute;
