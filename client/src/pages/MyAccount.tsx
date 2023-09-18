import { useCallback, useContext, useEffect, useState } from 'react';
import {
  UserIcon,
  ArchiveBoxIcon,
  LockClosedIcon,
  Square2StackIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';
import AsyncCreatableSelect from 'react-select/async-creatable';
import MainContainer from '@layout/MainContainer';
import EditUserData from '@features/myAccount/EditUserData';
import MyShop from '@features/myAccount/MyShop';
import { UserContext } from '@context/UserProvider';
import MarketplaceBadge from '@components/UI/badges/MarketplaceBadge';
import avatarImg from '@assets/img/avataaars.svg';
import { Button } from '@components/UI/button';
import SecurityPermissions from '@features/myAccount/SecurityPermissions';
import OrderHistory from '@features/myAccount/OrderHistory';
import Admin from '@features/myAccount/Admin';
import { MarketPlaceTypes, UserRoleTypes } from '@customTypes/types';
import { Input } from '@components/UI/input';
import { DatePickerDemo } from '@components/UI/datePicker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/UI/dialog';
import { RadioGroup, RadioGroupItem } from '@components/UI/radio-group';
import { Label } from '@components/UI/label';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../data/endpoints';
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

const tabNames = {
  MY_DATA: 'myData',
  SECURITY_PERMISSIONS: 'securityPermissions',
  HISTORY: 'history',
  MY_PRODUCTS: 'myProducts',
  ADMIN: 'admin',
};

type ProductDataTypes = {
  title: { value: string; hasError: boolean };
  authors: { value: string[]; hasError: boolean };
  categories: { value: string[]; hasError: boolean };
  otherCategory: { value: string; hasError: boolean };
  description: { value: string; hasError: boolean };
  imgs: { value: string[]; hasError: boolean };
  quantity: { value: number; hasError: boolean };
  price: { value: number; hasError: boolean };
  marketPlace: { value: string; hasError: boolean };
  startingPrice: { value: number; hasError: boolean };
};

const initialProductData = {
  title: { value: '', hasError: false },
  authors: { value: [], hasError: false },
  categories: { value: [], hasError: false },
  otherCategory: { value: '', hasError: false },
  description: { value: '', hasError: false },
  imgs: { value: [], hasError: false },
  quantity: { value: 1, hasError: false },
  price: { value: 1, hasError: false },
  marketPlace: { value: MarketPlaceTypes.SHOP, hasError: false },
  startingPrice: { value: 1, hasError: false },
};

const TABS_ARRAY = [
  {
    text: 'My data',
    name: tabNames.MY_DATA,
    icon: <UserIcon height={20} width={20} />,
  },
  {
    text: 'Security & Permissions',
    name: tabNames.SECURITY_PERMISSIONS,
    icon: <LockClosedIcon height={20} width={20} />,
  },
  {
    text: 'History',
    name: tabNames.HISTORY,
    icon: <ArchiveBoxIcon height={20} width={20} />,
  },
  {
    text: 'My products',
    name: tabNames.MY_PRODUCTS,
    icon: <Square2StackIcon height={20} width={20} />,
  },
  {
    text: 'Admin',
    name: tabNames.ADMIN,
  },
];

export default function MyAccount() {
  const { userData, fetchUserData } = useContext(UserContext);
  const [finishAuctionDate, setFinishAuctionDate] = useState<Date>();
  const [searchParams] = useSearchParams();
  const lastSearchQuery = searchParams.get('tab');
  const [selectedtab, setSelectedtab] = useState(
    lastSearchQuery || TABS_ARRAY[0].name
  );

  const [productData, setProductData] =
    useState<ProductDataTypes>(initialProductData);

  const [categoryState, setCategoryState] = useState<{
    isLoading: boolean;
    options: any;
    value: [];
  }>({
    isLoading: false,
    options: [],
    value: [],
  });

  const [status, setStatus] = useState({
    isLoading: false,
    hasFailed: false,
    isSuccess: false,
  });
  const [authorState, setAuthorState] = useState<{
    isLoading: boolean;
    options: any;
    value: [];
  }>({
    isLoading: false,
    options: [],
    value: [],
  });
  const navigate = useNavigate();
  const path = useLocation();

  const changeSelectedTab = (option: string) => {
    setSelectedtab(option);
    navigate(
      { pathname: path.pathname, search: `tab=${option}` },
      { replace: true }
    );
  };

  const resetProductData = () => {
    setTimeout(() => {
      setProductData(initialProductData);
      setCategoryState((prevState) => {
        return { ...prevState, value: [] };
      });
      setAuthorState((prevState) => {
        return { ...prevState, value: [] };
      });
    }, 200);
  };

  const productDataChangeHandler = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    > | null,
    radioValue?: string
  ) => {
    if (e === null) {
      if (radioValue) {
        setProductData((prevState) => {
          return {
            ...prevState,
            marketPlace: { value: radioValue, hasError: false },
          };
        });
      }
    } else if (e.target.name === 'imgs') {
      setProductData((prevState) => {
        return {
          ...prevState,
          imgs: {
            value: [...prevState.imgs.value, e.target.value],
            hasError: false,
          },
        };
      });
    } else if (e.target.name === 'authors') {
      setProductData((prevState) => {
        return {
          ...prevState,
          authors: {
            value: [...prevState.imgs.value, e.target.value],
            hasError: false,
          },
        };
      });
    } else {
      setProductData((prevState) => {
        return {
          ...prevState,
          [e.target.name]: { value: e.target.value, hasError: false },
        };
      });
    }
  };

  const fetchAllCategories = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.CATEGORY_ALL,
    });
    setCategoryState((prevState) => {
      return { ...prevState, options: [...data] };
    });
  }, []);

  const fetchAllAuthors = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_AUTHORS,
    });
    setAuthorState((prevState) => {
      return { ...prevState, options: [...data] };
    });
  }, []);

  const getAllData = useCallback(async () => {
    fetchAllAuthors();
    fetchAllCategories();
  }, [fetchAllAuthors, fetchAllCategories]);

  const addProductHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProductData = {
      seller_data: {
        _id: userData?._id,
        pseudonim: userData?.author_info.pseudonim,
      },
      title: productData.title.value,
      description: productData.description.value,
      price: Number(productData.price.value),
      img: productData.imgs.value,
      categories: categoryState.value,
      authors: authorState.value,
      quantity: productData.quantity.value,
      market_place: productData.marketPlace.value,
      auction_end_date: finishAuctionDate,
      starting_price: Number(productData.startingPrice.value),
    };

    try {
      setStatus((prevState) => {
        return { ...prevState, isLoading: true };
      });

      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.PRODUCT_ONE,
        body: { newProductData },
      });
      setStatus((prevState) => {
        return { ...prevState, isLoading: false };
      });
      fetchUserData();
      resetProductData();

      setStatus((prevState) => {
        return { ...prevState, isSuccess: true };
      });
      getAllData();
    } catch (err) {
      setStatus((prevState) => {
        return { ...prevState, isLoading: false, hasFailed: true };
      });
    }
  };

  const filterCategories = (inputValue: string) => {
    return categoryState.options.filter((i: { label: string }) => {
      return i.label.toLowerCase().includes(inputValue.toLowerCase());
    });
  };
  const filterAuthors = (inputValue: string) => {
    return authorState.options.filter((i: { label: string }) => {
      return i.label.toLowerCase().includes(inputValue.toLowerCase());
    });
  };
  const categoryOptions = (inputValue: string) =>
    new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(filterCategories(inputValue));
      }, 1000);
    });

  const authorOptions = (inputValue: string) =>
    new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(filterAuthors(inputValue));
      }, 1000);
    });

  const selectCategoryChange = (selectedOptions: any) => {
    setCategoryState((prevState) => {
      return { ...prevState, value: selectedOptions };
    });
  };

  const selectAuthorChange = (selectedOptions: any) => {
    setAuthorState((prevState) => {
      return { ...prevState, value: selectedOptions };
    });
  };

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  return (
    <div className="relative mb-16 min-h-screen">
      <div>
        <MainContainer>
          <header>
            <div className="mx-auto py-8 sm:py-12">
              <div className="gap-2 sm:flex sm:items-center sm:justify-between">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <img
                    className="inline-block h-24 w-24 rounded-full ring-2 ring-white"
                    src={avatarImg}
                    alt="avatar_img"
                  />
                  <div className="pt-1 text-left">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-5xl">
                      Welcome Back, {userData?.username}!
                    </h1>

                    <p className="mt-1.5 text-lg text-gray-500">
                      Let&apos;s see some books! 🎉{' '}
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

                {userData?.role !== UserRoleTypes.USER && (
                  <div className="mt-4 flex flex-col sm:mt-0 sm:flex-row sm:items-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default">Add new book</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <form
                          onSubmit={(e) => addProductHandler(e)}
                          className="w-full"
                        >
                          <DialogHeader>
                            <DialogTitle>Add product</DialogTitle>
                            <DialogDescription>
                              Fill in your product data. Click the
                              &apos;add&apos; button when you&apos;re done.
                            </DialogDescription>
                          </DialogHeader>
                          <fieldset className="mb-2 space-y-1">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Title
                            </label>

                            <input
                              name="title"
                              id="title"
                              type="text"
                              placeholder="Harry Potter..."
                              className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                              value={productData.title.value}
                              onChange={(e) => productDataChangeHandler(e)}
                            />
                          </fieldset>

                          <fieldset className="mb-2 space-y-1">
                            <p className="block text-sm font-medium text-gray-700">
                              Authors
                            </p>
                            <div>
                              {productData.authors.value.map((author) => (
                                <span key={author}>{author}</span>
                              ))}
                            </div>
                            <div className="flex">
                              <label
                                htmlFor="newAuthor"
                                className="sr-only block text-sm font-medium text-gray-700"
                              >
                                Author
                              </label>
                              <AsyncCreatableSelect
                                isMulti
                                cacheOptions
                                defaultOptions
                                loadOptions={authorOptions}
                                value={authorState.value}
                                onChange={selectAuthorChange}
                              />
                            </div>
                          </fieldset>

                          <fieldset className="mb-2 space-y-1">
                            <p className="block text-sm font-medium text-gray-700">
                              Categories
                            </p>
                            {productData.categories.value.map((category) => (
                              <span key={category}>{category}</span>
                            ))}
                            <div>
                              <label
                                htmlFor="newCategory"
                                className="sr-only block text-sm font-medium text-gray-700"
                              >
                                Category
                              </label>
                              <AsyncCreatableSelect
                                isMulti
                                cacheOptions
                                defaultOptions
                                loadOptions={categoryOptions}
                                value={categoryState.value}
                                onChange={selectCategoryChange}
                              />
                            </div>
                          </fieldset>

                          <fieldset className="mb-2 space-y-1">
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Description
                            </label>

                            <textarea
                              name="description"
                              id="description"
                              placeholder="Few words..."
                              className="mt-1 w-full resize-none rounded-md border-gray-200 shadow-sm sm:text-sm"
                              value={productData.description.value}
                              onChange={(e) => productDataChangeHandler(e)}
                            />
                          </fieldset>

                          <fieldset className="relative mb-2 max-w-full space-y-1 break-all">
                            <label
                              htmlFor="imgs"
                              className="block text-sm font-medium text-gray-700  "
                            >
                              Imgs
                            </label>

                            <Input
                              type="file"
                              name="imgs"
                              id="imgs"
                              onChange={(e) => productDataChangeHandler(e)}
                              accept="application/pdf, image/png"
                            />

                            {productData.imgs.value.length > 0 &&
                              productData.imgs.value.map((img, id) => {
                                return (
                                  <p
                                    className="text-xs"
                                    key={id}
                                    id={id.toString()}
                                  >
                                    {img.slice(0, 60)}...
                                  </p>
                                );
                              })}
                          </fieldset>

                          <fieldset className="mb-2 space-y-1">
                            <label
                              htmlFor="quantity"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Amount
                            </label>

                            <input
                              name="quantity"
                              id="quantity"
                              type="number"
                              placeholder="1..."
                              min={1}
                              max={100}
                              className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                              value={productData.quantity.value}
                              onChange={(e) => productDataChangeHandler(e)}
                            />
                          </fieldset>

                          <fieldset className="mb-2 space-y-1">
                            <span className="block text-sm font-medium text-gray-700">
                              Marketplace
                            </span>
                            <RadioGroup defaultValue={MarketPlaceTypes.SHOP}>
                              <div>
                                <RadioGroupItem
                                  value={MarketPlaceTypes.SHOP}
                                  id={MarketPlaceTypes.SHOP}
                                />
                                <Label htmlFor={MarketPlaceTypes.SHOP}>
                                  {MarketPlaceTypes.SHOP}
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem
                                  value={MarketPlaceTypes.AUCTION}
                                  id={MarketPlaceTypes.AUCTION}
                                />
                                <Label htmlFor={MarketPlaceTypes.AUCTION}>
                                  {MarketPlaceTypes.AUCTION}
                                </Label>
                              </div>
                            </RadioGroup>
                          </fieldset>

                          {productData.marketPlace.value ===
                          MarketPlaceTypes.SHOP ? (
                            <fieldset className="mb-2 space-y-1">
                              <label
                                htmlFor="price"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Price
                              </label>
                              <input
                                name="price"
                                id="price"
                                type="number"
                                placeholder="$1..."
                                min={0.1}
                                step={0.1}
                                className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                value={productData.price.value}
                                onChange={(e) => productDataChangeHandler(e)}
                              />
                            </fieldset>
                          ) : (
                            <div>
                              <fieldset className="mb-2 space-y-1">
                                <label
                                  htmlFor="price"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Starting Price
                                </label>
                                <input
                                  name="startingPrice"
                                  id="startingPrice"
                                  type="number"
                                  placeholder="$1..."
                                  min={0.1}
                                  step={0.1}
                                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                                  value={productData.startingPrice.value}
                                  onChange={(e) => productDataChangeHandler(e)}
                                />
                              </fieldset>
                              <DatePickerDemo
                                date={finishAuctionDate}
                                setDate={setFinishAuctionDate}
                              />
                            </div>
                          )}
                          <DialogFooter>
                            <DialogTrigger asChild>
                              <Button variant="default" type="submit">
                                Add
                              </Button>
                            </DialogTrigger>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            </div>
          </header>
          <div>
            <div className="px-2">
              <div className="sm:hidden">
                <label htmlFor="Tab" className="sr-only">
                  Tab
                </label>

                <select
                  id="Tab"
                  className="w-full rounded-md border-gray-200"
                  onChange={(e) => changeSelectedTab(e.target.value)}
                  value={selectedtab}
                >
                  {TABS_ARRAY.map((tab) => {
                    if (
                      tab.name === 'admin' &&
                      userData?.role !== UserRoleTypes.ADMIN
                    )
                      return null;
                    if (
                      tab.name === 'myProducts' &&
                      userData?.role !== UserRoleTypes.ADMIN &&
                      userData?.role !== UserRoleTypes.AUTHOR
                    )
                      return null;
                    return (
                      <option key={tab.name} value={tab.name}>
                        {tab.text}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex gap-6" aria-label="Tabs">
                    {TABS_ARRAY.map((option) => {
                      if (
                        option.name === 'admin' &&
                        userData?.role !== UserRoleTypes.ADMIN
                      ) {
                        return null;
                      }
                      if (
                        option.name === 'myProducts' &&
                        userData?.role !== UserRoleTypes.ADMIN &&
                        userData?.role !== UserRoleTypes.AUTHOR
                      ) {
                        return null;
                      }

                      return (
                        <button
                          key={option.name}
                          type="button"
                          onClick={() => changeSelectedTab(option.name)}
                          className={`${
                            selectedtab === option.name
                              ? 'border-sky-500 text-sky-600'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                          } ease inline-flex shrink-0 items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium transition duration-200`}
                        >
                          {option.icon}
                          {option.text}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </div>
            <div className="mt-8 flex w-full flex-col gap-8 px-4 sm:flex-row">
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
      </div>
    </div>
  );
}
