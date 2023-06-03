import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

interface SearchBarProps {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeHolder?: string;
  value?: string;
  width?: string;
  margin?: string;
}

const SearchBarWrapper = styled.div`
  position: relative;
`;

const SearchBarIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  border-radius: 50%;
  background: linear-gradient(
    to right,
    ${(props) => props.theme.primaryColor},
    ${(props) => props.theme.secondaryColor}
  );
  height: 40px;
  width: 40px;
  padding: 9px;
`;

const SearchBarInput = styled.input<SearchBarProps>`
  outline: solid 2px transparent;
  color: ${(props) => props.theme.white};
  border-radius: 20px;
  height: 40px;
  width: 100%;
  padding-left: 50px;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.1);
  &::placeholder{
    font-weight: 500;
  }
  &:focus {
    transition: ease-in-out 0.25s;
    background-color: rgba(255, 255, 255, 0.15);
  }
  ${MEDIA_QUERY_MOBILE} {
    font-size: 14px;
  }
`;

export default function SearchBar(props: SearchBarProps) {
  const { onChange, placeHolder, value, width, margin } = props;
  return (
    <SearchBarWrapper style={{ width: width, margin: margin }}>
      <SearchBarIcon>
        <FaSearch style={{ fontSize: '20px' }} />
      </SearchBarIcon>
      <SearchBarInput
        type="text"
        placeholder={placeHolder}
        onChange={onChange}
        value={value}
      />
    </SearchBarWrapper>
  );
}
