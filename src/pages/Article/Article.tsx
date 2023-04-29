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

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';

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
`;

const ArticleContent = styled.div`
  line-height: 36px;
  width: 1280px;
  ${MEDIA_QUERY_TABLET} {
    width: 65%;
    line-height: 32px;
  }
`;

const ReplyButton = styled.button`
  border-radius: 20px;
  box-shadow: 0 0 0 3px ${(props) => props.theme.black}, 0 0 0 5px transparent;
  &:hover {
    box-shadow: 0 0 0 3px ${(props) => props.theme.black},
      0 0 0 5px rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.25s;
  }
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
  padding: 8px 12px;
  border-radius: 20px;
  filter: brightness(0.9);
  &:hover {
    filter: brightness(1.05);
    scale: 1.05;
    transition: ease-in-out 0.5s;
  }
  ${MEDIA_QUERY_TABLET} {
    font-size: 14px;
  }
`;
const ConfirmButton = styled(CancelButton)`
  background-color: ${(props) => props.theme.white};
  color: ${(props) => props.theme.darkGrey};
  font-weight: 550;
  &:hover {
    background-color: ${(props) => props.theme.white};
    color: ${(props) => props.theme.black};
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
    box-shadow: 0 0 0 5px ${(props) => props.theme.black},
      0 0 0 6px rgba(255, 255, 255, 0.1);
    transition: ease-in-out 0.25s;
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
    <ArticleWrapper
      onClick={() => commentOptionWindow && setCommentOptionWindow(null)}
    >
      {isLoading && <p>loading...</p>}
      {!isLoading && article && (
        <ColumnFlexbox>
          <ArticleHeader>
            <RowFlexbox
              width="1100px"
              margin="0 auto"
              justifyContent="space-between"
              alignItems="center"
            >
              <XLText>{`[${article.type}] ${article.title}`}</XLText>
              <ColumnFlexbox gap="14px">
                <div>{article.author}</div>
                <RowFlexbox gap="8px">
                  <MDText>
                    <FaColumns />
                  </MDText>
                  <MDText>韓劇版</MDText>
                </RowFlexbox>
                <RowFlexbox gap="8px">
                  <MDText>
                    <FaUser />
                  </MDText>
                  <MDText>melody_6_9</MDText>
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
              <LGText>留言區</LGText>
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
                        <Comment key={index}>
                          <ColumnFlexbox gap="8px" width="100%">
                            <RowFlexbox gap="8px" tabletGap="6px">
                              <MDText>{comment.userName}</MDText>
                              <SMGreyText>
                                {comment.userId === userId && '(Me)'}
                              </SMGreyText>
                            </RowFlexbox>
                            <>
                              {editingCommentId === comment.id ? (
                                <CommentEditTextArea
                                  defaultValue={comment.comment}
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
                                <NMText LineHeight="20px">
                                  {comment.comment}
                                </NMText>
                              )}
                            </>
                            <ReplyTo>
                              <MDGreyText>B{index + 1}</MDGreyText>
                              {comment.userId !== userId && (
                                <>
                                  <MDGreyText> · </MDGreyText>
                                  <ReplyButton
                                    onClick={() =>
                                      handleReply(comment.id, index)
                                    }
                                  >
                                    <MDGreyText>回覆</MDGreyText>
                                  </ReplyButton>
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
                                    handleRemoveComment(comment.id);
                                    setCommentOptionWindow(null);
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
                value={writtenComment}
                placeholder={
                  userName
                    ? '留言.......'
                    : '要先登入才能使用論壇的討論功能喔！'
                }
                onChange={(e) => setWrittenComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUploadComment();
                  }
                }}
                disabled={!userName}
              />
              <RowFlexbox gap="4px" justifyContent="flex-end">
                <CancelButton
                  onClick={() => {
                    setWrittenComment('');
                  }}
                >
                  取消
                </CancelButton>
                <ConfirmButton
                  onClick={() => {
                    if (writtenComment) {
                      handleUploadComment();
                    } else {
                      alert('要先留言才可以送出喔！');
                    }
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
