import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './pages/Main';
import MainLayout from './layouts/MainLayout';
import SearchLayout from './layouts/SearchLayout';
import PlayListLayout from './layouts/PlayListLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 및 이메일 확인 */}
        <Route path="/" element={ <MainLayout/>}>
          <Route index element={ <Main/>} />
        </Route>

        {/* 플레이리스트 생성 */}
        <Route path="/search" element={ <SearchLayout/>}>

        </Route>

        {/* 플레이리스트 조회 및 제어 */}
        <Route path="/playlist" element={ <PlayListLayout/>}>

        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
