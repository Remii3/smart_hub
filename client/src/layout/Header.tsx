import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Nav from './Nav';

function Header() {
  const headerElement = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  const headerBgHandler = () => {
    const mainPageUrl = window.location.pathname === '/';
    const mainPageSectionOne = document.getElementById('mainPageSectionOne');

    if (mainPageSectionOne && mainPageUrl) {
      gsap.to(headerElement.current, {
        scrollTrigger: {
          trigger: mainPageSectionOne,
          toggleActions: 'restart none none reverse',
          start: 'top',
          end: 'top',
        },
        backgroundColor: '#14222F',
        ease: 'sine.out',
      });
    } else {
      gsap.to(headerElement.current, {
        backgroundColor: '#14222F',
        ease: 'none',
        duration: 0,
      });
    }
  };

  useEffect(() => {
    headerBgHandler();
  }, []);

  return (
    <header
      ref={headerElement}
      className="fixed top-0 z-20 w-screen bg-transparent pr-[17px]"
    >
      <Nav />
    </header>
  );
}

export default Header;
