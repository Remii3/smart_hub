import { useCallback, useEffect, useState } from 'react';
import Nav from './Nav';

type HeaderTypes = {
  currentPathname: string;
};

function Header({ currentPathname }: HeaderTypes) {
  const [isTransparent, setIsTransparent] = useState(false);
const isHomepage = currentPathname === '/';
const changeHeaderBgHandler = useCallback(() => {
  const mainPageTitle = document.getElementById('mainPageTitle');
  if (mainPageTitle && mainPageTitle?.getBoundingClientRect().top < 0) {
    setIsTransparent(false);
  } else {
    setIsTransparent(true);
  }
}, []);

useEffect(() => {
  if (isHomepage) {
    setIsTransparent(true);
    window.addEventListener('scroll', changeHeaderBgHandler);
  }
  return () => {
    window.removeEventListener('scroll', changeHeaderBgHandler);
  };
}, [changeHeaderBgHandler, currentPathname]);

const scrollFlag = isHomepage ? isTransparent : false;
return (
  <header className={`${isHomepage ? 'fixed' : 'sticky'} top-0 z-20 w-full`}>
    <div
      className={`${scrollFlag ? 'opacity-0' : 'opacity-100'}
        transiiton-opacity absolute left-0 top-0 h-full w-full bg-background shadow-sm duration-150 ease-out`}
    />
    <div className={`${scrollFlag ? 'text-background' : 'text-foreground'}`}>
      <Nav scrollFlag={scrollFlag} />
    </div>
  </header>
);
}

export default Header;
