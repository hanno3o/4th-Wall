import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../../config/firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useAppSelector } from '../../redux/hooks';

const quillStyle = `
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

const Wrapper = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 50px;
  margin: 0 auto;
`;

const SelectsWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const Select = styled.select`
  border: solid #000 1px;
  border-radius: 5px;
  margin-bottom: 20px;
  width: 200px;
`;

const Input = styled.input`
  border: #000 1px solid;
  padding: 5px;
  border-radius: 5px;
  margin-bottom: 20px;
`;

function Post() {
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const userName = useAppSelector((state) => state.user.userName);

  return (
    <Wrapper>
      <SelectsWrapper>
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
      </SelectsWrapper>
      <Input
        placeholder="輸入文章標題"
        onChange={(e) => setTitle(e.currentTarget.value)}
      />
      <style>{quillStyle}</style>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        style={{ height: '600px' }}
      />
      <Link
        style={{
          color: '#fff',
          fontWeight: '900',
          backgroundColor: '#000',
          width: '100px',
          padding: '10px',
          margin: '0 auto',
          marginTop: '90px',
          textAlign: 'center',
          borderRadius: '5px',
        }}
        to="/forum"
        onClick={async () => {
          await addDoc(collection(db, 'forum', 'KoreanDrama', 'articles'), {
            author: userName,
            type: type,
            title: title,
            content: content,
            date: Date.now(),
            commentsNum: 0,
          });
        }}
      >
        發文
      </Link>
    </Wrapper>
  );
}

export default Post;
