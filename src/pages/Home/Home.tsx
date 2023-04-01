import styled from 'styled-components';

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
  background: #535353;
  width: 14rem;
  height: 300px;
  flex-shrink: 0;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
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

  return (
    <Wrapper className="">
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
        <Drama>黑暗榮耀</Drama>
        <Drama>偶然發現的一天</Drama>
        <Drama>海岸村恰恰恰</Drama>
        <Drama>孤單又燦爛的神：鬼怪</Drama>
        <Drama>想見你</Drama>
        <Drama>那年夏天的我們</Drama>
        <Drama>二十五，二十一</Drama>
      </DramasSection>
      <div className="bg-[url('https://upload.wikimedia.org/wikipedia/zh/thumb/3/3e/Hometown_Cha-Cha-Cha.jpg/250px-Hometown_Cha-Cha-Cha.jpg')"></div>
    </Wrapper>
  );
}

export default Home;
