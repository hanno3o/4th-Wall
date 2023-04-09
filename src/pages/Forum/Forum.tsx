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
  margin-bottom: 105px;
`;

const Article = styled(Link)`
  background-color: #dfdfdf;
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
  display: flex;
  gap: 4px;
  position: absolute;
  bottom: 110px;
  left: 50%;
  transform: translate(-50%, 0);
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

interface IArticles {
  id?: string;
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
  const BoardData = {
    type: ['台劇版', '韓劇版', '動畫版', '美劇版'],
  };
  const articlesCollectionRef = collection(
    db,
    'forum',
    'KoreanDrama',
    'articles'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<IArticles[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const currentPageArticles = articles
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return 0;
      }
    })
    .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const getArticles = async () => {
      const articleSnapShot = await getDocs(articlesCollectionRef);
      setArticles(
        articleSnapShot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        })) as IArticles[]
      );
      setIsLoading(true);
    };

    getArticles();
  }, [articlesCollectionRef]);

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
          currentPageArticles.map((article) => {
            return (
              <Article to={`/article/${article.id}`} key={article.id}>
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
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              style={{
                cursor: 'pointer',
                backgroundColor: '#000',
                color: '#fff',
                width: '30px',
                height: '30px',
                fontWeight: '700',
                borderRadius: '5px',
              }}
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          ))}
        </Pagination>
      </Articles>
    </Wrapper>
  );
}

export default Forum;
