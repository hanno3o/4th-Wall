import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { db } from '../../config/firebase.config';
import { collection, addDoc } from 'firebase/firestore';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 50px;
  padding-bottom: 200px;
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
  margin-bottom: 10px;
`;

const Btn = styled(Link)`
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  font-size: 12px;
  border-radius: 50%;
  position: absolute;
  bottom: 100px;
  right: 30px;
`;

function Post() {
  const [episode, setEpisode] = useState('');
  const [drama, setDrama] = useState('');
  const [type, setType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <Wrapper>
      <SelectsWrapper>
        <Select
          name="episodes"
          onChange={(e) => setEpisode(e.currentTarget.value)}
        >
          <option value="none" selected disabled hidden>
            請選擇全集或特定集數
          </option>
          <option>全集</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
        </Select>
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
        placeholder="今天想要討論哪一部劇呢？"
        onChange={(e) => setDrama(e.currentTarget.value)}
      ></Input>
      <Input
        placeholder="輸入文章標題"
        onChange={(e) => setTitle(e.currentTarget.value)}
      ></Input>
      <ReactQuill theme="snow" value={content} onChange={setContent} />
      <Link
        style={{
          color: '#fff',
          fontWeight: '900',
          backgroundColor: '#000',
          width: '100px',
          padding: '10px',
          margin: '0 auto',
          marginTop: '20px',
          textAlign: 'center',
        }}
        to="/forum"
        onClick={async () => {
          await addDoc(collection(db, 'forum', 'KoreanDrama', 'articles'), {
            author: 'jennifer881030',
            type: type,
            epiosode: episode,
            drama: drama,
            title: title,
            content: content,
            date: Date.now(),
            commentsNum: '🔥',
          });
        }}
      >
        發文
      </Link>
    </Wrapper>
  );
}

export default Post;
