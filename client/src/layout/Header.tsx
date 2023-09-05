import { useCallback, useEffect, useState } from 'react';
import Nav from './Nav';

type HeaderTypes = {
  currentPathname: string;
};

function Header({ currentPathname }: HeaderTypes) {
  const [isTransparent, setIsTransparent] = useState(false);

  const changeHeaderBgHandler = useCallback(() => {
    const mainPageTitle = document.getElementById('mainPageTitle');
    if (mainPageTitle && mainPageTitle?.getBoundingClientRect().top < 0) {
      setIsTransparent(false);
    } else {
      setIsTransparent(true);
    }
  }, []);

  useEffect(() => {
    if (currentPathname === '/') {
      setIsTransparent(true);
      window.addEventListener('scroll', changeHeaderBgHandler);
    } else {
      setIsTransparent(false);
    }
    return () => {
      window.removeEventListener('scroll', changeHeaderBgHandler);
    };
  }, [changeHeaderBgHandler, currentPathname]);

  const flagTest = currentPathname === '/' ? isTransparent : false;
  return (
    <header className="sticky top-0 z-20 w-full ">
      <div
        className={`${flagTest ? 'opacity-0' : 'opacity-100'} ${
          currentPathname === '/' &&
          'transition-opacity duration-200 ease-in-out'
        } 
        absolute left-0 top-0 h-full w-full bg-pageBackground`}
      />
      <Nav />
    </header>
  );
}

export default Header;
