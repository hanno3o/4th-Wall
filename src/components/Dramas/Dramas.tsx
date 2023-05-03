import styled, { keyframes } from 'styled-components';
import { db } from '../../config/firebase.config';
import {
  collection,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  addToDramaList,
  removeFromDramaList,
} from '../../redux/reducers/userSlice';
import { Link } from 'react-router-dom';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { IoChevronBackCircle } from 'react-icons/io5';
import { HiOutlineChat } from 'react-icons/hi';
import { RiPushpinLine } from 'react-icons/ri';
import { MdOutlineRemoveCircle } from 'react-icons/md';
import {
  XLText,
  LGText,
  MDText,
  SMText,
  XSText,
  LGGreyText,
  MDGreyText,
  SMGreyText,
  XSGreyText,
} from '../../style/Text';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import { DramaCardsWrapper, DramaCard } from '../../style/DramaCard';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.black};
  opacity: 0.8;
`;

const DividerLine = styled.div`
  margin: 0 auto;
  border-bottom: solid 1px ${(props) => props.theme.grey};
`;

const fade = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
`;

const DramaCardSkeleton = styled(DramaCard)`
  background-color: ${(props) => props.theme.grey};
  animation: ${fade} 1s linear infinite;
`;

const DramaInfo = styled.div`
  background: ${(props) => props.theme.black};
  border: ${(props) => props.theme.grey} 1px solid;
  position: fixed;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  padding: 60px 40px;
  display: flex;
  z-index: 1;

  ${MEDIA_QUERY_TABLET} {
    width: 67.5vw;
    height: 760px;
    padding: 30px 20px;
  }

  ${MEDIA_QUERY_MOBILE} {
    width: 100vw;
    height: 720px;
  }
`;

const DramaInfoImage = styled.img`
  object-fit: cover;
  width: 280px;
  height: 400px;
  border-radius: 20px;

  ${MEDIA_QUERY_TABLET} {
    width: 224px;
    height: 320px;
  }
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;

  ${MEDIA_QUERY_TABLET} {
    width: 40px;
    height: 40px;
  }
`;

const SpotifyIframe = styled.iframe`
  border-radius: 20px;
  margin-top: 8px;
  width: 280px;
  height: 372px;
  ${MEDIA_QUERY_TABLET} {
    height: ${372 * 0.95}px;
    width: ${280 * 0.8}px;
    margin-top: 4px;
  }
`;

const HandleListButton = styled.button`
  font-size: 14px;
  color: ${(props) => props.theme.white};
  border: solid 1px ${(props) => props.theme.grey};
  padding: 6px 10px;
  margin-top: 10px;
  width: 200px;
  font-weight: 700;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.25);
  transition: ease-in-out 0.2s;
  ${MEDIA_QUERY_TABLET} {
    font-size: 12px;
    padding: 6px 8px;
  }
`;

const IconButton = styled.button`
  color: ${(props) => props.theme.lightGrey};
  font-size: 16px;
  border: solid 1px transparent;
  padding: 5px;
  border-radius: 50%;
  &:hover {
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

const CloseButton = styled.button`
  position: absolute;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  top: 20px;
  right: 20px;
  font-weight: 900;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.25s;
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
    width: 26px;
    height: 26px;
  }
`;

const BackButton = styled.button`
  color: ${(props) => props.theme.lightGrey};
  opacity: 0.5;
  position: absolute;
  left: 20px;
  top: 20px;
  font-weight: 900;
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
  &:hover {
    opacity: 1;
    transition: ease-in-out 0.25s;
  }
`;

const RemoveFromListButton = styled.button`
  opacity: 0.5;
  font-size: 32px;
  opacity: 0.2;
  position: absolute;
  top: 10px;
  right: 10px;
  &:hover {
    scale: 1.05;
    opacity: 0.7;
    transition: ease-in-out 0.25s;
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 28px;
  }
`;

const UserRatingStars = styled.button<IUserRating>`
  cursor: ${({ userName }) => (userName ? 'pointer' : 'default')};
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

const ActorLink = styled.div`
  width: 600px;
  display: flex;
  gap: 12px;
  overflow-x: scroll;
  ${MEDIA_QUERY_TABLET} {
    gap: 8px;
  }
`;

const ActorsButton = styled.button`
  border-radius: 20px;
  gap: 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  & span {
    display: none;
  }

  &:hover span {
    display: block;
  }
`;

const ActorInfo = styled.div`
  width: 1102px;
  height: 934px;
  transform: translate(-50%, -50%);
  background: ${(props) => props.theme.black};
  color: ${(props) => props.theme.white};
  position: fixed;
  left: 50vw;
  top: 50vh;
  border-radius: 20px;
  padding: 100px 40px;
  display: block;
  border: ${(props) => props.theme.grey} 1px solid;
  z-index: 1;
  ${MEDIA_QUERY_TABLET} {
    width: 65vw;
    height: 760px;
    padding: 80px 40px;
  }
`;

const PlatformIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  ${MEDIA_QUERY_TABLET} {
    width: 30px;
    height: 30px;
  }
`;

interface IDrama {
  id?: string | undefined;
  title?: string;
  year?: number;
  rating?: number;
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

interface IActor {
  name?: string;
  eng?: string;
  avatar?: string;
  id: string;
  dramas?: string[];
}

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
  userName: string;
}

interface IDramas {
  dramasData: IDrama[];
  isRemoveButton: boolean;
}

function Dramas({ dramasData, isRemoveButton }: IDramas) {
  const dramasRef = collection(db, 'dramas');
  const actorsRef = collection(db, 'actors');
  const [isLoading, setIsLoading] = useState(false);
  const [dramas, setDramas] = useState<IDrama[]>([]);
  const [dramaCard, setDramaCard] = useState<IDrama>();
  const prevDramaCardRef = useRef<IDrama | undefined>();
  const [actorAppearedDramas, setActorAppearedDramas] = useState<IDrama[]>([]);
  const [actors, setActors] = useState<IActor[] | undefined>(undefined);
  const [actorCard, setActorCard] = useState<IActor>();
  const [userReview, setUserReview] = useState<IReview | undefined>(undefined);
  const [allReviews, setAllReviews] = useState<IReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<IReview[]>([]);
  const [writtenReview, setWrittenReview] = useState<string | undefined>();
  const [userRating, setUserRating] = useState(0);
  const [editing, setEditing] = useState(false);
  const [updatedUserReview, setUpdatedUserReview] = useState('');
  const userName = useAppSelector((state) => state.user.userName);
  const userId = useAppSelector((state) => state.user.id);
  const dramaList = useAppSelector((state) => state.user.dramaList);
  const dispatch = useAppDispatch();
  const dramaId = dramaCard?.id;
  const currentDate = new Date();
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const getReviews = async () => {
    if (dramaId) {
      const reviewsRef = collection(db, 'dramas', dramaId, 'reviews');
      const reviewsSnapshot = await getDocs(reviewsRef);
      const reviewsArr: any = [];
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

  const getDramasAndActors = async () => {
    const dramasSnapshot = await getDocs(dramasRef);
    setDramas(
      dramasSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
    setTimeout(() => {
      setIsLoading(true);
    }, 300);
    const actorsQuery = await query(
      actorsRef,
      where('dramas', 'array-contains', dramaId)
    );
    const actorsQuerySnapshot = await getDocs(actorsQuery);
    const actors = actorsQuerySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setActors(actors);
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

  useEffect(() => {
    getDramasAndActors();
    getReviews();
  }, [dramaCard]);

  useEffect(() => {
    getAverageRatings();
  }, [filteredReviews]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDramaCard = (drama: IDrama) => {
    prevDramaCardRef.current = drama;
    setDramaCard(drama);
  };

  const handleAlert = () => {
    alert('要先登入才能加入喜愛的戲劇到自己的片單喔！');
  };

  const handleAddToDramaList = async () => {
    if (dramaCard?.id && userId) {
      dispatch(addToDramaList(dramaCard?.id));
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { dramaList: dramaList });
    }
  };

  const handleRemoveFromList = (dramaIdToRemove: string) => {
    dispatch(removeFromDramaList(dramaIdToRemove));
    return () => {};
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

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
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

  const handleActorCard = (actor: IActor) => {
    if (actor.dramas) {
      setActorCard(actor);
      const otherDramasIds = actor.dramas.filter(
        (dramaID) => dramaID !== dramaId
      );
      const otherDramas = dramas.filter(
        (drama) => drama.id && otherDramasIds.includes(drama.id)
      );
      setActorAppearedDramas(otherDramas);
    }
  };

  return (
    <>
      <DramaCardsWrapper>
        {isLoading
          ? dramasData.slice(0, end).map((drama, index) => {
              return (
                <DramaCard
                  onClick={() => handleDramaCard(drama)}
                  key={index}
                  style={{
                    backgroundImage: `linear-gradient(to top, #000, rgb(255, 255, 255, 0) 60%), url(${drama.image})`,
                    backgroundPosition: 'center top',
                  }}
                >
                  <LGText>{drama.title}</LGText>
                  <SMGreyText>{drama.eng}</SMGreyText>
                  <RowFlexbox gap="4px" alignItems="center">
                    <SMText>{drama.year}</SMText>
                    <SMText>{drama.type}</SMText>
                    <SMText>{drama.genre}</SMText>
                  </RowFlexbox>
                  <RowFlexbox>
                    {drama.rating && drama.rating > 0 ? (
                      <RowFlexbox alignItems="flex-end">
                        <LGText>{drama?.rating}</LGText>
                        <SMText margin="0 0 1px 0">/5</SMText>
                      </RowFlexbox>
                    ) : (
                      <SMText>目前尚無評價</SMText>
                    )}
                  </RowFlexbox>
                  {isRemoveButton && (
                    <RemoveFromListButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (drama.id) {
                          alert(`確定要從片單中移除 ${drama.title} 嗎？`);
                          handleRemoveFromList(drama.id);
                        }
                      }}
                    >
                      <MdOutlineRemoveCircle />
                    </RemoveFromListButton>
                  )}
                </DramaCard>
              );
            })
          : dramasData.map(() => <DramaCardSkeleton />)}
        {(dramaCard || actorCard) && (
          <Overlay
            onClick={() => {
              setDramaCard(undefined);
              setActorCard(undefined);
              setWrittenReview(undefined);
              setUserRating(0);
              setWrittenReview('');
              setEditing(false);
            }}
          />
        )}
        <DramaInfo style={{ display: dramaCard ? 'block' : 'none' }}>
          {isLoading && (
            <RowFlexbox gap="20px">
              <ColumnFlexbox gap="20px">
                {userReview ? null : (
                  <ColumnFlexbox gap="10px" padding="10px 0 0 0">
                    <RowFlexbox justifyContent="center">
                      {[...Array(5)].map((_, index) => {
                        index += 1;
                        return (
                          <UserRatingStars
                            key={index}
                            className={index <= userRating ? 'on' : 'off'}
                            isFilled={index <= userRating}
                            userName={userName || ''}
                            onMouseOver={() => userName && setUserRating(index)}
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
                      disabled={!userName}
                      maxLength={50}
                      placeholder={
                        userName
                          ? `留下對 ${dramaCard?.title} 的評論`
                          : '要先登入才能使用評論功能喔！'
                      }
                      defaultValue={writtenReview}
                      onChange={(e) => setWrittenReview(e.target.value)}
                      onKeyPress={(e) => {
                        if (userRating) {
                          if (e.key === 'Enter') {
                            handleUploadReview();
                          }
                        } else {
                          alert('要先選擇星星數才能送出評論喔～');
                        }
                      }}
                    />
                    <RowFlexbox gap="4px" justifyContent="center">
                      <TextButton
                        onClick={() => {
                          setUserRating(0);
                          setWrittenReview('');
                        }}
                      >
                        取消
                      </TextButton>
                      <TextButton
                        onClick={() => {
                          if (userRating) {
                            handleUploadReview();
                          } else {
                            userName && alert('要先選擇星星數才能送出評論喔～');
                          }
                        }}
                      >
                        送出
                      </TextButton>
                    </RowFlexbox>
                  </ColumnFlexbox>
                )}
                <ColumnFlexbox width="300px" tabletWidth="280px">
                  <MDText style={{ paddingLeft: '10px' }}>評論</MDText>
                  {!allReviews.length && (
                    <ColumnFlexbox margin="14px 0 0 10px">
                      <MDGreyText style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        \ 歡迎留下第一則評論 દ ᵕ̈ ૩ /
                      </MDGreyText>
                    </ColumnFlexbox>
                  )}
                  <ColumnFlexbox
                    style={{ overflowY: 'scroll' }}
                    height={userReview ? '775px' : '635px'}
                    tabletHeight={userReview ? '675px' : '560px'}
                  >
                    {userReview && (
                      <RowFlexbox gap="10px" padding="14px 10px">
                        <Avatar src={userReview?.avatar} alt="" />
                        <ColumnFlexbox>
                          <RowFlexbox gap="6px">
                            <XSGreyText>
                              {userReview.date
                                ? new Date(userReview.date).getFullYear() !==
                                  currentDate.getFullYear()
                                  ? new Date(
                                      userReview.date
                                    ).toLocaleDateString()
                                  : new Date(
                                      userReview.date
                                    ).toLocaleDateString(undefined, {
                                      month: 'numeric',
                                      day: 'numeric',
                                    })
                                : null}
                            </XSGreyText>
                            {editing ? (
                              <RowFlexbox>
                                {[...Array(5)].map((_, index) => {
                                  index += 1;
                                  return (
                                    <UserRatingStars
                                      key={index}
                                      className={
                                        index <= userRating ? 'on' : 'off'
                                      }
                                      isFilled={index <= userRating}
                                      onMouseOver={() => setUserRating(index)}
                                      userName={userName || ''}
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
                                        <FaRegStar
                                          style={{ fontSize: '14px' }}
                                        />
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
                                onChange={(e) =>
                                  setUpdatedUserReview(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    if (userRating) {
                                      handleSaveReview();
                                    } else {
                                      alert('要先選擇星星數才能送出評論喔～');
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
                                handleRemoveReview();
                                setUpdatedUserReview('');
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
                          return (
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                          );
                        } else {
                          return 0;
                        }
                      })
                      .map((review) => {
                        return (
                          <ColumnFlexbox>
                            <RowFlexbox padding="18px 10px" gap="8px">
                              <Avatar src={review.avatar} alt="" />
                              <ColumnFlexbox gap="4px">
                                <XSText>{review.userName}</XSText>
                                <RowFlexbox alignItems="center" gap="4px">
                                  <XSGreyText>
                                    {review.date
                                      ? new Date(review.date).getFullYear() !==
                                        currentDate.getFullYear()
                                        ? new Date(
                                            review.date
                                          ).toLocaleDateString()
                                        : new Date(
                                            review.date
                                          ).toLocaleDateString(undefined, {
                                            month: 'numeric',
                                            day: 'numeric',
                                          })
                                      : null}
                                  </XSGreyText>
                                  {review.rating && (
                                    <RowFlexbox>
                                      {Array.from(
                                        { length: review.rating },
                                        (_, index) => (
                                          <span key={index}>
                                            <FaStar
                                              style={{ fontSize: '14px' }}
                                            />
                                          </span>
                                        )
                                      )}
                                      {Array.from(
                                        { length: 5 - review.rating },
                                        (_, index) => (
                                          <span key={review.rating! + index}>
                                            <FaRegStar
                                              style={{ fontSize: '14px' }}
                                            />
                                          </span>
                                        )
                                      )}
                                    </RowFlexbox>
                                  )}
                                </RowFlexbox>
                                <XSText
                                  LineHeight="20px"
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
              <ColumnFlexbox gap="20px" tabletGap="14px">
                <RowFlexbox gap="20px">
                  <DramaInfoImage src={dramaCard?.image} alt="" />
                  <ColumnFlexbox justifyContent="space-between">
                    <XLText>{dramaCard?.title}</XLText>
                    <SMGreyText>{dramaCard?.eng}</SMGreyText>
                    <SMText>
                      {dramaCard?.year} | {dramaCard?.type} | {dramaCard?.genre}
                    </SMText>
                    <SMText>全 {dramaCard?.episodes} 集</SMText>
                    <Link
                      to={`/forum/${dramaCard?.engType}?keyword=${dramaCard?.title}`}
                      style={{ textAlign: 'left', width: '22px' }}
                    >
                      <HiOutlineChat style={{ fontSize: '22px' }} />
                    </Link>
                    {allReviews.length > 0 ? (
                      <ColumnFlexbox gap="4px">
                        <LGText>{dramaCard?.rating}/5</LGText>
                        <XSGreyText margin="0 0 12px 0">
                          已有 {allReviews.length} 人留下評價
                        </XSGreyText>
                      </ColumnFlexbox>
                    ) : (
                      <SMGreyText margin="0 0 28px 0">目前尚無評價</SMGreyText>
                    )}
                    <ColumnFlexbox gap="12px" textAlign="left" tabletGap="8px">
                      <ColumnFlexbox gap="4px">
                        <XSText>編劇</XSText>
                        <SMText>{dramaCard?.screenwriter}</SMText>
                      </ColumnFlexbox>
                      <ColumnFlexbox gap="4px">
                        <XSText>導演</XSText>
                        <SMText>{dramaCard?.director}</SMText>
                      </ColumnFlexbox>
                      <ColumnFlexbox gap="4px">
                        <XSText>演員</XSText>
                        <ActorLink>
                          {actors &&
                            actors.map((actor) => (
                              <ActorsButton
                                onClick={() => {
                                  handleActorCard(actor);
                                  setDramaCard(undefined);
                                  setUserRating(0);
                                  setEditing(false);
                                }}
                              >
                                <Avatar src={actor.avatar} alt="" />
                                <span>
                                  <ColumnFlexbox textAlign="left">
                                    <SMText>{actor.name}</SMText>
                                    <XSGreyText>{actor.eng}</XSGreyText>
                                  </ColumnFlexbox>
                                </span>
                              </ActorsButton>
                            ))}
                        </ActorLink>
                      </ColumnFlexbox>
                    </ColumnFlexbox>
                    <HandleListButton
                      onClick={() => {
                        if (
                          dramaList &&
                          dramaId &&
                          dramaList.includes(dramaId)
                        ) {
                          handleRemoveFromList(dramaId);
                        } else if (userName) {
                          handleAddToDramaList();
                        } else {
                          handleAlert();
                        }
                      }}
                      style={{
                        color:
                          dramaList && dramaId && dramaList.includes(dramaId)
                            ? '#2a2a2a'
                            : '#fff',
                        backgroundColor:
                          dramaList && dramaId && dramaList.includes(dramaId)
                            ? '#fff'
                            : '#2a2a2a',
                      }}
                    >
                      {dramaList && dramaId && dramaList.includes(dramaId)
                        ? '✓ 已加入片單'
                        : '＋ 加入片單'}
                    </HandleListButton>
                    <CloseButton
                      onClick={() => {
                        setDramaCard(undefined);
                        setWrittenReview('');
                        setUserRating(0);
                        setEditing(false);
                      }}
                    >
                      ✕
                    </CloseButton>
                  </ColumnFlexbox>
                </RowFlexbox>
                <RowFlexbox gap="20px">
                  <ColumnFlexbox justifyContent="space-between">
                    <XSText>原聲帶</XSText>
                    <SpotifyIframe
                      title="Spotify"
                      src={dramaCard?.spotify}
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </ColumnFlexbox>
                  <ColumnFlexbox
                    justifyContent="space-between"
                    width="400px"
                    tabletWidth="385px"
                  >
                    <ColumnFlexbox gap="6px" tabletGap="4px">
                      <XSText>劇情大綱</XSText>
                      <XSGreyText>{dramaCard?.story}</XSGreyText>
                    </ColumnFlexbox>

                    <ColumnFlexbox gap="6px" tabletGap="4px">
                      <XSText>上架日期</XSText>
                      <SMText>{dramaCard?.releaseDate}</SMText>
                    </ColumnFlexbox>
                    <RowFlexbox gap="6px" tabletGap="4px">
                      {dramaCard?.platform &&
                        dramaCard.platform.map((platform) => {
                          if (platform.includes('Netflix')) {
                            return (
                              <PlatformIcon
                                src="https://cdn.vox-cdn.com/thumbor/sW5h16et1R3au8ZLVjkcAbcXNi8=/0x0:3151x2048/2000x1333/filters:focal(1575x1024:1576x1025)/cdn.vox-cdn.com/uploads/chorus_asset/file/15844974/netflixlogo.0.0.1466448626.png"
                                alt=""
                              />
                            );
                          } else if (platform.includes('Disney+')) {
                            return (
                              <PlatformIcon
                                src="https://resize.indiatvnews.com/en/resize/newbucket/1200_-/2019/04/disney-plus-1555068793.jpg"
                                alt=""
                              />
                            );
                          } else if (platform.includes('LINE TV')) {
                            return (
                              <PlatformIcon
                                src="https://vos.line-scdn.net/strapi-cluster-instance-bucket-84/1_efe99e669c.jpeg"
                                alt=""
                              />
                            );
                          } else if (platform.includes('愛奇藝')) {
                            return (
                              <PlatformIcon
                                src="https://m.media-amazon.com/images/I/31doO2MnBGL.png"
                                alt=""
                              />
                            );
                          } else if (platform.includes('Friday影音')) {
                            return (
                              <PlatformIcon
                                src="https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Ffriday%E5%BD%B1%E9%9F%B3.png?alt=media&token=250d543c-3b82-49fe-b56f-17571de8bf82"
                                alt=""
                              />
                            );
                          } else if (platform === 'KKTV') {
                            return (
                              <PlatformIcon
                                src="https://play-lh.googleusercontent.com/AguMKDjtbikobVooTJsD7MbAdGYZVs1UbZcvjWql4Vo_3EchgOEn9qV1ltxx0ymVEw"
                                alt=""
                              />
                            );
                          }
                        })}
                    </RowFlexbox>
                    <ColumnFlexbox gap="6px" tabletGap="6px">
                      <XSText>相關影片</XSText>
                      <RowFlexbox
                        gap="8px"
                        style={{
                          overflowX: 'scroll',
                        }}
                      >
                        {dramaCard &&
                          dramaCard.relatedVideos &&
                          dramaCard.relatedVideos.map((video, index) => (
                            <iframe
                              key={index}
                              style={{
                                borderRadius: '20px',
                              }}
                              width="100%"
                              height="195"
                              src={video}
                              title="YouTube video player"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          ))}
                      </RowFlexbox>
                    </ColumnFlexbox>
                  </ColumnFlexbox>
                </RowFlexbox>
              </ColumnFlexbox>
            </RowFlexbox>
          )}
        </DramaInfo>
        <ActorInfo style={{ display: actorCard ? 'block' : 'none' }}>
          {actorCard && actorAppearedDramas ? (
            actorAppearedDramas.length > 0 ? (
              <ColumnFlexbox gap="16px">
                <RowFlexbox
                  alignItems="flex-end"
                  gap="4px"
                  margin="-15px 0 0 0"
                >
                  <LGText>{actorCard.name}</LGText>
                  <MDText>還有出演過這些戲劇</MDText>
                </RowFlexbox>
                <RowFlexbox gap="16px">
                  {actorAppearedDramas?.map((drama, index) => (
                    <DramaCard
                      onClick={() => {
                        handleDramaCard(drama);
                        setActorCard(undefined);
                      }}
                      key={index}
                      style={{
                        backgroundImage: `linear-gradient(to top, #000, rgb(255, 255, 255, 0) 60%), url(${drama.image})`,
                        backgroundPosition: 'center top',
                      }}
                    >
                      <LGText>{drama.title}</LGText>
                      <SMGreyText>{drama.eng}</SMGreyText>
                      <RowFlexbox alignItems="center" gap="4px">
                        <SMText>{drama.year} |</SMText>
                        <SMText>{drama.type} |</SMText>
                        <SMText>{drama.genre}</SMText>
                      </RowFlexbox>
                      {drama.rating && drama.rating > 0 ? (
                        <RowFlexbox alignItems="flex-end">
                          <LGText>{drama?.rating}</LGText>
                          <SMText margin="0 0 1px 0">/5</SMText>
                        </RowFlexbox>
                      ) : (
                        <SMText>目前尚無評價</SMText>
                      )}
                    </DramaCard>
                  ))}
                </RowFlexbox>
              </ColumnFlexbox>
            ) : (
              <ColumnFlexbox>
                <RowFlexbox alignItems="flex-end" gap="4px">
                  <LGGreyText>
                    很抱歉，目前沒有 {actorCard.name} 出演過的其他戲劇資料：（
                  </LGGreyText>
                </RowFlexbox>
              </ColumnFlexbox>
            )
          ) : null}
          <BackButton
            onClick={() => {
              setDramaCard(prevDramaCardRef.current);
              setActorCard(undefined);
            }}
          >
            <IoChevronBackCircle style={{ fontSize: '24px' }} />
          </BackButton>
          <CloseButton
            onClick={() => {
              setActorCard(undefined);
            }}
          >
            ✕
          </CloseButton>
        </ActorInfo>
      </DramaCardsWrapper>
    </>
  );
}

export default Dramas;
