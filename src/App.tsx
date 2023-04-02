import React from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import { Reset } from 'styled-reset';

import Header from './components/Header';
import Footer from './components/Footer';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 400;
  }

  #root {
    min-height: 100vh;
    position: relative;

    @media screen and (max-width: 768px) {
    }
  }
`;

function App() {
  return (
    <>
      <Reset />
      <GlobalStyle />
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
