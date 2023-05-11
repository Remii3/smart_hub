import axios from 'axios';
import { lazy, useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { UserContext } from './context/UserProvider';
import LoadingComponent from './components/UI/Loaders/LoadingComponent';
import SuspenseComponent from './components/suspense/SuspenseComponent';
import MainLayout from './layout/MainLayout';

const MainPage = lazy(() => import('./pages/MainPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const NoPage404 = lazy(() => import('./pages/NoPage404'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const ShopPage = lazy(() => import('./pages/ShopPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const AuctionsPage = lazy(() => import('./pages/AuctionsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MyProductsPage = lazy(() => import('./pages/MyProductsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));

let properUrl = 'http://localhost:4000';

switch (window.location.origin) {
  case 'http://localhost:5173':
    properUrl = 'http://localhost:4000';
    break;
  case 'https://smarthub-jb8g.onrender.com':
    properUrl = 'https://smarthub-backend.onrender.com';
    break;
  default:
    properUrl = 'https://smarthub-backend.onrender.com';
    break;
}
axios.defaults.baseURL = properUrl;
axios.defaults.withCredentials = true;

function App() {
  const { userData } = useContext(UserContext);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <SuspenseComponent fallback={<LoadingComponent />}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:category" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/auctions" element={<AuctionsPage />} />
          <Route path="/auctions/:category" element={<AuctionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/account" element={<AuthPage />} />
          <Route
            path="/account/my"
            element={userData ? <MyAccount /> : <AuthPage />}
          />
          <Route
            path="/account/my/my-products"
            element={userData ? <MyProductsPage /> : <AuthPage />}
          />
          <Route path="/*" element={<NoPage404 />} />
        </Routes>
      </MainLayout>
    </SuspenseComponent>
  );
}
export default App;
