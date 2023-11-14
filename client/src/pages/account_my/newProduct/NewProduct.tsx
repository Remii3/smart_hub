import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@components/UI/dialog';
import { UserContext } from '@context/UserProvider';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';

import {
  useState,
  useCallback,
  useEffect,
  useContext,
  ChangeEvent,
} from 'react';
import { Button } from '@components/UI/button';
import { Input } from '@components/UI/input';
import { RadioGroup, RadioGroupItem } from '@components/UI/radio-group';
import { Label } from '@components/UI/label';

import * as z from 'zod';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/UI/form';
import Select from 'react-select';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { v4 } from 'uuid';
import useUploadImg from '@hooks/useUploadImg';
import { Textarea } from '@components/UI/textarea';
import { MarketplaceTypes } from '@customTypes/types';
import SushiSwiper from '@components/swiper/SushiSwiper';
import errorToast from '@components/UI/error/errorToast';
import { CollectionCardTypes, FetchDataTypes } from '@customTypes/interfaces';
import { Checkbox } from '@components/UI/checkbox';
import { SwiperSlide } from 'swiper/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@components/UI/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/UI/tabs';
import CollectionCard from '@components/cards/CollectionCard';

type SelectedImgsTypes = {
  id: string;
  data: File;
  url: string;
}[];

interface CollectionsDataTypes extends FetchDataTypes {
  data: null | CollectionCardTypes[];
}

const MarketPlaceTypes = { shop: 'shop', collection: 'collection' } as {
  shop: MarketplaceTypes;
  collection: MarketplaceTypes;
};
const formSchema = z.object({
  title: z.string().nonempty({ message: 'Please provide book title!' }).min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  authors: z
    .array(
      z.object({
        _id: z.string(),
        label: z.string(),
        value: z.string(),
      })
    )
    .nonempty({ message: 'Please provide book authors!' }),
  categories: z
    .array(
      z.object({
        _id: z.string(),
        label: z.string(),
        value: z.string(),
        description: z.string(),
      })
    )
    .optional(),
  description: z.string().optional(),
  quantity: z.number().min(1),
  price: z
    .string()
    .nonempty({ message: 'Please provide book price' })
    .or(z.number()),
  marketplace: z.enum([MarketPlaceTypes.shop, MarketPlaceTypes.collection]),
});

export default function NewProduct() {
  const [selectedImgs, setSelectedImgs] = useState<SelectedImgsTypes>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const initalMarketplace = 'shop' as MarketplaceTypes;
  const [selectedMarketplace, setSelectedMarketplace] =
    useState(initalMarketplace);
  const [collectionsData, setCollectionsData] = useState<CollectionsDataTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });

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

  const { userData, fetchUserData } = useContext(UserContext);

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

  const fetchAllCollections = useCallback(async () => {
    setCollectionsData((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COLLECTION_ALL,
      params: { limit: 0, creatorId: userData.data?._id },
    });
    if (error) {
      errorToast(error);
      return setCollectionsData({
        data: null,
        hasError: error,
        isLoading: false,
      });
    }
    setCollectionsData({
      data,
      hasError: null,
      isLoading: false,
    });
  }, []);

  if (!userData.data) return <div>Please log in!</div>;

  useEffect(() => {
    fetchAllAuthors();
    fetchAllCategories();
    fetchAllCollections();
  }, []);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      quantity: 0,
      price: '',
      categories: [],
      authors: [],
      marketplace: MarketPlaceTypes.shop,
    },
  });
  const { handleSubmit, control, watch, reset } = form;
  const marketplaceValue = watch('marketplace');

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const eventFiles = e.target.files;
      setSelectedImgs((prevState) => {
        return [
          ...prevState,
          {
            id: eventFiles[0].name + v4(),
            data: eventFiles[0],
            url: URL.createObjectURL(eventFiles[0]),
          },
        ];
      });
    }
  };

  const removeImg = (clieckedId: string) => {
    const updatedImgs = [...selectedImgs];
    const indexToRemove = updatedImgs.findIndex(
      (item) => item.id === clieckedId
    );
    if (indexToRemove !== -1) {
      const newArray = updatedImgs.filter((item) => item.id !== clieckedId);
      setSelectedImgs(newArray);
    }
  };

  const onSubmit = async (formResponse: any) => {
    const {
      title,
      description,
      price,
      categories,
      authors,
      quantity,
      marketplace,
    } = formResponse;
    setStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { error, data } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_ONE,
      body: {
        creatorData: {
          _id: userData.data?._id,
          pseudonim: userData.data?.author_info.pseudonim,
        },
        title,
        description,
        price,
        categories,
        authors,
        quantity,
        marketplace: selectedMarketplace,
        selectedCollections,
      },
    });
    if (data.id && selectedImgs.length > 0) {
      const urls = [];
      for (let i = 0; i < selectedImgs.length; i++) {
        const url = await useUploadImg({
          ownerId: data.id,
          selectedFile: selectedImgs[i].data,
          targetLocation: 'Product_imgs',
        });
        urls.push(url);
      }
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.PRODUCT_UPDATE,
        body: { _id: data.id, imgs: urls },
      });
    }
    if (error) {
      setStatus((prevState) => {
        return { ...prevState, isLoading: false, hasFailed: true };
      });
    } else {
      fetchUserData();
      reset();
      setStatus({ isLoading: false, hasFailed: false, isSuccess: true });
    }
  };

  const clearForm = () => {
    setOpenDialog(false);
    setTimeout(() => {
      setSelectedCollections([]);
      setStatus({ hasFailed: false, isLoading: false, isSuccess: false });
      setSelectedImgs([]);
      reset();
    }, 100);
  };
  const changeSelectedCollectionsHandler = (
    checked: boolean,
    collectionId: string
  ) => {
    if (checked) {
      setSelectedCollections((prevState) => [...prevState, collectionId]);
    } else {
      let selectedCollectionsCopy = [...selectedCollections];
      const idIndex = selectedCollections.findIndex(
        (id) => id === collectionId
      );
      selectedCollectionsCopy.splice(idIndex, 1);
      setSelectedCollections(selectedCollectionsCopy);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={clearForm} modal={true}>
      <div className="mt-4 flex flex-col sm:mt-0 sm:flex-row sm:items-center">
        <Button
          variant="default"
          className="w-full"
          onClick={() => setOpenDialog(true)}
        >
          Add new book
        </Button>
      </div>
      <DialogContent
        className={`${
          status.isLoading ? 'overflow-y-hidden' : 'overflow-y-auto'
        }  `}
      >
        {status.isLoading && (
          <div className="flex items-center justify-center">
            <div
              className="absolute mx-auto block h-6 w-6 animate-spin rounded-full border-[3px] border-current border-t-primary text-background"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {status.hasFailed && !status.isLoading && (
          <div className="h-auto">
            <DialogHeader className="mb-8 mt-4">
              <DialogTitle>Failed adding new product</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant={'outline'}
                onClick={() =>
                  setStatus((prevState) => {
                    return { ...prevState, hasFailed: false };
                  })
                }
              >
                Try again
              </Button>
              <Button variant={'destructive'} onClick={clearForm}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
        {status.isSuccess && !status.isLoading && (
          <>
            <DialogHeader className="mb-10">
              <h4>Success</h4>
              <p>Your book has been successfully added!</p>
            </DialogHeader>
            <DialogFooter>
              <Button variant={'default'} onClick={clearForm}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
        {!status.hasFailed && !status.isLoading && !status.isSuccess && (
          <Tabs
            defaultValue={selectedMarketplace}
            onValueChange={(e: string) =>
              setSelectedMarketplace(e as MarketplaceTypes)
            }
          >
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="relative flex flex-col space-y-4"
              >
                <DialogHeader>
                  <DialogTitle>Add new product</DialogTitle>
                  <DialogDescription>
                    Fill in your product data. Click the &apos;add&apos; button
                    when you&apos;re ready.
                  </DialogDescription>
                  <FormField
                    control={control}
                    name="marketplace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marketplace</FormLabel>
                        <FormControl>
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="shop">Shop</TabsTrigger>
                            <TabsTrigger value="collection">
                              Collection
                            </TabsTrigger>
                          </TabsList>
                        </FormControl>
                        <FormDescription>
                          Choose the destination of your book.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </DialogHeader>
                <article className="flex-grow px-1">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Title..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your book title.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="imgs"
                    render={() => {
                      return (
                        <FormItem>
                          <FormLabel>Imgs</FormLabel>
                          <FormControl>
                            <div className="block">
                              <Label className="inline-block">
                                <Input
                                  name="file"
                                  accept=".jpg, .jpeg, .png"
                                  type="file"
                                  value={''}
                                  onChange={(e) => onImageChange(e)}
                                  className="hidden"
                                />
                                <div className="cursor-pointer rounded-md p-1 transition-colors duration-150 ease-out hover:bg-slate-100">
                                  <PlusCircleIcon className="h-12 w-12" />
                                </div>
                              </Label>
                            </div>
                          </FormControl>
                          <FormDescription>
                            This is your book's imgs.
                          </FormDescription>
                          {selectedImgs.map((item) => (
                            <div
                              key={item.id}
                              className="group relative me-2 inline-block cursor-pointer rounded-md"
                              onClick={() => removeImg(item.id)}
                            >
                              <img
                                key={item.id}
                                id={item.id}
                                alt="preview_image"
                                className="aspect-square h-24 w-24 rounded-md"
                                src={item.url}
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 opacity-0 transition duration-150 ease-out group-hover:opacity-90">
                                <XCircleIcon className="h-12 w-12" />
                              </div>
                            </div>
                          ))}
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desciption</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Description..." {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your book's description.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            step={1}
                            placeholder="1,2,3"
                            {...field}
                            type="number"
                            value={Number(field.value).toString()}
                            onChange={(e) =>
                              field.onChange(
                                Number(Number(e.target.value).toString())
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          This is the quantity of your book.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="authors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Authors</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            isMulti
                            options={authorState.options}
                            onChange={field.onChange}
                            defaultValue={field.value}
                            menuPlacement="top"
                            className="shadow-sm"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                outline: state.isFocused
                                  ? '2px solid transparent'
                                  : '',
                                outlineColor: state.isFocused
                                  ? 'hsl(215, 20.2%, 65.1%)'
                                  : 'transparent',
                                outlineOffset: state.isFocused ? '0' : '',
                                border: state.isFocused
                                  ? '1px hsl(214, 32%, 91%) solid'
                                  : '1px hsl(214, 32%, 91%) solid',
                                '&:hover': {
                                  border: '1px var hsl(214, 30%, 95%) solid',
                                },
                                borderRadius: 'calc(var(--radius) - 2px)',
                                padding: '',
                                transition: 'none',
                              }),
                              option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused
                                  ? 'hsl(214, 30%, 95%)'
                                  : undefined,
                                ':active': {
                                  backgroundColor: 'hsl(214, 30%, 95%)',
                                },
                              }),
                              multiValue: (base) => ({
                                ...base,
                                backgroundColor: 'hsl(214, 30%, 95%)',
                                borderRadius: '0.75rem',
                                paddingLeft: '2px',
                              }),
                              multiValueRemove: (base) => ({
                                ...base,
                                borderRadius: '0 0.75rem 0.75rem 0',
                              }),
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the authors of your book.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            isMulti
                            options={categoryState.options}
                            onChange={field.onChange}
                            defaultValue={field.value}
                            menuPlacement="top"
                            className="shadow-sm"
                            styles={{
                              control: (base, state) => ({
                                ...base,
                                outline: state.isFocused
                                  ? '2px solid transparent'
                                  : '',
                                outlineColor: state.isFocused
                                  ? 'hsl(215, 20.2%, 65.1%)'
                                  : 'transparent',
                                outlineOffset: state.isFocused ? '0' : '',
                                border: state.isFocused
                                  ? '1px hsl(214, 32%, 91%) solid'
                                  : '1px hsl(214, 32%, 91%) solid',
                                '&:hover': {
                                  border: '1px var hsl(214, 30%, 95%) solid',
                                },
                                borderRadius: 'calc(var(--radius) - 2px)',
                                padding: '',
                                transition: 'none',
                              }),
                              option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused
                                  ? 'hsl(214, 30%, 95%)'
                                  : undefined,
                                ':active': {
                                  backgroundColor: 'hsl(214, 30%, 95%)',
                                },
                              }),
                              multiValue: (base) => ({
                                ...base,
                                backgroundColor: 'hsl(214, 30%, 95%)',
                                borderRadius: '0.75rem',
                                paddingLeft: '2px',
                              }),
                              multiValueRemove: (base) => ({
                                ...base,
                                borderRadius: '0 0.75rem 0.75rem 0',
                              }),
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          This is the categories of your book.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <div className="flex flex-row rounded-md shadow-sm">
                            <span className="flex items-center rounded-md rounded-r-none border border-input px-3 font-semibold text-foreground">
                              $
                            </span>
                            <Input
                              className="rounded-l-none shadow-none"
                              placeholder="0.00"
                              {...field}
                              step="0.01"
                              type="number"
                              value={field.value}
                              onBlur={(e) => {
                                if (e.target.value.trim().length > 0) {
                                  return field.onChange(
                                    e.target.value
                                      ? parseFloat(e.target.value).toFixed(2)
                                      : 0
                                  );
                                }
                              }}
                              onKeyDown={(e) => {
                                if (['.'].includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              onChange={(e) => {
                                return field.onChange(
                                  e.target.value
                                    ? parseFloat(e.target.value)
                                    : 0
                                );
                              }}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          This is the price of your book.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </article>

                <DialogFooter className="flex justify-end">
                  <TabsContent
                    value="collection"
                    tabIndex={-1}
                    className="flex justify-end"
                  >
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" type="button">
                          Choose collections
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <div className="relative flex h-full flex-col">
                          <SheetHeader>
                            <SheetTitle>Your collections</SheetTitle>
                            <SheetDescription>
                              Please select one/many of your collections you
                              wish to upload this product to.
                            </SheetDescription>
                          </SheetHeader>
                          <section className="my-4 h-full space-y-4 overflow-y-auto">
                            {collectionsData.data &&
                              collectionsData.data.map((collection) => (
                                <div className="relative">
                                  <Label
                                    key={collection._id}
                                    className="absolute inset-0 block h-full w-full cursor-pointer p-3 text-right"
                                  >
                                    <Checkbox
                                      id={collection._id}
                                      checked={selectedCollections.includes(
                                        collection._id
                                      )}
                                      onCheckedChange={(checked) =>
                                        changeSelectedCollectionsHandler(
                                          checked as boolean,
                                          collection._id
                                        )
                                      }
                                    />
                                  </Label>
                                  <CollectionCard
                                    _id={collection._id}
                                    title={collection.title}
                                    shortDescription={
                                      collection.shortDescription
                                    }
                                    rating={collection.rating}
                                    price={collection.price}
                                    imgs={collection.imgs}
                                    authors={collection.authors}
                                    categories={collection.categories}
                                    type="collection"
                                    productQuantity={collection.productQuantity}
                                    showOnly
                                  />
                                </div>
                              ))}
                          </section>
                          <SheetFooter>
                            <SheetTrigger asChild>
                              <Button variant={'default'}>Proceed</Button>
                            </SheetTrigger>
                          </SheetFooter>
                        </div>
                      </SheetContent>
                    </Sheet>
                    <Button
                      type="submit"
                      variant={'default'}
                      disabled={selectedCollections.length <= 0}
                    >
                      Submit
                    </Button>
                  </TabsContent>
                  <TabsContent
                    value="shop"
                    tabIndex={-1}
                    className="flex justify-end"
                  >
                    <Button variant="default" type="submit">
                      Add
                    </Button>
                  </TabsContent>
                </DialogFooter>
              </form>
            </Form>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
