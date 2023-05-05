import styled from 'styled-components';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

interface TextProps {
  LineHeight?: string;
  margin?: string;
  tabletMargin?: string;
}

export const XXLText = styled.div<TextProps>`
  color: #eee;
  font-size: 28px;
  font-weight: 700;
  line-height: ${(props) => props.LineHeight || ''};
  margin: ${(props) => props.margin || ''};
  ${MEDIA_QUERY_TABLET} {
    font-size: 24px;
  }
  ${MEDIA_QUERY_MOBILE} {
    font-size: 18px;
  }
`;

export const XLText = styled.div<TextProps>`
  font-size: 24px;
  font-weight: 700;
  line-height: ${(props) => props.LineHeight || ''};
  margin: ${(props) => props.margin || ''};
  ${MEDIA_QUERY_TABLET} {
    font-size: 20px;
  }
  ${MEDIA_QUERY_MOBILE} {
    font-size: 14px;
  }
`;

export const LGText = styled.div<TextProps>`
  font-size: 18px;
  font-weight: 700;
  line-height: ${(props) => props.LineHeight || ''};
  ${MEDIA_QUERY_TABLET} {
    font-size: 16px;
    font-weight: 600;
  }
  ${MEDIA_QUERY_MOBILE} {
    font-size: 14px;
  }
`;

export const MDText = styled.div<TextProps>`
  font-size: 16px;
  font-weight: 700;
  line-height: ${(props) => props.LineHeight || ''};
  margin: ${(props) => props.margin || ''};
  ${MEDIA_QUERY_TABLET},${MEDIA_QUERY_MOBILE} {
    font-size: 14px;
    font-weight: 600;
  }
`;

export const NMText = styled.div<TextProps>`
  font-size: 16px;
  line-height: ${(props) => props.LineHeight || ''};
  margin: ${(props) => props.margin || ''};
`;

export const SMText = styled.div<TextProps>`
  font-size: 14px;
  font-weight: 550;
  line-height: ${(props) => props.LineHeight || ''};
  margin: ${(props) => props.margin || ''};
  ${MEDIA_QUERY_TABLET} {
    font-size: 13px;
    font-weight: 550;
    margin: ${(props) => props.tabletMargin || ''};
  }
`;

export const XSText = styled.div<TextProps>`
  font-size: 14px;
  font-weight: 500;
  line-height: ${(props) => props.LineHeight || ''};
  margin: ${(props) => props.margin || ''};
  ${MEDIA_QUERY_TABLET} {
    font-weight: 400;
  }
`;

export const LGGreyText = styled.div<TextProps>`
  font-size: 18px;
  font-weight: 700;
  color: ${(props) => props.theme.lightGrey};
  line-height: ${(props) => props.LineHeight || ''};
`;

export const LGDarkGreyText = styled(LGGreyText)`
  color: ${(props) => props.theme.grey};
`;

export const MDGreyText = styled.div<TextProps>`
  font-size: 16px;
  color: ${(props) => props.theme.lightGrey};
  line-height: ${(props) => props.LineHeight || ''};
  ${MEDIA_QUERY_TABLET}, ${MEDIA_QUERY_MOBILE} {
    font-size: 14px;
  }
`;

export const SMGreyText = styled.div<TextProps>`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.theme.lightGrey};
  line-height: ${(props) => props.LineHeight || ''};
  margin: ${(props) => props.margin || ''};
  ${MEDIA_QUERY_TABLET}, ${MEDIA_QUERY_MOBILE} {
    font-size: 15.5px;
    font-weight: 400;
  }
`;

export const XSGreyText = styled.div<TextProps>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.lightGrey};
  line-height: 18px;
  margin: ${(props) => props.margin || ''};
  ${MEDIA_QUERY_TABLET}, ${MEDIA_QUERY_MOBILE} {
    font-size: 13px;
  }
`;
