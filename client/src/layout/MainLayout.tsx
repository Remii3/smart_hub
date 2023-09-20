import { useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import AppRoutes from '../AppRoutes';
import { useGetAccessDatabase } from '../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../data/endpoints';

export default function MainLayout() {
  const { pathname } = useLocation();

  window.onunload = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    if (
      !document.cookie.match('token') &&
      !document.cookie.match('guestToken')
    ) {
      useGetAccessDatabase({ url: DATABASE_ENDPOINTS.USER_GUEST });
    }
  }, [pathname]);

  return (
    <div id="mainContainer" className="relative overflow-clip bg-white">
      <Header currentPathname={pathname} />
      <main className="h-full min-h-[calc(100vh-64px-284px)] w-full">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
