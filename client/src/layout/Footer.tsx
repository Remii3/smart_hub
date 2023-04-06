import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1200px] flex-col justify-center gap-10 pb-20 pl-4 pt-10 text-white md:flex-row md:gap-5">
      <div className="flex basis-2/3 flex-col gap-10 sm:flex-row md:gap-5">
        <div className="basis-1/2 text-center">
          <h6 className="inline-block pb-4 text-xl">Best design team</h6>
          <ul className="flex flex-col gap-2">
            <li className="text-base">&copy;2023 Best design team</li>
            <li>
              <Link
                className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
                to="/termsconditions"
              >
                Terms and conditions
              </Link>
            </li>
            <li>
              <Link
                className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
                to="/privpolicy"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div className="basis-1/2 text-center">
          <h6 className="pb-4 text-xl">Company</h6>
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
                to="/shop"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
                to="/collections"
              >
                Collections
              </Link>
            </li>
            <li>
              <Link
                className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
                to="/auctions"
              >
                Auctions
              </Link>
            </li>
            <li>
              <Link
                className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
                to="/contact"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="basis-1/3 text-center">
        <h6 className="pb-4 text-xl">Community</h6>
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
              to="/news"
            >
              News
            </Link>
          </li>
          <li>
            <Link
              className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
              to="/blog"
            >
              Blog
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
