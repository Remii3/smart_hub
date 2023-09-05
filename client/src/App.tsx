import axios from 'axios';
import UserProvider from './context/UserProvider';
import CartProvider from './context/CartProvider';
import MainLayout from './layout/MainLayout';

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

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <MainLayout />
      </CartProvider>
    </UserProvider>
  );
}
