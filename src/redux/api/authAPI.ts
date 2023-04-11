import { db } from '../../config/firebase.config';
import { getDoc, doc } from 'firebase/firestore';
export async function fetchUser(id: string) {
  const userRef = doc(db, 'users', id);
  const userSnapshot = await getDoc(userRef);
  return new Promise((resolve) => {
    resolve({ data: userSnapshot.data() });
  });
}
