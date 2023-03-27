import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { OverlayContext } from '../context/OverlayProvider';
import { UserContext } from '../context/UserProvider';

import '../assets/styles/navAnimations.css';

function Nav() {
  const [openedBurger, setOpenedBurger] = useState(false);
  const [openedProfile, setOpenedProfile] = useState(false);

  const { loggedIn, setLoggedIn } = useContext(UserContext);

  const { shownOverlay, setShownOverlay } = useContext(OverlayContext);

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

  const showProfileDropdown = () => {
    console.log('first');
    setShownOverlay((prevState) => !prevState);
  };

  return (
    <nav className="relative top-0 left-0 z-30 mx-auto flex h-[64px] max-w-[1480px] flex-row items-center justify-between py-3 px-10 transition-all duration-300 ease-out">
      <div className="text-white">
        <Link to="/">SmartHub</Link>
      </div>
      <div className="hidden md:flex">
        <ul className="flex flex-row items-center px-8 text-white">
          <li className="text-base transition-[color,transform] duration-200 ease-out hover:scale-105 hover:text-primary">
            <Link className="px-4 py-2" to="/news">
              News
            </Link>
          </li>
          <li className="text-base transition-[color,transform] duration-200 ease-out hover:scale-105 hover:text-primary">
            <Link className="px-4 py-2" to="/shop">
              Shop
            </Link>
          </li>
          <li className="text-base transition-[color,transform] duration-200 ease-out hover:scale-105 hover:text-primary">
            <Link className="px-4 py-2" to="/specials">
              Specials
            </Link>
          </li>
          <li className="text-base transition-[color,transform] duration-200 ease-out hover:scale-105 hover:text-primary">
            <Link className="px-4 py-2" to="/auctions">
              Auctions
            </Link>
          </li>
        </ul>
        <div className="relative flex items-center justify-center px-2">
          <button type="button" onClick={showProfileDropdown}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {shownOverlay && !loggedIn && (
            <div className="absolute -bottom-16 flex w-20 flex-col gap-2 bg-pageBackground p-2">
              <Link to="/account/login" className="text-sm text-white">
                Sign in
              </Link>
              <Link to="/account/register" className="text-sm text-white">
                Sign up
              </Link>
            </div>
          )}
          {shownOverlay && loggedIn && (
            <div className="absolute -bottom-16 flex w-20 flex-col gap-2 bg-pageBackground p-2">
              <Link to="/account/my" className="text-sm text-white">
                My account
              </Link>
            </div>
          )}
        </div>
      </div>
      <button
        type="button"
        className={`${
          openedBurger ? 'open' : ''
        } relative block h-10 w-10  cursor-pointer  pl-2 md:hidden`}
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
