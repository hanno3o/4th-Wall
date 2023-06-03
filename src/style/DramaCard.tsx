import styled from 'styled-components';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

export const DramaCardsWrapper = styled.div`
  padding: 30px 0 100px 0;
  display: flex;
  gap: 26px;
  flex-wrap: wrap;
  ${MEDIA_QUERY_TABLET} {
    gap: 16px;
  }
  ${MEDIA_QUERY_MOBILE} {
    gap: 16px;
    padding: 30px 0 100px 0;
  }
`;

export const DramaCard = styled.div`
  cursor: pointer;
  width: 275px;
  height: 362px;
  background-color: ${(props) => props.theme.grey};
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
  background-size: cover;
  background-position: center top;
  position: relative;
  filter: brightness(0.9);
  &:hover {
    transform: scale(1.05);
    transition: ease-in-out 0.3s;
    filter: brightness(1.05);
  }
  ${MEDIA_QUERY_TABLET} {
    width: 238px;
    height: 316px;
    padding: 16px;
  }
  ${MEDIA_QUERY_MOBILE} {
    width: 180px;
    height: 265px;
    padding: 12px;
  }
`;
