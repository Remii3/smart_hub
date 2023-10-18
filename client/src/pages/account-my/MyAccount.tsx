import { ChangeEvent, useContext, useState } from 'react';
import {
  UserIcon,
  ArchiveBoxIcon,
  LockClosedIcon,
  Square2StackIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import MainContainer from '@layout/MainContainer';
import EditUserData from './tabs/EditUserData';
import MyShop from './tabs/my_products/MyShop';
import { UserContext } from '@context/UserProvider';
import MarketplaceBadge from '@components/UI/badges/MarketplaceBadge';
import avatarImg from '@assets/img/avataaars.svg';
import SecurityPermissions from './tabs/SecurityPermissions';
import OrderHistory from './tabs/OrderHistory';
import Admin from './tabs/admin/Admin';
import { UserRoleTypes } from '@customTypes/types';

import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import useUploadImg from '@hooks/useUploadImg';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import NewProduct from './NewProduct';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@components/UI/select';

import { useToast } from '@components/UI/use-toast';
import { UserCircleIcon } from '@heroicons/react/24/solid';

enum Test {
  'TEST' = 'Tesst',
}

type TabKeysTypes =
  | 'MY_DATA'
  | 'SECURITY_PERMISSIONS'
  | 'HISTORY'
  | 'MY_PRODUCTS'
  | 'ADMIN';

type TabNamesTypes =
  | 'my_data'
  | 'security_permissions'
  | 'history'
  | 'my_products'
  | 'admin';

const tabNames: Record<TabKeysTypes, TabNamesTypes> = {
  MY_DATA: 'my_data',
  SECURITY_PERMISSIONS: 'security_permissions',
  HISTORY: 'history',
  MY_PRODUCTS: 'my_products',
  ADMIN: 'admin',
};

const TABS_ARRAY: {
  text: string;
  name: TabNamesTypes;
  icon: JSX.Element;
}[] = [
  {
    text: 'My data',
    name: 'my_data',
    icon: <UserIcon height={20} width={20} />,
  },
  {
    text: 'Security & Permissions',
    name: 'security_permissions',
    icon: <LockClosedIcon height={20} width={20} />,
  },
  {
    text: 'History',
    name: 'history',
    icon: <ArchiveBoxIcon height={20} width={20} />,
  },
  {
    text: 'My products',
    name: 'my_products',
    icon: <Square2StackIcon height={20} width={20} />,
  },
  {
    text: 'Admin',
    name: 'admin',
    icon: <RocketLaunchIcon height={20} width={20} />,
  },
];

interface SelectedProfileImgTypes {
  data: null | File[];
  isLoading: boolean;
  error: null | string;
}

export default function MyAccount() {
  const [searchParams] = useSearchParams();
  const lastSearchQuery = searchParams.get('tab');
  const initialTab = (lastSearchQuery as TabNamesTypes) || TABS_ARRAY[0].name;

  const [selectedtab, setSelectedtab] = useState<TabNamesTypes>(initialTab);
  const [selecteProfiledImg, setSelectedProfileImg] =
    useState<SelectedProfileImgTypes>({
      isLoading: false,
      data: null,
      error: null,
    });

  const navigate = useNavigate();
  const path = useLocation();
  const { userData, fetchUserData } = useContext(UserContext);
  const { toast } = useToast();

  if (!userData) return navigate('/register');

  const changeSelectedTab = (option: TabNamesTypes) => {
    setSelectedtab(option);
    navigate(
      { pathname: path.pathname, search: `tab=${option}` },
      { replace: true }
    );
  };

  const uploadProfileImg = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files)
      return setSelectedProfileImg((prevState) => {
        return { ...prevState, error: 'No img was selected' };
      });

    setSelectedProfileImg((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const uploadData = await useUploadImg({
      selectedFile: e.target.files[0],
      ownerId: userData._id,
      targetLocation: 'Profile_img',
    });

    if (uploadData) {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_UPDATE,
        body: {
          userEmail: userData.email,
          fieldValue: uploadData,
          fieldKey: e.target.name,
        },
      });
      fetchUserData();
      setSelectedProfileImg({ data: null, error: null, isLoading: false });
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Failed adding profile img',
      });
      setSelectedProfileImg({
        data: null,
        error: 'Failed adding profile img',
        isLoading: false,
      });
    }
  };

  const subtitle =
    userData.role === UserRoleTypes.ADMIN ? (
      <span>Let&apos; put some things in order!</span>
    ) : userData.role === UserRoleTypes.AUTHOR ? (
      <p>Let&apos; add some new books! </p>
    ) : (
      <p>Let&apos;s see some books! 🎉</p>
    );

  return (
    <MainContainer>
      <header className="py-8 sm:pb-9 sm:pt-12">
        <div className="gap-2 sm:flex sm:items-end sm:justify-between md:items-center">
          <div className="flex flex-col items-center gap-4 sm:items-start md:flex-row">
            <button type="button" className="group relative ">
              <label
                className={`${
                  selecteProfiledImg.isLoading && 'opacity-100'
                } absolute flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-200/60 opacity-50 transition duration-150 ease-in-out group-hover:opacity-100`}
              >
                <input
                  type="file"
                  name="profile_img"
                  onChange={(e) => uploadProfileImg(e)}
                  className="hidden"
                  accept="image/png, image/jpg, image/jpeg"
                />
                {!selecteProfiledImg.isLoading && (
                  <PlusCircleIcon className="h-10 w-10 text-slate-800" />
                )}
                {selecteProfiledImg.isLoading && (
                  <div
                    className="absolute mx-auto block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-primary text-background"
                    role="status"
                    aria-label="loading"
                  >
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
              </label>
              {userData.user_info.profile_img.url ? (
                <img
                  className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white"
                  src={userData.user_info.profile_img.url}
                  alt="avatar_img"
                />
              ) : (
                <UserCircleIcon className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white" />
              )}
            </button>

            <div className="pt-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-foreground sm:text-5xl">
                Welcome Back, {userData.username}!
              </h1>

              <p className="mt-1.5 space-x-2 text-lg text-gray-500">
                {subtitle}
                {userData && userData.role !== 'User' && (
                  <MarketplaceBadge
                    message={userData.role}
                    color={
                      userData.role === 'Author'
                        ? 'text-purple-700'
                        : 'text-cyan-700'
                    }
                    bgColor={
                      userData.role === 'Author'
                        ? 'bg-purple-100'
                        : 'bg-cyan-100'
                    }
                  />
                )}
              </p>
            </div>
          </div>
          {userData.role !== UserRoleTypes.USER && <NewProduct />}
        </div>
      </header>
      <div className="pb-8 sm:pb-12">
        <div>
          <div className="px-2 sm:hidden ">
            <label htmlFor="tabMobile" className="sr-only">
              Tab
            </label>

            <Select
              name="tabMobile"
              onValueChange={(e) => changeSelectedTab(e as TabNamesTypes)}
              value={selectedtab}
            >
              <SelectTrigger>
                {TABS_ARRAY.find((tab) => tab.name === initialTab)?.text}
              </SelectTrigger>
              <SelectContent>
                {TABS_ARRAY.map((tab) => {
                  if (
                    tab.name === 'admin' &&
                    userData.role !== UserRoleTypes.ADMIN
                  )
                    return null;
                  if (
                    tab.name === 'my_products' &&
                    userData.role !== UserRoleTypes.ADMIN &&
                    userData.role !== UserRoleTypes.AUTHOR
                  )
                    return null;
                  return (
                    <SelectItem key={tab.name} value={tab.name}>
                      {tab.text}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex gap-6" aria-label="Tabs">
                <label htmlFor="tabDesktop" className="sr-only">
                  Tab
                </label>
                <ul id="tabDesktop">
                  {TABS_ARRAY.map((option) => {
                    if (
                      option.name === 'admin' &&
                      userData.role !== UserRoleTypes.ADMIN
                    ) {
                      return null;
                    }
                    if (
                      option.name === 'my_products' &&
                      userData.role !== UserRoleTypes.ADMIN &&
                      userData.role !== UserRoleTypes.AUTHOR
                    ) {
                      return null;
                    }

                    return (
                      <li
                        key={option.name}
                        value={option.name}
                        onClick={() => changeSelectedTab(option.name)}
                        className={`${
                          selectedtab === option.name
                            ? 'border-blue-400 text-blue-500'
                            : 'cursor-pointer border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                        } ease inline-flex shrink-0 items-center gap-2 border-b-2 px-3 pb-4 pt-3 text-sm font-medium transition duration-200 `}
                      >
                        {option.icon}
                        {option.text}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-8 w-full sm:px-2">
          {selectedtab === tabNames.MY_DATA && <EditUserData />}
          {selectedtab === tabNames.SECURITY_PERMISSIONS && (
            <SecurityPermissions />
          )}
          {selectedtab === tabNames.HISTORY && <OrderHistory />}
          {selectedtab === tabNames.MY_PRODUCTS && <MyShop />}
          {selectedtab === tabNames.ADMIN && <Admin />}
        </div>
      </div>
    </MainContainer>
  );
}
