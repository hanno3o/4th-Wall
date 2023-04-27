import styled from 'styled-components';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase.config';
import { doc, updateDoc, collection, getDoc } from 'firebase/firestore';
import {
  updateAvatar,
  updateUserName,
  removeFromDramaList,
} from '../../redux/reducers/userSlice';
import { useState, useEffect } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineRemoveCircle } from 'react-icons/md';
import SearchBar from '../../components/SearchBar';
import FilterNavBar from '../../components/FilterNavBar';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import {
  XLText,
  LGText,
  SMText,
  MDGreyText,
  SMGreyText,
} from '../../style/Text';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

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
  background-color: #eee;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  ${MEDIA_QUERY_TABLET} {
    width: 140px;
    height: 140px;
  }
`;

const UploadButton = styled.button`
  color: ${(props) => props.theme.lightGrey};
  font-size: 24px;
  position: absolute;
  bottom: 0px;
  left: 136px;
  ${MEDIA_QUERY_TABLET} {
    font-size: 20px;
    left: 116px;
  }
  &:hover {
    color: ${(props) => props.theme.white};
    scale: 1.05;
    transition: ease-in-out 0.25s;
  }
`;

const EditUserNameButton = styled.button`
  color: ${(props) => props.theme.lightGrey};
  font-size: 24px;
  padding: 10px;
  border-radius: 50%;
  &:hover {
    color: ${(props) => props.theme.white};
    transition: ease-in-out 0.5s;
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 18px;
  }
`;

const UserName = styled.input`
  border-radius: 6px;
  padding: 10px 0;
  font-size: 32px;
  font-weight: 500;
  margin-right: 10px;
  width: 300px;
  padding: 6px 10px;
  border-radius: 5px;
  font-weight: 500;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.1);
  &:focus {
    box-shadow: 0 0 0 5px ${(props) => props.theme.black},
      0 0 0 6px rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.25s;
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 26px;
  }
`;

const DramaCardsWrapper = styled.div`
  padding: 26px 0 100px 0;
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

function Profile() {
  const id = useAppSelector((state) => state.user.id);
  const userName = useAppSelector((state) => state.user.userName);
  const avatar = useAppSelector((state) => state.user.avatar);
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

  const [searchWords, setSearchWords] = useState('');
  const [editing, setEditing] = useState(false);
  const [updatedUserName, setUpdatedUserName] = useState(userName);
  const dramaList = useAppSelector((state) => state.user.dramaList);
  const dramasCollectionRef = collection(db, 'dramas');
  const [userDramaList, setUserDramaList] = useState<any[]>([]);
  const recordData = [
    { title: '使用天數', data: daysSinceRegistration },
    { title: '已收藏的劇', data: userDramaList.length },
    { title: '發文數', data: 36 },
  ];
  const displayedDramaList = userDramaList.filter(
    (drama) =>
      drama.eng?.toLowerCase().includes(searchWords.toLowerCase()) ||
      drama.title?.includes(searchWords)
  );
  const filteredByTypeDramas =
    selectedTypeFilter !== '所有影集'
      ? displayedDramaList.filter((drama) => drama.type === selectedTypeFilter)
      : displayedDramaList;

  useEffect(() => {
    const getDramaList = async () => {
      if (dramaList) {
        const dramaListRef = await Promise.all(
          dramaList.map((dramaId) => getDoc(doc(dramasCollectionRef, dramaId)))
        );
        const dramaListData = dramaListRef.map((doc) => doc.data());
        setUserDramaList(dramaListData);
      }
    };
    if (id) {
      const userRef = doc(db, 'users', id);
      updateDoc(userRef, { dramaList: dramaList });
    }

    getDramaList();
  }, [dramaList]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const imageUrl = await uploadImage(file);
    if (id) {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, { avatar: imageUrl });
      dispatch(updateAvatar(imageUrl));
    }
  };

  const uploadImage = async (file: any): Promise<string> => {
    const storageRef = ref(storage, 'images/' + file.name);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleEditUserName = () => {
    setEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedUserName(e.target.value);
  };

  const handleSaveUserName = async () => {
    setEditing(false);
    if (id && updatedUserName) {
      const userRef = doc(db, 'users', id);
      await updateDoc(userRef, { userName: updatedUserName });
      dispatch(updateUserName(updatedUserName));
    }
  };

  const handleRemoveFromList = (dramaIdToRemove: string) => {
    dispatch(removeFromDramaList(dramaIdToRemove));
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWords(e.target.value);
  };

  const handleTypeFilter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setSelectedTypeFilter(e.currentTarget.textContent);
  };

  return (
    <ProfilePageWrapper>
      <UserInfo>
        {avatar && <UserImage src={avatar} alt="" />}
        <UploadButton>
          <label htmlFor="upload-file">
            <FiUploadCloud style={{ cursor: 'pointer' }} />
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
              <RowFlexbox alignItems="baseline">
                {editing ? (
                  <UserName
                    style={{
                      outline: 'solid 2px #555',
                    }}
                    type="text"
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSaveUserName();
                      }
                    }}
                  />
                ) : (
                  <UserName
                    style={{
                      backgroundColor: 'transparent',
                    }}
                    type="text"
                    value={userName}
                    disabled
                  />
                )}
                <EditUserNameButton
                  onClick={editing ? handleSaveUserName : handleEditUserName}
                >
                  {editing ? (
                    <MDGreyText>儲存</MDGreyText>
                  ) : (
                    <AiOutlineEdit style={{ marginBottom: '-4px' }} />
                  )}
                </EditUserNameButton>
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
      <ColumnFlexbox>
        <RowFlexbox justifyContent="space-between" alignItems="flex-end">
          <FilterNavBar
            selectedTypeFilter={selectedTypeFilter}
            onClick={handleTypeFilter}
          />
          <SearchBar placeHolder="在片單中搜尋" onChange={handleSearchInput} />
        </RowFlexbox>
        <DividerLine />
        <DramaCardsWrapper>
          {filteredByTypeDramas.map((drama) => (
            <>
              <DramaCard
                style={{
                  backgroundImage: `linear-gradient(to top, #000, rgb(255, 255, 255, 0) 100%), url(${drama.image})`,
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
                <RemoveFromListButton
                  onClick={() => {
                    alert(`確定要從片單中移除 ${drama.title} 嗎？`);
                    handleRemoveFromList(drama.id);
                  }}
                >
                  <MdOutlineRemoveCircle />
                </RemoveFromListButton>
              </DramaCard>
            </>
          ))}
        </DramaCardsWrapper>
      </ColumnFlexbox>
    </ProfilePageWrapper>
  );
}

export default Profile;
