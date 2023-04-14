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

const Wrapper = styled.div`
  width: 80%;
  padding: 50px 100px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 auto;
`;

const UserProfile = styled.div`
  display: flex;
  position: relative;
`;

const UserImage = styled.img`
  object-fit: cover;
  background-color: #eee;
  width: 200px;
  height: 200px;
  border-radius: 50%;
`;

const UserInfo = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

const UserName = styled.input`
  padding: 6px;
  border: solid 1px transparent;
  border-radius: 6px;
  width: min-content;
  font-size: 42px;
  margin-bottom: 30px;
  width: 240px;
`;

const Records = styled.div`
  display: flex;
  gap: 20px;
`;

const Record = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;

const RecordTitle = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`;

const RecordData = styled.div`
  font-size: 30px;
`;

const SearchBar = styled.input`
  border-radius: 5px;
  border: #b6b6b6 solid 1px;
  height: 30px;
  width: 200px;
  padding: 10px;
`;

const DramaList = styled.div``;

const ListNavBar = styled.div`
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
`;

const Filters = styled.div`
  display: flex;
  gap: 30px;
  font-weight: 500;
  align-items: center;
`;

const Dramas = styled.div`
  margin-top: 20px;
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

const RemoveFromListButton = styled.button`
  color: #2a2a2a;
  background-color: #fff;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  font-weight: 900;
  font-size: 24px;
  line-height: 20px;
  opacity: 0.5;
  position: absolute;
  top: 10px;
  right: 10px;
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
  const filterData = {
    type: ['所有影集', '台劇', '韓劇', '動畫', '美劇'],
  };
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

  return (
    <Wrapper>
      <UserProfile>
        {avatar && <UserImage src={avatar} alt="" />}
        <label
          htmlFor="upload-file"
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '150px',
            fontSize: '32px',
            cursor: 'pointer',
          }}
        >
          ⬆️
        </label>
        <input
          id="upload-file"
          type="file"
          accept="image/*"
          hidden
          onChange={handleImageUpload}
        />
        <UserInfo>
          {userName && (
            <div style={{ display: 'flex' }}>
              {editing ? (
                <UserName
                  style={{ border: '#a1a1a1 solid 1px' }}
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
                  style={{ backgroundColor: 'transparent' }}
                  type="text"
                  value={userName}
                  disabled
                />
              )}
              <button
                style={{ marginBottom: '14px', marginLeft: '10px' }}
                onClick={editing ? handleSaveUserName : handleEditUserName}
              >
                {editing ? 'Save' : '🖋'}
              </button>
            </div>
          )}

          <Records>
            {recordData.map((record) => {
              return (
                <Record>
                  <RecordTitle>{record.title}</RecordTitle>
                  <RecordData>{record.data}</RecordData>
                </Record>
              );
            })}
          </Records>
        </UserInfo>
      </UserProfile>
      <DramaList>
        <ListNavBar>
          <Filters>
            {filterData.type.map((type) => {
              return <div>{type}</div>;
            })}
          </Filters>
          <SearchBar type="text" placeholder="Search" />
        </ListNavBar>
        <hr className="my-4" />
        <Dramas>
          {userDramaList.map((drama) => (
            <>
              <Drama
                style={{
                  backgroundImage: `linear-gradient(to top, rgb(25, 25, 25), rgb(255, 255, 255, 0) 100%), url(${drama.image})`,
                }}
              >
                <div>{drama.title}</div>
                <RemoveFromListButton
                  onClick={() => {
                    alert(`確定要從片單中移除 ${drama.title} 嗎？`);
                    handleRemoveFromList(drama.id);
                  }}
                >
                  -
                </RemoveFromListButton>
              </Drama>
            </>
          ))}
        </Dramas>
      </DramaList>
    </Wrapper>
  );
}

export default Profile;
