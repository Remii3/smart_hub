import React, { Suspense, lazy, useContext, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PopoverClose } from '@radix-ui/react-popover';
import { UserContext } from '@context/UserProvider';
import CartPopup from '@pages/cart/CartPopup';
import { CartContext } from '@context/CartProvider';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@components/UI/popover';
import { useGetAccessDatabase } from '../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../data/endpoints';
import { Separator } from '@components/UI/separator';
import { Button } from '@components/UI/button';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Input } from '@components/UI/input';

const ShoppingBagIcon = lazy(
  () => import('@heroicons/react/24/outline/ShoppingBagIcon')
);
const OutlinedUserIcon = lazy(
  () => import('@heroicons/react/24/outline/UserCircleIcon')
);
const MagnifyingGlassIcon = lazy(
  () => import('@heroicons/react/24/solid/MagnifyingGlassIcon')
);
const SolidUserIcon = lazy(
  () => import('@heroicons/react/24/solid/UserCircleIcon')
);
const HomeLogoIcon = lazy(() =>
  import('@assets/icons/Icons').then((module) => ({
    default: module.HomeLogoIcon,
  }))
);

export default function Nav({ scrollFlag }: { scrollFlag: boolean }) {
  const [openedBurger, setOpenedBurger] = useState(false);
  const [searchbarValue, setSearchbarValue] = useState('');
  const location = useLocation();

  const navMobile = useRef(null);

  const navigate = useNavigate();
  const navLinkList = [
    { to: '/news', text: 'news' },
    { to: '/shop', text: 'shop' },
    { to: '/collection', text: 'collections' },
  ];
  const { userData, changeUserData } = useContext(UserContext);
  const { cartState } = useContext(CartContext);

  const showMobileOverlay = () => {
    if (
      !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      document.querySelector('body')?.classList.toggle('mr-[17px]');
    }
    document.querySelector('body')?.classList.toggle('overflow-hidden');
    setOpenedBurger((prevState) => !prevState);
  };

  const hideMobileOverlay = () => {
    document.querySelector('body')?.classList.remove('overflow-hidden');
    document.querySelector('body')?.classList.remove('mr-[17px]');
    setOpenedBurger(false);
  };

  const logoutHandler = () => {
    let timeoutTimer = 0;
    if (openedBurger) {
      timeoutTimer = 500;
      showMobileOverlay();
      navigate('/');
    }
    setTimeout(async () => {
      document.cookie =
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      await useGetAccessDatabase({ url: DATABASE_ENDPOINTS.USER_GUEST });
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
  const totalProductQuantity =
    cartState.products &&
    cartState.products.reduce((acc, item) => acc + item.inCartQuantity, 0);

  const burgerColor = openedBurger
    ? 'bg-foreground'
    : scrollFlag
      ? 'bg-background'
      : 'bg-foreground';
  return (
    <nav>
      <div className="relative mx-auto flex h-[64px] max-w-[1480px] flex-row items-center justify-between px-4 py-3 sm:px-10">
        <div className="z-30 flex items-center">
          <Link
            to="/"
            className="relative block h-8 w-8 text-blue-600"
            onClick={() => hideMobileOverlay()}
          >
            <span className="sr-only">Home</span>
            <Suspense fallback={<LoadingCircle />}>
              <HomeLogoIcon className="h-8 w-8" />
            </Suspense>
          </Link>
          <ul className={`hidden flex-row items-center px-8 lg:flex`}>
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
        <form
          onSubmit={(e) => searchHandler(e)}
          className="relative mx-auto me-4 hidden w-full basis-full items-center justify-end text-gray-600 lg:flex"
        >
          <Input
            className="h-full max-w-[24rem] rounded-lg bg-background py-2 pl-3 pr-12 text-sm transition-[width] duration-200 ease-in-out focus-visible:w-full sm:w-56"
            type="text"
            name="search"
            placeholder="Search"
            value={searchbarValue}
            onChange={(e) => searchbarValueChangeHandler(e)}
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 h-full w-auto min-w-[40px] -translate-y-1/2 transform rounded-e-xl border-0 bg-transparent px-2 text-gray-600 transition"
          >
            <span className="sr-only">Search</span>
            <Suspense fallback={<LoadingCircle />}>
              <MagnifyingGlassIcon className="h-6 w-6 fill-current font-bold text-gray-600" />
            </Suspense>
          </button>
        </form>
        <div className="flex max-h-[32px] gap-4">
          <div className="block lg:hidden">
            <Popover>
              <PopoverTrigger
                aria-label="Search trigger"
                className="relative h-8 w-8"
              >
                <Suspense fallback={<LoadingCircle />}>
                  <MagnifyingGlassIcon className={`h-8 w-8`} />
                </Suspense>
              </PopoverTrigger>
              <PopoverContent className="mt-3 block w-screen rounded-t-none bg-background lg:hidden">
                <form
                  onSubmit={(e) => searchHandler(e)}
                  className="relative mx-auto w-full max-w-xl text-gray-600"
                >
                  <Input
                    className="h-full w-full rounded-lg border-2 border-gray-300 bg-background px-3 py-2 pr-16 text-sm focus:outline-none"
                    type="text"
                    name="search"
                    placeholder="Search"
                    value={searchbarValue}
                    onChange={(e) => searchbarValueChangeHandler(e)}
                  />
                  <PopoverClose
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 rounded-e-lg border-b-2 border-r-2 border-t-2 border-transparent bg-transparent px-2 text-gray-600 transition"
                  >
                    <span className="sr-only">Search</span>
                    <Suspense fallback={<LoadingCircle />}>
                      <MagnifyingGlassIcon className="h-4 w-4 fill-current font-bold text-gray-600" />
                    </Suspense>
                  </PopoverClose>
                </form>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger
                className="relative h-8 w-8"
                aria-label="Shopping cart"
              >
                <Suspense fallback={<LoadingCircle />}>
                  <ShoppingBagIcon className={`h-8 w-8`} />
                  {cartState && cartState.products.length > 0 && (
                    <span
                      aria-hidden="true"
                      className={`${
                        scrollFlag
                          ? 'bg-foreground/90 text-background'
                          : 'bg-background/90 text-foreground'
                      } absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full`}
                    >
                      {totalProductQuantity}
                    </span>
                  )}
                </Suspense>
              </PopoverTrigger>
              <PopoverContent
                className={`${
                  !scrollFlag && 'rounded-t-none'
                } relative mt-3 w-screen max-w-full bg-background px-6 py-8 sm:px-6 md:max-w-lg lg:px-6 `}
              >
                <CartPopup />
              </PopoverContent>
            </Popover>
            <div className="hidden items-center lg:flex">
              <Popover>
                <PopoverTrigger
                  aria-label="Profile dropdown"
                  className="relative h-8 w-8"
                >
                  <Suspense fallback={<LoadingCircle />}>
                    {userData.data ? (
                      userData.data.userInfo.profileImg.url ? (
                        <img
                          src={userData.data.userInfo.profileImg.url}
                          height={32}
                          width={32}
                          className="h-8 w-8 rounded-full aspect-square object-cover"
                          alt="profile_img"
                        />
                      ) : (
                        <SolidUserIcon className={`h-8 w-8`} />
                      )
                    ) : (
                      <OutlinedUserIcon className={`h-8 w-8`} />
                    )}
                  </Suspense>
                </PopoverTrigger>
                <PopoverContent
                  className={`${
                    !scrollFlag && 'rounded-t-none'
                  } mt-3 w-auto bg-background p-0`}
                >
                  <ul>
                    {!userData.data && (
                      <>
                        <li>
                          <PopoverClose asChild>
                            <Link
                              to={{ pathname: '/account/login' }}
                              className={`${
                                !scrollFlag && 'rounded-t-none'
                              } flex w-full items-center justify-center px-5 pb-2 pt-3 text-sm transition-colors duration-200 ease-out hover:bg-slate-400/25 hover:text-primary`}
                            >
                              Sign in
                            </Link>
                          </PopoverClose>
                        </li>
                        <li>
                          <PopoverClose asChild>
                            <Link
                              to={{
                                pathname: '/account/register',
                              }}
                              className="flex w-full items-center justify-center rounded-b-md px-5 pb-3 pt-2 text-sm transition-colors duration-200 ease-out hover:bg-slate-400/25 hover:text-primary"
                            >
                              Sign up
                            </Link>
                          </PopoverClose>
                        </li>
                      </>
                    )}
                    {userData.data && (
                      <>
                        <li>
                          <PopoverClose asChild>
                            <Link
                              to="/account/my"
                              className={`${
                                !scrollFlag && 'rounded-t-none'
                              } flex w-full items-center justify-center px-5 pb-2 pt-3 text-sm transition-colors duration-200 ease-out hover:bg-slate-400/25 hover:text-primary`}
                            >
                              Account
                            </Link>
                          </PopoverClose>
                        </li>
                        <li>
                          <PopoverClose asChild>
                            <button
                              type="button"
                              onClick={logoutHandler}
                              className="flex w-full items-center justify-center rounded-b-md px-5 pb-3 pt-2 text-sm text-red-500 transition-colors duration-200 ease-out hover:bg-red-400/25 "
                            >
                              Logout
                            </button>
                          </PopoverClose>
                        </li>
                      </>
                    )}
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center justify-center lg:hidden">
            <div
              className={`${
                openedBurger && 'tham-active'
              } tham-e-squeeze tham tham-w-8 relative z-30 duration-300 ease-in-out hover:bg-opacity-30 `}
              onClick={showMobileOverlay}
            >
              <div className="tham-box">
                <div
                  className={`${burgerColor} tham-inner transition-colors duration-200 ease-in-out`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={navMobile}
        className={`${
          openedBurger ? 'left-0 opacity-100' : 'left-[100vw] opacity-0'
        } absolute top-[0] z-10 h-screen w-full transform overflow-auto bg-background pt-16 transition-[left,opacity] duration-500 ease-in-out lg:hidden`}
      >
        <ul className="flex flex-col text-foreground">
          {navLinkList.map((navLink, id) => (
            <li key={id}>
              <Link
                to={navLink.to}
                className="hover:text-primaryText mx-auto block w-1/3 py-3 text-center text-lg transition-[color] duration-200 ease-out"
                onClick={showMobileOverlay}
              >
                {navLink.text[0].toLocaleUpperCase()}
                {navLink.text.slice(1)}
              </Link>
            </li>
          ))}
          <li>
            <Separator className="mx-auto my-4 w-3/4 bg-slate-300" />
          </li>
          <li>
            {!userData.data ? (
              <div className="flex-col">
                <Link
                  to={{ pathname: '/account/login' }}
                  className="hover:text-primaryText mx-auto block w-1/3 py-3 text-center text-lg transition-[color] duration-200 ease-out"
                  onClick={showMobileOverlay}
                >
                  Sign in
                </Link>
                <Link
                  to={{ pathname: '/account/register' }}
                  className="hover:text-primaryText mx-auto block w-1/3 py-3 text-center text-lg transition-[color] duration-200 ease-out"
                  onClick={showMobileOverlay}
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex-col">
                <Link
                  to="/account/my"
                  className="hover:text-primaryText mx-auto block w-1/3 py-3 text-center text-lg transition-[color] duration-200 ease-out"
                  onClick={showMobileOverlay}
                >
                  Profile
                </Link>

                <Button
                  type="submit"
                  variant={'link'}
                  className="mx-auto block w-1/3 py-3 text-center text-lg text-red-600 transition-[filter] duration-200 ease-out hover:brightness-90"
                  onClick={logoutHandler}
                >
                  Logout
                </Button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
