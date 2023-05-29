import axios from 'axios';
import { lazy, useContext, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { UserContext } from './context/UserProvider';
import LoadingComponent from './components/UI/Loaders/LoadingComponent';
import SuspenseComponent from './components/suspense/SuspenseComponent';
import MainLayout from './layout/MainLayout';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import MyAccount from './pages/MyAccount';
import NewsPage from './pages/NewsPage';
import CollectionsPage from './pages/CollectionsPage';
import AuctionsPage from './pages/AuctionsPage';

const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
// const RegisterPage = lazy(() => import('./pages/RegisterPage'));
// const LoginPage = lazy(() => import('./pages/LoginPage'));
// const MainPage = lazy(() => import('./pages/MainPage'));
const NoPage404 = lazy(() => import('./pages/NoPage404'));
// const MyAccount = lazy(() => import('./pages/MyAccount'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
// const ShopPage = lazy(() => import('./pages/ShopPage'));
// const NewsPage = lazy(() => import('./pages/NewsPage'));
// const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
// const AuctionsPage = lazy(() => import('./pages/AuctionsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const MyProductsPage = lazy(() => import('./pages/MyProductsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const CartPage = lazy(() => import('./pages/CartPage'));

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
    if (
      !document.cookie.match('token') &&
      !document.cookie.match('guestToken')
    ) {
      axios.get('/account/guest');
    }
  }, [pathname]);

  return (
    <SuspenseComponent fallback={<LoadingComponent />}>
      <MainLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:searchParam" element={<SearchPage />} />
          <Route path="/shop/categories" element={<CategoriesPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/auctions" element={<AuctionsPage />} />
          <Route path="/auctions/categories" element={<CategoriesPage />} />
          <Route path="/auctions/:searchParam" element={<SearchPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/account/register" element={<RegisterPage />} />
          <Route path="/account/login" element={<LoginPage />} />
          <Route
            path="/account/my"
            element={userData ? <MyAccount /> : <RegisterPage />}
          />
          <Route
            path="/account/my/my-products"
            element={userData ? <MyProductsPage /> : <RegisterPage />}
          />
          <Route path="/*" element={<NoPage404 />} />
        </Routes>
      </MainLayout>
    </SuspenseComponent>
  );
}
export default App;
