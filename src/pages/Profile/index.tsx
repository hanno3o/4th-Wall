import styled, { keyframes } from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase.config';
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { UPDATE_AVATAR, UPDATE_USERNAME } from '../../redux/reducers/userSlice';
import { useState, useEffect } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { HiOutlineArrowLongRight } from 'react-icons/hi2';
import FilterNavBar from '../../components/FilterNavBar';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import { XLText, SMText, LGDarkGreyText } from '../../style/Text';
import Dramas from '../../components/Dramas';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import {
  GET_USER_DRAMASLIST,
  GET_ALL_DRAMAS,
} from '../../redux/reducers/dramasSlice';
import { debounce } from '../../utils/debounce';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';

const ProfilePageWrapper = styled.div`
  width: 1280px;
  padding: 50px;
  gap: 24px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  ${MEDIA_QUERY_TABLET} {
    width: 1100px;
    gap: 16px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  position: relative;
  margin-top: 70px;
  gap: 30px;
  ${MEDIA_QUERY_TABLET} {
    gap: 20px;
  }
`;

const DividerLine = styled.div`
  border-bottom: solid 1px ${(props) => props.theme.grey};
`;

const UserImage = styled.img`
  object-fit: cover;
  background-color: ${(props) => props.theme.grey};
  width: 160px;
  height: 160px;
  border-radius: 50%;
  ${MEDIA_QUERY_TABLET} {
    width: 140px;
    height: 140px;
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

const UserImageSkeleton = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.grey};
  animation: ${fade} 1s linear infinite;
  ${MEDIA_QUERY_TABLET} {
    width: 140px;
    height: 140px;
  }
`;

const UploadButton = styled.button`
  font-size: 24px;
  position: absolute;
  bottom: 0px;
  left: 136px;
  ${MEDIA_QUERY_TABLET} {
    font-size: 20px;
    left: 116px;
  }
  &:hover {
    scale: 1.05;
    transition: ease-in-out 0.25s;
  }
`;

const UploadButtonIcon = styled.span`
  cursor: pointer;
`;

const UserName = styled.div`
  cursor: pointer;
  font-size: 32px;
  font-weight: 500;
  margin-left: -10px;
  padding: 6px 10px;
  border-radius: 5px;
  font-weight: 500;
  outline: solid 2px transparent;
  ${MEDIA_QUERY_TABLET} {
    font-size: 26px;
  }
`;

const EditUserName = styled.input`
  font-size: 32px;
  font-weight: 500;
  margin-left: -10px;
  padding: 2px 10px;
  border-radius: 5px;
  font-weight: 500;
  outline: solid 2px transparent;
  background-color: rgba(255, 255, 255, 0.1);
  ${MEDIA_QUERY_TABLET} {
    font-size: 26px;
    padding: 3.5px 10px;
  }
`;

const UserNameSkeleton = styled.div`
  margin-top: 10px;
  border-radius: 5px;
  height: 36px;
  width: 218px;
  background-color: ${(props) => props.theme.grey};
  animation: ${fade} 1s linear infinite;
`;

const SMTextSkeleton = styled(SMText)`
  width: 60px;
  height: 16px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.grey};
  animation: ${fade} 1s linear infinite;
`;

const XLTextSkeleton = styled(XLText)`
  width: 26px;
  height: 26px;
  border-radius: 20px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.grey};
  animation: ${fade} 1s linear infinite;
`;

const HomepageLink = styled(Link)`
  margin: -36px auto;
  color: rgba(255, 255, 255, 0.4);
  font-size: 18px;
  font-weight: 600;
  border-radius: 20px;
  letter-spacing: 1px;
  padding: 8px 20px;
  z-index: 0;
  background-color: rgba(255, 255, 255, 0.1);
  &:hover {
    color: ${(props) => props.theme.white};
    background-color: rgba(255, 255, 255, 0.2);
    transition: ease-in-out 0.25s;
  }
`;

const SearchbarWrapper = styled.div`
  position: relative;
`;

const SearchbarIcon = styled.div`
  position: absolute;
  top: 25%;
  transform: translate(0, -25%);
  font-size: 20px;
  padding: 10px 10px;
  &:hover {
    transition: ease-in-out 0.25s;
  }
`;

const SearchbarInput = styled.input`
  outline: solid 2px transparent;
  color: ${(props) => props.theme.white};
  height: 40px;
  width: 100%;
  padding-left: 50px;
  font-weight: 500;
  background-color: transparent;
`;

export default function Profile() {
  const id = useAppSelector((state) => state.user.id);
  const userName = useAppSelector((state) => state.user.userName);
  const avatar = useAppSelector((state) => state.user.avatar);
  const dramaList = useAppSelector((state) => state.user.dramaList);
  const userDramasList = useAppSelector((state) => state.dramas.userDramasList);
  const dispatch = useAppDispatch();
  const registrationDate = useAppSelector(
    (state) => state.user.registrationDate
  );
  const today = new Date();
  const timeDiff = registrationDate ? today.getTime() - registrationDate : 0;
  const daysSinceRegistration = Math.floor(timeDiff / (1000 * 3600 * 24));
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(
    '所有影集'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchWords, setSearchWords] = useState('');
  const [editing, setEditing] = useState(false);
  const [updatedUserName, setUpdatedUserName] = useState(userName);
  const [articleCount, setArticleCount] = useState<number>(0);
  const recordData = [
    { title: '使用天數', data: daysSinceRegistration },
    { title: '已收藏的劇', data: userDramasList.length },
    { title: '發文數', data: articleCount },
  ];

  const displayedDramaList = userDramasList.filter(
    (drama) =>
      drama.eng?.toLowerCase().includes(searchWords.toLowerCase()) ||
      drama.title?.includes(searchWords)
  );
  const filteredByTypeDramas =
    selectedTypeFilter !== '所有影集'
      ? displayedDramaList.filter((drama) => drama.type === selectedTypeFilter)
      : displayedDramaList;

  const getUserArticlesByAuthorId = async (
    boardName: string,
    id: string | null
  ) => {
    try {
      const articlesCollectionRef = collection(
        db,
        'forum',
        boardName,
        'articles'
      );
      const articlesQuerySnapshot = await getDocs(
        query(articlesCollectionRef, where('authorId', '==', id))
      );
      const articles = articlesQuerySnapshot.docs.map((doc) => doc.data());
      return articles.length;
    } catch (error) {
      console.error('Error getting articles by author ID: ', error);
      return;
    }
  };

  useEffect(() => {
    dispatch(GET_ALL_DRAMAS());
  }, []);

  useEffect(() => {
    const promises = [
      'TaiwanDrama',
      'KoreanDrama',
      'JapaneseDrama',
      'AmericanDrama',
      'ChinaDrama',
    ].map((boardName) => getUserArticlesByAuthorId(boardName, id));

    Promise.all(promises).then((res) => {
      const totalArticleCount = res.reduce((acc: number, currentValue) => {
        if (typeof currentValue === 'number') {
          return acc + currentValue;
        } else {
          return acc;
        }
      }, 0);
      setArticleCount(totalArticleCount);
    });

    if (id) {
      const userRef = doc(db, 'users', id);
      updateDoc(userRef, { dramaList: dramaList });
      const dramaIDList = dramaList || [];
      dispatch(GET_USER_DRAMASLIST(dramaIDList));
      setTimeout(() => {
        setIsLoading(true);
      }, 100);
    }
  }, [dramaList]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await uploadImage(file);
      if (id) {
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, { avatar: imageUrl });
        dispatch(UPDATE_AVATAR(imageUrl));
      }
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, 'images/' + file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleEditUserName = () => {
    setEditing(true);
  };

  const handleUserNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUserName(e.target.value);
  };

  const handleSaveUserName = async () => {
    setEditing(false);
    if (id && updatedUserName) {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, { userName: updatedUserName });
      dispatch(UPDATE_USERNAME(updatedUserName));
    }
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWords(e.target.value);
  };

  const delayedSearch = debounce(handleSearchInput, 500);

  const handleTypeFilter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setSelectedTypeFilter(e.currentTarget.textContent);
  };

  return (
    <ProfilePageWrapper>
      {isLoading ? (
        <UserInfo>
          {avatar && <UserImage src={avatar} alt="" />}
          <UploadButton>
            <label htmlFor="upload-file">
              <UploadButtonIcon>
                <FiUploadCloud />
              </UploadButtonIcon>
            </label>
          </UploadButton>
          <input
            id="upload-file"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
          <ColumnFlexbox width="100%" justifyContent="space-around">
            {userName && (
              <>
                <RowFlexbox alignItems="center">
                  {editing ? (
                    <EditUserName
                      type="text"
                      maxLength={15}
                      defaultValue={userName}
                      onChange={handleUserNameInput}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveUserName();
                        }
                      }}
                    />
                  ) : (
                    <UserName
                      onClick={
                        editing ? handleSaveUserName : handleEditUserName
                      }
                    >
                      {userName}
                    </UserName>
                  )}
                </RowFlexbox>
                <RowFlexbox gap="18px">
                  {recordData.map((record) => {
                    return (
                      <ColumnFlexbox textAlign="center" gap="8px">
                        <SMText>{record.title}</SMText>
                        <XLText>{record.data}</XLText>
                      </ColumnFlexbox>
                    );
                  })}
                </RowFlexbox>
              </>
            )}
          </ColumnFlexbox>
        </UserInfo>
      ) : (
        <UserInfo>
          <UserImageSkeleton />
          <ColumnFlexbox justifyContent="space-around">
            <RowFlexbox alignItems="center">
              <UserNameSkeleton />
            </RowFlexbox>
            <RowFlexbox gap="18px">
              {recordData.map(() => {
                return (
                  <ColumnFlexbox textAlign="center" gap="8px">
                    <SMTextSkeleton />
                    <XLTextSkeleton />
                  </ColumnFlexbox>
                );
              })}
            </RowFlexbox>
          </ColumnFlexbox>
        </UserInfo>
      )}
      <ColumnFlexbox>
        <RowFlexbox justifyContent="space-between" alignItems="flex-end">
          <FilterNavBar
            selectedTypeFilter={selectedTypeFilter}
            onClick={handleTypeFilter}
          />
          <SearchbarWrapper>
            <SearchbarIcon>
              <FaSearch />
            </SearchbarIcon>
            <SearchbarInput
              type="text"
              placeholder="在片單中搜尋"
              onChange={delayedSearch}
            />
          </SearchbarWrapper>
        </RowFlexbox>
        <DividerLine />
        {!filteredByTypeDramas.length && (
          <ColumnFlexbox>
            <RowFlexbox margin="50px auto" textAlign="center">
              <LGDarkGreyText LineHeight="28px">
                空空如也的片單有點寂寞嗎？
                <br />
                快來挑選你熱愛的戲劇，設計獨一無二的觀影清單吧！
              </LGDarkGreyText>
            </RowFlexbox>
            <HomepageLink to="/home">
              <RowFlexbox>
                挑劇去 <HiOutlineArrowLongRight />
              </RowFlexbox>
            </HomepageLink>
          </ColumnFlexbox>
        )}
        <Dramas dramasData={filteredByTypeDramas} isRemoveButton={true} />
      </ColumnFlexbox>
    </ProfilePageWrapper>
  );
}
