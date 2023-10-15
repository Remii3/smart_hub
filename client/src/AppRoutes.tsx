import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserContext } from './context/UserProvider';

import ShopPage from './pages/shop/ShopPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/home/HomePage';
import MyAccount from './pages/account-my/MyAccount';
import NewsPage from './pages/news/NewsPage';
import CollectionsPage from './pages/CollectionsPage';
import AuctionsPage from './pages/AuctionsPage';
import CartPage from './pages/cart/CartPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import BlogPage from './pages/BlogPage';
import NoPage404 from './pages/NoPage404';
import ContactPage from './pages/ContactPage';
import ProductPage from './pages/product/ProductPage';
import SearchPage from './pages/search/SearchPage';
import OtherUserPage from './pages/account-other/OtherUserPage';
import OrderPage from './pages/OrderPage';
import ThankYouPage from '@pages/ThankYouPage';
import MainContainer from '@layout/MainContainer';

export default function AppRoutes() {
  const { userData } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/auctions" element={<AuctionsPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogPage />} />
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
  );
}
