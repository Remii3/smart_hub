import { useContext, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Nav from './Nav';
import { OverlayContext } from '../context/OverlayProvider';

function Header() {
  const { shownOverlay, setShownOverlay } = useContext(OverlayContext);
  const navOverlay = useRef(null);
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

  const accountDropdownOverlayHandler = () => {
    const tm = gsap.timeline();

    if (shownOverlay) {
      tm.to(navOverlay.current, {
        opacity: 0,
        duration: 0.1,
      }).to(navOverlay.current, { maxHeight: 0, duration: 0.01 });
    } else {
      tm.to(navOverlay.current, { maxHeight: '100vh', duration: 0.01 }).to(
        navOverlay.current,
        {
          opacity: 0.3,
          duration: 0.1,
        }
      );
    }
    setShownOverlay((prevState) => !prevState);
  };

  useEffect(() => {
    headerBgHandler();
  }, []);

  return (
    <header
      ref={headerElement}
      className="fixed left-0 top-0 z-20 w-full bg-transparent"
    >
      <div
        ref={navOverlay}
        className="absolute inset-0 h-screen max-h-0 w-screen bg-black opacity-0"
        onClick={accountDropdownOverlayHandler}
        aria-hidden="true"
      />
      <Nav
        accountDropdownOverlayHandler={accountDropdownOverlayHandler}
        headerBgHandler={() => headerBgHandler()}
      />
    </header>
  );
}

export default Header;
