import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

import { OverlayContext } from '../context/OverlayProvider';
import { UserContext } from '../context/UserProvider';
import {
  OutlineAccountImg,
  SolidAccountImg,
} from '../assets/icons/AccountIcon';

type PropsTypes = {
  accountDropdownOverlayHandler: () => void;
  headerBgHandler: () => void;
};

function Nav({ accountDropdownOverlayHandler, headerBgHandler }: PropsTypes) {
  const [openedBurger, setOpenedBurger] = useState(false);
  const navMobile = useRef(null);
  const navLinkList = [
    { to: '/news', text: 'news' },
    { to: '/shop', text: 'shop' },
    { to: '/collections', text: 'collections' },
    { to: '/auctions', text: 'auctions' },
  ];
  const { userData, setUserData } = useContext(UserContext);
  const { shownOverlay } = useContext(OverlayContext);

  gsap.registerPlugin();

  const showMobileOverlay = () => {
    if (openedBurger) {
      gsap.to(navMobile.current, {
        left: '100vw',
        ease: 'sine.inOut',
      });
      setOpenedBurger(false);
    } else {
      gsap.to(navMobile.current, {
        left: '0',
        ease: 'sine.inOut',
      });
      setOpenedBurger(true);
    }
  };

  const accountDropdownHandler = () => {
    headerBgHandler();
    accountDropdownOverlayHandler();
  };

  const logoutHandler = () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUserData(() => null);
    accountDropdownHandler();
  };

  useEffect(() => {
    gsap.to(navMobile.current, {
      left: '100vw',
      ease: 'sine.inOut',
    });
    setOpenedBurger(false);
  }, []);

  return (
    <nav>
      <div className="mx-auto flex h-[64px] max-w-[1480px] flex-row items-center justify-between px-10 py-3">
        <div>
          <Link to="/" className="text-white">
            SmartHub
          </Link>
        </div>
        <div className="hidden md:flex">
          <ul className="flex flex-row items-center px-8 text-white">
            {navLinkList.map((navLink, id) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={id}>
                <Link
                  to={navLink.to}
                  className="px-4 py-2 text-base transition-[color] duration-200 ease-out hover:text-primary"
                >
                  {navLink.text[0].toLocaleUpperCase()}
                  {navLink.text.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="relative z-40 mt-[2px] flex items-center justify-center ">
            <button
              type="button"
              className={`${
                shownOverlay ? 'bg-transparentGray shadow-lg' : ''
              } rounded-lg p-1 transition-[background-color,box-shadow] duration-200 ease-out hover:bg-transparentGray hover:shadow-lg `}
              onClick={() => accountDropdownHandler()}
            >
              {userData ? <SolidAccountImg /> : <OutlineAccountImg />}
            </button>

            <div className="absolute top-7 w-24 rounded-lg bg-pageBackground">
              {!userData ? (
                <div className={`${shownOverlay ? 'flex' : 'hidden'} flex-col`}>
                  <Link
                    to={{ pathname: '/account', search: 'auth=login' }}
                    className="w-full px-3 pb-2 pt-4 text-center text-base text-white transition-[color] duration-200 ease-out hover:text-primary"
                    onClick={() => accountDropdownHandler()}
                  >
                    Sign in
                  </Link>
                  <Link
                    to={{ pathname: '/account', search: 'auth=register' }}
                    className="w-full px-3 pb-4 pt-2 text-center text-base text-white transition-[color] duration-200 ease-out hover:text-primary"
                    onClick={() => accountDropdownHandler()}
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className={`${shownOverlay ? 'flex' : 'hidden'} flex-col`}>
                  <Link
                    to="/account/my"
                    className="px-3 pb-2 pt-4 text-white transition-[color] duration-200 ease-out hover:text-primary"
                  >
                    <button
                      type="button"
                      className="w-full text-center text-base"
                      onClick={() => accountDropdownHandler()}
                    >
                      Account
                    </button>
                  </Link>
                  <button
                    type="button"
                    onClick={logoutHandler}
                    className="px-3 pb-4 pt-2 text-base text-white transition-[color] duration-200 ease-out hover:text-primary"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`${
            openedBurger ? 'open' : ''
          } relative z-30 block h-10 w-10 cursor-pointer pl-2 md:hidden`}
          onClick={showMobileOverlay}
        >
          <span
            className={`${
              openedBurger
                ? 'left-1/2 top-[18px] w-0'
                : 'left-0 top-[5px] w-full'
            } absolute block h-1 rotate-0 rounded-lg bg-white opacity-100 transition-[top,left,width] duration-200 ease-in-out`}
          />
          <span
            className={`${
              openedBurger ? 'rotate-45' : 'rotate-0'
            } absolute left-0 top-[18px] block h-1 w-full rounded-lg bg-white opacity-100 transition-transform`}
          />
          <span
            className={`${
              openedBurger ? '-rotate-45' : 'rotate-0'
            } absolute left-0 top-[18px] block h-1 w-full rounded-lg bg-white opacity-100 transition-transform`}
          />
          <span
            className={`${
              openedBurger
                ? 'left-1/2 top-[18px] w-0'
                : 'left-0 top-[31px] w-full'
            } absolute block h-1 rotate-0 rounded-lg bg-white opacity-100 transition-[top,left,width] duration-200 ease-in-out`}
          />
        </button>
      </div>
      <div
        ref={navMobile}
        className="mobile-overlay absolute left-[100vw] top-[0] z-10 h-screen w-full bg-pageBackground pt-16"
      >
        <ul className="flex flex-col text-white">
          {navLinkList.map((navLink, id) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={id}>
              <Link
                to={navLink.to}
                className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
              >
                {navLink.text[0].toLocaleUpperCase()}
                {navLink.text.slice(1)}
              </Link>
            </li>
          ))}
          <div
            className="mx-auto my-4 h-[1px] w-3/4 rounded-lg bg-white"
            aria-hidden="true"
          />
          <li className="w-full bg-pageBackground">
            {!userData ? (
              <div className="flex-col">
                <Link
                  to={{ pathname: '/account', search: 'auth=login' }}
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                >
                  Sign in
                </Link>
                <Link
                  to={{ pathname: '/account', search: 'auth=register' }}
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex-col">
                <Link
                  to="/account/my"
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                >
                  Account
                </Link>
                <button
                  type="button"
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
