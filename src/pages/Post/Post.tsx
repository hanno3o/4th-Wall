import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../../config/firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAppSelector } from '../../redux/hooks';
import { FaPen } from 'react-icons/fa';
import { RowFlexbox } from '../../style/Flexbox';
import { MDText } from '../../style/Text';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';

const quillStyle = `
.ql-toolbar .ql-picker-label {
  color: #fff; 
}
  .ql-editor p {
    font-size: 16px;
  }
  .ql-editor h1 {
    font-size: 26px;
    font-weight: 700;
  }
  .ql-editor h2 {
    font-size: 22px;
    font-weight: 700;
  }
  .ql-editor strong {
    font-weight: 900;
  }
  .ql-editor em {
    font-style: italic;
  }
  .ql-editor a {
    font-color: blue;
  }
`;

const PostPageWrapper = styled.div`
  width: 1280px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 12.5vh;
  gap: 20px;
  ${MEDIA_QUERY_TABLET} {
    width: 1100px;
    gap: 16px;
  }
`;

const Select = styled.select`
  color: ${(props) => props.theme.white};
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  padding: 6px;

  width: 200px;
  font-weight: 500;
  outline: solid 2px ${(props) => props.theme.grey};
  &:focus {
    box-shadow: 0 0 0 5px ${(props) => props.theme.black},
      0 0 0 6px rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.25s;
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
`;

const Input = styled.input`
  padding: 6px 10px;
  border-radius: 5px;
  font-weight: 500;
  outline: solid 2px ${(props) => props.theme.grey};
  color: ${(props) => props.theme.white};
  width: 100%;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.1);
  &:focus {
    box-shadow: 0 0 0 5px ${(props) => props.theme.black},
      0 0 0 6px rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.25s;
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
`;

const PostButton = styled(Link)`
  color: ${(props) => props.theme.lightGrey};
  background-color: rgba(255, 255, 255, 0.25);
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

function Post() {
  const { boardName } = useParams();
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const userId = useAppSelector((state) => state.user.id);

  return (
    <PostPageWrapper>
      <Select name="type" onChange={(e) => setType(e.currentTarget.value)}>
        <option value="none" selected disabled hidden>
          發文類別
        </option>
        <option>心得</option>
        <option>LIVE</option>
        <option>新聞</option>
        <option>閒聊</option>
        <option>問題</option>
      </Select>
      <Input
        placeholder="請輸入文章標題"
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <style>{quillStyle}</style>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        style={{ height: '50vh' }}
      />
      <PostButton
        to={`/forum/${boardName}`}
        onClick={async () => {
          boardName &&
            (await addDoc(collection(db, 'forum', boardName, 'articles'), {
              authorId: userId,
              type: type,
              title: title,
              content: content,
              date: Date.now(),
              commentsNum: 0,
            }));
        }}
      >
        <RowFlexbox gap="4px" justifyContent="center" alignItems="center">
          <FaPen />
          <MDText>發布文章</MDText>
        </RowFlexbox>
      </PostButton>
    </PostPageWrapper>
  );
}

export default Post;
