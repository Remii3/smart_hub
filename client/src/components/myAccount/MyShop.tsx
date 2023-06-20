import React, { useContext, useEffect, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PrimaryBtn from '../UI/Btns/PrimaryBtn';
import CustomDialog from '../UI/headlessUI/CustomDialog';
import { ProductCategories } from '../../types/interfaces';
import { UserContext } from '../../context/UserProvider';
import { CheckIcon } from '../../assets/icons/Icons';
import MyProducts from './MyProducts';

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

export default function MyShop() {
  const [isOpen, setIsOpen] = useState(false);
  const [productData, setProductData] =
    useState<ProductDataTypes>(initialProductData);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [categories, setCategories] = useState<ProductCategories[]>();
  const [shownAllProducts, setShownAllProducts] = useState(false);

  const { userData, fetchUserData } = useContext(UserContext);

  const resetProductData = () => {
    setTimeout(() => {
      setProductData(initialProductData);
    }, 200);
  };

  const resetHasFailed = () => {
    setHasFailed(false);
  };

  const changeIsOpen = () => {
    setIsOpen((prevState) => !prevState);
    resetProductData();
    setTimeout(() => {
      resetHasFailed();
      setIsSuccess(false);
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

  const addProductHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    let currentCategory = productData.category.value;
    if (productData.category.value === 'Other') {
      currentCategory = productData.otherCategory.value;
    }
    const newProductData = {
      userEmail: userData?.email,
      title: productData.title.value,
      author: productData.author.value,
      category: currentCategory,
      description: productData.description.value,
      imgs: productData.imgs.value,
      quantity: productData.quantity.value,
      price: productData.price.value,
      marketPlace: productData.marketPlace.value,
      height: productData.height.value,
      width: productData.width.value,
      depth: productData.depth.value,
    };

    try {
      setIsLoading(true);
      await axios.post('/product/product', newProductData);
      setIsLoading(false);
      fetchUserData();
      resetProductData();

      setIsSuccess(true);
    } catch (err) {
      setIsLoading(false);
      setHasFailed(true);
    }
  };

  useEffect(() => {
    if (productData.category.value === '') {
      axios.get('/category/all').then((res) => {
        setCategories(res.data);
        setProductData((prevState) => {
          return {
            ...prevState,
            category: { value: res.data[0].name, hasError: false },
          };
        });
      });
    }
  }, [productData.category.value]);

  const showAllHandler = () => {
    setShownAllProducts((prevState) => !prevState);
  };

  const addAuthorHandler = (e: HTMLInputElement) => {};
  return (
    <div>
      <div>
        <div className="mb-8">
          <div className="flex justify-between align-bottom">
            <h3 className="mb-0">My products</h3>
            {userData?.my_products && userData.my_products.length > 6 && (
              <div className="flex items-end">
                <Link to="/account/my/my-products" className="text-sm">
                  Show all
                </Link>
              </div>
            )}
          </div>
          {userData &&
          userData.my_products &&
          userData.my_products.length > 0 ? (
            <MyProducts
              myProducts={userData.my_products}
              onClick={showAllHandler}
              shownAllProducts={shownAllProducts}
            />
          ) : (
            'No products added.'
          )}
        </div>
        <div>
          <PrimaryBtn
            type="button"
            usecase="default"
            onClick={() => setIsOpen((prevState) => !prevState)}
          >
            Add Product
          </PrimaryBtn>
        </div>
      </div>
      <CustomDialog
        isOpen={isOpen}
        changeIsOpen={changeIsOpen}
        title="Add product"
        description={
          "Fill in your product data. Click the 'add' button when you're done."
        }
        isLoading={isLoading}
        hasFailed={hasFailed}
        changeHasFailed={resetHasFailed}
        isSuccess={isSuccess}
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
            <label
              htmlFor="authors"
              className="block text-sm font-medium text-gray-700"
            >
              Authors
            </label>

            <input
              name="authors"
              id="authors"
              type="text"
              placeholder="R.R. Martin..."
              className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
              value={productData.author.value}
              onChange={(e) => productDataChangeHandler(e)}
            />
            <button type="button" onClick={() => addAuthorHandler()}>
              +
            </button>
          </fieldset>

          <fieldset className="mb-2 space-y-1">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              name="category"
              id="category"
              value={productData.category.value}
              onChange={(e) => productDataChangeHandler(e)}
            >
              {categories?.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name[0].toUpperCase()}
                  {item.name.slice(1)}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            {productData.category.value === 'Other' && (
              <input
                id="otherCategory"
                name="otherCategory"
                type="text"
                placeholder="Fantasy..."
                value={productData.otherCategory.value}
                onChange={(e) => productDataChangeHandler(e)}
              />
            )}
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
            <PrimaryBtn
              type="submit"
              usecase="default"
              customCSS="flex items-center justify-center bg-green-500 px-6 py-2 border-none text-white hover:bg-green-700 focus:ring-green-300"
            >
              Add
            </PrimaryBtn>
          </div>
        </form>
      </CustomDialog>
    </div>
  );
}
