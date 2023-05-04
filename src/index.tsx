import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './config/firebase.config';
import { Provider } from 'react-redux';
import { store } from './redux/store';

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
const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route
            path="login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route path="forum/:boardName" element={<Forum />} />
          <Route path="forum/:boardName/:id" element={<Article />} />
          <Route path="forum/:boardName/post" element={<Post />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
