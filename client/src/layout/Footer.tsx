import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='mx-auto flex max-w-[1200px] flex-col justify-center gap-5 pt-6 pb-10 pl-4 text-white md:flex-row'>
      <div className='flex basis-2/3 flex-col gap-5 sm:flex-row'>
        <div className='basis-1/2'>
          <h6 className='inline-block pb-4 text-xl'>Best design team</h6>
          <ul>
            <li>&copy;2023 Best design team</li>
            <li>
              <Link to={'/'}> Terms and conditions</Link>
            </li>
            <li>
              <Link to={'/'}>Privacy Policy </Link>
            </li>
          </ul>
        </div>
        <div className='basis-1/2'>
          <h6 className='pb-4 text-xl'>Company</h6>
          <ul>
            <li>
              <Link to='/'>Shop</Link>
            </li>
            <li>
              <Link to='/'>Collections</Link>
            </li>
            <li>
              <Link to='/'>Auctions</Link>
            </li>
            <li>
              <Link to='/'>Contact</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className='basis-1/3'>
        <h6 className='pb-4 text-xl'>Community</h6>
        <ul>
          <li>
            <Link to={'/'}>Blog</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
