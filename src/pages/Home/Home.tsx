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
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  addToDramaList,
  removeFromDramaList,
} from '../../redux/reducers/userSlice';

const Wrapper = styled.div`
  width: 75%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 auto;
`;

const SearchBar = styled.input`
  border-radius: 5px;
  border: #b6b6b6 solid 1px;
  height: 36px;
  width: 100%;
  padding: 10px;
`;

const FilterPanel = styled.div`
  margin-top: 30px;
`;

const FilterNavBar = styled.div`
  cursor: pointer;
  display: flex;
  gap: 4px;
  font-weight: 500;
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TypeFilter = styled.div<TypeFilterProps>`
  font-weight: 500;
  padding: 0 10px 8px;
  ${(props) =>
    props.selectedTypeFilter &&
    props.selectedTypeFilter.includes(props.children as string) &&
    `
    border-bottom: #3f3a3a 4px solid;
    `}
`;

const Label = styled.label`
  margin-right: 20px;
  font-weight: 500;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
`;

const Option = styled.div<FilterOptionsProps>`
  cursor: pointer;
  display: flex;
  margin-right: 8px;
  font-weight: 200;
  border: solid 1px #bbb;
  border-radius: 5px;
  padding: 6px;
  ${(props) =>
    props.order &&
    props.order.includes(props.children as string) &&
    `
    font-weight: 500;
    border: #3f3a3a;
    solid 1px; color: #fff;
    background-color: #3f3a3a;
    `}

  ${(props) =>
    props.genre &&
    props.genre.length > 0 &&
    props.genre.includes(props.children as string) &&
    `
    font-weight: 500;
    border: #3f3a3a solid 1px;
    color: #fff;
    background-color: #3f3a3a;
    `}

  ${(props) =>
    props.year &&
    props.year.length > 0 &&
    props.year.includes(props.children as number) &&
    `
    font-weight: 500;
    border: #3f3a3a solid 1px;
    color: #fff;
    background-color: #3f3a3a;
    `}
`;

const DramasSection = styled.div`
  margin-top: 40px;
  margin-bottom: 100px;
  display: flex;
  gap: 18px;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const Drama = styled.div`
  cursor: pointer;
  width: 15.8em;
  height: 320px;
  flex-shrink: 0;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
  background-size: cover;
  position: relative;
`;

const DramaCard = styled.div`
  width: 1000px;
  transform: translate(-50%, -50%);
  background: #2a2a2a;
  color: #fff;
  position: fixed;
  left: 50vw;
  top: 50vh;
  border-radius: 10px;
  opacity: 0.9;
  padding: 60px 40px;
  display: block;
`;

const DramaCardMainInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DramaCardTitle = styled.div`
  font-size: 26px;
  font-weight: 900;
`;

const DramaCardSubTitle = styled.div`
  font-size: 16px;
  color: #afafaf;
  font-weight: 500;
`;

const DramaCardType = styled.div`
  font-size: 14px;
  color: #fff;
  margin-top: 2px;
  font-weight: 900;
`;

const DramaCardRating = styled.div`
  font-size: 18px;
  color: #fff;
  font-weight: 900;
`;

const DramaCardDescriptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DramaCardDescriptionTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  line-height: 22px;
`;

const DramaCardDescription = styled.div`
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 8px;
  line-height: 18px;
`;

const HandleListButton = styled.button`
  font-size: 16px;
  color: #fff;
  border: solid 1px #fff;
  padding: 5px;
  font-weight: 700;
  position: absolute;
  top: 60px;
  right: 40px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  font-weight: 900;
`;

const UserRatingStars = styled.button<UserRatingStarsProps>`
  color: ${({ isFilled }) => (isFilled ? '#fff' : '#8e8e8e')};
  background-color: transparent;
  border: none;
  outline: none;
  cursor: pointer;
`;

const ReviewInputField = styled.input`
  color: #000;
  cursor: text;
  width: 100%;
  margin-top: 10px;
  margin-right: 10px;
  font-size: 12px;
  padding: 4px 2px;
  border-radius: 5px;
`;
interface TypeFilterProps {
  selectedTypeFilter?: string | null;
}
interface FilterOptionsProps {
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
  }
  interface ICast {
    name?: string;
  }
  interface IReview {
    date?: number;
    rating?: number;
    writtenReview?: string;
    id?: string;
    avatar?: string;
    userName?: string;
  }

  const dramasCollectionRef = collection(db, 'dramas');
  const [isLoading, setIsLoading] = useState(false);
  const [dramas, setDramas] = useState<IDrama[]>([]);
  const [cast, setCast] = useState<ICast[]>([]);
  const [genre, setGenre] = useState<string[]>([]);
  const [order, setOrder] = useState('');
  const [year, setYear] = useState<number[]>([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(
    '所有影集'
  );
  const [dramaCard, setDramaCard] = useState<IDrama>();
  const [userReview, setUserReview] = useState<IReview | undefined>(undefined);
  const [allReviews, setAllReviews] = useState<IReview[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<IReview[]>([]);
  const [writtenReview, setWrittenReview] = useState<string | undefined>();
  const [userRating, setUserRating] = useState(0);
  const [editing, setEditing] = useState(false);
  const [updatedUserReview, setUpdatedUserReview] = useState('');

  const userName = useAppSelector((state) => state.user.userName);
  const avatar = useAppSelector((state) => state.user.avatar);
  const userId = useAppSelector((state) => state.user.id);
  const dramaList = useAppSelector((state) => state.user.dramaList);
  const dispatch = useAppDispatch();
  const dramaId = dramaCard?.id;

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

  const getReviews = async () => {
    if (dramaId) {
      const castsCollectionRef = collection(db, 'dramas', dramaId, 'cast');
      const castSnapshot = await getDocs(castsCollectionRef);
      const castArr: any = [];
      castSnapshot.forEach((doc) => {
        castArr.push(doc.data());
      });
      setCast(castArr);
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

  useEffect(() => {
    const getDramas = async () => {
      const data = await getDocs(dramasCollectionRef);
      setDramas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setIsLoading(true);
    };
    const getCast = async () => {
      if (dramaId) {
        const castsCollectionRef = collection(db, 'dramas', dramaId, 'cast');
        const castSnapshot = await getDocs(castsCollectionRef);
        const castArr: any = [];
        castSnapshot.forEach((doc) => {
          castArr.push(doc.data());
        });
        setCast(castArr);
      }
    };
    getDramas();
    getCast();
    getReviews();
  }, [dramaCard]);

  useEffect(() => {
    getAverageRatings();
  }, [filteredReviews]);

  function handleTypeFilter(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setSelectedTypeFilter(e.currentTarget.textContent);
  }

  function handleFilters(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    title: string
  ) {
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
  }

  function handleDramaCard(drama: IDrama) {
    setDramaCard(drama);
  }

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

  const handleReviewInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUserReview(e.target.value);
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
    <Wrapper>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translate(0, -50%)',
          }}
        >
          🔍
        </div>
        <SearchBar
          style={{ paddingLeft: '40px' }}
          type="text"
          placeholder="請輸入想要查找的戲劇名稱"
        />
      </div>
      <FilterPanel>
        <FilterNavBar>
          {filterData.type.map((type, index) => {
            return (
              <TypeFilter
                key={index}
                selectedTypeFilter={selectedTypeFilter}
                onClick={handleTypeFilter}
              >
                {type}
              </TypeFilter>
            );
          })}
        </FilterNavBar>
        <hr className="mb-6" />
        <Filter>
          {filterData.filters.map((filter, index) => {
            return (
              <Options key={index}>
                <Label>{filter.title}</Label>
                {filter.filter.map((item, index) => {
                  return (
                    <>
                      <Option
                        key={index}
                        year={year}
                        genre={genre}
                        order={order}
                        onClick={(e) => handleFilters(e, filter.title)}
                      >
                        {item}
                      </Option>
                    </>
                  );
                })}
              </Options>
            );
          })}
        </Filter>
      </FilterPanel>
      <DramasSection>
        {isLoading &&
          filteredByMultiFiltersDramas.map((drama, index) => {
            return (
              <Drama
                onClick={() => handleDramaCard(drama)}
                key={index}
                style={{
                  backgroundImage: `linear-gradient(to top, rgb(25, 25, 25), rgb(255, 255, 255, 0) 100%), url(${drama.image})`,
                }}
              >
                <div>{drama.title}</div>
                <div>{drama.year}</div>
                <div>{drama.rating}/5</div>
                <div>{drama.genre}</div>
                <div>{drama.type}</div>
              </Drama>
            );
          })}
        <DramaCard style={{ display: dramaCard ? 'block' : 'none' }}>
          {isLoading && (
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  width: '320px',
                  marginRight: '40px',
                }}
              >
                {userReview ? null : (
                  <div
                    style={{
                      width: '320px',
                      marginRight: '40px',
                      height: '90px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ display: 'flex' }}>
                      {avatar && (
                        <img
                          style={{
                            borderRadius: '50%',
                            width: '42px',
                            height: '42px',
                            marginRight: '10px',
                            objectFit: 'cover',
                          }}
                          src={avatar}
                          alt=""
                        />
                      )}
                      <div style={{ width: '100%' }}>
                        <div>
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
                                <span style={{ fontSize: '24px' }}>
                                  &#9733;
                                </span>
                              </UserRatingStars>
                            );
                          })}
                        </div>
                        <ReviewInputField
                          style={{ padding: '10px' }}
                          type="text"
                          value={writtenReview}
                          placeholder={
                            userName
                              ? `留下你對 ${dramaCard?.title} 的評論！`
                              : '要先登入才能使用評論功能喔！'
                          }
                          disabled={!userName}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setWrittenReview(e.target.value);
                          }}
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
                        <button
                          style={{
                            fontSize: '12px',
                            marginTop: '12px',
                            textAlign: 'right',
                            width: '100%',
                          }}
                          onClick={() => {
                            if (userRating) {
                              handleUploadReview();
                            } else {
                              alert('要先選擇星星數才能送出評論喔～');
                            }
                          }}
                        >
                          送出
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    paddingLeft: '2px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '900',
                    }}
                  >
                    評論
                  </div>
                  <div
                    style={{
                      height: '700px',
                      overflowY: 'scroll',
                    }}
                  >
                    {userReview && (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            margin: '14px 0',
                            fontSize: '13px',
                            padding: '14px 8px',
                            borderRadius: '5px',
                            backgroundColor: '#000',
                          }}
                        >
                          <img
                            style={{
                              borderRadius: '50%',
                              width: '42px',
                              height: '42px',
                              marginRight: '10px',
                              objectFit: 'cover',
                            }}
                            src={userReview?.avatar}
                            alt=""
                          />
                          <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {editing ? (
                                <div>
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
                                        <span style={{ fontSize: '13px' }}>
                                          &#9733;
                                        </span>
                                      </UserRatingStars>
                                    );
                                  })}
                                </div>
                              ) : (
                                userReview?.rating && (
                                  <div>
                                    {Array.from(
                                      { length: userReview?.rating },
                                      (_, index) => (
                                        <span key={index}>★</span>
                                      )
                                    )}
                                    {Array.from(
                                      { length: 5 - userReview?.rating },
                                      (_, index) => (
                                        <span key={userReview?.rating! + index}>
                                          ☆
                                        </span>
                                      )
                                    )}
                                  </div>
                                )
                              )}
                              <div>
                                {userReview.date
                                  ? new Date(
                                      userReview.date
                                    ).toLocaleDateString()
                                  : null}
                              </div>
                              <div>📌</div>
                            </div>
                            <div style={{ display: 'flex' }}>
                              {editing ? (
                                <>
                                  <ReviewInputField
                                    type="text"
                                    style={{
                                      color: '#000',
                                      marginTop: '8px',
                                    }}
                                    placeholder={userReview?.writtenReview}
                                    onChange={handleReviewInputChange}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        if (userRating) {
                                          handleSaveReview();
                                        } else {
                                          alert(
                                            '要先選擇星星數才能送出評論喔～'
                                          );
                                        }
                                      }
                                    }}
                                  />
                                </>
                              ) : (
                                <ReviewInputField
                                  type="text"
                                  value={userReview?.writtenReview}
                                  style={{
                                    color: '#fff',
                                    backgroundColor: 'transparent',
                                    marginTop: '8px',
                                  }}
                                  disabled
                                />
                              )}
                              <button
                                style={{
                                  marginTop: '16px',
                                  marginRight: '10px',
                                  fontSize: '10px',
                                }}
                                onClick={
                                  editing && userRating
                                    ? handleSaveReview
                                    : handleEditReview
                                }
                              >
                                {editing ? 'Save' : '🖋'}
                              </button>
                              <button
                                onClick={handleRemoveReview}
                                style={{
                                  color: '#fff',
                                  backgroundColor: 'transparent',
                                  marginTop: '14px',
                                  marginRight: '10px',
                                }}
                              >
                                🗑
                              </button>
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex' }}></div>
                      </>
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
                          <>
                            <div
                              style={{
                                display: 'flex',
                                padding: '10px 8px',
                                fontSize: '12px',
                              }}
                            >
                              <img
                                style={{
                                  borderRadius: '50%',
                                  width: '42px',
                                  height: '42px',
                                  marginRight: '10px',
                                  objectFit: 'cover',
                                }}
                                src={review.avatar}
                                alt=""
                              />
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '8px',
                                  flexDirection: 'column',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '16px',
                                    fontWeight: '900',
                                  }}
                                >
                                  {review.userName}
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <div>
                                    {review.rating && (
                                      <div>
                                        {Array.from(
                                          { length: review.rating },
                                          (_, index) => (
                                            <span key={index}>★</span>
                                          )
                                        )}
                                        {Array.from(
                                          { length: 5 - review.rating },
                                          (_, index) => (
                                            <span key={review.rating! + index}>
                                              ☆
                                            </span>
                                          )
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    {review.date
                                      ? new Date(
                                          review.date
                                        ).toLocaleDateString()
                                      : null}
                                  </div>
                                </div>
                                <div
                                  style={{
                                    fontWeight: '900',
                                    lineHeight: '18px',
                                  }}
                                >
                                  {review.writtenReview}
                                </div>
                              </div>
                            </div>
                            {filteredReviews.length > 1 && (
                              <hr
                                style={{
                                  margin: '6px 0',
                                  borderColor: '#696969',
                                }}
                              />
                            )}
                          </>
                        );
                      })}
                  </div>
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                  }}
                >
                  <img
                    className="w-48 h-70 mb-8"
                    style={{
                      objectFit: 'cover',
                    }}
                    src={dramaCard?.image}
                    alt=""
                  />
                  <DramaCardMainInfo>
                    <DramaCardTitle>{dramaCard?.title}</DramaCardTitle>
                    <DramaCardSubTitle>{dramaCard?.eng}</DramaCardSubTitle>
                    <DramaCardType>
                      {dramaCard?.type} | {dramaCard?.year} | {dramaCard?.genre}
                    </DramaCardType>
                    <DramaCardRating>{dramaCard?.rating}/5</DramaCardRating>
                    <DramaCardDescription>
                      已有 {allReviews.length} 人留下評價
                    </DramaCardDescription>
                    <div>
                      <DramaCardDescriptionTitle>
                        編劇
                      </DramaCardDescriptionTitle>
                      <DramaCardDescription>
                        {dramaCard?.screenwriter}
                      </DramaCardDescription>
                      <DramaCardDescriptionTitle>
                        導演
                      </DramaCardDescriptionTitle>
                      <DramaCardDescription>
                        {dramaCard?.director}
                      </DramaCardDescription>
                      <DramaCardDescriptionTitle>
                        演員
                      </DramaCardDescriptionTitle>
                      <DramaCardDescription>
                        {cast.map((cast) => ` ${cast.name}`)}
                      </DramaCardDescription>
                    </div>
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
                        ? '✓已加入片單'
                        : '＋加入片單'}
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
                  </DramaCardMainInfo>
                </div>
                <DramaCardDescriptionWrapper>
                  <div style={{ width: '315px' }}>
                    <DramaCardDescriptionTitle>
                      劇情大綱
                    </DramaCardDescriptionTitle>
                    <DramaCardDescription style={{ paddingRight: '22px' }}>
                      {dramaCard?.story}
                    </DramaCardDescription>
                    <DramaCardDescriptionTitle>集數</DramaCardDescriptionTitle>
                    <DramaCardDescription>
                      共 {dramaCard?.episodes} 集
                    </DramaCardDescription>
                    <DramaCardDescriptionTitle>
                      集數熱度
                    </DramaCardDescriptionTitle>
                    <DramaCardDescription>平均熱度：17/集</DramaCardDescription>
                    <img
                      style={{ width: '290px' }}
                      src="https://book.gosu.bar/uploads/images/gallery/2019-12/qWqeJ5ZcX2DYL2rQ-%E5%9F%BA%E7%A4%8E%E6%8A%98%E7%B7%9A%E5%9C%96.png"
                      alt=""
                    />
                    <div style={{ fontSize: '10px', marginTop: '10px' }}>
                      （計算方式：論壇中相對集數之文章總和除以總集數）
                    </div>
                  </div>
                  <div>
                    <DramaCardDescriptionTitle>
                      原聲帶
                    </DramaCardDescriptionTitle>
                    <iframe
                      title="Spotify"
                      style={{ borderRadius: '12px', marginTop: '4px' }}
                      src={dramaCard?.spotify}
                      width="100%"
                      height="352"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                </DramaCardDescriptionWrapper>
              </div>
            </div>
          )}
        </DramaCard>
      </DramasSection>
    </Wrapper>
  );
}

export default Home;
