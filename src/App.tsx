import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<MainPage />} />
      </Routes>
    </>
  );
};

export default App;
