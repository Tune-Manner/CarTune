import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import MainLayout from './layouts/MainLayout';
import SearchLayout from './layouts/SearchLayout';
import PlayListLayout from './layouts/PlayListLayout';
import WeatherSearch from './pages/search/WeatherSearch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 및 이메일 확인 */}
        <Route path="/" element={ <MainLayout/> }>
          <Route index element={ <Main/> } />
        </Route>

        {/* 플레이리스트 생성 */}
        <Route path="/search" element={ <SearchLayout/> }>
          <Route index element={<Navigate to="/search/weather" replace/>}/>
          <Route path="weather" element={ <WeatherSearch/> }/>
        </Route>

        {/* 플레이리스트 조회 및 제어 */}
        <Route path="/playlist" element={ <PlayListLayout/> }>
          
        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
