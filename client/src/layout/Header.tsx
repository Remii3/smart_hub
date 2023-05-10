import { useCallback, useEffect, useRef, useState } from 'react';
import Nav from './Nav';

type HeaderTypes = {
  currentPathname: string;
};

function Header({ currentPathname }: HeaderTypes) {
  const headerElement = useRef(null);
  const mainPageSectionOne = document.getElementById('mainPageSectionOne');
  const [isTransparent, setIsTransparent] = useState(false);
  const isMainPage = currentPathname === '/';

  const changeHeaderBgHandler = useCallback(() => {
    if (
      mainPageSectionOne &&
      window.pageYOffset > mainPageSectionOne?.offsetHeight
    ) {
      setIsTransparent(false);
    } else {
      setIsTransparent(true);
    }
  }, [mainPageSectionOne]);

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
    <header className="fixed top-0 z-20 w-screen pr-[17px]">
      <div
        ref={headerElement}
        className={`${
          isMainPage && isTransparent ? 'opacity-0' : 'opacity-100'
        } absolute left-0 top-0 h-full w-full bg-pageBackground`}
      />
      <Nav />
    </header>
  );
}

export default Header;
