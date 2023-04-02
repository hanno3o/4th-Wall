import styled from 'styled-components';
import { db } from '../../firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const Wrapper = styled.div`
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SearchBar = styled.input`
  border-radius: 5px;
  border: #b6b6b6 solid 1px;
  height: 30px;
  width: 100%;
  padding: 10px;
`;

const FilterSection = styled.div`
  margin-top: 30px;
`;

const FilterNavBar = styled.div`
  display: flex;
  gap: 30px;
  font-weight: 500;
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Options = styled.div`
  display: flex;
`;

const Label = styled.label`
  margin-right: 20px;
  font-weight: 500;
`;

const Option = styled.div`
  display: flex;
  margin-right: 8px;
  font-weight: 200;
`;

const DramasSection = styled.div`
  margin-top: 40px;
  margin-bottom: 100px;
  display: flex;
  gap: 18px;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const Drama = styled.div`
  cursor: pointer;
  background: #535353;
  width: 14rem;
  height: 300px;
  flex-shrink: 0;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

const DramaCard = styled.div`
  width: 500px;
  transform: translate(-50%, -50%);
  background: #000;
  color: #fff;
  position: absolute;
  left: 50%;
  top: 45%;
  border-radius: 10px;
  opacity: 0.8;
  padding: 20px;
`;

function Home() {
  const filterData = {
    type: ['所有影集', '台劇', '韓劇', '日劇', '動畫', '美劇', '陸劇'],
    filters: [
      {
        title: '類型',
        filter: [
          '愛情',
          '喜劇',
          '奇幻',
          '懸疑',
          '刑偵犯罪',
          '復仇',
          '職場',
          '音樂',
        ],
      },
      {
        title: '排序',
        filter: ['新上架', '評價最高', '最熱門', '由新到舊', '由舊到新'],
      },
      {
        title: '年份',
        filter: [
          2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
          2012,
        ],
      },
    ],
  };
  interface Drama {
    id: string;
    title?: string;
    year?: number;
    rating?: number;
    image?: string;
    eng?: string;
    genre?: string;
    type?: string;
    story?: string;
    director?: string;
    screenwriter?: string;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [dramas, setDramas] = useState<Drama[]>([]);

  const dramasCollectionRef = collection(db, 'dramas');
  useEffect(() => {
    const getDramas = async () => {
      const data = await getDocs(dramasCollectionRef);
      setDramas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setIsLoading(true);
    };

    getDramas();
  }, []);

  return (
    <Wrapper>
      <SearchBar type="text" placeholder="請輸入想要查找的戲劇名稱" />
      <FilterSection>
        <FilterNavBar>
          {filterData.type.map((type) => {
            return <div>{type}</div>;
          })}
        </FilterNavBar>
        <hr className="my-6" />
        <Filter>
          {filterData.filters.map((filter) => {
            return (
              <Options>
                <Label>{filter.title}</Label>
                {filter.filter.map((item) => {
                  return (
                    <>
                      <Option>{item}</Option>
                    </>
                  );
                })}
              </Options>
            );
          })}
        </Filter>
      </FilterSection>
      <DramasSection>
        {isLoading &&
          dramas.map((drama) => {
            return (
              <Drama>
                <div>{drama.title}</div>
                <div>{drama.year}</div>
                <div>{drama.rating}/5</div>
              </Drama>
            );
          })}
        <DramaCard>
          {isLoading && (
            <>
              <img
                className="w-24 h-36 mb-8"
                src={dramas[0].image}
                alt=""
              ></img>
              <div>{dramas[0].title}</div>
              <div>{dramas[0].eng}</div>
              <div>{dramas[0].year}</div>
              <div>
                {dramas[0].type} | {dramas[0].year} | {dramas[0].genre}
              </div>
              <div>{dramas[0].rating}/5</div>
              <div>已有 106 人留下評價</div>
              <button>加入片單</button>
              <div>編劇</div>
              <div>{dramas[0].screenwriter}</div>
              <div>導演</div>
              <div>{dramas[0].director}</div>
              <div>演員</div>
              <div>金宣虎 申敏兒</div>
              <div>劇情大綱</div>
              <div>{dramas[0].story}</div>
              <div>集數熱度</div>
              <div>原聲帶</div>
              <div>留下你對 {dramas[0].title} 的評論！</div>
              <div>☆☆☆☆☆</div>
              <div>ffuri ★★★☆☆ 3/27</div>
              <div>hanny ★★★★☆ 3/29</div>
              <div>wendy ★★★★☆ 4/1</div>
              <div>joy1215 ★★★★☆ 4/2</div>
            </>
          )}
        </DramaCard>
      </DramasSection>
    </Wrapper>
  );
}

export default Home;
