import React from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import AuthRoute from './components/AuthRoute';
import Header from './components/Header';
import Footer from './components/Footer';

const theme = {
  primaryColor: '#fc3344',
  secondaryColor: '#4538e6',
  darkBlack: '#080808',
  black: '#181818',
  white: '#fff',
  lightGrey: '#bbb',
  grey: '#555',
  darkGrey: '#2a2a2a',
};

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Lexend', 'Noto Sans TC', sans-serif;
    font-weight: 400;
    background-color:#181818;
    color: #fff;
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
      <AuthRoute>
        <ThemeProvider theme={theme}>
          <Header />
          <Outlet />
          <Footer />
        </ThemeProvider>
      </AuthRoute>
    </>
  );
}

export default App;
