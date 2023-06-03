import React from 'react';
import { Outlet } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Reset } from 'styled-reset';
import AuthRoute from './components/AuthRoute';
import Header from './components/Header';
import Footer from './components/Footer'

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

  html {
    scroll-behavior: smooth;
  }

  a {
  text-decoration: none;
  color: inherit;
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
  }

  h2 {
    font-size: 20px;
    font-weight: 700;
  }

  strong {
    font-weight: 900;
  }

  em {
    font-style: italic;
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: inherit;
    outline: none;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
  }

  input[type="text"],
  [type="email"],
  [type="password"]
  {
    border: none;
    outline: none;
    text-align: left;
    text-decoration: none;
    vertical-align: middle;
  }

  textarea {
    resize: none;
    text-align: left;
    text-decoration: none;
    vertical-align: middle;
    overflow: auto;
  }

  select {
    background-color: transparent;
    background-image: none;
    border: none;
    outline: none;
  }

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
