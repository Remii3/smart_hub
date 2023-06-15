import { Fragment, useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const navLinkList = [
    { to: '/news', text: 'news' },
    { to: '/shop', text: 'shop' },
    { to: '/collections', text: 'collections' },
    { to: '/auctions', text: 'auctions' },
  ];
  const { userData, changeUserData } = useContext(UserContext);
  const { cartState } = useContext(CartContext);

  gsap.registerPlugin();

  const showMobileOverlay = () => {
    setOpenedBurger((prevState) => !prevState);
  };

  const logoutHandler = () => {
    let timeoutTimer = 0;
    if (openedBurger) {
      timeoutTimer = 500;
      setOpenedBurger(false);
      navigate('/');
    }
    setTimeout(async () => {
      document.cookie =
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      await axios.get('/user/guest');
      changeUserData(null);
      navigate('/');
    }, timeoutTimer);
  };

  return (
    <nav>
      <div className="relative mx-auto flex h-[64px] max-w-[1480px] flex-row items-center justify-between px-4 py-3 sm:px-10">
        <div className="z-30">
          <Link
            to="/"
            className=" text-white"
            onClick={() => setOpenedBurger(false)}
          >
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
                    {userData ? <SolidAccountImg /> : <OutlineAccountImg />}
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
                    {cartState &&
                      cartState.cart &&
                      cartState.cart.products.length > 0 && (
                        <span className="absolute bottom-0 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pageBackground">
                          {cartState.cart.products.length}
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
        <div className="flex md:hidden">
          <Popover className="z-30 mx-1 md:hidden">
            {({ open }) => (
              <>
                <div>
                  <Popover.Button
                    className={`
                ${open ? 'bg-opacity-20' : 'bg-opacity-0 text-opacity-90'}
                group relative inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <CartIcon height={7} width={7} />
                    {cartState &&
                      cartState.cart &&
                      cartState.cart.products.length > 0 && (
                        <span className="absolute bottom-0 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pageBackground">
                          {cartState.cart.products.length}
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
                  <Popover.Panel className="absolute right-0 z-10 mt-[10px] w-full origin-top-right transform pl-0">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <CartPopup />
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          <button
            type="button"
            className={`${
              openedBurger ? 'open bg-opacity-20' : 'bg-opacity-0'
            } relative z-30 min-w-[44px] rounded-md bg-black   text-white transition-all ease-in-out hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            onClick={showMobileOverlay}
          >
            <span
              className={`${
                openedBurger ? 'translate-y-1 rotate-45' : '-translate-y-1.5'
              } absolute left-1/2 
               top-[40%] block h-1 w-7 origin-center -translate-x-1/2 transform rounded-lg bg-white transition duration-200 ease-in-out`}
            />
            <span
              className={`${
                openedBurger ? 'left-1/3 opacity-0' : 'left-1/2 opacity-100'
              } absolute block h-1 w-5 -translate-x-1/2 transform rounded-lg bg-white transition-[left,opacity] duration-200 ease-in-out`}
            />
            <span
              className={`${
                openedBurger ? '-translate-y-1 -rotate-45' : 'translate-y-1.5'
              } absolute left-1/2 top-[60%] 
              block h-1 w-7 origin-center -translate-x-1/2 transform rounded-lg bg-white transition duration-200 ease-in-out`}
            />
          </button>
        </div>
      </div>
      <div
        ref={navMobile}
        className={`${
          openedBurger ? 'left-0 opacity-100' : 'left-[100vw] opacity-0'
        } mobile-overlay absolute top-[0] z-10 h-screen w-full transform bg-pageBackground pt-16 transition-[left,opacity] duration-500 ease-in-out`}
      >
        <ul className="flex flex-col text-white">
          {navLinkList.map((navLink, id) => (
            // eslint-disable-next-line react/no-array-index-key
            <li key={id}>
              <Link
                to={navLink.to}
                className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                onClick={showMobileOverlay}
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
                  to={{ pathname: '/account/login' }}
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                  onClick={showMobileOverlay}
                >
                  Sign in
                </Link>
                <Link
                  to={{ pathname: '/account/register' }}
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                  onClick={showMobileOverlay}
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex-col">
                <Link
                  to="/account/my"
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                  onClick={showMobileOverlay}
                >
                  Account
                </Link>
                <button
                  type="button"
                  className="block w-full py-3 text-center text-lg transition-[color] duration-200 ease-out hover:text-primaryText"
                  onClick={() => {
                    logoutHandler();
                  }}
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
