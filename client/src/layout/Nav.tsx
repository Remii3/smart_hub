import { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { OverlayContext } from '../context/OverlayProvider';
import { UserContext } from '../context/UserProvider';
import '../assets/styles/navAnimations.css';

function Nav() {
  const [openedBurger, setOpenedBurger] = useState(false);
  const userIcon = useRef<HTMLDivElement>(null);

  const { userData, setUserData } = useContext(UserContext);

  const { shownOverlay, setShownOverlay } = useContext(OverlayContext);

  gsap.registerPlugin();

  const showMobileOverlay = () => {
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (mobileOverlay?.classList.contains('active')) {
      mobileOverlay?.classList.remove('active');
      mobileOverlay?.classList.add('inactive');

      setTimeout(() => {
        mobileOverlay?.classList.remove('inactive');
      }, 100);
      setOpenedBurger(false);
    } else {
      mobileOverlay?.classList.add('active');
      setOpenedBurger(true);
    }
  };

  const profileDropdownHandler = () => {
    setShownOverlay((prevState) => !prevState);
  };

  const disableDropdownHandler = () => {
    setShownOverlay(false);
  };

  const logoutHandler = () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    setUserData(() => null);
    disableDropdownHandler();
  };

  return (
    <nav className="mx-auto flex h-[64px] max-w-[1480px] flex-row items-center justify-between  py-3 px-10 transition-all duration-300 ease-out">
      <div className="text-white">
        <button type="button" onClick={() => setShownOverlay(false)}>
          <Link to="/">SmartHub</Link>
        </button>
      </div>
      <div className="hidden md:flex">
        <ul className="flex flex-row items-center px-8 text-white">
          <li className="text-base transition-[color,transform] duration-200 ease-out hover:scale-105 hover:text-primary">
            <button type="button" onClick={disableDropdownHandler}>
              <Link className="px-4 py-2" to="/news">
                News
              </Link>
            </button>
          </li>

          <li className="text-base transition-[color,transform] duration-200 ease-out hover:scale-105 hover:text-primary">
            <button type="button" onClick={disableDropdownHandler}>
              <Link className="px-4 py-2" to="/shop">
                Shop
              </Link>
            </button>
          </li>

          <li className="text-base transition-[color,transform] duration-200 ease-out hover:scale-105 hover:text-primary">
            <button type="button" onClick={disableDropdownHandler}>
              <Link className="px-4 py-2" to="/specials">
                Specials
              </Link>
            </button>
          </li>

          <li className="text-base transition-[color,transform] duration-200 ease-out hover:scale-105 hover:text-primary">
            <button type="button" onClick={disableDropdownHandler}>
              <Link className="px-4 py-2" to="/auctions">
                Auctions
              </Link>
            </button>
          </li>
        </ul>
        <div className="relative z-40 flex items-center justify-center px-2">
          <button type="button" onClick={profileDropdownHandler}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mt-[2px] h-7 w-7 text-white"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {!userData && (
            <div
              ref={userIcon}
              className={`${
                shownOverlay ? 'flex' : 'hidden'
              } absolute top-7 w-24 flex-col rounded-lg bg-pageBackground`}
            >
              <Link
                to={{ pathname: '/account', search: 'auth=login' }}
                className="px-3 pt-4 pb-2 text-white transition-[color,transform] duration-200 ease-out hover:text-primary"
              >
                <button
                  type="button"
                  className="w-full text-center text-base"
                  onClick={disableDropdownHandler}
                >
                  Sign in
                </button>
              </Link>
              <Link
                to={{ pathname: '/account', search: 'auth=register' }}
                className="px-3 pb-4 pt-2 text-white transition-[color,transform] duration-200 ease-out hover:text-primary"
              >
                <button
                  type="button"
                  className="w-full text-center text-base"
                  onClick={disableDropdownHandler}
                >
                  Sign up
                </button>
              </Link>
            </div>
          )}
          {userData && (
            <div
              className={`${
                shownOverlay ? 'flex' : 'hidden'
              }  absolute top-7 w-24 flex-col rounded-lg bg-pageBackground`}
            >
              <Link
                to="/account/my"
                className="px-3 pb-2 pt-4 text-white transition-[color,transform] duration-200 ease-out hover:text-primary"
              >
                <button
                  type="button"
                  className="w-full text-center text-base"
                  onClick={disableDropdownHandler}
                >
                  Account
                </button>
              </Link>
              <button
                type="button"
                onClick={logoutHandler}
                className="px-3 pb-4 pt-2 text-base text-white transition-[color,transform] duration-200 ease-out hover:text-primary"
              >
                Logout
              </button>
            </div>
          )}
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
            openedBurger ? 'top-[18px] left-1/2 w-0' : 'top-[5px] left-0 w-full'
          } absolute block h-1 rotate-0 rounded-lg bg-white opacity-100 transition-[top,left,width] duration-200 ease-in-out`}
        />
        <span
          className={`${
            openedBurger ? 'rotate-45' : 'rotate-0'
          } absolute top-[18px] left-0 block h-1 w-full rounded-lg bg-white opacity-100 transition-transform`}
        />
        <span
          className={`${
            openedBurger ? '-rotate-45' : 'rotate-0'
          } absolute top-[18px] left-0 block h-1 w-full rounded-lg bg-white opacity-100 transition-transform`}
        />
        <span
          className={`${
            openedBurger
              ? 'top-[18px] left-1/2 w-0'
              : 'top-[31px] left-0 w-full'
          } absolute block h-1 rotate-0 rounded-lg bg-white opacity-100 transition-[top,left,width] duration-200 ease-in-out`}
        />
      </button>
    </nav>
  );
}

export default Nav;
