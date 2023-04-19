import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../config/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { useAppSelector } from '../../redux/hooks';

const Wrapper = styled.div`
  width: 75%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
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
  height: 36px;
  width: 100%;
  padding: 10px;
`;

const Boards = styled.div`
  cursor: pointer;
  display: flex;
  margin-top: 30px;
  font-weight: 500;
  align-items: center;
  gap: 8px;
`;

const Board = styled(Link)<ISelectedBoardProps>`
  font-weight: 500;
  height: 30px;
  padding: 0 8px 8px;
  ${(props) =>
    props.selectedBoard &&
    props.selectedBoard.includes(props.children as string) &&
    `
    border-bottom: #3f3a3a 4px solid;
    `}
`;

const Articles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 105px;
`;

const Article = styled(Link)`
  border: #d4d4d4 solid 1px;
  border-radius: 5px;
  box-shadow: 1px 1px 4px #bdbdbd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 40px 30px;
  height: 70px;
`;

const Title = styled.div`
  text-align: left;
  font-weight: 700;
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
  commentsNum?: number;
}

interface ISelectedBoardProps {
  selectedBoard?: string | undefined;
  boardName?: string | undefined;
}

function Forum() {
  const { boardName } = useParams();
  const BoardsData = {
    boards: [
      { Chinese: '台劇版', English: 'TaiwanDrama' },
      { Chinese: '韓劇版', English: 'KoreanDrama' },
      { Chinese: '日劇版', English: 'JapaneseDrama' },
      { Chinese: '美劇版', English: 'AmericanDrama' },
      { Chinese: '陸劇版', English: 'ChinaDrama' },
    ],
  };
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<IArticles[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string | undefined>('');
  const [searchWords, setSearchWords] = useState('');
  const [board, setBoard] = useState<string>('TaiwanDrama');
  const userName = useAppSelector((state) => state.user.userName);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 10;
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const keyword = urlSearchParams.get('keyword');

  const displayedArticles = articles.filter((article) =>
    article.title?.includes(searchWords)
  );

  const currentPageArticles = displayedArticles
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

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWords(e.target.value);
    const searchParams = new URLSearchParams();
    const currentPath = window.location.pathname;
    e.target.value !== '' && searchParams.append('keyword', e.target.value);
    const queryString = searchParams.toString();
    const url = queryString ? `${currentPath}?${queryString}` : currentPath;
    window.history.replaceState(null, '', url);
  };

  useEffect(() => {
    setSearchWords(keyword ?? '');
    if (boardName === 'TaiwanDrama') {
      setSelectedBoard('台劇版');
    } else if (boardName === 'KoreanDrama') {
      setSelectedBoard('韓劇版');
    } else if (boardName === 'JapaneseDrama') {
      setSelectedBoard('日劇版');
    } else if (boardName === 'AmericanDrama') {
      setSelectedBoard('美劇版');
    } else if (boardName === 'ChinaDrama') {
      setSelectedBoard('陸劇版');
    }
    setBoard(boardName ? boardName : 'TaiwanDrama');
    const articlesCollectionRef = collection(db, 'forum', board, 'articles');
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
  }, [board]);

  return (
    <Wrapper>
      <WelcomeMessage>歡迎來到 4th forum 一起討論戲劇！</WelcomeMessage>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translate(0, -50%)',
          }}
        >
          🔍
        </div>
        <SearchBar
          style={{ paddingLeft: '40px' }}
          type="text"
          placeholder="請輸入想要查找的文章標題"
          value={searchWords}
          onChange={handleSearchInput}
        />
      </div>
      <Boards>
        {BoardsData.boards.map((board, index) => {
          return (
            <Board
              key={index}
              to={`/forum/${board.English}`}
              onClick={() => {
                setSelectedBoard(board.Chinese);
                setBoard(board.English);
                setSearchWords('');
              }}
              selectedBoard={selectedBoard}
            >
              {board.Chinese}
            </Board>
          );
        })}
      </Boards>
      <hr className="mb-3" />
      {userName ? (
        <Btn to={`/forum/${board}/post`}>Post</Btn>
      ) : (
        <Btn to="" onClick={() => alert('要先登入才能發布文章喔！')}>
          Post
        </Btn>
      )}
      <Articles>
        {isLoading &&
          currentPageArticles.map((article) => {
            return (
              <Article
                to={`/forum/${boardName}/article/${article.id}`}
                key={article.id}
              >
                <div>
                  {!!article.commentsNum ? (
                    <div
                      style={{
                        flexGrow: '1',
                        fontWeight: '900',
                        fontSize: '24px',
                        width: '40px',

                        color:
                          article.commentsNum <= 10
                            ? '#a2c548'
                            : article.commentsNum <= 99
                            ? '#ecba5c'
                            : '#cb322c',
                      }}
                    >
                      {article.commentsNum >= 100 ? '爆' : article.commentsNum}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontWeight: '900',
                        fontSize: '24px',
                        width: '40px',
                        color: 'transparent',
                      }}
                    ></div>
                  )}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: '2',
                    marginLeft: '20px',
                  }}
                >
                  <Title>
                    [{article.type}] {article.title}
                  </Title>
                  <div
                    style={{
                      width: '50px',
                      flexGrow: '1',
                      fontSize: '14px',
                      marginTop: '10px',
                      textAlign: 'left',
                      color: '#a3a3a3',
                      fontWeight: '700',
                    }}
                  >
                    {article.author}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '400',
                  }}
                >
                  {article.date &&
                    new Date(article.date).toLocaleString(undefined, {
                      year: 'numeric',
                      month: 'numeric',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
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
