import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
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
  font-size: 24px;
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
  id?: string;
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
  const [writtenComment, setWrittenComment] = useState<string>('');
  const articleRef =
    id && boardName ? doc(db, 'forum', boardName, 'articles', id) : undefined;

  const getArticleAndComments = async () => {
    if (articleRef) {
      const articleSnapshot = await getDoc(articleRef);
      setArticle(articleSnapshot.data() as IArticle);
      setIsLoading(false);
      const commentsRef = articleRef && collection(articleRef, 'comments');
      const commentsSnapshot = await getDocs(commentsRef);
      setComments(
        commentsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    }
  };
  useEffect(() => {
    getArticleAndComments();
  }, []);

  const handleCommentInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWrittenComment(e.target.value);
    if (articleRef) {
      await updateDoc(articleRef, { commentsNum: comments.length + 1 });
    }
  };

  const handleUploadComment = async () => {
    try {
      if (articleRef && id) {
        await setDoc(doc(articleRef, 'comments', `${Date.now()}`), {
          date: Date.now(),
          userName: userName,
          comment: writtenComment,
        });
        setWrittenComment('');
        getArticleAndComments();
      }
    } catch (err) {
      console.error('Error uploading comment:', err);
    }
  };

  return (
    <Wrapper
      style={{
        overflowY: 'scroll',
        height: '100vh',
      }}
    >
      {isLoading && <p>loading...</p>}
      {!isLoading && article && (
        <div>
          <ArticleHeader>
            <Title>{`[${article.type}] ${article.title}`}</Title>
            <Info>
              <p>{article.author}</p>
              <p>{article.date && new Date(article.date).toLocaleString()}</p>
            </Info>
          </ArticleHeader>
          <div
            style={{ fontSize: '18px', lineHeight: '32px' }}
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="p-4 mt-8 mx-6"
          />
          <div className="p-4 mt-4 mx-6 h-96">
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '10px',
                }}
              >
                留言區
              </div>
              <div style={{ fontSize: '14px', marginTop: '7px' }}>
                （共有 {comments.length} 則留言）
              </div>
            </div>
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
                  .map((comment, index) => {
                    return (
                      <div>
                        <div
                          key={index}
                          style={{
                            padding: '20px 12px',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            border: '#dcdcdc solid 1px',
                            margin: '10px 0',
                            borderRadius: '5px',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: '16px',
                                marginBottom: '8px',
                                fontWeight: '500',
                              }}
                            >
                              {comment.userName}
                            </div>
                            <div style={{ fontSize: '18px' }}>
                              {comment.comment}
                            </div>
                          </div>

                          <div style={{ marginTop: '24px' }}>
                            {comment.date
                              ? new Date(comment.date).toLocaleString()
                              : null}
                          </div>
                        </div>
                      </div>
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
                    marginBottom: '200px',
                  }}
                />
              )}
              <input
                type="text"
                value={writtenComment}
                placeholder={
                  userName
                    ? '留言.......'
                    : '要先登入才能使用論壇的討論功能喔！'
                }
                style={{
                  cursor: 'text',
                  height: '65px',
                  width: '100%',
                  color: '#2a2a2a',
                  padding: '8px',
                  border: '#898989 solid 1px',
                  borderRadius: '5px',
                  marginTop: '10px',
                  marginBottom: '200px',
                  fontSize: '18px',
                }}
                onChange={handleCommentInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUploadComment();
                  }
                }}
                disabled={!userName}
              />
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
}

export default Article;
