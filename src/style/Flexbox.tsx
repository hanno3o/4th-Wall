import styled from 'styled-components';

const MEDIA_QUERY_TABLET =
  '@media screen and (min-width: 1281px) and (max-width: 1440px)';
const MEDIA_QUERY_MOBILE = '@media screen and (max-width: 1280px)';

interface FlexboxProps {
  flexWrap?: string;
  width?: string;
  height?: string;
  gap?: string;
  textAlign?: string;
  cursor?: string;
  justifyContent?: string;
  alignItems?: string;
  padding?: string;
  margin?: string;
  border?: string;
  mobileWidth?: string;
  mobileHeight?: string;
  mobileJustifyContent?: string;
  mobileAlignItems?: string;
  mobileOrder?: number;
  mobileGap?: string;
  tabletWidth?: string;
  tabletHeight?: string;
  tabletJustifyContent?: string;
  tabletAlignItems?: string;
  tabletGap?: string;
}

export const RowFlexbox = styled.div<FlexboxProps>`
  display: flex;
  flex-wrap: ${(props) => props.flexWrap || ''};
  width: ${(props) => props.width || ''};
  height: ${(props) => props.height || ''};
  gap: ${(props) => props.gap || ''};
  text-align: ${(props) => props.textAlign || ''};
  cursor: ${(props) => props.cursor || ''};
  justify-content: ${(props) => props.justifyContent || ''};
  align-items: ${(props) => props.alignItems || ''};
  padding: ${(props) => props.padding || ''};
  margin: ${(props) => props.margin || ''};
  border: ${(props) => props.border || ''};

  ${MEDIA_QUERY_TABLET} {
    width: ${(props) => props.tabletWidth || ''};
    height: ${(props) => props.tabletHeight || ''};
    justify-content: ${(props) => props.tabletJustifyContent || ''};
    align-items: ${(props) => props.tabletAlignItems || ''};
    gap: ${(props) => props.tabletGap || ''};
  }

  ${MEDIA_QUERY_MOBILE} {
    width: ${(props) => props.mobileWidth || ''};
    height: ${(props) => props.mobileHeight || ''};
    justify-content: ${(props) => props.mobileJustifyContent || ''};
    align-items: ${(props) => props.mobileAlignItems || ''};
    gap: ${(props) => props.mobileGap || ''};
    order: ${(props) => props.mobileOrder || 0};
  }
`;

export const ColumnFlexbox = styled(RowFlexbox)`
  flex-direction: column;
`;
