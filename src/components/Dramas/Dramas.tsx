import styled, { keyframes } from 'styled-components';
import { db } from '../../config/firebase.config';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
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
  SMGreyText,
  XSGreyText,
} from '../../style/Text';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import { DramaCardsWrapper, DramaCard } from '../../style/DramaCard';
import Swal from 'sweetalert2';
import { useMediaQuery } from 'react-responsive';
import Reviews, { reviewsLength } from './Reviews';

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
    width: 100vw;
    height: 720px;
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
`;

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
`;

const ActionButton = styled.button`
  font-size: 14px;
  color: ${(props) => props.theme.white};
  border: solid 1px ${(props) => props.theme.grey};
  padding: 6px 20px;
  margin-top: -16px;
  font-weight: 700;
  border-radius: 20px;
  align-items: center;
  transition: ease-in-out 0.2s;
  ${MEDIA_QUERY_TABLET} {
    margin-top: -6px;
    font-size: 13.5px;
    padding: 4px 18px;
  }
  &:hover {
    scale: 1.05;
    transition: ease-in-out 0.25s;
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

const ActorLink = styled.div`
  width: 100%;
  overflow-x: scroll;
  display: flex;
  gap: 16px;
  ${MEDIA_QUERY_TABLET} {
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

interface IDramas {
  dramasData: IDrama[];
  isRemoveButton: boolean;
}

function Dramas({ dramasData, isRemoveButton }: IDramas) {
  const [isLoading, setIsLoading] = useState(false);
  const dramasRef = collection(db, 'dramas');
  const [dramas, setDramas] = useState<IDrama[]>([]);
  const [dramaCard, setDramaCard] = useState<IDrama>();
  const prevDramaCardRef = useRef<IDrama | undefined>();
  const actorsRef = collection(db, 'actors');
  const [actorAppearedDramas, setActorAppearedDramas] = useState<IDrama[]>([]);
  const [actors, setActors] = useState<IActor[] | undefined>(undefined);
  const [actorCard, setActorCard] = useState<IActor>();
  const email = useAppSelector((state) => state.user.email);
  const userId = useAppSelector((state) => state.user.id);
  const dramaList = useAppSelector((state) => state.user.dramaList);
  const dispatch = useAppDispatch();
  const dramaId = dramaCard?.id;
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const isTablet = useMediaQuery({
    query: '(min-width: 1281px) and (max-width: 1440px)',
  });
  const [cachedActors, setCachedActors] = useState<{
    [key: string]: IActor[];
  } | null>(null);

  useEffect(() => {
    getDramas();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cachedActors && dramaId && cachedActors[dramaId]) {
      setActors(cachedActors[dramaId]);
    } else {
      getActors();
    }
  }, [dramaCard]);

  const getDramas = async () => {
    const dramasSnapshot = await getDocs(dramasRef);
    setDramas(
      dramasSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
    setTimeout(() => {
      setIsLoading(true);
    }, 300);
  };

  const getActors = async () => {
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
    dramaId &&
      setCachedActors((prevCachedActors) => ({
        ...(prevCachedActors || {}),
        [dramaId]: actors,
      }));
  };

  const handleDramaCard = (drama: IDrama) => {
    prevDramaCardRef.current = drama;
    setDramaCard(drama);
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

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      setPage((prevPage) => prevPage + 1);
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
      {(dramaCard || actorCard) && (
        <Overlay
          onClick={() => {
            setDramaCard(undefined);
            setActorCard(undefined);
            setActors(undefined);
          }}
        />
      )}
      <Popup style={{ display: dramaCard ? 'block' : 'none' }}>
        {isLoading && (
          <RowFlexbox gap="20px" height="100%" width="100%">
            <Reviews
              dramaCardTitle={dramaCard?.title || ''}
              dramaId={dramaId || ''}
            />
            <ColumnFlexbox
              gap="20px"
              tabletGap="14px"
              width="100%"
              height="100%"
            >
              <RowFlexbox gap="20px">
                <DramaImage src={dramaCard?.image} alt="" />
                <ColumnFlexbox justifyContent="space-between" width="100%">
                  <ColumnFlexbox gap="6px">
                    <XLText>{dramaCard?.title}</XLText>
                    <SMGreyText>{dramaCard?.eng}</SMGreyText>
                    {isTablet ? (
                      <>
                        <MDText>
                          {dramaCard?.year} | {dramaCard?.type} |{' '}
                          {dramaCard?.genre} · 全 {dramaCard?.episodes} 集
                        </MDText>
                      </>
                    ) : (
                      <>
                        <MDText>
                          {dramaCard?.year} | {dramaCard?.type} |{' '}
                          {dramaCard?.genre}
                        </MDText>
                        <MDText>全 {dramaCard?.episodes} 集</MDText>
                      </>
                    )}
                  </ColumnFlexbox>
                  {reviewsLength ? (
                    <ColumnFlexbox gap="6px" tabletGap="2px">
                      <RowFlexbox alignItems="flex-end">
                        <XLText>{dramaCard?.rating}</XLText>
                        <XSText>/5</XSText>
                      </RowFlexbox>
                      <XSGreyText>已有 {reviewsLength} 人留下評價</XSGreyText>
                    </ColumnFlexbox>
                  ) : (
                    <ColumnFlexbox height="48px" tabletHeight="40px">
                      <SMGreyText>目前尚無評價</SMGreyText>
                    </ColumnFlexbox>
                  )}
                  <ColumnFlexbox gap="10px" textAlign="left" tabletGap="8px">
                    <ColumnFlexbox gap="6px" tabletGap="2px">
                      <XSText>編劇</XSText>
                      <MDText>{dramaCard?.screenwriter}</MDText>
                    </ColumnFlexbox>
                    <ColumnFlexbox gap="6px" tabletGap="2px">
                      <XSText>導演</XSText>
                      <MDText>{dramaCard?.director}</MDText>
                    </ColumnFlexbox>
                    <ColumnFlexbox gap="6px" tabletGap="2px" width="100%">
                      <XSText>演員</XSText>
                      <ActorLink>
                        {actors ? (
                          actors.map((actor) => (
                            <ActorsButton
                              onClick={() => {
                                handleActorCard(actor);
                                setDramaCard(undefined);
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
                          dramaId &&
                          dramaList.includes(dramaId)
                        ) {
                          handleRemoveFromList(dramaId);
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
                        width: '130px',
                        color:
                          dramaList && dramaId && dramaList.includes(dramaId)
                            ? '#181818'
                            : '#fff',
                        backgroundColor:
                          dramaList && dramaId && dramaList.includes(dramaId)
                            ? '#fff'
                            : '#181818',
                      }}
                    >
                      {dramaList && dramaId && dramaList.includes(dramaId)
                        ? '✓ 已加入片單'
                        : '＋ 加入片單'}
                    </ActionButton>
                    <ActionButton>
                      <Link
                        to={`/forum/${dramaCard?.engType}?keyword=${dramaCard?.title}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <HiOutlineChat style={{ fontSize: '20px' }} />
                        <span>聊劇去</span>
                      </Link>
                    </ActionButton>
                  </RowFlexbox>
                  <CloseButton
                    onClick={() => {
                      setDramaCard(undefined);
                      setActors(undefined);
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
                <ColumnFlexbox justifyContent="space-between">
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
                  <ColumnFlexbox gap="6px">
                    <XSText>相關影片</XSText>
                    <RowFlexbox
                      gap="10px"
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
      </Popup>
      <Popup style={{ display: actorCard ? 'block' : 'none' }}>
        {actorCard && actorAppearedDramas ? (
          actorAppearedDramas.length > 0 ? (
            <ColumnFlexbox gap="16px" margin='30px 80px'>
              <RowFlexbox alignItems="flex-end" gap="4px">
                <LGText>{actorCard.name}</LGText>
                <LGText>還有出演過這些戲劇</LGText>
              </RowFlexbox>
              <RowFlexbox gap="16px" flexWrap="wrap">
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
              <RowFlexbox alignItems="flex-end" gap="4px" margin='30px 40px'>
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
      </Popup>
    </DramaCardsWrapper>
  );
}

export default Dramas;
