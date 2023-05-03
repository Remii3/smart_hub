import axios from 'axios';
import { lazy, useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { UserContext } from './context/UserProvider';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import LoadingComponent from './components/UI/Loaders/LoadingComponent';
import SuspenseComponent from './components/suspense/SuspenseComponent';

const MainPage = lazy(() => import('./pages/MainPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NoPage404 = lazy(() => import('./pages/NoPage404'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
let properUrl = 'http://localhost:4000';

switch (document.URL) {
  case 'http://localhost:5173/':
    properUrl = 'http://localhost:4000';
    break;
  case 'https://smarthub-jb8g.onrender.com/':
    properUrl = 'https://smarthub-backend.onrender.com';
    break;
  default:
    properUrl = 'https://smarthub-backend.onrender.com';
    break;
}
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  const { userData } = useContext(UserContext);

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SuspenseComponent fallback={<LoadingComponent />}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:category" element={<ShopPage />} />
        <Route path="/shop/:category/:id" element={<ProductPage />} />
        <Route path="/account" element={<AuthPage />} />
        {userData && <Route path="/account/my" element={<MyAccount />} />}
        <Route path="/*" element={<NoPage404 />} />
      </Routes>
    </SuspenseComponent>
  );
}
export default App;
