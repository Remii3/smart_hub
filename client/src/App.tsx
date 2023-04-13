import axios from 'axios';
import { lazy, useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import SuspenseComponent from './components/suspense/SuspenseComponent';
import LoadingComponent from './components/UI/LoadingComponent';
import { UserContext } from './context/UserProvider';

const MainPage = lazy(() => import('./pages/MainPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NoPage404 = lazy(() => import('./pages/NoPage404'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
axios.defaults.baseURL = 'https://smarthub-backend.onrender.com';
axios.defaults.withCredentials = true;

function App() {
  const { userData } = useContext(UserContext);
  return (
    <SuspenseComponent fallback={<LoadingComponent />}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/account" element={<AuthPage />} />
        {userData && <Route path="/account/my" element={<MyAccount />} />}
        <Route path="/*" element={<NoPage404 />} />
      </Routes>
    </SuspenseComponent>
  );
}
export default App;
