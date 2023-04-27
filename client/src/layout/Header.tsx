import { gsap } from 'gsap';
import { useContext, useEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { OverlayContext } from '../context/OverlayProvider';
import Nav from './Nav';

function Header() {
  const { shownOverlay, setShownOverlay } = useContext(OverlayContext);
  const navOverlay = useRef(null);
  const headerBgBreakPoint = useRef(null);
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const mainContainer = document.getElementById('mainContainer');

    ScrollTrigger.create({
      trigger: mainContainer,
      start: 'top 70px',
      end: 'bottom 70px',
      markers: false,
      animation: gsap.to(headerBgBreakPoint.current, {
        backgroundColor: '#14222F',
        ease: 'sine.out',
      }),
      toggleActions: 'restart none none reverse',
    });
  }, []);

  const profileOverlayHandler = () => {
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
  return (
    <header
      ref={headerBgBreakPoint}
      className="sticky left-0 top-0 z-20 w-full overflow-hidden bg-transparent"
    >
      <div
        ref={navOverlay}
        className="absolute inset-0 h-screen max-h-0 w-screen bg-black opacity-0"
        onClick={profileOverlayHandler}
        aria-hidden="true"
      />
      <Nav profileOverlayHandler={profileOverlayHandler} />
    </header>
  );
}

export default Header;
