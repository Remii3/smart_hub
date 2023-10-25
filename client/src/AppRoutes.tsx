import { Suspense, lazy, useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UserContext } from './context/UserProvider';

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
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
const ThankYouPage = lazy(() => import('./pages/checkout/ThankYouPage'));
const ShopPage = lazy(() => import('./pages/shop/ShopPage'));

import LoadingCircle from '@components/Loaders/LoadingCircle';
import HomePage from '@pages/home/HomePage';
import { CartContext } from '@context/CartProvider';

export default function AppRoutes() {
  const { userData } = useContext(UserContext);
  const { cartState } = useContext(CartContext);
  return (
    <Suspense
      fallback={
        <div className="relative h-full min-h-screen w-full">
          <LoadingCircle />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route
          path="/checkout"
          element={
            cartState.products.length > 0 ? (
              <CheckoutPage />
            ) : (
              <Navigate to={'/cart'} />
            )
          }
        />
        <Route path="/thankyou" element={<ThankYouPage />} />
        <Route path="/account/register" element={<RegisterPage />} />
        <Route path="/account/login" element={<LoginPage />} />
        <Route path="/account/my/order/:id" element={<OrderPage />} />
        <Route
          path="/account/my"
          element={
            !userData.data && !userData.isLoading ? (
              <Navigate to={'/account/register'} />
            ) : (
              <MyAccount />
            )
          }
        />
        <Route path="/account/:userId" element={<OtherUserPage />} />
        <Route path="/*" element={<NoPage404 />} />
      </Routes>
    </Suspense>
  );
}
