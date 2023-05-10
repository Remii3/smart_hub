/* eslint-disable react/no-array-index-key */
import { Link } from 'react-router-dom';

function Footer() {
  const leftColumnLinks = [
    { to: '/termsconditions', text: 'Terms and conditions' },
    { to: '/privacypolicy', text: 'Privacy Policy' },
  ];
  const middleColumnLinks = [
    { to: '/shop', text: 'Shop' },
    { to: '/news', text: 'News' },
    { to: '/collections', text: 'Collections' },
    { to: '/contact', text: 'Contact' },
  ];
  const rightColumnLinks = [
    { to: '/news', text: 'News' },
    { to: '/blog', text: 'Blog' },
  ];
  return (
    <footer className="w-full bg-pageBackground">
      <div className="mx-auto flex max-w-[1200px] flex-col justify-center gap-10 pb-20 pl-4 pt-10 text-white md:flex-row md:gap-5">
        <div className="flex basis-2/3 flex-col gap-10 sm:flex-row md:gap-5">
          <div className="basis-1/2 text-center">
            <h6 className="inline-block pb-4 text-xl">Best design team</h6>
            <ul className="flex flex-col gap-2">
              <li className="pt-1 text-base">&copy;2023 Best design team</li>
              {leftColumnLinks.map((link, id) => (
                <li key={id}>
                  <Link
                    to={link.to}
                    className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="basis-1/2 text-center">
            <h6 className="pb-4 text-xl">Company</h6>
            <ul className="flex flex-col gap-2">
              {middleColumnLinks.map((link, id) => (
                <li key={id}>
                  <Link
                    to={link.to}
                    className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="basis-1/3 text-center">
          <h6 className="pb-4 text-xl">Community</h6>
          <ul className="flex flex-col gap-2">
            {rightColumnLinks.map((link, id) => (
              <li key={id}>
                <Link
                  to={link.to}
                  className="text-base transition-[color] duration-200 ease-out hover:text-primaryText"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
