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
  deleteDoc,
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
  padding: 30px 330px;
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

const MoreButton = styled.div`
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  top: 4px;
  right: 10px;
  border-radius: 50%;
  padding: 0 5px 10px;
  color: transparent;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const Comment = styled.div`
  padding: 20px 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: #dcdcdc solid 1px;
  margin: 10px 0;
  border-radius: 5px;
  position: relative;

  &:hover {
    ${MoreButton} {
      color: #2a2a2a;
    }
  }
`;

const CommentOptions = styled.div`
  cursor: pointer;
  flex-direction: column;
  font-size: 14px;
  background-color: #fff;
  border: solid 1px #eee;
  border-radius: 4px;
  width: 80px;
  /* padding: 16px; */
  box-shadow: 2px 2px 4px #bdbdbd;
  position: absolute;
  top: 4px;
  right: 50px;
`;

const CommentOption = styled.div`
  height: 42px;
  line-height: 42px;
  padding-left: 12px;

  &:hover {
    background-color: #f5f5f5;
  }
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
  userId?: string;
  comment?: string;
  date?: Date;
}

function Article() {
  const userName = useAppSelector((state) => state.user.userName);
  const avatar = useAppSelector((state) => state.user.avatar);
  const userId = useAppSelector((state) => state.user.id);
  const { boardName, id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<IArticle>();
  const [comments, setComments] = useState<IComments[]>([]);
  const [writtenComment, setWrittenComment] = useState<string>('');
  const [commentOptionWindow, setCommentOptionWindow] = useState<
    string | undefined | null
  >();
  const [editingCommentId, setEditingCommentId] = useState('');
  const [updatedComment, setUpdatedComment] = useState('');
  const articleRef =
    id && boardName ? doc(db, 'forum', boardName, 'articles', id) : undefined;
  const commentsRef = articleRef && collection(articleRef, 'comments');

  useEffect(() => {
    getArticleAndComments();
  }, []);

  const getArticleAndComments = async () => {
    if (articleRef && commentsRef && userId) {
      const articleSnapshot = await getDoc(articleRef);
      setArticle(articleSnapshot.data() as IArticle);
      setIsLoading(false);

      const commentsSnapshot = await getDocs(commentsRef);
      const commentsArr: any = [];
      for (const singleDoc of commentsSnapshot.docs) {
        const commentData = singleDoc.data();
        const commentUserId = commentData.userId;
        const userDoc = await getDoc(doc(db, 'users', commentUserId));
        const userData = userDoc.data();
        const comment = {
          ...commentData,
          id: singleDoc.id,
          userName: userData?.userName || '',
        };
        commentsArr.push(comment);
      }
      setComments(commentsArr);
    }
  };

  const handleCommentInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWrittenComment(e.target.value);
    if (articleRef) {
      await updateDoc(articleRef, { commentsNum: comments.length + 1 });
    }
  };

  const handleUploadComment = async () => {
    try {
      if (articleRef && id && writtenComment) {
        await setDoc(doc(articleRef, 'comments', `${Date.now()}`), {
          date: Date.now(),
          userId: userId,
          comment: writtenComment,
        });
        setWrittenComment('');
        getArticleAndComments();
      }
    } catch (err) {
      console.error('Error uploading comment:', err);
    }
  };

  const showCommentOptions = (commentId: string | undefined) => {
    if (commentId) setCommentOptionWindow(commentId);
  };

  const handleEditComment = (commentId: string | undefined) => {
    if (commentId) setEditingCommentId(commentId);
  };

  const handleUpdatedCommentInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdatedComment(e.target.value);
  };

  const handleUpdateComment = async (commentId: string | undefined) => {
    if (commentId) setEditingCommentId(commentId);
    try {
      if (commentsRef && updatedComment) {
        const commentRef = doc(commentsRef, commentId);
        await updateDoc(commentRef, { comment: updatedComment });
        handleEditComment('Other word instead of comment id');
        getArticleAndComments();
      }
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };

  const handleRemoveComment = async (commentId: string | undefined) => {
    try {
      if (commentsRef) {
        const commentRef = doc(commentsRef, commentId);
        await deleteDoc(commentRef);
        alert('已刪除留言');
        getArticleAndComments();
        await updateDoc(articleRef, { commentsNum: comments.length - 1 });
      }
    } catch (err) {
      console.error('Error Removing comment:', err);
    }
  };

  const handleReply = (commentId: string | undefined, index: number) => {
    if (commentId) {
      setWrittenComment(`B${index + 1} `);
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
          <div style={{ width: '70%', margin: '0 auto' }}>
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
                          new Date(a.date).getTime() -
                          new Date(b.date).getTime()
                        );
                      } else {
                        return 0;
                      }
                    })
                    .map((comment, index) => {
                      return (
                        <>
                          <Comment key={index}>
                            <div>
                              <div
                                style={{
                                  fontSize: '14px',
                                  paddingLeft: '4px',
                                  fontWeight: '500',
                                  marginBottom: '4px',
                                }}
                              >
                                {comment.userName}
                              </div>
                              <div>
                                {editingCommentId === comment.id ? (
                                  <input
                                    style={{
                                      border: '#a1a1a1 solid 1px',
                                      padding: '4px 4px',
                                      borderRadius: '5px',
                                      width: '1060px',
                                      marginBottom: '4px',
                                    }}
                                    type="text"
                                    onChange={handleUpdatedCommentInputChange}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleUpdateComment(comment.id);
                                      }
                                    }}
                                  />
                                ) : (
                                  <input
                                    style={{
                                      backgroundColor: 'transparent',
                                      padding: '4px 4px',
                                      borderRadius: '5px',
                                      width: '1190px',
                                      marginBottom: '4px',
                                    }}
                                    type="text"
                                    value={comment.comment}
                                    disabled
                                  />
                                )}
                              </div>
                              <div
                                style={{
                                  paddingLeft: '4px',
                                  fontSize: '14px',
                                  color: '#585858',
                                  display: 'flex',
                                  gap: '6px',
                                }}
                              >
                                <div>B{index + 1}</div>
                                {comment.userId !== userId && (
                                  <>
                                    <div> · </div>
                                    <button
                                      onClick={() =>
                                        handleReply(comment.id, index)
                                      }
                                    >
                                      回覆
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                            <div
                              style={{
                                marginTop: '24px',
                                position: 'absolute',
                                right: '10px',
                              }}
                            >
                              {comment.date
                                ? new Date(comment.date).toLocaleString()
                                : null}
                            </div>
                            {comment.userId === userId && (
                              <div
                                onClick={() => {
                                  if (commentOptionWindow === comment.id) {
                                    setCommentOptionWindow(null);
                                  }
                                }}
                              >
                                <MoreButton
                                  onClick={() => showCommentOptions(comment.id)}
                                >
                                  …
                                </MoreButton>
                                <CommentOptions
                                  style={{
                                    display:
                                      commentOptionWindow === comment.id
                                        ? 'flex'
                                        : 'none',
                                  }}
                                >
                                  <CommentOption
                                    onClick={() =>
                                      handleEditComment(comment.id)
                                    }
                                  >
                                    🖋 編輯
                                  </CommentOption>
                                  <CommentOption
                                    onClick={() =>
                                      handleRemoveComment(comment.id)
                                    }
                                  >
                                    🗑 刪除
                                  </CommentOption>
                                </CommentOptions>
                              </div>
                            )}
                          </Comment>
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
        </div>
      )}
    </Wrapper>
  );
}

export default Article;
