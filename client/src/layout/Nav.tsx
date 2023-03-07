import { Link } from 'react-router-dom';

function Nav() {
  return (
    <nav className='flex flex-row justify-between items-center max-w-[1480px] relative top-0 left-0 py-3 mx-auto px-10 z-30'>
      <div>SmartHub</div>
      <div className='hidden md:flex'>
        <ul className='text-white flex flex-row'>
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
    </nav>
  );
}

export default Nav;
