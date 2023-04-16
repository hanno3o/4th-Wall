import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useAppSelector } from '../../redux/hooks';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ArticleHeader = styled.div`
  background-color: #4e4d4d;
  color: #fff;
  padding: 30px 45px;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
`;

const Info = styled.div`
  display: flex;
  gap: 30px;
`;

interface IArticle {
  drama?: string;
  title?: string;
  author?: string;
  content: string;
  episode?: string;
  type?: string;
  date?: Date;
}

interface IComments {
  userName?: string;
  comment?: string;
  date?: Date;
}

function Article() {
  const userName = useAppSelector((state) => state.user.userName);
  const avatar = useAppSelector((state) => state.user.avatar);
  const { boardName, id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<IArticle>();
  const [comments, setComments] = useState<IComments[]>([]);
  const articleRef =
    id && boardName ? doc(db, 'forum', boardName, 'articles', id) : undefined;

  useEffect(() => {
    async function getArticle() {
      if (articleRef) {
        const articleSnapshot = await getDoc(articleRef);
        setArticle(articleSnapshot.data() as IArticle);
        setIsLoading(false);
        const commentsRef = articleRef && collection(articleRef, 'comments');
        const commentsSnapshot = await getDocs(commentsRef);
        setComments(commentsSnapshot.docs.map((doc) => doc.data()));
      }
    }

    getArticle();
  }, []);

  return (
    <Wrapper>
      {isLoading && <p>loading...</p>}
      {!isLoading && article && (
        <>
          <ArticleHeader>
            <Title>{`[${article.type}] ${article.title}`}</Title>
            <Info>
              <p>{article.author}</p>
              <p>{article.date && new Date(article.date).toLocaleString()}</p>
            </Info>
          </ArticleHeader>
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="p-4 leading-6 mt-8 mx-6"
          />
          <div className="p-4 leading-6 mt-4 mx-6 h-96">
            <hr className="my-4"></hr>
            <div>
              {comments &&
                comments
                  .sort((a, b) => {
                    if (a.date && b.date) {
                      return (
                        new Date(a.date).getTime() - new Date(b.date).getTime()
                      );
                    } else {
                      return 0;
                    }
                  })
                  .map((comment) => {
                    return (
                      <>
                        <div className="flex justify-between w-full">
                          <div>
                            {comment.userName}:{comment.comment}
                          </div>
                          <div>
                            {comment.date
                              ? new Date(comment.date).toLocaleString()
                              : null}
                          </div>
                        </div>
                      </>
                    );
                  })}
            </div>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px 0',
                marginTop: '10px',
              }}
            >
              {avatar && (
                <img
                  src={avatar}
                  alt=""
                  style={{
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    objectFit: 'cover',
                  }}
                />
              )}
              <input
                type="text"
                placeholder={
                  userName
                    ? '留言.......'
                    : '要先登入才能使用論壇的討論功能喔！'
                }
                style={{
                  cursor: 'text',
                  height: '40px',
                  width: '100%',
                  fontSize: '16px',
                  color: '#2a2a2a',
                  padding: '8px',
                  border: '#898989 solid 1px',
                  borderRadius: '5px',
                }}
                disabled={!userName}
              />
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
}

export default Article;
