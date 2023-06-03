import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../config/firebase.config';
import { collection, getDocs, getDoc, doc, setDoc } from 'firebase/firestore';
import { useAppSelector } from '../../redux/hooks';
import { FaPen } from 'react-icons/fa';
import SearchBar from '../../components/SearchBar';
import {
  XLText,
  MDText,
  MDGreyText,
  SMGreyText,
  XSGreyText,
  LGText,
} from '../../style/Text';
import { ColumnFlexbox, RowFlexbox } from '../../style/Flexbox';
import Swal from 'sweetalert2';
import { boardNames } from '../../utils/constants';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

const ForumPageWrapper = styled.div`
  width: 1280px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding-top: 140px;

  ${MEDIA_QUERY_TABLET} {
    width: 65%;
  }

  ${MEDIA_QUERY_MOBILE} {
    width: 480px;
  }
`;

const BoardsWrapper = styled.div`
  margin: 42px auto 0;
  display: flex;
  flex-direction: column;
  ${MEDIA_QUERY_TABLET} {
    margin: 30px auto 0;
  }
`;

const Board = styled(Link)<ISelectedBoardProps>`
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 10px;
  letter-spacing: 0.5px;
  ${(props) =>
    props.selectedBoard &&
    props.selectedBoard.includes(props.children as string) &&
    `
    border-bottom: white 4px solid;
    `}
  ${MEDIA_QUERY_TABLET} {
    padding: 8px 12px;
    font-size: 16px;
    ${(props) =>
      props.selectedBoard &&
      props.selectedBoard.includes(props.children as string) &&
      `
  border-bottom: #fff 3.5px solid;
  `}
  }
  ${MEDIA_QUERY_MOBILE} {
    padding: 6px 8px;
    ${(props) =>
      props.selectedBoard &&
      props.selectedBoard.includes(props.children as string) &&
      `
    border-bottom: white 2.5px solid;
    `}
  }
`;

const Article = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 50px 8px;
  height: 70px;
  ${MEDIA_QUERY_MOBILE} {
    padding: 1px 0px 2px 10px;
  }
`;

const CommentNumOfArticle = styled.div`
  width: 50px;
`;

const Pagination = styled.div`
  display: flex;
  position: absolute;
  bottom: 130px;
  left: 50%;
  transform: translate(-50%, 0);
  gap: 4px;
`;

const PaginationButton = styled.button`
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  width: 26px;
  height: 26px;
  font-weight: 500;
  color: ${(props) => props.theme.lightGrey};
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: ${(props) => props.theme.white};
    transition: ease-in-out 0.25s;
    font-weight: 500;
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 12px;
    width: 20px;
    height: 20px;
  }
`;

const fade = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
`;

const MdTextSkeleton = styled(MDText)`
  width: 220px;
  height: 16px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.grey};
  animation: ${fade} 1s linear infinite;
`;

const SmGreyTextSkeleton = styled(SMGreyText)`
  width: 600px;
  height: 14px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.grey};
  animation: ${fade} 1s linear infinite;
`;

const XsGreyTextSkeleton = styled(XSGreyText)`
  width: 50px;
  height: 12px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.grey};
  animation: ${fade} 1s linear infinite;
`;

const Spoiler = styled.div`
  width: 600px;
  height: 18px;
  background-color: rgba(255, 255, 255, 0.25);
  ${MEDIA_QUERY_TABLET} {
    width: 400px;
    height: 16px;
  }
`;

const PostButton = styled(Link)`
  background-color: rgba(255, 255, 255, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  position: fixed;
  z-index: 1;
  bottom: 60px;
  right: 40px;
  font-size: 16px;
  &:hover {
    color: ${(props) => props.theme.black};
    background-color: ${(props) => props.theme.white};
    scale: 1.05;
    transition: ease-in-out 0.25s;
    font-size: 18px;
  }
`;

const DividerLine = styled.div`
  border-bottom: solid 1px ${(props) => props.theme.grey};
`;

interface IArticles {
  id?: string;
  drama?: string;
  title?: string;
  authorId?: string;
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

export default function Forum() {
  const { boardName } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<IArticles[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string | undefined>('');
  const [searchWords, setSearchWords] = useState('');
  const [board, setBoard] = useState<string>(boardNames.TaiwanDrama);
  const email = useAppSelector((state) => state.user.email);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 15;
  const totalPages = Math.ceil(articles.length / PAGE_SIZE);
  const urlSearchParams = new URLSearchParams(window.location.search);
  const keyword = urlSearchParams.get('keyword');
  const currentDate = new Date();
  const spoilerKeywords = ['雷', '劇透'];

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

  const getArticles = async () => {
    try {
      if (boardName) {
        const articlesCollectionRef = collection(
          db,
          'forum',
          boardName,
          'articles'
        );
        const articleSnapShot = await getDocs(articlesCollectionRef);
        const updatePromises: Promise<void>[] = [];
        const articleArr: IArticles[] = [];
        for (const singleDoc of articleSnapShot.docs) {
          const articleData = singleDoc.data();
          const articleUserId = articleData.authorId;
          const userDoc = await getDoc(doc(db, 'users', articleUserId));
          const userData = userDoc.data();
          const article = {
            ...articleData,
            id: singleDoc.id,
            author: userData?.userName || '',
          };
          articleArr.push(article);
          const articleDocRef = doc(articlesCollectionRef, singleDoc.id);
          const updatePromise = setDoc(
            articleDocRef,
            {
              author: userData?.userName || '',
            },
            { merge: true }
          );
          updatePromises.push(updatePromise);
        }
        setArticles(articleArr);
        await Promise.all(updatePromises);
        setTimeout(() => {
          setIsLoading(true);
        }, 100);
      }
    } catch (error) {
      console.error('Error getting articles: ', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSearchWords(keyword ?? '');
    boardName
      ? setSelectedBoard(boardNames[boardName as keyof typeof boardNames])
      : setSelectedBoard(boardNames.TaiwanDrama);

    setBoard(boardName ? boardName : 'TaiwanDrama');

    getArticles();
  }, [board]);

  return (
    <ForumPageWrapper>
      <XLText margin="0 auto 26px">歡迎來到 4th forum 一起討論戲劇！</XLText>
      <SearchBar
        width="60%"
        margin="0 auto"
        value={searchWords}
        placeHolder="請輸入想要查找的文章標題"
        onChange={handleSearchInput}
      />
      <BoardsWrapper>
        <RowFlexbox mobileJustifyContent="space-between">
          {Object.keys(boardNames).map((englishName, index) => {
            const chineseName =
              boardNames[englishName as keyof typeof boardNames];
            return (
              <Board
                key={index}
                onClick={() => {
                  setBoard(englishName);
                  setSelectedBoard(chineseName);
                  setSearchWords('');
                  handlePageChange(1);
                }}
                to={`/forum/${englishName}`}
                selectedBoard={selectedBoard}
              >
                {chineseName}
              </Board>
            );
          })}
        </RowFlexbox>
      </BoardsWrapper>
      <DividerLine />
      {email ? (
        <PostButton to={`/forum/${board}/post`}>
          <FaPen />
        </PostButton>
      ) : (
        <PostButton
          to=""
          onClick={() =>
            Swal.fire({
              title: '要先登入才能發布文章喔！',
              icon: 'warning',
              iconColor: '#bbb',
              confirmButtonColor: '#555',
            })
          }
        >
          <FaPen />
        </PostButton>
      )}
      <ColumnFlexbox gap="10px" margin="10px 0 125px 0">
        {isLoading
          ? currentPageArticles.map((article) => {
              return (
                <>
                  <Article
                    to={`/forum/${boardName}/${article.id}`}
                    key={article.id}
                  >
                    <RowFlexbox>
                      {!!article.commentsNum ? (
                        <CommentNumOfArticle
                          style={{
                            color:
                              article.commentsNum <= 10
                                ? '#a2c548'
                                : article.commentsNum <= 99
                                ? '#ecba5c'
                                : '#cb322c',
                          }}
                        >
                          {article.commentsNum >= 100
                            ? '爆'
                            : article.commentsNum}
                        </CommentNumOfArticle>
                      ) : (
                        <CommentNumOfArticle>-</CommentNumOfArticle>
                      )}
                    </RowFlexbox>
                    <ColumnFlexbox gap="8px" flexGrow="2">
                      <MDText>
                        [{article.type}] {article.title}
                      </MDText>
                      {spoilerKeywords.some(
                        (keyword) =>
                          article?.title?.includes(keyword) ||
                          article?.content?.includes(keyword)
                      ) ? (
                        <Spoiler />
                      ) : (
                        <MDGreyText>
                          {article.content
                            ?.replace(/(<([^>]+)>)/gi, '')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .slice(0, 45)}
                          ...
                        </MDGreyText>
                      )}
                      <XSGreyText>{article.author}</XSGreyText>
                    </ColumnFlexbox>
                    <SMGreyText margin="40px 0 0 0">
                      {article.date
                        ? new Date(article.date).getFullYear() !==
                          currentDate.getFullYear()
                          ? new Date(article.date).toLocaleDateString()
                          : new Date(article.date).toLocaleDateString(
                              undefined,
                              {
                                month: 'numeric',
                                day: 'numeric',
                              }
                            )
                        : null}
                    </SMGreyText>
                  </Article>
                  <DividerLine />
                </>
              );
            })
          : currentPageArticles.map(() => {
              return (
                <>
                  <Article to="">
                    <ColumnFlexbox
                      gap="10px"
                      margin="0 0 0 50px"
                      justifyContent="space-between"
                      flexGrow="2"
                    >
                      <MdTextSkeleton />
                      <SmGreyTextSkeleton />
                      <XsGreyTextSkeleton />
                    </ColumnFlexbox>
                    <XsGreyTextSkeleton margin="40px 0 0 0" />
                  </Article>
                  <DividerLine />
                </>
              );
            })}
        <Pagination>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationButton
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
              style={
                page === currentPage
                  ? {
                      backgroundColor: '#bbb',
                      color: '#181818',
                      fontWeight: 500,
                    }
                  : {}
              }
            >
              {page}
            </PaginationButton>
          ))}
        </Pagination>
      </ColumnFlexbox>
    </ForumPageWrapper>
  );
}
