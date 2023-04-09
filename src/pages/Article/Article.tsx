import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase.config';
import { doc, getDoc } from 'firebase/firestore';

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

interface Article {
  drama?: string;
  title?: string;
  author?: string;
  content: string;
  episode?: string;
  type?: string;
  date?: Date;
}

function Article() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [article, setArticle] = useState<Article>();
  const articleRef = id
    ? doc(db, 'forum', 'KoreanDrama', 'articles', id)
    : undefined;

  useEffect(() => {
    async function getArticle() {
      if (articleRef) {
        const articleSnapshot = await getDoc(articleRef);
        setArticle(articleSnapshot.data() as Article);
        setIsLoading(false);
      }
    }
    getArticle();
  }, [id, articleRef]);
  console.log(article);
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
            <div className="flex justify-between w-full">
              <div>furri: 韓國人說要當演員的人都開去看金編的劇，是教科書</div>
              <div>03/27 22:26</div>
            </div>
            <div className="flex justify-between w-full">
              <div>
                hanno3o: 到底要以編劇為主還是演員為主 還是觀眾自己解讀為主
              </div>
              <div>03/27 23:04</div>
            </div>
            <div className="flex justify-between w-full">
              <div>oliva: 最近重溫鬼怪， 金編的台詞都很有深度</div>
              <div>03/28 00:26</div>
            </div>
            <div className="flex justify-between w-full">
              <div>jpeg: 結果演員跟編劇想法不太一樣，這也是很妙XD</div>
              <div>03/28 00:34</div>
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
}

export default Article;
