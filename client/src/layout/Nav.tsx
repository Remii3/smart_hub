import React, { Fragment, useContext, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import axios from 'axios';
import { Menu, Popover, Transition } from '@headlessui/react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { UserContext } from '../context/UserProvider';
import { CartIcon, OutlineAccountImg } from '../assets/icons/Icons';
import CartPopup from '../components/cart/CartPopup';
import { CartContext } from '../context/CartProvider';

export default function Nav() {
  const [openedBurger, setOpenedBurger] = useState(false);
  const [searchbarValue, setSearchbarValue] = useState('');
  const location = useLocation();

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

  const searchHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchbarValue === '') {
      navigate({
        pathname: '/search',
      });
    } else {
      const existingSearch = new URLSearchParams(location.search);
      let finalQuery = `phrase=${searchbarValue}`;
      for (const [key, value] of existingSearch.entries()) {
        if (key !== 'phrase') {
          finalQuery += `&${key}=${value}`;
        }
      }
      navigate({
        pathname: '/search',
        search: finalQuery,
      });
      setSearchbarValue('');
    }
  };
  const searchbarValueChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchbarValue(e.target.value);
  };

  return (
    <nav>
      <div className="relative mx-auto flex h-[64px] max-w-[1480px] flex-row items-center justify-between px-4 py-3 sm:px-10">
        <div className="z-30 flex items-end">
          <Link
            to="/"
            className=" block text-blue-600"
            onClick={() => setOpenedBurger(false)}
          >
            <span className="sr-only">Home</span>
            <svg
              className="h-8"
              viewBox="0 0 28 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                fill="currentColor"
              />
            </svg>
          </Link>
          <ul className="hidden flex-row items-center px-8 text-white lg:flex">
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
        </div>
        <div className="hidden items-center lg:flex">
          <form
            onSubmit={(e) => searchHandler(e)}
            className="relative mx-auto  text-gray-600 "
          >
            <input
              className="h-full rounded-full border-none bg-white pe-10 ps-4 text-sm shadow-sm focus:outline-none sm:w-56"
              type="search"
              name="search"
              placeholder="Search"
              value={searchbarValue}
              onChange={(e) => searchbarValueChangeHandler(e)}
            />
            <button
              type="submit"
              className="absolute end-1 top-1/2 -translate-y-1/2 rounded-full bg-gray-50 px-2 text-gray-600 transition hover:text-gray-700"
            >
              <span className="sr-only">Search</span>
              <svg
                className="h-4 w-4 fill-current text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                id="Capa_1"
                x="0px"
                y="0px"
                viewBox="0 0 56.966 56.966"
                xmlSpace="preserve"
                width="512px"
                height="512px"
              >
                <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
              </svg>
            </button>
          </form>
          <Popover className="relative">
            {({ open }) => (
              <>
                <div>
                  <Popover.Button
                    className={`
                ${open ? 'bg-opacity-20' : 'bg-opacity-0 text-opacity-90'}
                group inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <ShoppingBagIcon height={30} width={30} />
                    {cartState && cartState.products.length > 0 && (
                      <span className="absolute bottom-0 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pageBackground">
                        {cartState.products.length}
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
          <Menu>
            {({ open }) => (
              <div className="relative ml-1 inline-block text-left">
                <div>
                  <Menu.Button
                    className={`${
                      open ? 'bg-opacity-20' : 'bg-opacity-0'
                    } inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    {userData ? (
                      <UserCircleIcon className="" height={30} width={30} />
                    ) : (
                      <OutlineAccountImg />
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
        </div>

        <div className="flex lg:hidden">
          <Popover className="z-30 mx-1">
            {({ open }) => (
              <>
                <div>
                  <Popover.Button
                    className={`
                ${open ? 'bg-opacity-20' : 'bg-opacity-0 text-opacity-90'}
                group relative inline-flex w-full justify-center rounded-md bg-black px-2 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <MagnifyingGlassIcon width={30} height={30} />
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
                  <Popover.Panel className="absolute right-0 z-10 mt-[10px] w-full origin-top-right transform  pl-0">
                    <div className="overflow-hidden rounded-lg px-4 shadow-lg ring-1 ring-black ring-opacity-5 sm:px-10">
                      <form
                        onSubmit={(e) => searchHandler(e)}
                        className="relative mx-auto  text-gray-600 "
                      >
                        <input
                          className="h-full w-full rounded-lg border-2 border-gray-300 bg-white px-5 pr-16 text-sm focus:outline-none"
                          type="search"
                          name="search"
                          placeholder="Search"
                          value={searchbarValue}
                          onChange={(e) => searchbarValueChangeHandler(e)}
                        />
                        <Popover.Button
                          type="submit"
                          className="absolute right-0 top-0 mr-3 mt-3"
                        >
                          <svg
                            className="h-4 w-4 fill-current text-gray-600"
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 56.966 56.966"
                            xmlSpace="preserve"
                            width="512px"
                            height="512px"
                          >
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                          </svg>
                        </Popover.Button>
                      </form>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
          <Popover className="z-30 mx-1">
            {({ open }) => (
              <>
                <div>
                  <Popover.Button
                    className={`
                ${open ? 'bg-opacity-20' : 'bg-opacity-0 text-opacity-90'}
                group relative inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
                  >
                    <CartIcon height={7} width={7} />
                    {cartState && cartState.products.length > 0 && (
                      <span className="absolute bottom-0 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-pageBackground">
                        {cartState.products.length}
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
        } mobile-overlay absolute top-[0] z-10 h-screen w-full transform bg-pageBackground pt-16 transition-[left,opacity] duration-500 ease-in-out lg:hidden`}
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
                {/* <Link
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
                </button> */}
                <li>
                  <strong className="block text-xs font-medium uppercase text-gray-400">
                    Profile
                  </strong>

                  <ul className="mt-2 space-y-1">
                    <li>
                      <a
                        href=""
                        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        Details
                      </a>
                    </li>

                    <li>
                      <a
                        href=""
                        className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      >
                        Subscription
                      </a>
                    </li>

                    <li>
                      <form action="/logout">
                        <button
                          type="submit"
                          className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 [text-align:_inherit] hover:bg-gray-100 hover:text-gray-700"
                        >
                          Logout
                        </button>
                      </form>
                    </li>
                  </ul>
                </li>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
