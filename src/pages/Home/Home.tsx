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
  width: 1000px;
  transform: translate(-50%, -50%);
  background: #2a2a2a;
  color: #fff;
  position: fixed;
  left: 50vw;
  top: 50vh;
  border-radius: 10px;
  opacity: 0.9;
  padding: 60px 40px;
  display: block;
`;

const DramaCardMainInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const DramaCardTitle = styled.div`
  font-size: 26px;
  font-weight: 900;
`;

const DramaCardSubTitle = styled.div`
  font-size: 16px;
  color: #afafaf;
  font-weight: 500;
`;

const DramaCardType = styled.div`
  font-size: 14px;
  color: #fff;
  margin-top: 2px;
  font-weight: 900;
`;

const DramaCardRating = styled.div`
  font-size: 18px;
  color: #fff;
  font-weight: 900;
`;

const DramaCardDescriptionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DramaCardDescriptionTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  line-height: 22px;
`;

const DramaCardDescription = styled.div`
  font-size: 12px;
  font-weight: 400;
  margin-bottom: 8px;
  line-height: 18px;
`;

const HandleListButton = styled.button`
  font-size: 16px;
  color: #fff;
  border: solid 1px #fff;
  padding: 5px;
  font-weight: 700;
  position: absolute;
  top: 60px;
  right: 40px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  font-weight: 900;
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
    id?: string | undefined;
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
    spotify?: string;
  }

  interface Cast {
    name?: string;
  }

  const dramasCollectionRef = collection(db, 'dramas');
  const [isLoading, setIsLoading] = useState(false);
  const [dramas, setDramas] = useState<Drama[]>([]);
  const [cast, setCast] = useState<Cast[]>([]);
  const [genre, setGenre] = useState<string[]>([]);
  const [order, setOrder] = useState('');
  const [year, setYear] = useState<number[]>([]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(
    '所有影集'
  );
  const [dramaCard, setDramaCard] = useState<Drama>();

  useEffect(() => {
    const getDramas = async () => {
      const data = await getDocs(dramasCollectionRef);
      setDramas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setIsLoading(true);
    };

    getDramas();
  }, []);

  useEffect(() => {
    const getCasts = async () => {
      const dramaId = dramaCard?.id;
      if (dramaId) {
        const castsCollectionRef = collection(db, 'dramas', dramaId, 'cast');
        const castSnapshot = await getDocs(castsCollectionRef);
        const castArr: any = [];
        castSnapshot.forEach((doc) => {
          castArr.push(doc.data());
        });
        setCast(castArr);
      }
    };
    getCasts();
  }, [dramaCard]);

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

  function handleDramaCard(drama: Drama) {
    setDramaCard(drama);
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
                onClick={() => handleDramaCard(drama)}
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
        <DramaCard style={{ display: dramaCard ? 'block' : 'none' }}>
          {isLoading && (
            <div style={{ display: 'flex' }}>
              <div style={{ width: '300px' }}>
                <div style={{ fontSize: '20px', fontWeight: '700' }}>
                  評論區
                </div>
                <div>
                  <div style={{ marginTop: '10px' }}>☆☆☆☆☆</div>
                  <input
                    type="text"
                    placeholder={`留下你對 ${dramaCard?.title} 的評論！`}
                    style={{
                      width: '260px',
                      marginTop: '10px',
                      fontSize: '12px',
                      color: '#000',
                      padding: '10px',
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div>ffuri ★★★☆☆ 3/27</div>
                  <div>hanny ★★★★☆ 3/29</div>
                  <div>wendy ★★★★☆ 4/1</div>
                  <div>joy1215 ★★★★☆ 4/2</div>
                </div>
              </div>
              <div>
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                  }}
                >
                  <img
                    className="w-48 h-70 mb-8"
                    style={{
                      objectFit: 'cover',
                    }}
                    src={dramaCard?.image}
                    alt=""
                  ></img>
                  <DramaCardMainInfo>
                    <DramaCardTitle>{dramaCard?.title}</DramaCardTitle>
                    <DramaCardSubTitle>{dramaCard?.eng}</DramaCardSubTitle>
                    <DramaCardType>
                      {dramaCard?.type} | {dramaCard?.year} | {dramaCard?.genre}
                    </DramaCardType>
                    <DramaCardRating>{dramaCard?.rating}/5</DramaCardRating>
                    <DramaCardDescription>
                      已有 106 人留下評價
                    </DramaCardDescription>
                    <div>
                      <DramaCardDescriptionTitle>
                        編劇
                      </DramaCardDescriptionTitle>
                      <DramaCardDescription>
                        {dramaCard?.screenwriter}
                      </DramaCardDescription>
                      <DramaCardDescriptionTitle>
                        導演
                      </DramaCardDescriptionTitle>
                      <DramaCardDescription>
                        {dramaCard?.director}
                      </DramaCardDescription>
                      <DramaCardDescriptionTitle>
                        演員
                      </DramaCardDescriptionTitle>
                      <DramaCardDescription>
                        {cast.map((cast) => ` ${cast.name}`)}
                      </DramaCardDescription>
                    </div>
                    <HandleListButton>＋加入片單</HandleListButton>
                    <CloseButton onClick={() => setDramaCard(undefined)}>
                      ✕
                    </CloseButton>
                  </DramaCardMainInfo>
                </div>
                <DramaCardDescriptionWrapper>
                  <div style={{ width: '315px' }}>
                    <DramaCardDescriptionTitle>
                      劇情大綱
                    </DramaCardDescriptionTitle>
                    <DramaCardDescription style={{ paddingRight: '22px' }}>
                      {dramaCard?.story}
                    </DramaCardDescription>
                    <DramaCardDescriptionTitle>
                      集數熱度
                    </DramaCardDescriptionTitle>
                    <DramaCardDescription>平均熱度：17/集</DramaCardDescription>
                    <img
                      style={{ width: '290px' }}
                      src="https://book.gosu.bar/uploads/images/gallery/2019-12/qWqeJ5ZcX2DYL2rQ-%E5%9F%BA%E7%A4%8E%E6%8A%98%E7%B7%9A%E5%9C%96.png"
                      alt=""
                    />
                    <div style={{ fontSize: '10px', marginTop: '10px' }}>
                      （計算方式：論壇中相對集數之文章總和除以總集數）
                    </div>
                  </div>
                  <div>
                    <DramaCardDescriptionTitle>
                      原聲帶
                    </DramaCardDescriptionTitle>
                    <iframe
                      style={{ borderRadius: '12px', marginTop: '4px' }}
                      src={dramaCard?.spotify}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                </DramaCardDescriptionWrapper>
              </div>
            </div>
          )}
        </DramaCard>
      </DramasSection>
    </Wrapper>
  );
}

export default Home;
