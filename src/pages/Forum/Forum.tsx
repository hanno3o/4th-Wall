import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WelcomeMessage = styled.div`
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 10px;
`;

const SearchBar = styled.input`
  border-radius: 5px;
  border: #b6b6b6 solid 1px;
  height: 30px;
  width: 100%;
  padding: 10px;
`;

const Boards = styled.div`
  display: flex;
  margin-top: 40px;
  gap: 30px;
  font-weight: 500;
  align-items: center;
`;

const Articles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 80px;
`;

const Article = styled(Link)`
  background-color: #b8b8b8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  height: 60px;
`;

const Title = styled.div`
  text-align: left;
  font-weight: 700;
`;

const Pagination = styled.div`
  color: #000;
  font-weight: 700;
  margin-top: 20px;
  text-align: center;
`;

const Btn = styled(Link)`
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  position: absolute;
  bottom: 100px;
  right: 30px;
`;

function Forum() {
  const BoardData = {
    type: ['台劇版', '韓劇版', '動畫版', '美劇版'],
  };

  return (
    <Wrapper>
      <WelcomeMessage>歡迎來到 4th forum 一起討論戲劇！</WelcomeMessage>
      <SearchBar type="text" placeholder="請輸入想要查找的文章標題" />
      <Boards>
        {BoardData.type.map((type) => {
          return <div>{type}</div>;
        })}
      </Boards>
      <hr className="my-4" />
      <Btn to="/post">Post</Btn>
      <Articles>
        <Article to="/article">
          <div>28</div>
          <Title>[閒聊] 黑暗榮耀的女主角手法好像某個人</Title>
          <div>ffuri</div>
          <div>3/26</div>
        </Article>
        <Article to="/article">
          <div>72</div>
          <Title>[徵文] 2016 明星韓劇-孤單又燦爛的神 鬼怪</Title>
          <div>fifi</div>
          <div>3/25</div>
        </Article>
        <Article to="/article">
          <div>72</div>
          <Title>[心得] 重看2521才是正確打開這部韓劇的方式</Title>
          <div>tftt</div>
          <div>3/24</div>
        </Article>
        <Article to="/article">
          <div>89</div>
          <Title>[新聞] 李到晛鬆口談《黑暗榮耀》第三季去向！</Title>
          <div>jinnit</div>
          <div>3/24</div>
        </Article>
        <Article to="/article">
          <div>💥</div>
          <Title>[LIVE] Law School/法學院 EP08</Title>
          <div>kkuri</div>
          <div>3/22</div>
        </Article>
        <Pagination>◀ 1 2 3 4 ▶</Pagination>
      </Articles>
    </Wrapper>
  );
}

export default Forum;
