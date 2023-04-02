import styled from 'styled-components';
import MarkdownEditor from '../../components/Markdown';
import { Link } from 'react-router-dom';

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
  return (
    <Wrapper>
      <SelectsWrapper>
        <Select name="episodes">
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
        <Select name="type">
          <option value="none" selected disabled hidden>
            發文類別
          </option>
          <option>心得</option>
          <option>LIVE</option>
          <option>新聞</option>
          <option>閒聊</option>
        </Select>
      </SelectsWrapper>
      <Input placeholder="標題"></Input>
      <MarkdownEditor />
      <Btn to="/forum">Publish</Btn>
    </Wrapper>
  );
}

export default Post;
