import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAppSelector } from '../../redux/hooks';
import { FaPen } from 'react-icons/fa';
import { ColumnFlexbox, RowFlexbox } from '../../style/Flexbox';
import { LGText, MDText, XSText } from '../../style/Text';
import { IoChevronBackCircle } from 'react-icons/io5';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import Swal from 'sweetalert2';
import { boardNames } from '../../utils/constants';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';

const quillStyle = `
  .ql-editor * {
  font: unset;
  }
  .ql-container {
  border: 2px solid #555 !important;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
  }
  .ql-toolbar {
  border:2px solid #555 !important;
  border-bottom: 1px solid transparent !important;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  }
  .ql-toolbar .ql-stroke {
    stroke: #bbb;
  }
  .ql-toolbar .ql-fill {
    fill: #bbb;
  }
  .ql-toolbar .ql-picker {
    color: #bbb;
  }
  .ql-editor p {
    font-size: 16px;
    ${MEDIA_QUERY_TABLET} {
      font-size: 14px;
    }
  }
  .ql-editor h1 {
    font-size: 22px;
    font-weight: 700;
  }
  .ql-editor h2 {
    font-size: 18px;
    font-weight: 700;
  }
  .ql-editor strong {
    font-weight: 900;
  }
  .ql-editor em {
    font-style: italic;
  }

`;

const PostPageWrapper = styled.div`
  width: 1280px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 12.5vh;
  gap: 18px;
  ${MEDIA_QUERY_TABLET} {
    width: 1100px;
    gap: 14px;
  }
`;

const Select = styled.select`
  color: ${(props) => props.theme.white};
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 6px;
  width: 120px;
  font-weight: 500;
  outline: solid 2px transparent;
  &:focus {
    transition: ease-in-out 0.25s;
    background-color: rgba(255, 255, 255, 0.2);
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
`;

const TitleInputField = styled.input`
  padding: 6px 10px;
  border-radius: 5px;
  font-weight: 500;
  outline: solid 2px transparent;
  color: ${(props) => props.theme.white};
  width: 100%;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.1);
  &:focus {
    background-color: rgba(255, 255, 255, 0.2);
    transition: ease-in-out 0.25s;
    &::placeholder {
      color: ${(props) => props.theme.lightGrey};
    }
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
`;

const PostButton = styled.button`
  color: ${(props) => props.theme.white};
  background-color: rgba(255, 255, 255, 0.3);
  margin: 40px auto 0;
  padding: 10px 20px;
  text-align: center;
  border-radius: 20px;
  &:hover {
    color: ${(props) => props.theme.darkGrey};
    background-color: ${(props) => props.theme.white};
    scale: 1.05;
    transition: ease-in-out 0.5s;
  }
  ${MEDIA_QUERY_TABLET} {
    padding: 8px 16px;
  }
`;

const DisabledPostButton = styled.button`
  cursor: default;
  color: ${(props) => props.theme.grey};
  background-color: rgba(255, 255, 255, 0.1);
  margin: 40px auto 0;
  padding: 10px 20px;
  text-align: center;
  border-radius: 20px;
  ${MEDIA_QUERY_TABLET} {
    padding: 8px 16px;
  }
`;

const BackButton = styled.button`
  color: ${(props) => props.theme.lightGrey};
  opacity: 0.5;
  position: fixed;
  left: 35px;
  top: 90px;
  font-weight: 900;
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
  &:hover {
    opacity: 1;
    transition: ease-in-out 0.25s;
  }
`;

const InfoButton = styled.button`
  font-size: 18px;
  color: ${(props) => props.theme.lightGrey};
  opacity: 0.5;
  font-weight: 900;
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
  &:hover {
    opacity: 1;
    transition: ease-in-out 0.25s;
  }
`;

const InfoCard = styled.div`
  background: transparent;
  backdrop-filter: blur(3px);
  background-color: rgba(255, 255, 255, 0.1);
  border: ${(props) => props.theme.grey} 1px solid;
  position: fixed;
  left: 47.5vw;
  top: 14vh;
  transform: translate(-50%, -50%);
  border-radius: 5px;
  padding: 20px;
  display: flex;
  z-index: 1;

  ${MEDIA_QUERY_TABLET} {
    left: 52vw;
    top: 14.5vh;
    padding: 14px;
  }
`;

function Post() {
  let navigate = useNavigate();
  const { boardName } = useParams();
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [infoCard, setInfoCard] = useState(false);
  const [content, setContent] = useState('');
  const [boardToPost, setBoardToPost] = useState('');
  const userId = useAppSelector((state) => state.user.id);
  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      ['link', 'image'],
    ],
  };

  useEffect(() => {
    boardName && setBoardToPost(boardName);
  }, []);

  return (
    <PostPageWrapper>
      <BackButton onClick={() => navigate(-1)}>
        <IoChevronBackCircle style={{ fontSize: '32px' }} />
      </BackButton>
      <RowFlexbox gap="10px">
        <Select
          defaultValue={boardName}
          name="type"
          onChange={(e) => {
            setBoardToPost(e.currentTarget.value);
            window.history.replaceState(
              null,
              '',
              `/forum/${e.currentTarget.value}/post`
            );
          }}
        >
          <option value="none" disabled>
            選擇看板
          </option>
          {Object.entries(boardNames).map(([englishName, chineseName]) => (
            <option key={englishName} value={englishName}>
              {chineseName}
            </option>
          ))}
        </Select>
        <Select name="type" onChange={(e) => setType(e.currentTarget.value)}>
          <option value="none" disabled selected>
            發文類別
          </option>
          <option>心得</option>
          <option>LIVE</option>
          <option>新聞</option>
          <option>閒聊</option>
          <option>問題</option>
        </Select>
        <InfoButton
          onMouseEnter={() => setInfoCard(true)}
          onMouseLeave={() => setInfoCard(false)}
        >
          <AiOutlineInfoCircle />
        </InfoButton>
      </RowFlexbox>
      <TitleInputField
        type="text"
        placeholder="請輸入文章標題"
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <style>{quillStyle}</style>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        style={{ height: '50vh' }}
        modules={modules}
      />
      {type &&
      title &&
      content
        ?.replace(/(<([^>]+)>)/gi, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>').length > 50 ? (
        <PostButton
          onClick={() => {
            Swal.fire({
              text: '確定要發布這篇文章嗎？',
              icon: 'warning',
              width: 300,
              reverseButtons: true,
              showCancelButton: true,
              cancelButtonText: '取消',
              confirmButtonText: '是的',
              iconColor: '#bbb',
              confirmButtonColor: '#555',
              cancelButtonColor: '#b0b0b0',
            }).then(async (res) => {
              if (res.isConfirmed) {
                boardName &&
                  (await addDoc(
                    collection(db, 'forum', boardToPost, 'articles'),
                    {
                      authorId: userId,
                      type: type,
                      title: title,
                      content: content,
                      date: Date.now(),
                      commentsNum: 0,
                    }
                  ));
                navigate(`/forum/${boardToPost}`);
                Swal.fire({
                  title: '已成功發布文章',
                  icon: 'success',
                  width: 300,
                  iconColor: '#bbb',
                  confirmButtonColor: '#555',
                });
              }
            });
          }}
        >
          <RowFlexbox gap="4px" justifyContent="center" alignItems="center">
            <FaPen />
            <MDText>發布文章</MDText>
          </RowFlexbox>
        </PostButton>
      ) : (
        <DisabledPostButton
          onClick={() => {
            Swal.fire({
              text: '請檢查是否已經選擇發文類別 輸入文章標題及至少50字內文',
              width: '300',
              icon: 'warning',
              iconColor: '#bbb',
              confirmButtonColor: '#555',
            });
          }}
        >
          <RowFlexbox gap="4px" justifyContent="center" alignItems="center">
            <FaPen />
            <MDText>發布文章</MDText>
          </RowFlexbox>
        </DisabledPostButton>
      )}
      <RowFlexbox>
        <InfoCard style={{ display: infoCard ? 'block' : 'none' }}>
          <ColumnFlexbox gap="4px">
            <LGText style={{ marginBottom: '6px' }}>發文注意事項</LGText>
            <XSText>※ 發文類別選擇後會呈現於標題，不需於標題重複輸入</XSText>
            <XSText>
              ※ 需選擇發文類別、輸入標題及至少50字內文才可發布文章
            </XSText>
            <XSText>
              ※ 如有暴雷內容請盡量註明於標題，如：黑暗榮耀觀後心得（有雷）
            </XSText>
            <XSText>
              ※ 標題或內文提及「雷」、「劇透」等關鍵字，則文章預覽區塊會
              <br />
              加上防雷灰底提醒其他使用者，敬請見諒
            </XSText>
          </ColumnFlexbox>
        </InfoCard>
      </RowFlexbox>
    </PostPageWrapper>
  );
}

export default Post;
