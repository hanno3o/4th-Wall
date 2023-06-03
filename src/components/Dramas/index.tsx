import styled, { keyframes } from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  ADD_TO_DRAMALIST,
  REMOVE_FROM_DRAMALIST,
} from '../../redux/reducers/userSlice';
import { Link } from 'react-router-dom';
import { IoChevronBackCircle } from 'react-icons/io5';
import { HiOutlineChat } from 'react-icons/hi';
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
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';
import {
  GET_REVIEWS,
  UPLOAD_REVIEW,
  UPDATE_REVIEW,
  REMOVE_REVIEW,
  GET_ACTORS,
} from '../../redux/reducers/dramasSlice';
import {
  ReviewsPayload,
  IReview,
  IDrama,
  IDramas,
  IActor,
  IUserRating,
} from '../../redux/api/dramasAPI';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { RiPushpinLine } from 'react-icons/ri';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;

  ${MEDIA_QUERY_TABLET} {
    width: 45px;
    height: 45px;
  }

  ${MEDIA_QUERY_MOBILE} {
    width: 40px;
    height: 40px;
  }
`;
const DividerLine = styled.div`
  width: 95%;
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
  font-size: 14px;
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
    font-weight: 400;
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 70vw;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.black};
  opacity: 0.8;
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

const Popup = styled.div`
  background: ${(props) => props.theme.black};
  position: fixed;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  border-radius: 20px;
  padding: 60px 40px;
  display: flex;
  z-index: 1;
  height: 950px;
  width: 1100px;

  ${MEDIA_QUERY_TABLET} {
    height: 772px;
    width: 980px;
    padding: 30px 20px;
  }

  ${MEDIA_QUERY_MOBILE} {
    padding: 30px 20px;
    height: 90vh;
    width: 100vw;
    overflow-y: scroll;
    top: 55vh;
    border-radius: 0;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }
`;

const PopupContent = styled.div`
  display: flex;
  gap: 20px;
  height: 100%;
  width: 100%;
  ${MEDIA_QUERY_MOBILE} {
    flex-direction: column;
  }
`;

const DramaImage = styled.img`
  object-fit: cover;
  width: 280px;
  height: 400px;
  border-radius: 20px;
  flex-shrink: 0;

  ${MEDIA_QUERY_TABLET} {
    width: 224px;
    height: 320px;
  }

  ${MEDIA_QUERY_MOBILE} {
    width: 164px;
    height: 240px;
  }
`;

const AvatarSkeleton = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: transparent;

  ${MEDIA_QUERY_TABLET} {
    width: 45px;
    height: 45px;
  }
`;

const MoreInfo = styled.div`
  display: flex;
  gap: 20px;
  ${MEDIA_QUERY_MOBILE} {
    flex-direction: column;
  }
`;

const SoundTrack = styled.div`
  justify-content: space-between;
`;

const SpotifyIframe = styled.iframe`
  border-radius: 20px;
  margin-top: 8px;
  width: 280px;
  height: 380px;
  ${MEDIA_QUERY_TABLET} {
    height: 352px;
    width: ${280 * 0.8}px;
    margin-top: 4px;
  }
  ${MEDIA_QUERY_MOBILE} {
    height: 352px;
    width: 100%;
  }
`;

const YoutubeIframe = styled.iframe`
  border-radius: 20px;
`;

const ActionButton = styled.button`
  font-size: 16px;
  color: ${(props) => props.theme.white};
  border: solid 1px ${(props) => props.theme.grey};
  padding: 6px 20px;
  font-weight: 700;
  border-radius: 20px;
  align-items: center;
  transition: ease-in-out 0.2s;
  ${MEDIA_QUERY_TABLET} {
    margin-top: -6px;
    font-size: 14px;
    padding: 6px 18px;
  }
  ${MEDIA_QUERY_MOBILE} {
    font-size: 13px;
    flex-shrink: 0;
    padding: 6px 12px;
  }
  &:hover {
    scale: 1.05;
    transition: ease-in-out 0.25s;
  }
`;

const LinkToForum = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
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
  font-size: 24px;
  font-weight: 900;
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

const ActorLink = styled.div`
  width: 100%;
  overflow-x: scroll;
  display: flex;
  gap: 16px;
  ${MEDIA_QUERY_TABLET} {
    gap: 10px;
  }
  ${MEDIA_QUERY_MOBILE} {
    gap: 10px;
  }
`;

const ActorsButton = styled.button`
  flex-shrink: 0;
  gap: 6px;
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
export default function Dramas({ dramasData, isRemoveButton }: IDramas) {
  const [isLoading, setIsLoading] = useState(false);
  const [reviewsArr, setReviewsArr] = useState<IReview[]>([]);
  const [otherUserReviewsArr, setOtherUserReviewsArr] = useState<IReview[]>([]);
  const [userReview, setUserReview] = useState<IReview | undefined>(undefined);
  const [dramaPopup, setDramaPopup] = useState<IDrama>();
  const prevDramaCardRef = useRef<IDrama | undefined>();
  const [actorAppearedDramas, setActorAppearedDramas] = useState<IDrama[]>([]);
  const [actorPopup, setActorPopup] = useState<IActor>();
  const email = useAppSelector((state) => state.user.email);
  const userID = useAppSelector((state) => state.user.id);
  const dramaList = useAppSelector((state) => state.user.dramaList);
  const dramas = useAppSelector((state) => state.dramas.dramas);
  const actors = useAppSelector((state) => state.dramas.actors);
  const dispatch = useAppDispatch();
  const dramaID = dramaPopup?.id;
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const currentDate = new Date();
  const [writtenReview, setWrittenReview] = useState<string | undefined>(
    undefined
  );
  const [userRating, setUserRating] = useState(0);
  const [editing, setEditing] = useState(false);
  const [updatedUserReview, setUpdatedUserReview] = useState('');
  const isTablet = useMediaQuery({
    query: '(min-width: 1281px) and (max-width: 1440px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 1280px)',
  });

  const getAllReviews = () => {
    dramaID &&
      userID &&
      dispatch(GET_REVIEWS({ dramaID, userID })).then((res) => {
        const payload = res.payload as ReviewsPayload;
        setReviewsArr(payload.reviewsArr);
        setOtherUserReviewsArr(payload.otherUserReviewsArr);
        setUserReview(payload.userReview);
      });
  };

  const uploadReview = () => {
    dramaID &&
      userID &&
      dispatch(
        UPLOAD_REVIEW({
          dramaID,
          userID,
          userRating,
          writtenReview,
        })
      );
    getAllReviews();
  };

  const updateReview = () => {
    setEditing(false);
    dramaID &&
      userID &&
      dispatch(
        UPDATE_REVIEW({
          dramaID,
          userID,
          userRating,
          updatedUserReview,
        })
      );
    getAllReviews();
  };

  const removeReview = () => {
    dramaID &&
      userID &&
      dispatch(
        REMOVE_REVIEW({
          dramaID,
          userID,
        })
      ).then(() => {
        getAllReviews();
      });
  };

  const getActors = () => {
    dramaID && dispatch(GET_ACTORS(dramaID));
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 300);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getAllReviews();
    getActors();
    if (dramaPopup || actorPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [dramaPopup, actorPopup]);

  const handleDramaPopup = (drama: IDrama) => {
    prevDramaCardRef.current = drama;
    setDramaPopup(drama);
    document.body.style.overflow = 'hidden';
  };

  const handleAddToDramaList = async () => {
    if (dramaID && userID) {
      dispatch(ADD_TO_DRAMALIST(dramaID));
    }
  };

  const handleRemoveFromList = (dramaIdToRemove: string) => {
    dispatch(REMOVE_FROM_DRAMALIST(dramaIdToRemove));
    return () => {};
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleActorPopup = (actor: IActor) => {
    if (actor.dramas) {
      setActorPopup(actor);
      const otherDramasIds = actor.dramas.filter(
        (dramaId) => dramaId !== dramaID
      );
      const otherDramas = dramas.filter(
        (drama) => drama.id && otherDramasIds.includes(drama.id)
      );
      setActorAppearedDramas(otherDramas);
    }
  };

  return (
    <DramaCardsWrapper>
      {isLoading
        ? dramasData.slice(0, end).map((drama, index) => {
            return (
              <DramaCard
                onClick={() => handleDramaPopup(drama)}
                key={index}
                style={{
                  backgroundImage: `linear-gradient(to top, #000, rgb(255, 255, 255, 0) 60%), url(${drama.image})`,
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
                  {drama.rating && Number(drama.rating) > 0 ? (
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
                      Swal.fire({
                        text: `確定要從片單中刪除 ${drama.title} 嗎？`,
                        icon: 'warning',
                        width: 400,
                        reverseButtons: true,
                        showCancelButton: true,
                        cancelButtonText: '取消',
                        confirmButtonText: '刪除',
                        iconColor: '#bbb',
                        confirmButtonColor: '#555',
                        cancelButtonColor: '#b0b0b0',
                      }).then((res) => {
                        if (res.isConfirmed) {
                          if (drama.id) {
                            handleRemoveFromList(drama.id);
                            Swal.fire({
                              title: '已刪除',
                              width: 300,
                              icon: 'success',
                              iconColor: '#bbb',
                              confirmButtonColor: '#555',
                            });
                          }
                        }
                      });
                    }}
                  >
                    <MdOutlineRemoveCircle />
                  </RemoveFromListButton>
                )}
              </DramaCard>
            );
          })
        : dramasData.map(() => <DramaCardSkeleton />)}
      {(dramaPopup || actorPopup) && (
        <Overlay
          onClick={() => {
            setEditing(false);
            setWrittenReview('');
            setUserRating(0);
            setDramaPopup(undefined);
            setActorPopup(undefined);
          }}
        />
      )}
      {dramaPopup && isLoading && (
        <Popup>
          <PopupContent>
            <ColumnFlexbox mobileOrder={2}>
              {userReview ? null : (
                <ColumnFlexbox
                  height="20%"
                  gap="10px"
                  padding="10px 0 0 0"
                  mobileHeight="80%"
                >
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
                            if (userRating && userID && dramaID) {
                              if (e.key === 'Enter') {
                                uploadReview();
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
                        ? `留下對 ${dramaPopup?.title} 的評論`
                        : '要先登入才能使用評論功能喔！'
                    }
                    defaultValue={writtenReview}
                    value={writtenReview}
                    onChange={(e) => setWrittenReview(e.target.value)}
                    onKeyPress={(e) => {
                      if (userRating) {
                        if (e.key === 'Enter') {
                          uploadReview();
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
                          userID && dramaID && uploadReview();
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
                mobileWidth="100%"
                height={userReview ? '100%' : '80%'}
              >
                <MDText margin="4px 10px" tabletMargin="2px 6px">
                  評論
                </MDText>
                {!reviewsArr.length && (
                  <ColumnFlexbox margin="10px 0 0 10px">
                    <MDGreyText>\ 歡迎留下第一則評論 દ ᵕ̈ ૩ /</MDGreyText>
                  </ColumnFlexbox>
                )}
                <ColumnFlexbox overflowY="scroll">
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
                                    className={
                                      index <= userRating ? 'on' : 'off'
                                    }
                                    isFilled={index <= userRating}
                                    onMouseOver={() => setUserRating(index)}
                                    email={email || ''}
                                  >
                                    <span>
                                      <FaStar />
                                    </span>
                                  </UserRatingStars>
                                );
                              })}
                            </RowFlexbox>
                          ) : (
                            userReview?.rating && (
                              <RowFlexbox fontSize="14px">
                                {Array.from(
                                  { length: userReview?.rating },
                                  (_, index) => (
                                    <span key={index}>
                                      <FaStar />
                                    </span>
                                  )
                                )}
                                {Array.from(
                                  { length: 5 - userReview?.rating },
                                  (_, index) => (
                                    <span key={userReview?.rating! + index}>
                                      <FaRegStar />
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
                                    updateReview();
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
                            <XSText LineHeight="20px">
                              {userReview?.writtenReview}
                            </XSText>
                          )}
                        </RowFlexbox>
                        <RowFlexbox margin="0 0 0 -6px">
                          <TextButton
                            onClick={
                              editing && userRating
                                ? updateReview
                                : () => setEditing(true)
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
                                  removeReview();
                                  setWrittenReview('');
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
                  {otherUserReviewsArr
                    .slice()
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
                          <RowFlexbox padding="16px 10px" gap="8px">
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
                                  <RowFlexbox fontSize="14px">
                                    {Array.from(
                                      { length: review.rating },
                                      (_, index) => (
                                        <span key={index}>
                                          <FaStar />
                                        </span>
                                      )
                                    )}
                                    {Array.from(
                                      { length: 5 - review.rating },
                                      (_, index) => (
                                        <span key={review.rating! + index}>
                                          <FaRegStar />
                                        </span>
                                      )
                                    )}
                                  </RowFlexbox>
                                )}
                              </RowFlexbox>
                              <XSText LineHeight="18px">
                                {review.writtenReview}
                              </XSText>
                            </ColumnFlexbox>
                          </RowFlexbox>
                          {otherUserReviewsArr.length > 1 && <DividerLine />}
                        </ColumnFlexbox>
                      );
                    })}
                </ColumnFlexbox>
              </ColumnFlexbox>
            </ColumnFlexbox>
            <ColumnFlexbox
              gap="20px"
              tabletGap="14px"
              width="100%"
              mobileOrder={1}
            >
              <RowFlexbox gap="20px">
                <DramaImage src={dramaPopup?.image} alt="" />
                <ColumnFlexbox justifyContent="space-between" width="100%">
                  <ColumnFlexbox gap="6px">
                    <XLText>{dramaPopup?.title}</XLText>
                    <SMGreyText>{dramaPopup?.eng}</SMGreyText>
                    {isTablet ? (
                      <>
                        <MDText>
                          {dramaPopup?.year} | {dramaPopup?.type} |{' '}
                          {dramaPopup?.genre} · 全 {dramaPopup?.episodes} 集
                        </MDText>
                      </>
                    ) : (
                      <>
                        <MDText>
                          {dramaPopup?.year} | {dramaPopup?.type} |{' '}
                          {dramaPopup?.genre}
                        </MDText>
                        <MDText>全 {dramaPopup?.episodes} 集</MDText>
                      </>
                    )}
                  </ColumnFlexbox>
                  {reviewsArr.length ? (
                    <ColumnFlexbox gap="6px" tabletGap="2px">
                      <RowFlexbox alignItems="flex-end">
                        <XLText>{dramaPopup?.rating}</XLText>
                        <XSText>/5</XSText>
                      </RowFlexbox>
                      <XSGreyText>
                        已有 {reviewsArr.length} 人留下評價
                      </XSGreyText>
                    </ColumnFlexbox>
                  ) : (
                    <ColumnFlexbox height="48px" tabletHeight="40px">
                      <SMGreyText>目前尚無評價</SMGreyText>
                    </ColumnFlexbox>
                  )}
                  <ColumnFlexbox gap="10px" textAlign="left" tabletGap="8px">
                    {!isMobile && (
                      <>
                        <ColumnFlexbox gap="6px" tabletGap="2px">
                          <XSText>編劇</XSText>
                          <MDText>{dramaPopup?.screenwriter}</MDText>
                        </ColumnFlexbox>
                        <ColumnFlexbox gap="6px" tabletGap="2px">
                          <XSText>導演</XSText>
                          <MDText>{dramaPopup?.director}</MDText>
                        </ColumnFlexbox>
                      </>
                    )}
                    <ColumnFlexbox gap="6px" tabletGap="2px" width="100%">
                      <XSText>演員</XSText>
                      <ActorLink>
                        {actors ? (
                          actors.map((actor) => (
                            <ActorsButton
                              onClick={() => {
                                handleActorPopup(actor);
                                setDramaPopup(undefined);
                              }}
                            >
                              <Avatar src={actor.avatar} alt="" />
                              <span>
                                <ColumnFlexbox textAlign="left">
                                  <MDText>{actor.name}</MDText>
                                  <XSGreyText>{actor.eng}</XSGreyText>
                                </ColumnFlexbox>
                              </span>
                            </ActorsButton>
                          ))
                        ) : (
                          <AvatarSkeleton />
                        )}
                      </ActorLink>
                    </ColumnFlexbox>
                  </ColumnFlexbox>
                  <RowFlexbox gap="6px">
                    <ActionButton
                      onClick={() => {
                        if (
                          dramaList &&
                          dramaID &&
                          dramaList.includes(dramaID)
                        ) {
                          handleRemoveFromList(dramaID);
                        } else if (email) {
                          handleAddToDramaList();
                        } else {
                          Swal.fire({
                            width: 300,
                            text: '要先登入才能加入喜愛的戲劇到自己的片單喔！',
                            icon: 'warning',
                            iconColor: '#bbb',
                            confirmButtonColor: '#555',
                          });
                        }
                      }}
                      style={{
                        color:
                          dramaList && dramaID && dramaList.includes(dramaID)
                            ? '#181818'
                            : '#fff',
                        backgroundColor:
                          dramaList && dramaID && dramaList.includes(dramaID)
                            ? '#fff'
                            : '#181818',
                      }}
                    >
                      {dramaList && dramaID && dramaList.includes(dramaID)
                        ? '✓ 已加入片單'
                        : '＋ 加入片單'}
                    </ActionButton>
                    <ActionButton>
                      <LinkToForum
                        to={`/forum/${dramaPopup?.engType}?keyword=${dramaPopup?.title}`}
                      >
                        <HiOutlineChat />
                        <span>聊劇去</span>
                      </LinkToForum>
                    </ActionButton>
                  </RowFlexbox>
                </ColumnFlexbox>
              </RowFlexbox>
              <MoreInfo>
                <SoundTrack>
                  <XSText>原聲帶</XSText>
                  <SpotifyIframe
                    title="Spotify"
                    src={dramaPopup?.spotify}
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </SoundTrack>
                <ColumnFlexbox justifyContent="space-between" mobileGap="12px">
                  <ColumnFlexbox>
                    <XSText>劇情大綱</XSText>
                    <XSGreyText>{dramaPopup?.story}</XSGreyText>
                  </ColumnFlexbox>
                  <ColumnFlexbox>
                    <XSText>上架日期</XSText>
                    <SMText>{dramaPopup?.releaseDate}</SMText>
                  </ColumnFlexbox>
                  <RowFlexbox gap="6px">
                    {dramaPopup?.platform &&
                      dramaPopup.platform.map((platform) => {
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
                  <ColumnFlexbox gap="6px">
                    <XSText>相關影片</XSText>
                    <RowFlexbox gap="10px" overflowX="scroll">
                      {dramaPopup &&
                        dramaPopup.relatedVideos &&
                        dramaPopup.relatedVideos.map((video, index) => (
                          <YoutubeIframe
                            key={index}
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
              </MoreInfo>
            </ColumnFlexbox>
            <CloseButton
              onClick={() => {
                setEditing(false);
                setDramaPopup(undefined);
                setWrittenReview('');
                setUserRating(0);
              }}
            >
              ✕
            </CloseButton>
          </PopupContent>
        </Popup>
      )}
      {actorPopup && (
        <Popup>
          {actorAppearedDramas ? (
            actorAppearedDramas.length > 0 ? (
              <ColumnFlexbox gap="16px" margin="30px 80px">
                <RowFlexbox alignItems="flex-end" gap="4px">
                  <LGText>{actorPopup.name}</LGText>
                  <LGText>還有出演過這些戲劇</LGText>
                </RowFlexbox>
                <RowFlexbox gap="16px" flexWrap="wrap">
                  {actorAppearedDramas?.map((drama, index) => (
                    <DramaCard
                      onClick={() => {
                        handleDramaPopup(drama);
                        setActorPopup(undefined);
                      }}
                      key={index}
                      style={{
                        backgroundImage: `linear-gradient(to top, #000, rgb(255, 255, 255, 0) 60%), url(${drama.image})`,
                      }}
                    >
                      <LGText>{drama.title}</LGText>
                      <SMGreyText>{drama.eng}</SMGreyText>
                      <RowFlexbox alignItems="center" gap="4px">
                        <SMText>{drama.year} |</SMText>
                        <SMText>{drama.type} |</SMText>
                        <SMText>{drama.genre}</SMText>
                      </RowFlexbox>
                      {drama.rating && Number(drama.rating) > 0 ? (
                        <RowFlexbox alignItems="flex-end">
                          <LGText>{drama?.rating}</LGText>
                          <SMText>/5</SMText>
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
                <RowFlexbox alignItems="flex-end" gap="4px" margin="30px 40px">
                  <LGGreyText>
                    很抱歉，目前沒有 {actorPopup.name} 出演過的其他戲劇資料：（
                  </LGGreyText>
                </RowFlexbox>
              </ColumnFlexbox>
            )
          ) : null}
          <BackButton
            onClick={() => {
              setDramaPopup(prevDramaCardRef.current);
              setActorPopup(undefined);
            }}
          >
            <IoChevronBackCircle />
          </BackButton>
          <CloseButton
            onClick={() => {
              setActorPopup(undefined);
            }}
          >
            ✕
          </CloseButton>
        </Popup>
      )}
    </DramaCardsWrapper>
  );
}
