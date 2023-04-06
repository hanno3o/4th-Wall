import styled from 'styled-components';
import { db } from '../../config/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const Wrapper = styled.div`
  width: 75%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0 auto;
`;

const SearchBar = styled.input`
  border-radius: 5px;
  border: #b6b6b6 solid 1px;
  height: 30px;
  width: 100%;
  padding: 10px;
`;

const FilterPanel = styled.div`
  margin-top: 30px;
`;

const FilterNavBar = styled.div`
  cursor: pointer;
  display: flex;
  gap: 4px;
  font-weight: 500;
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TypeFilter = styled.div<TypeFilterProps>`
  font-weight: 500;
  padding: 0 10px 8px;
  ${(props) =>
    props.selectedTypeFilter &&
    props.selectedTypeFilter.includes(props.children as string) &&
    `
    border-bottom: #3f3a3a 4px solid;
    `}
`;

const Label = styled.label`
  margin-right: 20px;
  font-weight: 500;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
`;

const Option = styled.div<FilterOptionsProps>`
  cursor: pointer;
  display: flex;
  margin-right: 8px;
  font-weight: 200;
  border: solid 1px #bbb;
  border-radius: 5px;
  padding: 6px;
  ${(props) =>
    props.order &&
    props.order.includes(props.children as string) &&
    `
    font-weight: 500;
    border: #3f3a3a;
    solid 1px; color: #fff;
    background-color: #3f3a3a;
    `}

  ${(props) =>
    props.genre &&
    props.genre.length > 0 &&
    props.genre.includes(props.children as string) &&
    `
    font-weight: 500;
    border: #3f3a3a solid 1px;
    color: #fff;
    background-color: #3f3a3a;
    `}

  ${(props) =>
    props.year &&
    props.year.length > 0 &&
    props.year.includes(props.children as number) &&
    `
    font-weight: 500;
    border: #3f3a3a solid 1px;
    color: #fff;
    background-color: #3f3a3a;
    `}
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
  width: 15.8em;
  height: 320px;
  flex-shrink: 0;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
  background-size: cover;
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
  display: none;
`;

interface TypeFilterProps {
  selectedTypeFilter?: string | null;
}
interface FilterOptionsProps {
  genre?: string[];
  year?: number[];
  order?: string;
}

function Home() {
  const filterData = {
    type: ['所有影集', '台劇', '韓劇', '日劇', '美劇', '陸劇'],
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
          '穿越',
          '律政',
          '校園',
        ],
      },
      {
        title: '排序',
        filter: ['新上架', '評價最高', '由新到舊', '由舊到新'],
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
  const [genre, setGenre] = useState<string[]>([]);
  const [order, setOrder] = useState('');
  const [year, setYear] = useState<number[]>([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(
    '所有影集'
  );

  useEffect(() => {
    const getDramas = async () => {
      const data = await getDocs(dramasCollectionRef);
      setDramas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setIsLoading(true);
    };

    getDramas();
  }, []);

  function handleTypeFilter(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    setSelectedTypeFilter(e.currentTarget.textContent);
  }

  function handleFilters(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    title: string
  ) {
    const selectedValue = e.currentTarget.textContent;
    if (title === '類型') {
      if (genre.includes(selectedValue ? selectedValue : '')) {
        const newGenre = genre.filter((value) => value !== selectedValue);
        setGenre(newGenre);
      } else {
        setGenre((prevGenres) => [
          ...prevGenres,
          selectedValue ? selectedValue : '',
        ]);
      }
    } else if (title === '排序') {
      if (order === selectedValue) {
        setOrder('');
      } else {
        setOrder(selectedValue ? selectedValue : '');
      }
    } else if (title === '年份') {
      if (year.includes(selectedValue ? Number(selectedValue) : NaN)) {
        const newYear = year.filter((value) => value !== Number(selectedValue));
        setYear(newYear);
      } else {
        setYear((prevYears) => [
          ...prevYears,
          selectedValue ? Number(selectedValue) : NaN,
        ]);
      }
    }
  }

  const filteredByTypeDramas =
    selectedTypeFilter !== '所有影集'
      ? dramas.filter((drama) => drama.type === selectedTypeFilter)
      : dramas;

  const filteredByMultiFiltersDramas = filteredByTypeDramas
    .filter((drama) => {
      const newest = order === '新上架' ? drama.year === 2023 : true;
      const yearFilter =
        year.length > 0
          ? year.some((year) =>
              drama.year?.toString()?.includes(year.toString())
            )
          : true;
      const genreFilter =
        genre.length > 0
          ? genre.some((genre) => drama.genre?.includes(genre))
          : true;
      return yearFilter && genreFilter && newest;
    })
    .sort((a, b) => {
      if (a.year && b.year) {
        if (order === '由新到舊') {
          return b.year - a.year;
        } else if (order === '由舊到新') {
          return a.year - b.year;
        }
      }
      if (a.rating && b.rating && order === '評價最高') {
        return b.rating - a.rating;
      }
      return 0;
    });

  console.log(`類型：${genre} 排序：${order} 年份：${year}`);

  return (
    <Wrapper>
      <SearchBar type="text" placeholder="請輸入想要查找的戲劇名稱" />
      <FilterPanel>
        <FilterNavBar>
          {filterData.type.map((type, index) => {
            return (
              <TypeFilter
                key={index}
                selectedTypeFilter={selectedTypeFilter}
                onClick={handleTypeFilter}
              >
                {type}
              </TypeFilter>
            );
          })}
        </FilterNavBar>
        <hr className="mb-6" />
        <Filter>
          {filterData.filters.map((filter, index) => {
            return (
              <Options key={index}>
                <Label>{filter.title}</Label>
                {filter.filter.map((item, index) => {
                  return (
                    <>
                      <Option
                        key={index}
                        year={year}
                        genre={genre}
                        order={order}
                        onClick={(e) => handleFilters(e, filter.title)}
                      >
                        {item}
                      </Option>
                    </>
                  );
                })}
              </Options>
            );
          })}
        </Filter>
      </FilterPanel>
      <DramasSection>
        {isLoading &&
          filteredByMultiFiltersDramas.map((drama, index) => {
            return (
              <Drama
                key={index}
                style={{
                  backgroundImage: `linear-gradient(to top, rgb(25, 25, 25), rgb(255, 255, 255, 0) 100%), url(${drama.image})`,
                }}
              >
                <div>{drama.title}</div>
                <div>{drama.year}</div>
                <div>{drama.rating}/5</div>
                <div>{drama.genre}</div>
                <div>{drama.type}</div>
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
