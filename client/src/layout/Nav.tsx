import { useState } from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  const [openedBurger, setOpenedBurger] = useState(false);

  const showMobileOverlay = () => {
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const navBackground = document.querySelector('.navBackground');
    if (mobileOverlay?.classList.contains('active')) {
      mobileOverlay?.classList.remove('active');
      mobileOverlay?.classList.add('inactive');

      navBackground?.classList.add('opacity-0');
      navBackground?.classList.remove('opacity-100');

      setTimeout(() => {
        mobileOverlay?.classList.remove('inactive');
      }, 100);
      setOpenedBurger(false);
    } else {
      mobileOverlay?.classList.add('active');
      navBackground?.classList.remove('opacity-0');
      navBackground?.classList.add('opacity-100');
      setOpenedBurger(true);
    }
  };

  return (
    <nav className='relative top-0 left-0 z-30 mx-auto flex h-[64px] max-w-[1480px] flex-row items-center justify-between py-3 px-10 transition-all duration-500 ease-out'>
      <div className='text-white'>SmartHub</div>
      <div className='hidden md:flex'>
        <ul className='flex flex-row items-center text-white'>
          <li className='px-2'>
            <Link to={'/'}>News</Link>
          </li>
          <li className='px-2'>
            <Link to={'/'}>Shop</Link>
          </li>
          <li className='px-2'>
            <Link to={'/'}>Specials</Link>
          </li>
          <li className='px-2'>
            <Link to={'/'}>Auctions</Link>
          </li>
        </ul>
        <div className='px-2'>Profile</div>
      </div>
      <div
        id='nav-icon3'
        className={`${
          openedBurger ? 'open' : ''
        } relative block cursor-pointer py-2 pl-2 md:hidden`}
        onClick={showMobileOverlay}
      >
        <span className='top-[5px] rotate-0'></span>
        <span
          className={`${openedBurger ? 'rotate-45' : 'rotate-0'} top-5`}
        ></span>
        <span
          className={`${openedBurger ? '-rotate-45' : 'rotate-0'} top-5`}
        ></span>
        <span className='top-[35px] rotate-0'></span>
      </div>
    </nav>
  );
}

export default Nav;
