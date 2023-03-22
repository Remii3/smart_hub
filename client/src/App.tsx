import axios from 'axios';
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import SuspenseComponent from './components/suspense/SuspenseComponent';
import LoadingComponent from './components/UI/LoadingComponent';
import { OverlayProvider } from './context/OverlayProvider';

const MainPage = lazy(() => import('./pages/MainPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <SuspenseComponent fallback={<LoadingComponent />}>
      <OverlayProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/account/register" element={<AuthPage />} />
          <Route path="/account/login" element={<AuthPage />} />
        </Routes>
      </OverlayProvider>
    </SuspenseComponent>
  );
}
export default App;
