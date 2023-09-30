import { DatePickerDemo } from '@components/UI/datePicker';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@components/UI/dialog';
import { UserContext } from '@context/UserProvider';
import { MarketPlaceTypes, MarketplaceType } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';

import { useState, useCallback, useEffect, useContext } from 'react';
import { Button } from '@components/UI/button';
import { Input } from '@components/UI/input';
import { RadioGroup, RadioGroupItem } from '@components/UI/radio-group';
import { Label } from '@components/UI/label';

type ProductDataTypes = {
  data: {
    title: { value: string; error: null | string };
    authors: { value: string[] | null; error: null | string };
    categories: { value: string[] | null; error: null | string };
    description: { value: string; error: null | string };
    imgs: { value: null | File[]; error: null | string };
    quantity: { value: number | null; error: null | string };
    price: { value: number | null; error: null | string };
    marketPlace: { value: MarketplaceType; error: null | string };
  };
  isLoading: boolean;
};

const initialProductData: ProductDataTypes = {
  data: {
    title: { value: '', error: null },
    authors: { value: null, error: null },
    categories: { value: null, error: null },
    description: { value: '', error: null },
    imgs: { value: null, error: null },
    quantity: { value: null, error: null },
    price: { value: null, error: null },
    marketPlace: { value: MarketPlaceTypes.SHOP, error: null },
  },
  isLoading: false,
};

export default function NewProduct() {
  const [productData, setProductData] =
    useState<ProductDataTypes>(initialProductData);
  // const [selectedImgs, setSelectedImgs] = useState<[] | File[]>([]);

  const [categoryState, setCategoryState] = useState<{
    isLoading: boolean;
    options: any;
  }>({
    isLoading: false,
    options: [],
  });

  const [authorState, setAuthorState] = useState<{
    isLoading: boolean;
    options: any;
  }>({
    isLoading: false,
    options: [],
  });

  const [status, setStatus] = useState({
    isLoading: false,
    hasFailed: false,
    isSuccess: false,
  });

  const { userData } = useContext(UserContext);

  const resetProductData = () => {
    setTimeout(() => {
      setProductData(initialProductData);
    }, 200);
  };

  const productDataChangeHandler = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    // if (e === null) {
    // if (radioValue) {
    //   setProductData((prevState) => {
    //     return {
    //       ...prevState,
    //       marketPlace: { value: radioValue, hasError: false },
    //     };
    //   });
    // }
    // } else if (e.target.name === 'imgs') {
    // setProductData((prevState) => {
    //   return {
    //     ...prevState,
    //     imgs: {
    //       value: [...prevState.imgs.value, e.target.value],
    //       hasError: false,
    //     },
    //   };
    // });
    // } else if (e.target.name === 'authors') {
    // setProductData((prevState) => {
    //   return {
    //     ...prevState,
    //     authors: {
    //       value: [...prevState.imgs.value, e.target.value],
    //       hasError: false,
    //     },
    //   };
    // });
    // } else {
    // }
    setProductData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: { value: e.target.value, hasError: false },
      };
    });
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

  const categoryOptions = (inputValue: string) => {
    const filterCategories = categoryState.options.filter(
      (i: { label: string }) => {
        return i.label.toLowerCase().includes(inputValue.toLowerCase());
      }
    );
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(filterCategories());
      }, 1000);
    });
  };

  const authorOptions = (inputValue: string) => {
    const filterAuthors = authorState.options.filter((i: { label: string }) => {
      return i.label.toLowerCase().includes(inputValue.toLowerCase());
    });
    new Promise<any[]>((resolve) => {
      setTimeout(() => {
        resolve(filterAuthors());
      }, 1000);
    });
  };

  if (!userData) return <></>;

  const addProductHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      authors,
      categories,
      description,
      imgs,
      marketPlace,
      price,
      quantity,
      title,
    } = productData.data;
    const errors = [];
    if (title.value.trim().length <= 0) {
      // setProductData(prevState=> {return {...prevState,data:{...prevState.data, title:}}})
      errors.push({ title: { error: 'Title is required' } });
    }
    const newProductData = {
      seller_data: {
        _id: userData._id,
        pseudonim: userData.author_info.pseudonim,
      },
      title: title.value,
      description: description.value,
      price: Number(price.value),
      imgs: imgs.value,
      categories: categories.value,
      authors: authors.value,
      quantity: quantity.value,
      market_place: marketPlace.value,
    };

    try {
    } catch (err) {
      setStatus((prevState) => {
        return { ...prevState, isLoading: false, hasFailed: true };
      });
    }
  };

  useEffect(() => {
    getAllData();
  }, [getAllData]);

  return (
    <div className="mt-4 flex flex-col sm:mt-0 sm:flex-row sm:items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">Add new book</Button>
        </DialogTrigger>
        <DialogContent>
          <form onSubmit={(e) => addProductHandler(e)} className="w-full">
            <DialogHeader>
              <DialogTitle>Add new product</DialogTitle>
              <DialogDescription>
                Fill in your product data. Click the &apos;add&apos; button when
                you&apos;re ready.
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
                value={productData.data.title.value}
                onChange={(e) => productDataChangeHandler(e)}
              />
            </fieldset>

            <fieldset className="mb-2 space-y-1">
              <p className="block text-sm font-medium text-gray-700">Authors</p>
              <div>
                {productData.data.authors.value ? (
                  productData.data.authors.value.map((author) => (
                    <span key={author}>{author}</span>
                  ))
                ) : (
                  <p>No authors selected</p>
                )}
              </div>
              <div className="flex">
                <label
                  htmlFor="newAuthor"
                  className="sr-only block text-sm font-medium text-gray-700"
                >
                  Author
                </label>
                {/* <AsyncCreatableSelect
                  isMulti
                  cacheOptions
                  defaultOptions
                  loadOptions={authorOptions}
                  value={authorState.value}
                  onChange={selectAuthorChange}
                /> */}
              </div>
            </fieldset>

            <fieldset className="mb-2 space-y-1">
              <p className="block text-sm font-medium text-gray-700">
                Categories
              </p>
              {productData.data.categories.value ? (
                productData.data.categories.value.map((category) => (
                  <span key={category}>{category}</span>
                ))
              ) : (
                <p>No categories selected</p>
              )}
              <div>
                <label
                  htmlFor="newCategory"
                  className="sr-only block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                {/* <AsyncCreatableSelect
                  isMulti
                  cacheOptions
                  defaultOptions
                  loadOptions={categoryOptions}
                  value={categoryState.value}
                  onChange={selectCategoryChange}
                /> */}
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
                value={productData.data.description.value}
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
                multiple
                // onChange={(e) => productImgsHandler(e)}
                accept="image/png, image/jpg"
              />

              {productData.data.imgs.value ? (
                productData.data.imgs.value.map((img, id) => {
                  return (
                    <p className="text-xs" key={id} id={id.toString()}>
                      img
                    </p>
                  );
                })
              ) : (
                <p>No imgs selected</p>
              )}
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
                placeholder="1,2,3"
                min={1}
                max={100}
                className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                value={productData.data.quantity.value || ''}
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

            {productData.data.marketPlace.value === MarketPlaceTypes.SHOP && (
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
                  placeholder="$1.00"
                  min={0.1}
                  step={0.1}
                  className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                  value={productData.data.price.value || ''}
                  onChange={(e) => productDataChangeHandler(e)}
                />
              </fieldset>
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
  );
}
