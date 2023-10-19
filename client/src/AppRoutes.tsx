import { Suspense, lazy, useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserContext } from './context/UserProvider';

const ShopPage = lazy(() => import('./pages/shop/ShopPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const HomePage = lazy(() => import('./pages/home/HomePage'));
const MyAccount = lazy(() => import('./pages/account_my/MyAccount'));
const NewsPage = lazy(() => import('./pages/news/NewsPage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const CartPage = lazy(() => import('./pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
const NoPage404 = lazy(() => import('./pages/NoPage404'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProductPage = lazy(() => import('./pages/product/ProductPage'));
const SearchPage = lazy(() => import('./pages/search/SearchPage'));
const OtherUserPage = lazy(() => import('./pages/account_other/OtherUserPage'));
const OrderPage = lazy(() => import('./pages/OrderPage'));
const ThankYouPage = lazy(() => import('@pages/checkout/ThankYouPage'));

import LoadingCircle from '@components/Loaders/LoadingCircle';

export default function AppRoutes() {
  const { userData } = useContext(UserContext);

  return (
    <Suspense fallback={<LoadingCircle isLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/account/register" element={<RegisterPage />} />
        <Route path="/account/login" element={<LoginPage />} />
        <Route path="/account/my/order/:id" element={<OrderPage />} />
        <Route
          path="/account/my"
          element={userData ? <MyAccount /> : <RegisterPage />}
        />
        <Route path="/account/:userId" element={<OtherUserPage />} />
        <Route path="/*" element={<NoPage404 />} />
      </Routes>
    </Suspense>
  );
}
