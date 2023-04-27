import styled from 'styled-components';
import { RowFlexbox } from '../../style/Flexbox';

interface FilterNavBarProps {
  selectedTypeFilter?: string | null;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

const FilterWrapper = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  ${MEDIA_QUERY_MOBILE} {
    margin-top: 20px;
  }
`;

const FilterNavBarStyle = styled.div<FilterNavBarProps>`
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  padding: 8px 10px;
  letter-spacing: 0.5px;
  ${(props) =>
    props.selectedTypeFilter &&
    props.selectedTypeFilter.includes(props.children as string) &&
    `
    border-bottom: #fff 4px solid;
    `}

  ${MEDIA_QUERY_TABLET} {
    padding: 8px 12px;
    font-size: 14px;
    ${(props) =>
      props.selectedTypeFilter &&
      props.selectedTypeFilter.includes(props.children as string) &&
      `
    border-bottom: #fff 3px solid;
    `}
  }
  ${MEDIA_QUERY_MOBILE} {
    padding: 6px 14px;
    font-size: 14px;

    ${(props) =>
      props.selectedTypeFilter &&
      props.selectedTypeFilter.includes(props.children as string) &&
      `
    border-bottom: #fff 3px solid;
    `}
  }
`;

export default function FilterNavBar(props: FilterNavBarProps) {
  const { onClick, selectedTypeFilter } = props;
  const filterData = {
    type: ['所有影集', '台劇', '韓劇', '日劇', '美劇', '陸劇'],
  };

  return (
    <FilterWrapper>
      <RowFlexbox mobileJustifyContent="space-between">
        {filterData.type.map((type, index) => {
          return (
            <FilterNavBarStyle
              key={index}
              selectedTypeFilter={selectedTypeFilter}
              onClick={onClick}
            >
              {type}
            </FilterNavBarStyle>
          );
        })}
      </RowFlexbox>
    </FilterWrapper>
  );
}
