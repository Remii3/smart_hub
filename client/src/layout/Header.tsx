import { Link } from 'react-router-dom';
import useScrollPosition from '../hooks/useScrollPosition';
import Nav from './Nav';

function Header() {
  const scrollPosition = useScrollPosition();
  const windowWidth = window.innerWidth;
  let navColorBreakpoint = 0;

  if (windowWidth < 480) {
    navColorBreakpoint = 590;
  } else if (windowWidth < 900) {
    navColorBreakpoint = 950;
  } else {
    navColorBreakpoint = 980;
  }
  return (
    <header className="sticky top-0 left-0 z-30 w-full">
      <div
        className={`${
          Number(scrollPosition) <= navColorBreakpoint
            ? 'bg-transparent'
            : 'bg-pageBackground'
        } absolute top-0 left-0 z-20 h-full w-full transition-colors duration-300 ease-out`}
      />
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
        </ul>
      </div>
      <div className="sticky top-0 left-0 z-20 hidden h-screen w-screen bg-blue-300" />
    </header>
  );
}

export default Header;
