/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useContext, useEffect, useState } from 'react';
import {
  UserIcon,
  ArchiveBoxIcon,
  LockClosedIcon,
  Square2StackIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { RadioGroup } from '@headlessui/react';
import axios from 'axios';
import AsyncCreatableSelect from 'react-select/async-creatable';
import MainContainer from '../components/UI/SpecialElements/MainContainer';
import EditUserData from '../components/myAccount/EditUserData';
import MyShop from '../components/myAccount/MyShop';
import { UserContext } from '../context/UserProvider';
import MarketplaceBadge from '../components/UI/badges/MarketplaceBadge';
import testImg from '../assets/img/avataaars.svg';
import { Button } from '../components/UI/Btns/Button';
import CustomDialog from '../components/UI/headlessUI/CustomDialog';

const tabNames = {
  MY_DATA: 'myData',
  SECURITY_PERMISSIONS: 'securityPermissions',
  HISTORY: 'history',
  MY_PRODUCTS: 'myProducts',
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
  marketPlace: { value: '', hasError: false },
};

export default function MyAccount() {
  const { userData, fetchUserData } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const tabsArray = [
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
  ];
  const [selectedtab, setSelectedtab] = useState(tabsArray[0].name);

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

  const resetHasFailed = () => {
    setStatus((prevState) => {
      return { ...prevState, hasFailed: false };
    });
  };
  const changeIsOpen = () => {
    setIsOpen((prevState) => !prevState);
    resetProductData();
    setTimeout(() => {
      resetHasFailed();
      setStatus((prevState) => {
        return { ...prevState, isSuccess: false };
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
    const res = await axios.get('/category/all');
    setCategoryState((prevState) => {
      return { ...prevState, options: [...res.data] };
    });
  }, []);

  const fetchAllAuthors = useCallback(async () => {
    const res = await axios.get('/user/authors');
    setAuthorState((prevState) => {
      return { ...prevState, options: [...res.data] };
    });
  }, []);

  const getAllData = useCallback(async () => {
    fetchAllAuthors();
    fetchAllCategories();
  }, [fetchAllAuthors, fetchAllCategories]);

  const addProductHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProductData = {
      user_id: userData?._id,
      title: productData.title.value,
      description: productData.description.value,
      price: Number(productData.price.value),
      img: productData.imgs.value,
      categories: categoryState.value,
      authors: authorState.value,
      quantity: productData.quantity.value,
      market_place: productData.marketPlace.value,
    };

    try {
      setStatus((prevState) => {
        return { ...prevState, isLoading: true };
      });
      await axios.post('/product/product', { newProductData });
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

  const filterColors = (inputValue: string) => {
    return categoryState.options.filter((i: { label: string }) => {
      return i.label.toLowerCase().includes(inputValue.toLowerCase());
    });
  };
  const authorFilter = (inputValue: string) => {
    return authorState.options.filter((i: { label: string }) => {
      return i.label.toLowerCase().includes(inputValue.toLowerCase());
    });
  };
  const promiseOptions = (inputValue: string) =>
    new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(filterColors(inputValue));
      }, 1000);
    });

  const authorOptions = (inputValue: string) =>
    new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(authorFilter(inputValue));
      }, 1000);
    });

  const slectedChangetest = (selectedOptions: any) => {
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
                    src={testImg}
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

                <div className="mt-4 flex flex-col sm:mt-0 sm:flex-row sm:items-center">
                  <Button
                    variant="primary"
                    onClick={() => setIsOpen((prevState) => !prevState)}
                  >
                    Add new book
                  </Button>
                </div>
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
                  onChange={(e) => setSelectedtab(e.target.value)}
                >
                  {tabsArray.map((tab) => (
                    <option key={tab.name} value={tab.name}>
                      {tab.text}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden sm:block">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex gap-6" aria-label="Tabs">
                    {tabsArray.map((option) => (
                      <a
                        href="#"
                        key={option.name}
                        onClick={() => setSelectedtab(option.name)}
                        className={`${
                          selectedtab === option.name
                            ? 'border-sky-500 text-sky-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        } ease inline-flex shrink-0 items-center gap-2 border-b-2 px-1 pb-4 text-sm font-medium transition duration-200`}
                      >
                        {option.icon}
                        {option.text}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
            <div className="mt-8 flex w-full flex-col justify-start gap-8 px-4 lg:flex-row">
              {selectedtab === tabNames.MY_DATA && <EditUserData />}
              {selectedtab === tabNames.MY_PRODUCTS && <MyShop />}
            </div>
          </div>
        </MainContainer>
      </div>
      <CustomDialog
        isOpen={isOpen}
        changeIsOpen={changeIsOpen}
        title="Add product"
        description={
          "Fill in your product data. Click the 'add' button when you're done."
        }
        isLoading={status.isLoading}
        hasFailed={status.hasFailed}
        changeHasFailed={resetHasFailed}
        isSuccess={status.isSuccess}
      >
        <form onSubmit={(e) => addProductHandler(e)} className="w-full">
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
            <p className="block text-sm font-medium text-gray-700">Authors</p>
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
                loadOptions={promiseOptions}
                value={categoryState.value}
                onChange={slectedChangetest}
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
            <div className="rounded-md border-gray-200 shadow-sm">
              <label
                htmlFor="imgs"
                className="absolute block text-sm font-medium text-gray-700  "
              >
                Imgs
              </label>

              <input
                name="imgs"
                id="imgs"
                type="file"
                className="opacity-0"
                onChange={(e) => productDataChangeHandler(e)}
                multiple
                accept="application/pdf, image/png"
              />
            </div>
            {productData.imgs.value.length > 0 &&
              productData.imgs.value.map((img, id) => {
                return (
                  <p className="text-xs" key={id}>
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
          <fieldset className="mb-2 space-y-1">
            <span className="block text-sm font-medium text-gray-700">
              Marketplace
            </span>
            <RadioGroup
              value={productData.marketPlace.value}
              onChange={(value) => productDataChangeHandler(null, value)}
            >
              <div className="space-y-2">
                <RadioGroup.Option
                  value="Shop"
                  className={({ active, checked }) =>
                    `
                  ${
                    checked ? 'bg-primary bg-opacity-95 text-white' : 'bg-white'
                  }
                  relative flex
                    cursor-pointer rounded-lg px-5 py-4 shadow-md focus:ring focus:ring-blue-300`
                  }
                >
                  {({ active, checked }) => (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            Shop
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-sky-100' : 'text-gray-500'
                            }`}
                          >
                            <span>
                              Adds the product to the Shop marketplace
                            </span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon height={6} width={6} />
                        </div>
                      )}
                    </div>
                  )}
                </RadioGroup.Option>
                <RadioGroup.Option
                  value="Auction"
                  className={({ active, checked }) =>
                    `
                  ${
                    checked ? 'bg-primary bg-opacity-95 text-white' : 'bg-white'
                  }
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:ring focus:ring-blue-300`
                  }
                >
                  {({ active, checked }) => (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            Auction
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-sky-100' : 'text-gray-500'
                            }`}
                          >
                            <span>
                              Adds the product to the Auction marketplace
                            </span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon height={6} width={6} />
                        </div>
                      )}
                    </div>
                  )}
                </RadioGroup.Option>
              </div>
            </RadioGroup>
          </fieldset>

          <div className="mb-2 mt-4 flex justify-end">
            <Button variant="success" type="submit">
              Add
            </Button>
          </div>
        </form>
      </CustomDialog>
    </div>
  );
}
