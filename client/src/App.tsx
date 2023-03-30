import axios from 'axios';
import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import SuspenseComponent from './components/suspense/SuspenseComponent';
import LoadingComponent from './components/UI/LoadingComponent';
import { OverlayProvider } from './context/OverlayProvider';
import UserProvider from './context/UserProvider';

const MainPage = lazy(() => import('./pages/MainPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <SuspenseComponent fallback={<LoadingComponent />}>
      <OverlayProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/account" element={<AuthPage />} />
          </Routes>
        </UserProvider>
      </OverlayProvider>
    </SuspenseComponent>
  );
}
export default App;
