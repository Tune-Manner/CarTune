import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import MainLayout from './layouts/MainLayout';
import SearchLayout from './layouts/SearchLayout';
import PlayListLayout from './layouts/PlayListLayout';
import WeatherSearch from './pages/search/WeatherSearch';
import EmailLogin from 'pages/main/EmailLogin';
import WeatherSearchResult from 'pages/search/WeatherSearchResult';
import Playlist from 'pages/music/Playlist';
import SendEmail from 'pages/music/SendEmail';
import WeatherOptions from "./pages/search/WeatherOptions";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* 메인 및 이메일 확인 */}
          <Route path="/" element={ <MainLayout/> }>
            <Route index element={ <Main/> } />
            <Route path="email" element={ <EmailLogin/> } />
          </Route>

          {/* 플레이리스트 생성 */}
          <Route path="/search" element={ <SearchLayout/> }>
            <Route index element={<Navigate to="/search/weather" replace/>}/>
            <Route path="weather" element={ <WeatherSearch/> }/>
            {/* 아래 방식으로 값에 따른 결과 출력 */}
            <Route path="weather/result" element={ <WeatherSearchResult/> }/>
            <Route path="weather/options" element={ <WeatherOptions/> }/>
          </Route>

          {/* 플레이리스트 조회 및 제어 */}
          <Route path="/playlist" element={ <PlayListLayout/> }>
            <Route index element={ <Playlist/> }/>
            <Route path="send-email" element={ <SendEmail/> }/>
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
