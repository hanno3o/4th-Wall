import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { XXLText, XSGreyText } from '../../style/Text';
import { RowFlexbox, ColumnFlexbox } from '../../style/Flexbox';
import SearchBar from '../../components/SearchBar';
import FilterNavBar from '../../components/FilterNavBar';
import Dramas from '../../components/Dramas';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { GET_ALL_DRAMAS } from '../../redux/reducers/dramasSlice';
import { debounce } from '../../utils/debounce';
import { filterData } from '../../utils/constants';

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
    padding: 20px;
    width: 100%;
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
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 700;
    flex-shrink: 0;
  }
`;
interface MultiFilterOptionProps {
  genre?: string[];
  year?: number[];
  order?: string;
  platform?: string[];
}

export default function Home() {
  const [searchWords, setSearchWords] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | null>(
    '所有影集'
  );
  const dispatch = useAppDispatch();
  const [genre, setGenre] = useState<string[]>([]);
  const [order, setOrder] = useState('');
  const [year, setYear] = useState<number[]>([]);
  const [platform, setPlatform] = useState<string[]>([]);
  const dramas = useAppSelector((state) => state.dramas.dramas);

  const bannerImageURL =
    'https://firebasestorage.googleapis.com/v0/b/thwall-d0123.appspot.com/o/images%2Ffinalbanner.png?alt=media&token=5613b7b7-a3f2-446a-8184-b60bab7a8f02';

  useEffect(() => {
    dispatch(GET_ALL_DRAMAS());
  }, []);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWords(e.target.value);
  };

  const delayedSearch = debounce(handleSearchInput, 500);

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
        return Number(b.rating) - Number(a.rating);
      }
      return 0;
    });

  const filteredAndQueriedDramas = filteredByMultiFiltersDramas.filter(
    (drama) =>
      drama.eng?.toLowerCase().includes(searchWords.toLowerCase()) ||
      drama.title?.includes(searchWords)
  );

  return (
    <>
      <BannerImage
        style={{
          backgroundImage: `linear-gradient(to top, rgb(25, 25, 25), rgba(255, 255, 255, 0) 100%), url(${bannerImageURL})`,
        }}
      />
      <HomepageWrapper>
        <XXLText margin="-20px auto 30px">評劇、聊劇、收藏你的愛劇</XXLText>
        <SearchBar
          placeHolder="請輸入想要查找的戲劇名稱"
          onChange={delayedSearch}
        />
        <FilterNavBar
          selectedTypeFilter={selectedTypeFilter}
          onClick={handleTypeFilter}
        />
        <DividerLine />
        <ColumnFlexbox gap="18px" mobileGap="20px" margin="20px 0 0 0 ">
          {filterData.filters.map((filter, index) => {
            return (
              <RowFlexbox alignItems="center">
                <XSGreyText margin="0 10px 0 0">{filter.title}</XSGreyText>
                <RowFlexbox
                  gap="4px"
                  key={index}
                  alignItems="center"
                  overflowX="auto"
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
    </>
  );
}
