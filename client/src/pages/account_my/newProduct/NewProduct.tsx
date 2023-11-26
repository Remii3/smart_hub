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

import { Tabs, TabsList, TabsTrigger } from '@components/UI/tabs';
import errorToast from '@components/UI/error/errorToast';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';

type SelectedImgsTypes = {
  isDirty: boolean;
  imgs: {
    id: string;
    data?: File;
    url: string;
  }[];
};

const MarketPlaceTypes = { shop: 'shop', collection: 'collection' } as {
  shop: MarketplaceTypes;
  collection: MarketplaceTypes;
};

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  authors: z.any(),
  categories: z.any(),
  shortDescription: z.string().optional(),
  quantity: z.number().min(1),
  marketplace: z.enum([MarketPlaceTypes.shop, MarketPlaceTypes.collection]),
  price: z.number(),
});

export default function NewProduct() {
  const [selectedImgs, setSelectedImgs] = useState<SelectedImgsTypes>({
    imgs: [],
    isDirty: false,
  });
  const [newDescription, setNewDescription] = useState({
    value: '',
    show: false,
  });
  const [openDialog, setOpenDialog] = useState(false);

  const [selectedMarketplace, setSelectedMarketplace] =
    useState<MarketplaceTypes>('shop');

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

  useEffect(() => {
    fetchAllAuthors();
    fetchAllCategories();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      shortDescription: '',
      quantity: 0,
      price: '',
      categories: [] as any[],
      authors: [] as any[],
      marketplace: MarketPlaceTypes.shop,
    },
  });
  const { handleSubmit, control, reset } = form;

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const eventFiles = e.target.files;
      setSelectedImgs((prevState) => {
        return {
          isDirty: true,
          imgs: [
            ...prevState.imgs,
            {
              id: eventFiles[0].name + v4(),
              data: eventFiles[0],
              url: URL.createObjectURL(eventFiles[0]),
            },
          ],
        };
      });
    }
  };

  const removeImg = (clieckedId: string) => {
    const updatedImgs = [...selectedImgs.imgs];
    const indexToRemove = updatedImgs.findIndex(
      (item) => item.id === clieckedId
    );
    if (indexToRemove !== -1) {
      const newArray = updatedImgs.filter((item) => item.id !== clieckedId);
      setSelectedImgs({ imgs: newArray, isDirty: true });
    }
  };

  const onSubmit = async (formResponse: any) => {
    const dirtyData = Object.fromEntries(
      Object.keys(form.formState.dirtyFields).map((x: string) => [
        x,
        form.getValues(x as keyof z.infer<typeof formSchema>),
      ])
    ) as any;

    if (newDescription.value !== newDescription.value) {
      dirtyData.description = newDescription.value;
    }

    if (selectedImgs.isDirty) {
      dirtyData.imgs = selectedImgs.imgs;
    }
    dirtyData.marketplace = formResponse.marketplace;
    setStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { error, data } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_ONE,
      body: {
        creatorData: {
          _id: userData.data?._id,
          pseudonim: userData.data?.author_info.pseudonim,
          profile_img: userData.data?.user_info.profile_img.url,
        },
        ...dirtyData,
      },
    });
    if (data.id && selectedImgs.imgs.length > 0) {
      const urls = [];
      for (let i = 0; i < selectedImgs.imgs.length; i++) {
        const url = await useUploadImg({
          ownerId: data.id,
          selectedFile: selectedImgs.imgs[i].data || null,
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
      errorToast(error);
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
      setStatus({ hasFailed: false, isLoading: false, isSuccess: false });
      setSelectedImgs({ imgs: [], isDirty: false });
      reset();
    }, 50);
  };

  return (
    <Dialog open={openDialog} onOpenChange={clearForm}>
      <div className="mt-4 flex flex-col sm:mt-0 sm:flex-row sm:items-center">
        <Button
          variant="default"
          className="w-full"
          onClick={() => {
            setOpenDialog(true);
            setTimeout(() => {
              setNewDescription({ value: '', show: true });
            }, 100);
          }}
        >
          Add new book
        </Button>
      </div>
      <DialogContent
        className={`${
          status.isLoading ? 'overflow-y-hidden' : 'overflow-y-auto'
        } h-full w-full p-7 `}
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
                          <TabsList
                            defaultValue={'shop'}
                            className="grid w-full grid-cols-2"
                          >
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
                          {selectedImgs.imgs.map((item) => (
                            <div
                              key={item.id}
                              className="group relative me-2 inline-block cursor-pointer rounded-md"
                              onClick={() => removeImg(item.id)}
                            >
                              <XCircleIcon className="absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-slate-200 opacity-75 transition-[opacity,filter] group-hover:opacity-100" />
                              <img
                                key={item.id}
                                id={item.id}
                                alt="Product preview remove img."
                                className="aspect-[4/3] h-24 w-24 rounded-md object-cover brightness-[40%] transition group-hover:brightness-[20%]"
                                src={item.url}
                              />
                            </div>
                          ))}
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Short description..."
                            {...field}
                          />
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
                            getOptionValue={(author) =>
                              author.author_info.pseudonim
                            }
                            getOptionLabel={(author) =>
                              author.author_info.pseudonim
                            }
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
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
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
                  {newDescription.show && (
                    <CKEditor
                      editor={ClassicEditor}
                      data={newDescription.value}
                      config={{
                        mediaEmbed: { previewsInData: true },
                        toolbar: {
                          shouldNotGroupWhenFull: true,
                          items: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            'mediaEmbed',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'outdent',
                            'indent',
                            '|',
                            'blockQuote',
                            'insertTable',
                            'undo',
                            'redo',
                          ],
                        },
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setNewDescription({ show: true, value: data });
                      }}
                    />
                  )}
                </article>

                <DialogFooter className="flex justify-end">
                  <Button variant="default" type="submit">
                    Add
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
