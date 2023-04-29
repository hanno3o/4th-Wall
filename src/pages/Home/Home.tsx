import styled from 'styled-components';
import { db } from '../../config/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { XXLText, SMGreyText } from '../../style/Text';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import SearchBar from '../../components/SearchBar';
import FilterNavBar from '../../components/FilterNavBar';
import Dramas from '../../components/Dramas';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

const HomepageWrapper = styled.div`
  width: 1280px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  ${MEDIA_QUERY_TABLET} {
    width: 1100px;
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 480px;
    margin-top: -50px;
  }
`;

const BannerImage = styled.div`
  width: 100%;
  height: 480px;
  ${MEDIA_QUERY_TABLET} {
    height: 375px;
  }
  ${MEDIA_QUERY_MOBILE} {
    height: 265px;
  }
`;

const DividerLine = styled.div`
  border-bottom: solid 1px ${(props) => props.theme.grey};
`;

const MultiFilterOption = styled.div<MultiFilterOptionProps>`
  color: ${(props) => props.theme.lightGrey};
  font-size: 14px;
  cursor: pointer;
  display: flex;
  font-weight: 500;
  border-radius: 20px;
  padding: 8px 14px;
  z-index: 0;
  background-color: rgba(255, 255, 255, 0.1);
  ${(props) =>
    props.order &&
    props.order.includes(props.children as string) &&
    `
    color: #181818;
    background-color: #fff;
    `}

  ${(props) =>
    props.genre &&
    props.genre.length > 0 &&
    props.genre.includes(props.children as string) &&
    `
    color: #181818;
    background-color: #fff;
    `}

  ${(props) =>
    props.platform &&
    props.platform.length > 0 &&
    props.platform.includes(props.children as string) &&
    `
    color: #181818;
    background-color: #fff;
    `}

  ${(props) =>
    props.year &&
    props.year.length > 0 &&
    props.year.includes(props.children as number) &&
    `
    color: #181818;
    background-color: #fff;
    `}

    &:hover {
    color: ${(props) => props.theme.white};
    background-color: rgba(255, 255, 255, 0.2);
    transition: ease-in-out 0.25s;
  }
  ${MEDIA_QUERY_MOBILE} {
    max-width: 100px;
    padding: 6px 14px;
    font-size: 10px;
    font-weight: 700;
  }
`;
interface MultiFilterOptionProps {
  genre?: string[];
  year?: number[];
  order?: string;
  platform?: string[];
}
interface IDrama {
  id?: string | undefined;
  title?: string;
  year?: number;
  rating?: number;
  image?: string;
  eng?: string;
  genre?: string;
  platform?: string[];
  type?: string;
  story?: string;
  director?: string;
  screenwriter?: string;
  spotify?: string;
  episodes?: number;
  engType?: string;
  relatedVideos?: string[];
  releaseDate?: string;
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
          '劇情',
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
      {
        title: '平台',
        filter: [
          'Netflix',
          'Disney+',
          'LINE TV',
          '愛奇藝',
          'Friday影音',
          'KKTV',
        ],
      },
    ],
  };
  const dramasRef = collection(db, 'dramas');
  const [searchWords, setSearchWords] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(
    '所有影集'
  );
  const [genre, setGenre] = useState<string[]>([]);
  const [order, setOrder] = useState('');
  const [year, setYear] = useState<number[]>([]);
  const [platform, setPlatform] = useState<string[]>([]);
  const [dramas, setDramas] = useState<IDrama[]>([]);

  const bannerImageURL =
    'https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Ffinalbanner.png?alt=media&token=5613b7b7-a3f2-446a-8184-b60bab7a8f02';

  const getDramasAndActors = async () => {
    const dramasSnapshot = await getDocs(dramasRef);
    setDramas(
      dramasSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  useEffect(() => {
    getDramasAndActors();
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWords(e.target.value);
  };

  const handleTypeFilter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setSelectedTypeFilter(e.currentTarget.textContent);
  };

  const handleMultiFilter = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    title: string
  ) => {
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
    } else if (title === '平台') {
      if (platform.includes(selectedValue ? selectedValue : '')) {
        const newPlatform = platform.filter((value) => value !== selectedValue);
        setPlatform(newPlatform);
      } else {
        setPlatform((prevPlatforms) => [
          ...prevPlatforms,
          selectedValue ? selectedValue : '',
        ]);
      }
    }
  };

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
      const platformFilter =
        platform.length > 0
          ? platform.some((platform) => drama.platform?.includes(platform))
          : true;
      return yearFilter && genreFilter && newest && platformFilter;
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

  const filteredAndQueriedDramas = filteredByMultiFiltersDramas.filter(
    (drama) =>
      drama.eng?.toLowerCase().includes(searchWords.toLowerCase()) ||
      drama.title?.includes(searchWords)
  );

  return (
    <body>
      <BannerImage
        style={{
          backgroundImage: `linear-gradient(to top, rgb(25, 25, 25), rgba(255, 255, 255, 0) 100%), url(${bannerImageURL})`,
        }}
      />
      <HomepageWrapper>
        <XXLText margin="-20px auto 30px">評劇、聊劇、收藏你的愛劇</XXLText>
        <SearchBar
          placeHolder="請輸入想要查找的戲劇名稱"
          onChange={handleSearchInput}
        />
        <FilterNavBar
          selectedTypeFilter={selectedTypeFilter}
          onClick={handleTypeFilter}
        />
        <DividerLine />
        <ColumnFlexbox gap="18px" mobileGap="12px" margin="20px 0 0 0 ">
          {filterData.filters.map((filter, index) => {
            return (
              <RowFlexbox alignItems="center">
                <SMGreyText margin="0 10px 0 0">{filter.title}</SMGreyText>
                <RowFlexbox
                  gap="4px"
                  key={index}
                  alignItems="center"
                  style={{ overflowX: 'auto' }}
                >
                  {filter.filter.map((item, index) => {
                    return (
                      <MultiFilterOption
                        key={index}
                        year={year}
                        genre={genre}
                        order={order}
                        platform={platform}
                        onClick={(e) => handleMultiFilter(e, filter.title)}
                      >
                        {item}
                      </MultiFilterOption>
                    );
                  })}
                </RowFlexbox>
              </RowFlexbox>
            );
          })}
        </ColumnFlexbox>
        <Dramas dramasData={filteredAndQueriedDramas} isRemoveButton={false} />
      </HomepageWrapper>
    </body>
  );
}

export default Home;
