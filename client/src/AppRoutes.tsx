import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserContext } from './context/UserProvider';

import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import MyAccount from './pages/MyAccount';
import NewsPage from './pages/newsPage/NewsPage';
import CollectionsPage from './pages/CollectionsPage';
import AuctionsPage from './pages/AuctionsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BlogPage from './pages/BlogPage';
import NoPage404 from './pages/NoPage404';
import ContactPage from './pages/ContactPage';
import ProductPage from './pages/ProductPage';
import SearchPage from './pages/SearchPage';
import OtherUserPage from './pages/OtherUserPage';
import OrderPage from './pages/OrderPage';
import ThankYouPage from '@pages/ThankYouPage';

export default function AppRoutes() {
  const { userData } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
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
