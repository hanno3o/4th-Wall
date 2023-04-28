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
import {
  XXLText,
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
import SearchBar from '../../components/SearchBar';
import FilterNavBar from '../../components/FilterNavBar';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

const HomepageWrapper = styled.div`
  width: 1280px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  ${MEDIA_QUERY_TABLET} {
    width: 1100px;
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 480px;
    margin-top: -50px;
  }
`;

const BannerImage = styled.div`
  width: 100%;
  height: 480px;
  ${MEDIA_QUERY_TABLET} {
    height: 375px;
  }
  ${MEDIA_QUERY_MOBILE} {
    height: 265px;
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

const DividerLine = styled.div`
  margin: 0 auto;
  border-bottom: solid 1px ${(props) => props.theme.grey};
`;

const MultiFilterOption = styled.div<MultiFilterOptionProps>`
  color: ${(props) => props.theme.lightGrey};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  border-radius: 20px;
  padding: 8px 14px;
  z-index: 0;
  background-color: rgba(255, 255, 255, 0.1);
  ${(props) =>
    props.order &&
    props.order.includes(props.children as string) &&
    `
    color: #181818;
    background-color: #fff;
    `}

  ${(props) =>
    props.genre &&
    props.genre.length > 0 &&
    props.genre.includes(props.children as string) &&
    `
    color: #181818;
    background-color: #fff;
    `}

  ${(props) =>
    props.year &&
    props.year.length > 0 &&
    props.year.includes(props.children as number) &&
    `
    color: #181818;
    background-color: #fff;
    `}

    &:hover {
    color: ${(props) => props.theme.white};
    background-color: rgba(255, 255, 255, 0.2);
    transition: ease-in-out 0.25s;
  }
  ${MEDIA_QUERY_MOBILE} {
    max-width: 100px;
    padding: 6px 14px;
    font-size: 10px;
    font-weight: 700;
  }
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

const DramaCardsWrapper = styled.div`
  padding: 40px 0 100px 0;
  display: flex;
  gap: 26px;
  flex-wrap: wrap;

  ${MEDIA_QUERY_TABLET} {
    gap: 16px;
  }
  ${MEDIA_QUERY_MOBILE} {
    gap: 16px;
  }
`;

const DramaCard = styled.div`
  cursor: pointer;
  width: 275px;
  height: 362px;
  background-color: ${(props) => props.theme.grey};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
  background-size: cover;
  position: relative;
  filter: brightness(0.9);
  &:hover {
    transform: scale(1.05);
    transition: ease-in-out 0.3s;
    filter: brightness(1.05);
  }
  ${MEDIA_QUERY_TABLET} {
    width: 238px;
    height: 316px;
    padding: 16px;
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 180px;
    height: 265px;
    padding: 12px;
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

const UserRatingStars = styled.button<UserRatingStarsProps>`
  display: flex;
  gap: 4px;
  color: ${({ isFilled }) => (isFilled ? '#fff' : '#555')};
  background-color: transparent;
  cursor: pointer;
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
interface MultiFilterOptionProps {
  genre?: string[];
  year?: number[];
  order?: string;
}
interface UserRatingStarsProps {
  key: number;
  className: string;
  isFilled: boolean;
}

function Home() {
  const filterData = {
    type: ['所有影集', '台劇', '韓劇', '日劇', '美劇', '陸劇'],
    filters: [
      {
        title: '類型',
        filter: [
          '愛情',
          '喜劇',
          '奇幻',
          '懸疑',
          '刑偵犯罪',
          '復仇',
          '職場',
          '音樂',
          '穿越',
          '律政',
          '校園',
        ],
      },
      {
        title: '排序',
        filter: ['新上架', '評價最高', '由新到舊', '由舊到新'],
      },
      {
        title: '年份',
        filter: [
          2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
          2012,
        ],
      },
    ],
  };
  interface IDrama {
    id?: string | undefined;
    title?: string;
    year?: number;
    rating?: number;
    image?: string;
    eng?: string;
    genre?: string;
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

  const dramasRef = collection(db, 'dramas');
  const actorsRef = collection(db, 'actors');
  const [isLoading, setIsLoading] = useState(false);
  const [searchWords, setSearchWords] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(
    '所有影集'
  );
  const [genre, setGenre] = useState<string[]>([]);
  const [order, setOrder] = useState('');
  const [year, setYear] = useState<number[]>([]);
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
  const bannerImageURL =
    'https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Ffinalbanner.png?alt=media&token=5613b7b7-a3f2-446a-8184-b60bab7a8f02';

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
    }, 1000);
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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWords(e.target.value);
  };

  const handleTypeFilter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setSelectedTypeFilter(e.currentTarget.textContent);
  };

  const handleMultiFilter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    title: string
  ) => {
    const selectedValue = e.currentTarget.textContent;
    if (title === '類型') {
      if (genre.includes(selectedValue ? selectedValue : '')) {
        const newGenre = genre.filter((value) => value !== selectedValue);
        setGenre(newGenre);
      } else {
        setGenre((prevGenres) => [
          ...prevGenres,
          selectedValue ? selectedValue : '',
        ]);
      }
    } else if (title === '排序') {
      if (order === selectedValue) {
        setOrder('');
      } else {
        setOrder(selectedValue ? selectedValue : '');
      }
    } else if (title === '年份') {
      if (year.includes(selectedValue ? Number(selectedValue) : NaN)) {
        const newYear = year.filter((value) => value !== Number(selectedValue));
        setYear(newYear);
      } else {
        setYear((prevYears) => [
          ...prevYears,
          selectedValue ? Number(selectedValue) : NaN,
        ]);
      }
    }
  };

  const handleDramaCard = (drama: IDrama) => {
    prevDramaCardRef.current = drama;
    setDramaCard(drama);
  };

  const filteredByTypeDramas =
    selectedTypeFilter !== '所有影集'
      ? dramas.filter((drama) => drama.type === selectedTypeFilter)
      : dramas;

  const filteredByMultiFiltersDramas = filteredByTypeDramas
    .filter((drama) => {
      const newest = order === '新上架' ? drama.year === 2023 : true;
      const yearFilter =
        year.length > 0
          ? year.some((year) =>
              drama.year?.toString()?.includes(year.toString())
            )
          : true;
      const genreFilter =
        genre.length > 0
          ? genre.some((genre) => drama.genre?.includes(genre))
          : true;
      return yearFilter && genreFilter && newest;
    })
    .sort((a, b) => {
      if (a.year && b.year) {
        if (order === '由新到舊') {
          return b.year - a.year;
        } else if (order === '由舊到新') {
          return a.year - b.year;
        }
      }
      if (a.rating && b.rating && order === '評價最高') {
        return b.rating - a.rating;
      }
      return 0;
    });

  const filteredAndQueriedDramas = filteredByMultiFiltersDramas.filter(
    (drama) =>
      drama.eng?.toLowerCase().includes(searchWords.toLowerCase()) ||
      drama.title?.includes(searchWords)
  );

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
    <body>
      <BannerImage
        style={{
          backgroundImage: `linear-gradient(to top, rgb(25, 25, 25), rgba(255, 255, 255, 0) 100%), url(${bannerImageURL})`,
        }}
      />
      <HomepageWrapper>
        <XXLText margin="-20px auto 30px">評劇、聊劇、收藏你的愛劇</XXLText>
        <SearchBar
          placeHolder="請輸入想要查找的戲劇名稱"
          onChange={handleSearchInput}
        />
        <FilterNavBar
          selectedTypeFilter={selectedTypeFilter}
          onClick={handleTypeFilter}
        />
        <DividerLine />
        <ColumnFlexbox gap="18px" mobileGap="12px" margin="20px 0 0 0 ">
          {filterData.filters.map((filter, index) => {
            return (
              <RowFlexbox alignItems="center">
                <SMGreyText margin="0 10px 0 0">{filter.title}</SMGreyText>
                <RowFlexbox
                  gap="4px"
                  key={index}
                  alignItems="center"
                  style={{ overflowX: 'auto' }}
                >
                  {filter.filter.map((item, index) => {
                    return (
                      <MultiFilterOption
                        key={index}
                        year={year}
                        genre={genre}
                        order={order}
                        onClick={(e) => handleMultiFilter(e, filter.title)}
                      >
                        {item}
                      </MultiFilterOption>
                    );
                  })}
                </RowFlexbox>
              </RowFlexbox>
            );
          })}
        </ColumnFlexbox>
        <DramaCardsWrapper>
          {isLoading
            ? filteredAndQueriedDramas.map((drama, index) => {
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
                  </DramaCard>
                );
              })
            : filteredAndQueriedDramas.map(() => <DramaCardSkeleton />)}
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
                              onMouseOver={() => setUserRating(index)}
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
                              alert('要先選擇星星數才能送出評論喔～');
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
                        <MDGreyText
                          style={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
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
                                      >
                                        <span>
                                          <FaStar
                                            style={{ fontSize: '14px' }}
                                          />
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
                                          <FaStar
                                            style={{ fontSize: '14px' }}
                                          />
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
                                <XSText LineHeight="20px">
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
                                        ? new Date(
                                            review.date
                                          ).getFullYear() !==
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
                                  <XSText LineHeight="20px">
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
                        {dramaCard?.year} | {dramaCard?.type} |{' '}
                        {dramaCard?.genre}
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
                        <SMGreyText margin="0 0 28px 0">
                          目前尚無評價
                        </SMGreyText>
                      )}
                      <ColumnFlexbox
                        gap="12px"
                        textAlign="left"
                        tabletGap="8px"
                      >
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
      </HomepageWrapper>
    </body>
  );
}

export default Home;
