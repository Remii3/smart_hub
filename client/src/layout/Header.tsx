import { Link } from 'react-router-dom';
import useScrollPosition from '../hooks/useScrollPosition';
import Nav from './Nav';

function Header() {
  const scrollPosition = useScrollPosition();

  return (
    <header className='sticky top-0 left-0 z-30 w-full'>
      <div
        className={`${
          Number(scrollPosition) <= 935 ? 'bg-transparent' : 'bg-pageBackground'
        } absolute top-0 left-0 z-20 h-full w-full transition-colors duration-300 ease-in-out`}
      />
      <Nav />
      <div className='mobile-overlay bg-pageBackground absolute top-0 left-[100vw] z-10 w-full'>
        <ul className='flex flex-col text-white'>
          <li className='w-full'>
            <Link
              to={'/'}
              className='hover:text-primaryText block w-full py-3 text-center text-lg transition-colors duration-200 ease-out'
            >
              News
            </Link>
          </li>
          <li className='w-full'>
            <Link
              to={'/'}
              className='hover:text-primaryText block w-full py-3 text-center text-lg transition-colors duration-200 ease-out'
            >
              Shop
            </Link>
          </li>
          <li>
            <Link
              to={'/'}
              className='hover:text-primaryText block w-full py-3 text-center text-lg transition-colors duration-200 ease-out'
            >
              Specials
            </Link>
          </li>
          <li>
            <Link
              to={'/'}
              className='hover:text-primaryText block w-full py-3 text-center text-lg transition-colors duration-200 ease-out'
            >
              Auctions
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
