import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import SuspenseComponent from './components/suspense/SuspenseComponent';
import LoadingComponent from './components/UI/LoadingComponent';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
const MainPage = lazy(() => import('./pages/MainPage'));

function App() {
  return (
    <>
      <SuspenseComponent fallback={<LoadingComponent />}>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/account/register' element={<RegisterPage />} />
          <Route path='/account/login' element={<LoginPage />} />
        </Routes>
      </SuspenseComponent>
    </>
  );
}

export default App;
