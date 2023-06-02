import { useCallback, useEffect, useRef, useState } from 'react';
import Nav from './Nav';

type HeaderTypes = {
  currentPathname: string;
};

function Header({ currentPathname }: HeaderTypes) {
  const headerElement = useRef(null);
  const mainPageTitle = document.getElementById('mainPageTitle');
  const [isTransparent, setIsTransparent] = useState(false);
  const isMainPage = currentPathname === '/';

  const changeHeaderBgHandler = useCallback(() => {
    if (mainPageTitle && mainPageTitle?.getBoundingClientRect().top < 0) {
      setIsTransparent(false);
    } else {
      setIsTransparent(true);
    }
  }, [mainPageTitle]);

  useEffect(() => {
    if (isMainPage) {
      setIsTransparent(true);
      window.addEventListener('scroll', changeHeaderBgHandler);
    }
    return () => {
      window.removeEventListener('scroll', changeHeaderBgHandler);
    };
  }, [changeHeaderBgHandler, isMainPage]);

  return (
    <header className="fixed top-0 z-20 w-full ">
      <div
        ref={headerElement}
        className={`${
          isMainPage && isTransparent ? 'opacity-0' : 'opacity-100'
        } absolute left-0 top-0 h-full w-full bg-pageBackground transition-[opacity] duration-300 ease-in-out`}
      />
      <Nav />
    </header>
  );
}

export default Header;
