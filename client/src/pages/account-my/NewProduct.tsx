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

export default function NewProduct() {
  const [productData, setProductData] =
    useState<ProductDataTypes>(initialProductData);
  const [selectedImgs, setSelectedImgs] = useState<[] | File[]>([]);

  const [categoryState, setCategoryState] = useState<{
    isLoading: boolean;
    options: any;
    value: [];
  }>({
    isLoading: false,
    options: [],
    value: [],
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

  const [status, setStatus] = useState({
    isLoading: false,
    hasFailed: false,
    isSuccess: false,
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
      imgs: [],
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

      const { error, data } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.PRODUCT_ONE,
        body: { newProductData },
      });
      if (error) {
      } else {
        if (selectedImgs) {
          const urlsTable = [];
          for (let i = 0; i < selectedImgs.length; i++) {
            urlsTable.push(
              await useUploadImg({
                ownerId: data.id,
                selectedFile: selectedImgs[i],
                targetLocation: 'Product_imgs',
                iteration: i,
              })
            );
          }
          const { error } = await usePostAccessDatabase({
            url: DATABASE_ENDPOINTS.PRODUCT_UPDATE,
            body: { _id: data.id, imgs: urlsTable, market_place: 'Shop' },
          });
        }

        setStatus((prevState) => {
          return { ...prevState, isLoading: false };
        });
        fetchUserData();
        resetProductData();

        setStatus((prevState) => {
          return { ...prevState, isSuccess: true };
        });
        getAllData();
      }
    } catch (err) {
      setStatus((prevState) => {
        return { ...prevState, isLoading: false, hasFailed: true };
      });
    }
  };

  const productImgsHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImgs((prevState) => [...prevState, ...files]);
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
              <DialogTitle>Add product</DialogTitle>
              <DialogDescription>
                Fill in your product data. Click the &apos;add&apos; button when
                you&apos;re done.
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
                multiple
                onChange={(e) => productImgsHandler(e)}
                accept="image/png, image/jpg"
              />

              {productData.imgs.value.length > 0 &&
                productData.imgs.value.map((img, id) => {
                  return (
                    <p className="text-xs" key={id} id={id.toString()}>
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

            {productData.marketPlace.value === MarketPlaceTypes.SHOP ? (
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
  );
}
