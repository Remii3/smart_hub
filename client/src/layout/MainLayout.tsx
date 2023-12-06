import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import AppRoutes from '../AppRoutes';
import { useGetAccessDatabase } from '../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../data/endpoints';

export default function MainLayout() {
  const { pathname } = useLocation();
  window.onpagehide = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    useGetAccessDatabase({ url: DATABASE_ENDPOINTS.USER_GUEST });
  }, [pathname]);

  return (
    <div id="mainContainer" className="relative overflow-clip bg-background">
      <Header currentPathname={pathname} />
      <main className="h-full min-h-[calc(100vh-64px-284px)] w-full">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
