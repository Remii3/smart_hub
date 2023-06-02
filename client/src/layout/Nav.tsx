import { Fragment, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';

import { Menu, Popover, Transition } from '@headlessui/react';
import { UserContext } from '../context/UserProvider';
import {
  CartIcon,
  OutlineAccountImg,
  SolidAccountImg,
} from '../assets/icons/Icons';
import CartPopup from '../components/cart/CartPopup';
import { CartContext } from '../context/CartProvider';

function Nav() {
  const [openedBurger, setOpenedBurger] = useState(false);
  const navMobile = useRef(null);
  const navLinkList = [
    { to: '/news', text: 'news' },
    { to: '/shop', text: 'shop' },
    { to: '/collections', text: 'collections' },
    { to: '/auctions', text: 'auctions' },
  ];
  const { userData, changeUserData } = useContext(UserContext);
  const { cartProducts } = useContext(CartContext);

  gsap.registerPlugin();

  const showMobileOverlay = () => {
    if (openedBurger) {
      gsap.to(navMobile.current, {
        left: '100vw',
        ease: 'sine.inOut',
      });
      setOpenedBurger(false);
    } else {
      gsap.to(navMobile.current, {
        left: '0',
        ease: 'sine.inOut',
      });
      setOpenedBurger(true);
    }
  };

  const logoutHandler = async () => {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    await axios.get('/user/guest');
    changeUserData(null);
  };

  useEffect(() => {
    gsap.to(navMobile.current, {
      left: '100vw',
      ease: 'sine.inOut',
    });
    setOpenedBurger(false);
  }, []);

  return (
    <nav>
      <div className="relative mx-auto flex h-[64px] max-w-[1480px] flex-row items-center justify-between px-10 py-3">
        <div>
          <Link to="/" className="text-white">
            SmartHub
          </Link>
        </div>
        <div className="hidden md:flex">
          <ul className="flex flex-row items-center px-8 text-white">
            {navLinkList.map((navLink, id) => (
              <li key={id}>
                <Link
                  to={navLink.to}
                  className="px-4 py-2 text-base transition-[color] duration-200 ease-out hover:text-primary"
                >
                  {navLink.text[0].toLocaleUpperCase()}
                  {navLink.text.slice(1)}
                </Link>
              </li>
            ))}
          </ul>

          <Menu>
            {({ open }) => (
              <div className="relative inline-block text-left">
                <div>
                  <Menu.Button
                    className={`${
                      open ? 'bg-opacity-20' : 'bg-opacity-0'
                    } inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    {userData ? (
                      <SolidAccountImg height={7} width={7} />
                    ) : (
                      <OutlineAccountImg height={7} width={7} />
                    )}
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-[11px] w-28 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="p-1">
                      {!userData && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={{ pathname: '/account/login' }}
                                className={`${
                                  active
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition ease-out`}
                              >
                                Sign in
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to={{
                                  pathname: '/account/register',
                                }}
                                className={`${
                                  active
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition ease-out`}
                              >
                                Sign up
                              </Link>
                            )}
                          </Menu.Item>
                        </>
                      )}
                      {userData && (
                        <>
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/account/my"
                                className={`${
                                  active
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition ease-out`}
                              >
                                Account
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                type="button"
                                onClick={logoutHandler}
                                className={`${
                                  active
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-900'
                                } group flex w-full items-center rounded-md px-2 py-2 text-sm transition ease-out`}
                              >
                                Logout
                              </button>
                            )}
                          </Menu.Item>
                        </>
                      )}
                    </div>
                  </Menu.Items>
                </Transition>
              </div>
            )}
          </Menu>
          <Popover className="relative ml-1">
            {({ open }) => (
              <>
                <div>
                  <Popover.Button
                    className={`
                ${open ? 'bg-opacity-20' : 'bg-opacity-0 text-opacity-90'}
                group inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <CartIcon height={7} width={7} />
                    {cartProducts && cartProducts.length > 0 && (
                      <span className="absolute bottom-0 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pageBackground">
                        {cartProducts.length}
                      </span>
                    )}
                  </Popover.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-[10px] origin-top-right transform px-4 sm:px-0 lg:max-w-3xl">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <CartPopup />
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
        <div className="flex  md:hidden">
          <button
            type="button"
            className={`${
              openedBurger ? 'open' : ''
            } relative z-30 block h-10 w-10 cursor-pointer pl-2 md:hidden`}
            onClick={showMobileOverlay}
          >
            <span
              className={`${
                openedBurger
                  ? 'left-1/2 top-[18px] w-0'
                  : 'left-0 top-[5px] w-full'
              } absolute block h-1 rotate-0 rounded-lg bg-white opacity-100 transition-[top,left,width] duration-200 ease-in-out`}
            />
            <span
              className={`${
                openedBurger ? 'rotate-45' : 'rotate-0'
              } absolute left-0 top-[18px] block h-1 w-full rounded-lg bg-white opacity-100 transition-transform`}
            />
            <span
              className={`${
                openedBurger ? '-rotate-45' : 'rotate-0'
              } absolute left-0 top-[18px] block h-1 w-full rounded-lg bg-white opacity-100 transition-transform`}
            />
            <span
              className={`${
                openedBurger
                  ? 'left-1/2 top-[18px] w-0'
                  : 'left-0 top-[31px] w-full'
              } absolute block h-1 rotate-0 rounded-lg bg-white opacity-100 transition-[top,left,width] duration-200 ease-in-out`}
            />
          </button>
          <Popover className="ml-1 md:hidden">
            {({ open }) => (
              <>
                <div>
                  <Popover.Button
                    className={`
                ${open ? 'bg-opacity-20' : 'bg-opacity-0 text-opacity-90'}
                group relative inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <CartIcon height={7} width={7} />
                    {cartProducts && cartProducts.length > 0 && (
                      <span className="absolute bottom-0 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pageBackground">
                        {cartProducts.length}
                      </span>
                    )}
                  </Popover.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute right-0 z-10 mt-[10px] w-full origin-top-right transform pl-0 pr-4">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <CartPopup />
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </div>
      </div>
      <div
        ref={navMobile}
        className="mobile-overlay absolute left-[100vw] top-[0] z-10 h-screen w-full bg-pageBackground pt-16"
      >
        <ul className="flex flex-col text-white">
          {navLinkList.map((navLink, id) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={id}>
              <Link
                to={navLink.to}
                className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
              >
                {navLink.text[0].toLocaleUpperCase()}
                {navLink.text.slice(1)}
              </Link>
            </li>
          ))}
          <div
            className="mx-auto my-4 h-[1px] w-3/4 rounded-lg bg-white"
            aria-hidden="true"
          />
          <li className="w-full bg-pageBackground">
            {!userData ? (
              <div className="flex-col">
                <Link
                  to={{ pathname: '/account', search: 'auth=login' }}
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                >
                  Sign in
                </Link>
                <Link
                  to={{ pathname: '/account', search: 'auth=register' }}
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex-col">
                <Link
                  to="/account/my"
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                >
                  Account
                </Link>
                <button
                  type="button"
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
