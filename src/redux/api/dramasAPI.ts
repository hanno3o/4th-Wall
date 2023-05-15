import { db } from '../../config/firebase.config';
import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

export interface IDrama {
  id?: string | undefined;
  title?: string;
  year?: number;
  rating?: string;
  image?: string;
  eng?: string;
  genre?: string;
  platform?: string[];
  type?: string;
  story?: string;
  director?: string;
  screenwriter?: string;
  spotify?: string;
  episodes?: number;
  engType?: string;
  relatedVideos?: string[];
  releaseDate?: string;
}

export interface IDramas {
  dramasData: IDrama[];
  isRemoveButton: boolean;
}

export interface IActor {
  name?: string;
  eng?: string;
  avatar?: string;
  id: string;
  dramas?: string[];
}

export interface IReview {
  date?: number;
  rating?: number;
  writtenReview?: string;
  id?: string;
  avatar?: string;
  userName?: string;
}

export interface IUserRating {
  key: number;
  className: string;
  isFilled: boolean;
  email: string;
}

export interface ReviewsPayload {
  reviewsArr: IReview[];
  otherUserReviewsArr: IReview[];
  userReview: IReview | undefined;
}

const dramasRef = collection(db, 'dramas');
const actorsRef = collection(db, 'actors');

export const getAllDramas = async () => {
  try {
    const allDramasSnapshot = await getDocs(dramasRef);
    const allDramas = allDramasSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return allDramas;
  } catch (error) {
    console.error('Error occurred while fetching all dramas:', error);
    return [];
  }
};

export const getActors = async (dramaID: string) => {
  try {
    const actorsQuery = await query(
      actorsRef,
      where('dramas', 'array-contains', dramaID)
    );
    const actorsQuerySnapshot = await getDocs(actorsQuery);
    const actors = actorsQuerySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return actors;
  } catch (error) {
    console.error('Error occurred while fetching actors:', error);
    return;
  }
};

export const getReviews = async (dramaID: string, userID: string) => {
  try {
    if (dramaID) {
      const reviewsSnapshot = await getDocs(
        collection(db, 'dramas', dramaID, 'reviews')
      );
      const reviewsArr = [];
      for (const reviewDoc of reviewsSnapshot.docs) {
        const reviews = reviewDoc.data();
        const userSnapshot = await getDoc(doc(db, 'users', reviewDoc.id));
        const user = userSnapshot.data();
        const review = {
          ...reviews,
          id: reviewDoc.id,
          avatar: user?.avatar || '',
          userName: user?.userName || '',
        };
        reviewsArr.push(review);
      }

      const otherUserReviewsArr = reviewsArr.filter(
        (review: { id: string | null }) => {
          return review.id !== userID;
        }
      );

      const userReview = reviewsArr.find((review: { id: string | null }) => {
        return review.id === userID;
      });

      calculateAverageRating(dramaID, reviewsArr);

      return { reviewsArr, otherUserReviewsArr, userReview };
    } else {
      throw new Error('Invalid dramaID');
    }
  } catch (error) {
    console.error('Error occurred while fetching reviews:', error);
  }
};

const calculateAverageRating = async (
  dramaID: string,
  reviewsArr: IReview[]
): Promise<string | null> => {
  try {
    if (dramaID) {
      const dramaRef = doc(db, 'dramas', dramaID);
      const totalStars = reviewsArr.reduce((acc, review) => {
        if (review.rating) {
          return acc + Number(review.rating); 
        } else {
          return acc;
        }
      }, 0);
      const averageRating =
        reviewsArr.length > 0 ? (totalStars / reviewsArr.length).toFixed(1) : '0';
      await updateDoc(dramaRef, { rating: averageRating });
      return averageRating;
    }
    return null;
  } catch (error) {
    console.error('Error occurred while calculating average ratings:', error);
    return null;
  }
};


export const handleUploadReview = async (
  dramaID: string,
  userID: string,
  userRating: number,
  writtenReview: string | undefined
) => {
  try {
    if (dramaID && userID) {
      await setDoc(doc(db, 'dramas', dramaID, 'reviews', userID), {
        date: Date.now(),
        rating: userRating,
        writtenReview: writtenReview,
      });
      getReviews(dramaID, userID);
    }
  } catch (error) {
    console.error('Error occurred while uploading the review:', error);
  }
};

export const handleUpdateReview = async (
  dramaID: string,
  userID: string,
  userRating: number,
  updatedUserReview: string | undefined
) => {
  if (dramaID && userID) {
    const reviewRef = doc(db, 'dramas', dramaID, 'reviews', userID);
    try {
      await updateDoc(reviewRef, {
        date: Date.now(),
        rating: userRating,
        writtenReview: updatedUserReview,
      });
    } catch (error) {
      console.error('Error occurred while saving the review:', error);
    }
  }
};

export const handleRemoveReview = async (dramaID: string, userID: string) => {
  if (dramaID) {
    try {
      const reviewsRef = collection(db, 'dramas', dramaID, 'reviews');
      const reviewsSnapshot = await getDocs(reviewsRef);
      for (const reviewDoc of reviewsSnapshot.docs) {
        const reviewID = reviewDoc.id;
        if (reviewID === userID) {
          const reviewDocRef = doc(reviewsRef, reviewID);
          await deleteDoc(reviewDocRef);
          break;
        }
      }
    } catch (error) {
      console.error('Error occurred while removing the review:', error);
    }
  }
};

export const getUserDramaList = async (dramaList: string[]) => {
  try {
    if (dramaList) {
      const dramaListRef = await Promise.all(
        dramaList.map((dramaId) => getDoc(doc(dramasRef, dramaId)))
      );
      const userDramaList = dramaListRef.map((doc) => doc.data());
      return userDramaList;
    }
    return [];
  } catch (error) {
    console.error('Error occurred while fetching user drama list:', error);
    return [];
  }
};
