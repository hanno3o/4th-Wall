import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { db } from '../../config/firebase.config';
import { collection, getDocs } from 'firebase/firestore';

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
  width: 360px;
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

interface Article {
  drama?: string;
  title?: string;
  author?: string;
  episodes?: string;
  content?: string;
  type?: string;
  date?: Date;
  commentsNum?: number | string;
}

function Forum() {
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const articlesCollectionRef = collection(
    db,
    'forum',
    'KoreanDrama',
    'articles'
  );

  const BoardData = {
    type: ['台劇版', '韓劇版', '動畫版', '美劇版'],
  };

  useEffect(() => {
    const getArticles = async () => {
      const articleSnapShot = await getDocs(articlesCollectionRef);
      setArticles(
        articleSnapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as Article[]
      );
      setIsLoading(true);
    };

    getArticles();
  }, []);

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
        {isLoading &&
          articles
            .sort((a, b) => {
              if (a.date && b.date) {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              } else {
                return 0;
              }
            })
            .map((article, index) => {
              return (
                <Article to="/article" key={index}>
                  <div>{article.commentsNum}</div>
                  <Title>
                    [{article.type}] {article.title}
                  </Title>
                  <div style={{ textAlign: 'left', width: '50px' }}>
                    {article.author}
                  </div>
                  <div>
                    {article.date && new Date(article.date).toLocaleString()}
                  </div>
                </Article>
              );
            })}
        <Pagination>◀ 1 2 3 4 ▶</Pagination>
      </Articles>
    </Wrapper>
  );
}

export default Forum;
