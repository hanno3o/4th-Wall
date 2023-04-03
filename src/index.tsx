import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './config/firebase.config';
import AuthRoute from './components/AuthRoute';
// import { Provider } from 'react-redux';
// import { store } from './app/store';

import App from './App';
import Login from './pages/Login';
import Home from './pages/Home';
import Forum from './pages/Forum';
import Profile from './pages/Profile';
import Post from './pages/Post';
import Article from './pages/Article';

initializeApp(firebaseConfig);

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Routes>
      {/* <Provider store={store}> */}
      <Route path="/" element={<App />}>
        <Route
          index
          element={
            <AuthRoute>
              <Home />
            </AuthRoute>
          }
        />
        <Route path="login" element={<Login />} />
        <Route path="forum" element={<Forum />} />
        <Route path="post" element={<Post />} />
        <Route path="article" element={<Article />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      {/* </Provider> */}
    </Routes>
  </BrowserRouter>
);
