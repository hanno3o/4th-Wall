import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { RowFlexbox } from '../../style/Flexbox';
import { BsGithub, BsDiscord } from 'react-icons/bs';

const FooterWrapper = styled.footer`
  width: 100%;
  background-color: ${(props) => props.theme.darkBlack};
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 10px;
  height: 70px;
  padding: 40px 0;
  position: absolute;
  bottom: 0;
`;

const FooterIconButtons = styled(Link)`
  font-size: 20px;
  opacity: 0.5;
  &:hover {
    opacity: 0.7;
    transition: ease-in-out 0.3s;
    scale: 1.05;
  }
`;

function Footer() {
  return (
    <FooterWrapper>
      <RowFlexbox gap="10px">
        <FooterIconButtons to="https://github.com/hanno3o" target="_blank">
          <BsGithub />
        </FooterIconButtons>
        <FooterIconButtons
          to="https://discordapp.com/users/838622061911998474"
          target="_blank"
        >
          <BsDiscord />
        </FooterIconButtons>
      </RowFlexbox>
      <div style={{ fontSize: '12px' }}>Copyright © 4thWall, Inc.</div>
    </FooterWrapper>
  );
}

export default Footer;
