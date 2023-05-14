import { useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';

type PropsType = {
  children: React.ReactNode;
};

function MainLayout({ children }: PropsType) {
  const [currentPathname, setCurrentPathname] = useState('');

  useEffect(() => {
    setCurrentPathname(window.location.pathname);
  }, [children]);

  return (
    <div id="mainContainer" className="relative overflow-hidden bg-white">
      <Header currentPathname={currentPathname} />
      <main className="mt-16 h-full w-full">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
