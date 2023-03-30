import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserProvider';
import { OverlayContext } from '../context/OverlayProvider';
import useScrollPosition from '../hooks/useScrollPosition';
import Nav from './Nav';

function Header() {
  const scrollPosition = useScrollPosition('mainPageScroll');
  const windowWidth = window.innerWidth;
  let navColorBreakpoint = 0;
  const { shownOverlay, setShownOverlay } = useContext(OverlayContext);
  const { userData, setUserData } = useContext(UserContext);

  if (windowWidth < 480) {
    navColorBreakpoint = 590;
  } else if (windowWidth < 900) {
    navColorBreakpoint = 950;
  } else {
    navColorBreakpoint = 980;
  }

  return (
    <header className="fixed top-0 left-0 z-20 w-full">
      {shownOverlay && (
        <div
          className="absolute inset-0 z-30 h-screen w-screen bg-black opacity-30"
          onClick={() => setShownOverlay(false)}
          aria-hidden="true"
        />
      )}
      <Nav />
      <div className="mobile-overlay absolute top-0 left-[100vw] z-10 w-full bg-pageBackground">
        <ul className="flex flex-col text-white">
          <li className="w-full">
            <Link
              to="/news"
              className="block w-full py-3 text-center text-lg transition-colors duration-200 ease-out hover:text-primaryText"
            >
              News
            </Link>
          </li>
          <li className="w-full">
            <Link
              to="/shop"
              className="block w-full py-3 text-center text-lg transition-colors duration-200 ease-out hover:text-primaryText"
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              to="/collections"
              className="block w-full py-3 text-center text-lg transition-colors duration-200 ease-out hover:text-primaryText"
            >
              Collections
            </Link>
          </li>
          <li>
            <Link
              to="/auctions"
              className="block w-full py-3 text-center text-lg transition-colors duration-200 ease-out hover:text-primaryText"
            >
              Auctions
            </Link>
          </li>
          <div className="mx-auto my-4 h-[1px] w-3/4 rounded-lg bg-white" />

          {!userData && (
            <div className="w-full flex-col bg-pageBackground">
              <button type="button" className="w-full">
                <Link
                  to={{ pathname: '/account', search: 'auth=login' }}
                  className="block w-full py-3 text-center text-lg transition-colors duration-200 ease-out hover:text-primaryText"
                >
                  Sign in
                </Link>
              </button>
              <button type="button" className="w-full">
                <Link
                  to={{ pathname: '/account', search: 'auth=register' }}
                  className="block w-full py-3 text-center text-lg transition-colors duration-200 ease-out hover:text-primaryText"
                >
                  Sign up
                </Link>
              </button>
            </div>
          )}
          {userData && (
            <div className="w-full flex-col bg-pageBackground">
              <Link
                to="/account/my"
                className="block w-full py-3 text-center text-lg transition-colors duration-200 ease-out hover:text-primaryText"
              >
                Account
              </Link>
              <button
                type="button"
                className="block w-full py-3 text-center text-lg transition-colors duration-200 ease-out hover:text-primaryText"
              >
                Logout
              </button>
            </div>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;
