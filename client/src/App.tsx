import axios from 'axios';
import UserProvider from './context/UserProvider';
import CartProvider from './context/CartProvider';
import MainLayout from './layout/MainLayout';
import { Toaster } from '@components/UI/toaster';
import { ParallaxProvider } from 'react-scroll-parallax';

let properUrl = 'http://localhost:4000';

switch (window.location.origin) {
  case 'http://localhost:5173':
    properUrl = 'http://localhost:4000';
    break;
  case 'http://localhost:4173':
    properUrl = 'http://localhost:4000';
    break;
  case 'https://smarthub.studio':
    properUrl = 'https://smarthub-backend.onrender.com';
    break;
  default:
    properUrl = 'https://smarthub-backend.onrender.com';
    break;
}
axios.defaults.baseURL = properUrl;
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <>
      <UserProvider>
        <CartProvider>
          <ParallaxProvider>
            <MainLayout />
            <Toaster />
          </ParallaxProvider>
        </CartProvider>
      </UserProvider>
    </>
  );
}
