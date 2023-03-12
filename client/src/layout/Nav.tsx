import { useState } from 'react';
import { Link } from 'react-router-dom';

import '../assets/styles/navAnimations.css';

function Nav() {
  const [openedBurger, setOpenedBurger] = useState(false);

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

  return (
    <nav className='relative top-0 left-0 z-30 mx-auto flex h-[64px] max-w-[1480px] flex-row items-center justify-between py-3 px-10 transition-all duration-300 ease-out'>
      <div className='text-white'>SmartHub</div>
      <div className='hidden md:flex'>
        <ul className='flex flex-row items-center px-8 text-white'>
          <li className='hover:text-primary text-base transition-[color,transform] duration-200 ease-out hover:scale-105'>
            <Link className='px-4 py-2' to={'/'}>
              News
            </Link>
          </li>
          <li className='hover:text-primary text-base transition-[color,transform] duration-200 ease-out hover:scale-105'>
            <Link className='px-4 py-2' to={'/'}>
              Shop
            </Link>
          </li>
          <li className='hover:text-primary text-base transition-[color,transform] duration-200 ease-out hover:scale-105'>
            <Link className='px-4 py-2' to={'/'}>
              Specials
            </Link>
          </li>
          <li className='hover:text-primary text-base transition-[color,transform] duration-200 ease-out hover:scale-105'>
            <Link className='px-4 py-2' to={'/'}>
              Auctions
            </Link>
          </li>
        </ul>
        <div className='px-2'>Profile</div>
      </div>
      <div
        className={`${
          openedBurger ? 'open' : ''
        } relative block h-10 w-10  cursor-pointer py-2 pl-2 md:hidden`}
        onClick={showMobileOverlay}
      >
        <span
          className={`${
            openedBurger ? 'top-[18px] left-1/2 w-0' : 'top-[5px] left-0 w-full'
          } absolute block h-1 rotate-0 rounded-lg bg-white opacity-100 transition-[top,left,width] duration-200 ease-in-out`}
        ></span>
        <span
          className={`${
            openedBurger ? 'rotate-45' : 'rotate-0'
          } absolute top-5 left-0 block h-1 w-full rounded-lg bg-white opacity-100 transition-transform`}
        ></span>
        <span
          className={`${
            openedBurger ? '-rotate-45' : 'rotate-0'
          } absolute top-5 left-0 block h-1 w-full rounded-lg bg-white opacity-100 transition-transform`}
        ></span>
        <span
          className={`${
            openedBurger
              ? 'top-[18px] left-1/2 w-0'
              : 'top-[35px] left-0 w-full'
          } absolute block h-1 rotate-0 rounded-lg bg-white opacity-100 transition-[top,left,width] duration-200 ease-in-out`}
        ></span>
      </div>
    </nav>
  );
}

export default Nav;
