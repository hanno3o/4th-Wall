import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { setUserInfo } from '../redux/reducers/authSlice';

export interface AuthRouteProps {
  children?: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<AuthRouteProps> = (props) => {
  const { children } = props;
  const auth = getAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const AuthCheck = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as {
            id: string | null;
            avatar: string | null;
            email: string | null;
            userName: string | null;
            registrationDate: number;
            dramaList: string[];
          };
          dispatch(setUserInfo(userData));
        } else {
          const userData = {
            id: user.uid,
            email: user.email,
            userName: user.displayName,
            avatar: user.photoURL,
            registrationDate: Date.now(),
            dramaList: []
          };
          await setDoc(userRef, userData);
          dispatch(setUserInfo(userData));
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
