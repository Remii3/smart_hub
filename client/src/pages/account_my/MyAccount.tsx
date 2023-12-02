import { useContext, useState } from 'react';
import {
  UserIcon,
  ArchiveBoxIcon,
  LockClosedIcon,
  Square2StackIcon,
  RocketLaunchIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import EditUserData from './tabs/EditUserData';
import { UserContext } from '@context/UserProvider';
import SecurityPermissions from './tabs/SecurityPermissions';
import OrderHistory from './tabs/OrderHistory';
import Admin from './tabs/admin/Admin';
import { UserRoleTypes } from '@customTypes/types';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import NewProduct from './newProduct/NewProduct';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@components/UI/select';

import { useToast } from '@components/UI/use-toast';
import Follows from './tabs/Follows';
import MyCollections from './tabs/myCollections/MyCollections';
import { Badge } from '@components/UI/badge';
import MyProducts from './tabs/myProducts/MyProducts';

type TabKeysTypes =
  | 'MY_DATA'
  | 'SECURITY_PERMISSIONS'
  | 'HISTORY'
  | 'MY_PRODUCTS'
  | 'MY_COLLECTIONS'
  | 'ADMIN'
  | 'FOLLOWING';

type TabNamesTypes =
  | 'my_data'
  | 'security_permissions'
  | 'history'
  | 'my_products'
  | 'my_collections'
  | 'admin'
  | 'following';

const tabNames: Record<TabKeysTypes, TabNamesTypes> = {
  MY_DATA: 'my_data',
  SECURITY_PERMISSIONS: 'security_permissions',
  HISTORY: 'history',
  MY_PRODUCTS: 'my_products',
  MY_COLLECTIONS: 'my_collections',
  ADMIN: 'admin',
  FOLLOWING: 'following',
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
    text: 'My collections',
    name: 'my_collections',
    icon: <Square2StackIcon height={20} width={20} />,
  },
  {
    text: 'Admin',
    name: 'admin',
    icon: <RocketLaunchIcon height={20} width={20} />,
  },
  {
    text: 'Following',
    name: 'following',
    icon: <StarIcon height={20} width={20} />,
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

  const navigate = useNavigate();
  const path = useLocation();
  const { userData, fetchUserData } = useContext(UserContext);
  const { toast } = useToast();
  const changeSelectedTab = (option: TabNamesTypes) => {
    setSelectedtab(option);
    navigate(
      { pathname: path.pathname, search: `tab=${option}` },
      { replace: true }
    );
  };

  if (!userData.data || userData.isLoading) return <></>;

  const subtitle =
    userData.data.role === UserRoleTypes.ADMIN ? (
      <span>Let&apos; put some things in order!</span>
    ) : userData.data.role === UserRoleTypes.AUTHOR ? (
      <div>Let&apos; add some new books! </div>
    ) : (
      <div>Let&apos;s see some books! 🎉</div>
    );

  return (
    <>
      <header className="py-8 sm:pb-9 sm:pt-12">
        <div className="gap-2 sm:flex sm:items-end sm:justify-between md:items-center">
          <div className="flex flex-col items-center gap-4 sm:items-start md:flex-row">
            {userData.data.userInfo.profileImg.url ? (
              <img
                className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white"
                src={userData.data.userInfo.profileImg.url}
                alt="avatar_img"
              />
            ) : (
              <img
                src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white"
                alt="profile_img"
              />
            )}

            <div className="pt-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-foreground sm:text-5xl">
                Welcome Back, {userData.data.username}!
              </h1>

              <div className="mt-1.5 space-x-2 text-lg text-gray-500">
                {subtitle}
                {userData.data && userData.data.role !== 'User' && (
                  <Badge
                    variant={'outline'}
                    className={`${
                      userData.data.role === UserRoleTypes.AUTHOR &&
                      'bg-purple-100 text-purple-700'
                    } ${
                      userData.data.role === UserRoleTypes.ADMIN &&
                      'bg-cyan-100 text-cyan-700'
                    }`}
                  >
                    {userData.data.role}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {userData.data.role !== UserRoleTypes.USER && (
            <div className="space-y-1">
              <NewProduct />
            </div>
          )}
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
                    userData.data &&
                    userData.data.role !== UserRoleTypes.ADMIN
                  )
                    return null;
                  if (
                    tab.name === 'my_products' &&
                    userData.data &&
                    userData.data.role !== UserRoleTypes.ADMIN &&
                    userData.data &&
                    userData.data.role !== UserRoleTypes.AUTHOR
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
                      userData.data &&
                      userData.data.role !== UserRoleTypes.ADMIN
                    ) {
                      return null;
                    }
                    if (
                      option.name === 'my_products' &&
                      userData.data &&
                      userData.data.role !== UserRoleTypes.ADMIN &&
                      userData.data &&
                      userData.data.role !== UserRoleTypes.AUTHOR
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
          {selectedtab === tabNames.MY_PRODUCTS && <MyProducts />}
          {selectedtab === tabNames.MY_COLLECTIONS && <MyCollections />}
          {selectedtab === tabNames.ADMIN && <Admin />}
          {selectedtab === tabNames.FOLLOWING && <Follows />}
        </div>
      </div>
    </>
  );
}
