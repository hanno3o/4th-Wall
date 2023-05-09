import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import ReactLoading from 'react-loading';
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
import { FaColumns, FaUser } from 'react-icons/fa';
import { IoIosTime } from 'react-icons/io';
import {
  XLText,
  LGText,
  MDText,
  NMText,
  SMText,
  MDGreyText,
  SMGreyText,
} from '../../style/Text';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai';
import { IoChevronBackCircle } from 'react-icons/io5';
import Swal from 'sweetalert2';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';

const Loading = styled(ReactLoading)`
  margin: 36vh auto;
`;

const ArticleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 70px;
  padding-bottom: 200px;
`;

const ArticleHeader = styled.div`
  background-color: ${(props) => props.theme.darkGrey};
  height: 180px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  position: relative;
`;

const BackButton = styled.button`
  color: ${(props) => props.theme.lightGrey};
  opacity: 0.5;
  position: fixed;
  left: 35px;
  top: 90px;
  font-weight: 900;
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
  &:hover {
    opacity: 1;
    transition: ease-in-out 0.25s;
  }
`;

const ArticleContent = styled.div`
  a {
    color: #7b85c6;
    text-decoration: underline;
  }
  line-height: 32px;
`;

const MoreButton = styled.button`
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  position: absolute;
  top: 4px;
  right: 10px;
  border-radius: 50%;
  padding: 0 5px 10px;
  color: transparent;
  &:hover {
    color: ${(props) => props.theme.white};
    background-color: rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.25s;
  }
`;

const Comment = styled.div`
  padding: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border: 0.5px solid ${(props) => props.theme.grey};
  border-radius: 20px;
  position: relative;

  &:hover {
    ${MoreButton} {
      color: ${(props) => props.theme.white};
    }
  }
`;

const CommentOptions = styled.div`
  cursor: pointer;
  width: 80px;
  flex-direction: column;
  font-size: 14px;
  background-color: ${(props) => props.theme.white};
  border: solid 1px ${(props) => props.theme.lightGrey};
  border-radius: 5px;
  position: absolute;
  top: 6px;
  right: 50px;
  color: ${(props) => props.theme.grey};
`;

const CommentOption = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  height: 42px;
  line-height: 42px;

  &:hover {
    background-color: #e8e8e8;
  }
`;

const ReplyTo = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.lightGrey};
  display: flex;
  gap: 6px;
`;

const CancelButton = styled.button`
  color: ${(props) => props.theme.lightGrey};
  font-size: 16px;
  border: solid 1px transparent;
  padding: 6px 10px;
  border-radius: 20px;
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
`;
const ConfirmButton = styled(CancelButton)`
  background-color: ${(props) => props.theme.lightGrey};
  color: ${(props) => props.theme.darkGrey};
  font-weight: 500;
  &:hover {
    background-color: ${(props) => props.theme.white};
    color: ${(props) => props.theme.black};
    transition: ease-in-out 0.25s;
  }
  &:disabled {
    background-color: ${(props) => props.theme.grey};
    color: ${(props) => props.theme.darkGrey};
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
`;

const CommentDate = styled.div`
  font-size: 14px;
  position: absolute;
  right: 16px;
  bottom: 20px;
`;

const CommentTextArea = styled.textarea`
  cursor: text;
  resize: none;
  line-height: 22px;
  width: 100%;
  border-radius: 20px;
  padding: 18px 16px;
  margin: 10px 0;
  outline: solid 2px transparent;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.1);
  &:focus {
    transition: ease-in-out 0.25s;
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const CommentEditTextArea = styled.textarea`
  line-height: 20px;
  border-radius: 5px;
  resize: none;
  outline: ${(props) => props.theme.grey};
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
  width: 100%;
`;
interface IArticle {
  drama?: string;
  title?: string;
  author?: string;
  authorId?: string;
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
  let navigate = useNavigate();
  const email = useAppSelector((state) => state.user.email);
  const userId = useAppSelector((state) => state.user.id);
  const { boardName, id } = useParams();
  const regex = /\bB\d+\b/g;
  const [floor, setFloor] = useState<number | undefined>();
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
    if (articleRef && commentsRef) {
      const articleSnapshot = await getDoc(articleRef);
      setArticle(articleSnapshot.data() as IArticle);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
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

  const handleUploadComment = async () => {
    try {
      if (articleRef && id && writtenComment) {
        await setDoc(doc(articleRef, 'comments', `${Date.now()}`), {
          date: Date.now(),
          userId: userId,
          comment: writtenComment,
        });
        await updateDoc(articleRef, { commentsNum: comments.length + 1 });
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

  const handleUpdateComment = async (commentId: string | undefined) => {
    if (commentId) setEditingCommentId(commentId);
    try {
      if (commentsRef && updatedComment) {
        const commentRef = doc(commentsRef, commentId);
        await updateDoc(commentRef, { comment: updatedComment });
        handleEditComment('Other word instead of comment id');
        getArticleAndComments();
        setUpdatedComment('');
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
    <ArticleWrapper
      onClick={(e) => {
        const target = e.target as HTMLElement;
        commentOptionWindow && setCommentOptionWindow(null);
        target.tagName !== 'A' && floor && setFloor(undefined);
      }}
    >
      {isLoading && <Loading type="spinningBubbles" color="#fff" />}
      {!isLoading && article && (
        <ColumnFlexbox>
          <ArticleHeader>
            <BackButton onClick={() => navigate(`/forum/${boardName}`)}>
              <IoChevronBackCircle style={{ fontSize: '32px' }} />
            </BackButton>
            <RowFlexbox
              width="1100px"
              margin="0 auto"
              justifyContent="space-between"
              alignItems="center"
            >
              <XLText>{`[${article.type}] ${article.title}`}</XLText>
              <ColumnFlexbox gap="14px">
                <RowFlexbox gap="8px">
                  <MDText>
                    <FaColumns />
                  </MDText>
                  <MDText>
                    {(() => {
                      switch (boardName) {
                        case 'TaiwanDrama':
                          return '台劇版';
                        case 'KoreanDrama':
                          return '韓劇版';
                        case 'AmericanDrama':
                          return '美劇版';
                        case 'JapaneseDrama':
                          return '日劇版';
                        case 'ChinaDrama':
                          return '陸劇版';
                        default:
                          return boardName;
                      }
                    })()}
                  </MDText>
                </RowFlexbox>
                <RowFlexbox gap="8px">
                  <MDText>
                    <FaUser />
                  </MDText>
                  <MDText>{article.author}</MDText>
                </RowFlexbox>
                <RowFlexbox gap="8px">
                  <MDText>
                    <IoIosTime />
                  </MDText>
                  <MDText>
                    {article.date &&
                      new Date(article.date).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                  </MDText>
                </RowFlexbox>
              </ColumnFlexbox>
            </RowFlexbox>
          </ArticleHeader>
          <ColumnFlexbox width="1100px" margin="40px auto">
            <ArticleContent
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            <RowFlexbox alignItems="flex-end" margin="60px 0 0 0">
              <LGText id="B1">留言區</LGText>
              <SMGreyText>（共有 {comments.length} 則留言）</SMGreyText>
            </RowFlexbox>
            <ColumnFlexbox gap="8px" margin="20px 0 0 0 ">
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
                      <>
                        <Comment
                          key={index}
                          id={`B${index + 2}`}
                          style={{
                            background:
                              floor === index + 1
                                ? 'linear-gradient(to left, rgba(252,51,68,0.3), rgba(78,94,235,0.3))'
                                : '',
                          }}
                        >
                          <ColumnFlexbox gap="8px" width="100%">
                            <RowFlexbox gap="8px" tabletGap="6px">
                              <MDText>{comment.userName}</MDText>
                              <MDGreyText>
                                {comment.userId === userId && '(Me)'}
                              </MDGreyText>
                            </RowFlexbox>
                            <>
                              {editingCommentId === comment.id ? (
                                <CommentEditTextArea
                                  defaultValue={comment.comment}
                                  maxLength={100}
                                  onChange={(e) => {
                                    setUpdatedComment(e.target.value);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleUpdateComment(comment.id);
                                    }
                                  }}
                                />
                              ) : (
                                <NMText
                                  LineHeight="20px"
                                  style={{ wordBreak: 'break-word' }}
                                >
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        (comment?.comment &&
                                          comment.comment.replace(
                                            regex,
                                            `<a href="#$&" style="color:#7b85c6;">$&</a>`
                                          )) ||
                                        '',
                                    }}
                                    onClick={(e) => {
                                      const target = e.target as HTMLElement;
                                      if (target.tagName === 'A') {
                                        target.textContent &&
                                          setFloor(
                                            parseInt(
                                              target.textContent.slice(1)
                                            )
                                          );
                                      }
                                    }}
                                  />
                                </NMText>
                              )}
                            </>
                            <ReplyTo>
                              <MDGreyText>B{index + 1}</MDGreyText>
                              {comment.userId !== userId && (
                                <>
                                  <MDGreyText> · </MDGreyText>
                                  <a href="#comment-textarea">
                                    <button
                                      disabled={!email}
                                      onClick={() =>
                                        email && handleReply(comment.id, index)
                                      }
                                    >
                                      <MDGreyText>回覆</MDGreyText>
                                    </button>
                                  </a>
                                </>
                              )}
                            </ReplyTo>
                          </ColumnFlexbox>
                          <CommentDate>
                            {comment.date
                              ? new Date(comment.date).toLocaleString(
                                  undefined,
                                  {
                                    year: 'numeric',
                                    month: 'numeric',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                  }
                                )
                              : null}
                          </CommentDate>
                          {comment.userId === userId && (
                            <RowFlexbox
                              onClick={() => {
                                if (commentOptionWindow === comment.id) {
                                  setCommentOptionWindow(null);
                                }
                              }}
                            >
                              <MoreButton
                                onClick={() => showCommentOptions(comment.id)}
                              >
                                ...
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
                                  onClick={() => {
                                    handleEditComment(comment.id);
                                    setCommentOptionWindow(null);
                                  }}
                                >
                                  <AiOutlineEdit
                                    style={{
                                      fontSize: '18px',
                                      color: '#bbb',
                                    }}
                                  />
                                  <SMText>編輯</SMText>
                                </CommentOption>
                                <CommentOption
                                  onClick={() => {
                                    Swal.fire({
                                      text: '確定要刪除這則留言嗎？',
                                      icon: 'warning',
                                      width: 300,
                                      reverseButtons: true,
                                      showCancelButton: true,
                                      cancelButtonText: '取消',
                                      confirmButtonText: '刪除',
                                      iconColor: '#bbb',
                                      confirmButtonColor: '#555',
                                      cancelButtonColor: '#b0b0b0',
                                    }).then((res) => {
                                      if (res.isConfirmed) {
                                        handleRemoveComment(comment.id);
                                        setCommentOptionWindow(null);
                                        Swal.fire({
                                          title: '已刪除留言',
                                          width: 300,
                                          icon: 'success',
                                          iconColor: '#bbb',
                                          confirmButtonColor: '#555',
                                        });
                                      }
                                    });
                                  }}
                                >
                                  <AiOutlineDelete
                                    style={{
                                      fontSize: '18px',
                                      color: '#bbb',
                                    }}
                                  />
                                  <SMText>刪除</SMText>
                                </CommentOption>
                              </CommentOptions>
                            </RowFlexbox>
                          )}
                        </Comment>
                      </>
                    );
                  })}
            </ColumnFlexbox>
            <ColumnFlexbox alignItems="center" gap="8px" margin="10px 0 0 0">
              <CommentTextArea
                id="comment-textarea"
                value={writtenComment}
                placeholder={
                  email
                    ? '留言.......'
                    : '要先登入才能使用論壇的討論及回覆功能喔！'
                }
                maxLength={100}
                onChange={(e) => setWrittenComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const matchBNumberWrittenComment =
                      writtenComment.match(regex);
                    matchBNumberWrittenComment &&
                      matchBNumberWrittenComment.forEach((match) => {
                        const number = parseInt(match.substring(1));
                        if (number > comments.length) {
                          Swal.fire({
                            text: '此樓層不存在，無法進行回覆',
                            width: 350,
                            icon: 'warning',
                            iconColor: '#bbb',
                            confirmButtonColor: '#555',
                          });
                          return;
                        } else {
                          handleUploadComment();
                        }
                      });
                  }
                }}
                disabled={!email}
              />
              <RowFlexbox gap="4px" justifyContent="flex-end">
                <CancelButton
                  disabled={!writtenComment}
                  onClick={() => {
                    setWrittenComment('');
                  }}
                >
                  取消
                </CancelButton>
                <ConfirmButton
                  disabled={!email || !writtenComment}
                  onClick={() => {
                    const matchBNumberWrittenComment =
                      writtenComment.match(regex);
                    matchBNumberWrittenComment &&
                      matchBNumberWrittenComment.forEach((match) => {
                        const number = parseInt(match.substring(1));
                        if (number > comments.length) {
                          Swal.fire({
                            text: '此樓層不存在，無法進行回覆',
                            width: 350,
                            icon: 'warning',
                            iconColor: '#bbb',
                            confirmButtonColor: '#555',
                          });
                          return;
                        } else {
                          handleUploadComment();
                        }
                      });
                  }}
                >
                  送出
                </ConfirmButton>
              </RowFlexbox>
            </ColumnFlexbox>
          </ColumnFlexbox>
        </ColumnFlexbox>
      )}
    </ArticleWrapper>
  );
}

export default Article;
