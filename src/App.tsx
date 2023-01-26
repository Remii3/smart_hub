import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import NoPage404 from './pages/NoPage404';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='*' element={<NoPage404 />} />
      </Routes>
    </>
  );
};

export default App;
