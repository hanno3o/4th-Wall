import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { useAppDispatch } from '../redux/hooks';
import { SET_USERINFO } from '../redux/reducers/userSlice';

export interface AuthRouteProps {
  children?: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<AuthRouteProps> = (props) => {
  const { children } = props;
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const defaultAvatar = [
    'https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Fdefault_avatar_1.png?alt=media&token=475a94dc-bb66-47a7-a5bc-b82bc48391c8',
    'https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Fdefault_avatar_2.png?alt=media&token=292fb337-c689-48a3-8945-2075e0d26dda',
    'https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Fdefault_avatar_3.png?alt=media&token=b5ac0066-6f9a-4846-ba0a-d7679d7a9a9d',
    'https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Fdefault_avatar_4.png?alt=media&token=cfd64c72-6985-4c26-8c3d-d863c2c8f44d',
  ];

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
          dispatch(SET_USERINFO(userData));
        } else {
          const userData = {
            id: user.uid,
            email: user.email,
            userName:
              user.displayName && user.email
                ? user.displayName
                : user.email
                ? user.email.split('@')[0]
                : '',
            avatar: user.photoURL
              ? user.photoURL
              : defaultAvatar[Math.floor(Math.random() * defaultAvatar.length)],
            registrationDate: Date.now(),
            dramaList: [],
          };
          await setDoc(userRef, userData);
          dispatch(SET_USERINFO(userData));
        }
        setIsLoading(false);
      } else {
        console.log('unauthorized');
      }
    });

    return () => AuthCheck();
  }, [auth]);

  if (isLoading) return <p>loading...</p>;
  return <>{children}</>;
};

export default AuthRoute;
