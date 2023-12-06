import { Suspense, lazy, useContext } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { UserContext } from './context/UserProvider';

const TermsAndConditionPage = lazy(
  () => import('@pages/static/TermsAndConditionPage')
);
const PrivacyPolicyPage = lazy(() => import('@pages/static/PrivacyPolicyPage'));
const AboutUsPage = lazy(() => import('@pages/static/AboutUsPage'));
const ContactUsPage = lazy(() => import('@pages/static/ContactUsPage'));
const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@pages/auth/RegisterPage'));
const MyAccount = lazy(() => import('@pages/account_my/MyAccount'));
const NewsPage = lazy(() => import('@pages/news/NewsPage'));
const CollectionsPage = lazy(
  () => import('@pages/collections/CollectionsPage')
);
const CartPage = lazy(() => import('@pages/cart/CartPage'));
const CheckoutPage = lazy(() => import('@pages/checkout/CheckoutPage'));
const NoPage404 = lazy(() => import('@pages/static/NoPage404'));
const ProductPage = lazy(() => import('@pages/product/ProductPage'));
const SearchPage = lazy(() => import('@pages/search/SearchPage'));
const OtherUserPage = lazy(() => import('@pages/account_other/OtherUserPage'));
const OrderPage = lazy(() => import('@pages/order/OrderPage'));
const ThankYouPage = lazy(() => import('@pages/checkout/ThankYouPage'));
const ShopPage = lazy(() => import('@pages/shop/ShopPage'));
const HomePage = lazy(() => import('@pages/home/HomePage'));

import LoadingCircle from '@components/Loaders/LoadingCircle';
import { CartContext } from '@context/CartProvider';
import MainContainer from '@layout/MainContainer';

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
        <Route
          path="/"
          element={
            <MainContainer>
              <Outlet />
            </MainContainer>
          }
        >
          <Route path="news" element={<NewsPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="collection" element={<CollectionsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<Outlet />}>
            <Route
              path=""
              element={
                cartState.products.length > 0 ? (
                  <CheckoutPage />
                ) : (
                  <Navigate to={'/cart'} />
                )
              }
            />
            <Route path=":id/thankyou" element={<ThankYouPage />} />
          </Route>
          <Route path="account/register" element={<RegisterPage />} />
          <Route path="account/login" element={<LoginPage />} />
          <Route path="account/:username" element={<OtherUserPage />} />
          <Route
            path="account/my"
            element={
              !userData.data && !userData.isLoading ? (
                <Navigate to={'/account/register'} />
              ) : (
                <Outlet />
              )
            }
          >
            <Route path="" element={<MyAccount />} />
            <Route path="order/:id" element={<OrderPage />} />
          </Route>
          <Route path="terms_conditions" element={<TermsAndConditionPage />} />
          <Route path="privacy_policy" element={<PrivacyPolicyPage />} />
          <Route path="about_us" element={<AboutUsPage />} />
          <Route path="contact_us" element={<ContactUsPage />} />
        </Route>
        <Route path="/*" element={<NoPage404 />} />
      </Routes>
    </Suspense>
  );
}
