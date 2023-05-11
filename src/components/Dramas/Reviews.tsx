import styled from 'styled-components';
import { db } from '../../config/firebase.config';
import {
  collection,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { RiPushpinLine } from 'react-icons/ri';
import { MDText, XSText, MDGreyText, XSGreyText } from '../../style/Text';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import Swal from 'sweetalert2';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;

  ${MEDIA_QUERY_TABLET} {
    width: 45px;
    height: 45px;
  }
`;
const DividerLine = styled.div`
  margin: 0 auto;
  border-bottom: solid 1px ${(props) => props.theme.grey};
`;

const IconButton = styled.button`
  color: ${(props) => props.theme.lightGrey};
  font-size: 16px;
  border: solid 1px transparent;
  padding: 5px;
  border-radius: 50%;
  &:not([disabled]):hover {
    background-color: rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.5s;
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
`;

const TextButton = styled(IconButton)`
  font-size: 14px;
  border-radius: 20px;
  ${MEDIA_QUERY_TABLET} {
    padding: 2px 6px;
  }
`;

const UserRatingStars = styled.button<IUserRating>`
  cursor: ${({ email }) => (email ? 'pointer' : 'default')};
  display: flex;
  gap: 4px;
  color: ${({ isFilled }) => (isFilled ? '#fff' : '#555')};
  background-color: transparent;
  font-size: 18px;
  ${MEDIA_QUERY_TABLET} {
    font-size: 16px;
  }
`;

const ReviewTextArea = styled.textarea`
  resize: none;
  outline: ${(props) => props.theme.grey};
  background-color: ${(props) => props.theme.grey};
  box-shadow: 0 0 0 3px ${(props) => props.theme.grey};
  font-size: 14px;
  font-weight: 500;
  border-radius: 5px;
  padding: 14px;
  height: 60px;
  line-height: 20px;
  &::placeholder {
    color: ${(props) => props.theme.lightGrey};
  }
  ${MEDIA_QUERY_TABLET} {
    height: 42px;
    width: 90%;
    margin: 0 auto;
    padding: 10px;
  }
`;

const ReviewTextEditArea = styled.textarea`
  width: 216px;
  font-weight: 500;
  line-height: 20px;
  resize: none;
  font-size: 14px;
  border-radius: 5px;
  outline: ${(props) => props.theme.grey};
  background-color: ${(props) => props.theme.grey};
  box-shadow: 0 0 0 6px ${(props) => props.theme.grey};
  margin-top: 4px;
  ${MEDIA_QUERY_TABLET} {
    width: 206px;
  }
`;

interface IReview {
  date?: number;
  rating?: number;
  writtenReview?: string;
  id?: string;
  avatar?: string;
  userName?: string;
}

interface IUserRating {
  key: number;
  className: string;
  isFilled: boolean;
  email: string;
}

export let reviewsLength = 0;

function Reviews({
  dramaCardTitle,
  dramaId,
}: {
  dramaCardTitle: string;
  dramaId: string;
}) {
  const userId = useAppSelector((state) => state.user.id);
  const email = useAppSelector((state) => state.user.email);
  const currentDate = new Date();
  const [userReview, setUserReview] = useState<IReview | undefined>(undefined);
  const [allReviews, setAllReviews] = useState<IReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<IReview[]>([]);
  const [writtenReview, setWrittenReview] = useState<string | undefined>();
  const [userRating, setUserRating] = useState(0);
  const [editing, setEditing] = useState(false);
  const [updatedUserReview, setUpdatedUserReview] = useState('');

  useEffect(() => {
    getReviews();
    getAverageRatings();
    setUserRating(0);
    setWrittenReview('');
  }, [dramaId]);

  reviewsLength = allReviews.length;
  const getReviews = async () => {
    if (dramaId) {
      const reviewsRef = collection(db, 'dramas', dramaId, 'reviews');
      const reviewsSnapshot = await getDocs(reviewsRef);
      const reviewsArr = [];
      for (const singleDoc of reviewsSnapshot.docs) {
        const reviewsData = singleDoc.data();
        const userRef = doc(db, 'users', singleDoc.id);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const review = {
          ...reviewsData,
          id: singleDoc.id,
          avatar: userData?.avatar || '',
          userName: userData?.userName || '',
        };
        reviewsArr.push(review);
      }

      const filteredReviewsArr = reviewsArr.filter(
        (review: { id: string | null }) => {
          return review.id !== userId;
        }
      );
      const userReview = reviewsArr.filter((review: { id: string | null }) => {
        return review.id === userId;
      });

      setAllReviews(reviewsArr);
      setFilteredReviews(filteredReviewsArr);
      setUserReview(userReview[0]);
    }
  };

  const getAverageRatings = async () => {
    if (dramaId) {
      const reviewRef = doc(db, 'dramas', dramaId);
      const totalStars = allReviews.reduce((acc, review) => {
        if (review.rating) {
          return acc + review.rating;
        } else {
          return acc;
        }
      }, 0);
      const averageRating =
        allReviews.length > 0 ? (totalStars / allReviews.length).toFixed(1) : 0;
      await updateDoc(reviewRef, { rating: averageRating });
    }
  };

  const handleUploadReview = async () => {
    if (dramaId && userId) {
      await setDoc(doc(db, 'dramas', dramaId, 'reviews', userId), {
        date: Date.now(),
        rating: userRating,
        writtenReview: writtenReview,
      });
      setWrittenReview('');
      setUserRating(0);
      getReviews();
      getAverageRatings();
      setEditing(false);
    }
  };

  const handleEditReview = () => {
    setEditing(true);
  };

  const handleSaveReview = async () => {
    setEditing(false);
    if (dramaId && userId) {
      const reviewRef = doc(db, 'dramas', dramaId, 'reviews', userId);
      await updateDoc(reviewRef, {
        date: Date.now(),
        rating: userRating,
        writtenReview: updatedUserReview,
      });
      getReviews();
    }
  };
  const handleRemoveReview = async () => {
    if (dramaId) {
      try {
        const reviewsRef = collection(db, 'dramas', dramaId, 'reviews');
        const reviewsSnapshot = await getDocs(reviewsRef);
        for (const singleDoc of reviewsSnapshot.docs) {
          const reviewId = singleDoc.id;
          if (reviewId === userId) {
            const reviewDocRef = doc(reviewsRef, reviewId);
            await deleteDoc(reviewDocRef);
            break;
          }
        }
        getReviews();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <ColumnFlexbox height="100%">
      {userReview ? null : (
        <ColumnFlexbox height="20%" gap="10px" padding="10px 0 0 0">
          <RowFlexbox justifyContent="center">
            {[...Array(5)].map((_, index) => {
              index += 1;
              return (
                <UserRatingStars
                  key={index}
                  className={index <= userRating ? 'on' : 'off'}
                  isFilled={index <= userRating}
                  email={email || ''}
                  onMouseOver={() => email && setUserRating(index)}
                  onKeyPress={(e) => {
                    if (userRating) {
                      if (e.key === 'Enter') {
                        handleUploadReview();
                      }
                    }
                  }}
                >
                  <FaStar />
                </UserRatingStars>
              );
            })}
          </RowFlexbox>
          <ReviewTextArea
            disabled={!email}
            maxLength={50}
            placeholder={
              email
                ? `留下對 ${dramaCardTitle} 的評論`
                : '要先登入才能使用評論功能喔！'
            }
            defaultValue={writtenReview}
            value={writtenReview}
            onChange={(e) => setWrittenReview(e.target.value)}
            onKeyPress={(e) => {
              if (userRating) {
                if (e.key === 'Enter') {
                  handleUploadReview();
                }
              } else {
                Swal.fire({
                  width: 350,
                  text: '要先選擇星星數才能送出評論喔！',
                  icon: 'warning',
                  iconColor: '#bbb',
                  confirmButtonColor: '#555',
                });
              }
            }}
          />
          <RowFlexbox gap="4px" justifyContent="center">
            <TextButton
              disabled={!email}
              onClick={() => {
                setUserRating(0);
                setWrittenReview('');
              }}
            >
              取消
            </TextButton>
            <TextButton
              disabled={!email}
              onClick={() => {
                if (userRating) {
                  handleUploadReview();
                } else {
                  Swal.fire({
                    width: 350,
                    text: '要先選擇星星數才能送出評論喔！',
                    icon: 'warning',
                    iconColor: '#bbb',
                    confirmButtonColor: '#555',
                  });
                }
              }}
            >
              送出
            </TextButton>
          </RowFlexbox>
        </ColumnFlexbox>
      )}
      <ColumnFlexbox
        width="300px"
        tabletWidth="280px"
        height={userReview ? '100%' : '80%'}
      >
        <MDText margin="4px 10px" tabletMargin="2px 6px">
          評論
        </MDText>
        {!allReviews.length && (
          <ColumnFlexbox margin="10px 0 0 10px">
            <MDGreyText style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              \ 歡迎留下第一則評論 દ ᵕ̈ ૩ /
            </MDGreyText>
          </ColumnFlexbox>
        )}
        <ColumnFlexbox style={{ overflowY: 'scroll' }}>
          {userReview && (
            <RowFlexbox gap="8px" padding="14px 10px">
              <Avatar src={userReview?.avatar} alt="" />
              <ColumnFlexbox>
                <RowFlexbox gap="6px">
                  <XSGreyText>
                    {userReview.date
                      ? new Date(userReview.date).getFullYear() !==
                        currentDate.getFullYear()
                        ? new Date(userReview.date).toLocaleDateString()
                        : new Date(userReview.date).toLocaleDateString(
                            undefined,
                            {
                              month: 'numeric',
                              day: 'numeric',
                            }
                          )
                      : null}
                  </XSGreyText>
                  {editing ? (
                    <RowFlexbox>
                      {[...Array(5)].map((_, index) => {
                        index += 1;
                        return (
                          <UserRatingStars
                            key={index}
                            className={index <= userRating ? 'on' : 'off'}
                            isFilled={index <= userRating}
                            onMouseOver={() => setUserRating(index)}
                            email={email || ''}
                          >
                            <span>
                              <FaStar style={{ fontSize: '14px' }} />
                            </span>
                          </UserRatingStars>
                        );
                      })}
                    </RowFlexbox>
                  ) : (
                    userReview?.rating && (
                      <RowFlexbox>
                        {Array.from(
                          { length: userReview?.rating },
                          (_, index) => (
                            <span key={index}>
                              <FaStar style={{ fontSize: '14px' }} />
                            </span>
                          )
                        )}
                        {Array.from(
                          { length: 5 - userReview?.rating },
                          (_, index) => (
                            <span key={userReview?.rating! + index}>
                              <FaRegStar style={{ fontSize: '14px' }} />
                            </span>
                          )
                        )}
                      </RowFlexbox>
                    )
                  )}
                  <MDGreyText>
                    <RiPushpinLine />
                  </MDGreyText>
                </RowFlexbox>
                <RowFlexbox margin="6px 0">
                  {editing ? (
                    <ReviewTextEditArea
                      maxLength={50}
                      defaultValue={userReview?.writtenReview}
                      onChange={(e) => setUpdatedUserReview(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (userRating) {
                            handleSaveReview();
                          } else {
                            Swal.fire({
                              width: 350,
                              text: '要先選擇星星數才能送出評論喔！',
                              icon: 'warning',
                              iconColor: '#bbb',
                              confirmButtonColor: '#555',
                            });
                          }
                        }
                      }}
                    />
                  ) : (
                    <XSText
                      LineHeight="20px"
                      style={{ wordBreak: 'break-word' }}
                    >
                      {userReview?.writtenReview}
                    </XSText>
                  )}
                </RowFlexbox>
                <RowFlexbox margin="0 0 0 -6px">
                  <TextButton
                    onClick={
                      editing && userRating
                        ? handleSaveReview
                        : handleEditReview
                    }
                  >
                    {editing ? '儲存' : <AiOutlineEdit />}
                  </TextButton>
                  <IconButton
                    onClick={() => {
                      Swal.fire({
                        text: '確定要刪除這筆評論嗎？',
                        icon: 'warning',
                        width: 300,
                        reverseButtons: true,
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        confirmButtonText: '刪除',
                        iconColor: '#bbb',
                        confirmButtonColor: '#555',
                        cancelButtonColor: '#b0b0b0',
                      }).then((res) => {
                        if (res.isConfirmed) {
                          handleRemoveReview();
                          setUpdatedUserReview('');
                          setUserRating(0);
                          Swal.fire({
                            title: '已刪除評論',
                            icon: 'success',
                            iconColor: '#bbb',
                            width: 300,
                            confirmButtonColor: '#555',
                          });
                        }
                      });
                    }}
                  >
                    <AiOutlineDelete />
                  </IconButton>
                </RowFlexbox>
              </ColumnFlexbox>
            </RowFlexbox>
          )}
          {filteredReviews
            .sort((a, b) => {
              if (a.date && b.date) {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              } else {
                return 0;
              }
            })
            .map((review) => {
              return (
                <ColumnFlexbox
                  style={{
                    flexShrink: '0',
                  }}
                >
                  <RowFlexbox padding="16px 10px" gap="8px">
                    <Avatar src={review.avatar} alt="" />
                    <ColumnFlexbox gap="4px">
                      <XSText>{review.userName}</XSText>
                      <RowFlexbox alignItems="center" gap="4px">
                        <XSGreyText>
                          {review.date
                            ? new Date(review.date).getFullYear() !==
                              currentDate.getFullYear()
                              ? new Date(review.date).toLocaleDateString()
                              : new Date(review.date).toLocaleDateString(
                                  undefined,
                                  {
                                    month: 'numeric',
                                    day: 'numeric',
                                  }
                                )
                            : null}
                        </XSGreyText>
                        {review.rating && (
                          <RowFlexbox>
                            {Array.from(
                              { length: review.rating },
                              (_, index) => (
                                <span key={index}>
                                  <FaStar style={{ fontSize: '14px' }} />
                                </span>
                              )
                            )}
                            {Array.from(
                              { length: 5 - review.rating },
                              (_, index) => (
                                <span key={review.rating! + index}>
                                  <FaRegStar style={{ fontSize: '14px' }} />
                                </span>
                              )
                            )}
                          </RowFlexbox>
                        )}
                      </RowFlexbox>
                      <XSText
                        LineHeight="18px"
                        style={{ wordBreak: 'break-word' }}
                      >
                        {review.writtenReview}
                      </XSText>
                    </ColumnFlexbox>
                  </RowFlexbox>
                  {filteredReviews.length > 1 && (
                    <DividerLine style={{ width: '95%' }} />
                  )}
                </ColumnFlexbox>
              );
            })}
        </ColumnFlexbox>
      </ColumnFlexbox>
    </ColumnFlexbox>
  );
}

export default Reviews;
