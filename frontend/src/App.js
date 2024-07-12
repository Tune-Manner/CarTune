import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Main from './pages/Main';
import MainLayout from './layouts/MainLayout';
import SearchLayout from './layouts/SearchLayout';
import PlayListLayout from './layouts/PlayListLayout';
import WeatherSearch from './pages/search/WeatherSearch';
import EmailLogin from './pages/main/EmailLogin';
import WeatherSearchResult from './pages/search/WeatherSearchResult';
import Playlist from './pages/music/Playlist';
import SendEmail from './pages/music/SendEmail';
import WeatherOptions from 'pages/search/WeatherOptions';

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 메인 및 이메일 확인 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<PageTransition><Main /></PageTransition>} />
          <Route path="email" element={<PageTransition><EmailLogin /></PageTransition>} />
        </Route>

        {/* 플레이리스트 생성 */}
        <Route path="/search" element={<SearchLayout />}>
          <Route index element={<Navigate to="/search/weather" replace />} />
          <Route path="weather" element={<PageTransition><WeatherSearch /></PageTransition>} />
          <Route path="weather/result" element={<PageTransition><WeatherSearchResult /></PageTransition>} />
          <Route path="weather/options" element={<WeatherOptions/>}/>
        </Route>

        {/* 플레이리스트 조회 및 제어 */}
        <Route path="/playlist" element={<PlayListLayout />}>
          <Route index element={<PageTransition><Playlist /></PageTransition>} />
          <Route path="send-email" element={<PageTransition><SendEmail /></PageTransition>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

const PageTransition = ({ children }) => (
  <motion.div
  initial={{ opacity: 0.8, scale: 0.987 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{
    duration: 0.8,
    ease: [0, 0.2, 0.3, 1.01]
  }}
  >
    {children}
  </motion.div>
);

export default App;
