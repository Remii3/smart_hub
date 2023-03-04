import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='pt-6 pb-10 text-center text-xl text-white'>
      <div>
        <h6>Best design team</h6>
        <p>
          <Link to={'/'}></Link>
        </p>
        <p>
          <Link to={'/'}></Link>
        </p>
        <p>
          <Link to={'/'}></Link>
        </p>
        <div>{/* social media */}</div>
      </div>
      <div>
        <h6>Company</h6>
        <p>
          <Link to={'/'}></Link>
        </p>
        <p>
          <Link to={'/'}></Link>
        </p>{' '}
        <p>
          <Link to={'/'}></Link>
        </p>{' '}
        <p>
          <Link to={'/'}></Link>
        </p>
      </div>
      <div>
        <h6>Community</h6>
        <p>
          <Link to={'/'}></Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
