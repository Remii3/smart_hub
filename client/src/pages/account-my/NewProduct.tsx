import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@components/UI/dialog';
import { UserContext } from '@context/UserProvider';
import { MarketPlaceTypes, MarketplaceType } from '@customTypes/types';
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

type SelectedImgsTypes = {
  id: string;
  data: File;
  url: string;
}[];

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
  marketplace: z.enum([MarketPlaceTypes.SHOP, MarketPlaceTypes.COLLECTION]),
});

export default function NewProduct() {
  const [selectedImgs, setSelectedImgs] = useState<SelectedImgsTypes>([]);
  const [openDialog, setOpenDialog] = useState(false);

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

  if (!userData) return <div>Please log in!</div>;

  useEffect(() => {
    fetchAllAuthors();
    fetchAllCategories();
  }, [fetchAllAuthors, fetchAllCategories]);

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      quantity: 0,
      price: '',
      categories: [],
      authors: [],
      marketplace: MarketPlaceTypes.SHOP,
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
        seller_data: {
          _id: userData._id,
          pseudonim: userData.author_info.pseudonim,
        },
        title,
        description,
        price: parseFloat(price).toFixed(2),
        categories,
        authors,
        quantity: Number(quantity),
        market_place: marketplace,
      },
    });
    if (data.id && selectedImgs.length > 0) {
      const urls = [];
      for (let i = 0; i < selectedImgs.length; i++) {
        const url = await useUploadImg({
          ownerId: data.id,
          selectedFile: selectedImgs[i].data,
          targetLocation: 'Product_imgs',
          iteration: i,
        });
        urls.push(url);
      }
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.PRODUCT_UPDATE,
        body: { _id: data.id, market_place: MarketPlaceTypes.SHOP, imgs: urls },
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
      setStatus({ hasFailed: false, isLoading: false, isSuccess: false });
      setSelectedImgs([]);
      reset();
    }, 100);
  };

  return (
    <Dialog open={openDialog} onOpenChange={clearForm}>
      <div className="mt-4 flex flex-col sm:mt-0 sm:flex-row sm:items-center">
        <Button variant="default" onClick={() => setOpenDialog(true)}>
          Add new book
        </Button>
      </div>
      <DialogContent
        className={`${
          status.isLoading ? 'overflow-y-hidden' : 'overflow-y-auto'
        } max-h-[80vh] transition-[height] duration-200 ease-in-out`}
      >
        {status.isLoading && (
          <div className="flex h-[80vh] items-center justify-center">
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
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <DialogHeader>
                <DialogTitle>Add new product</DialogTitle>
                <DialogDescription>
                  Fill in your product data. Click the &apos;add&apos; button
                  when you&apos;re ready.
                </DialogDescription>
              </DialogHeader>

              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Title..." {...field} />
                    </FormControl>
                    <FormDescription>This is your book title.</FormDescription>
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
                      <div className="flex flex-row rounded-md shadow">
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
                              e.target.value ? parseFloat(e.target.value) : 0
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
              <FormField
                control={control}
                name="marketplace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marketplace</FormLabel>
                    <FormControl>
                      <RadioGroup
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Shop" id="shopOption" />
                          <Label
                            htmlFor="shopOption"
                            className="cursor-pointer"
                          >
                            Shop
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Collection"
                            id="collectionOption"
                          />
                          <Label
                            htmlFor="collectionOption"
                            className="cursor-pointer"
                          >
                            Collection
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormDescription>
                      Choose the destination of your book.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {marketplaceValue === MarketPlaceTypes.COLLECTION && (
                <div>TODO: Show available collections</div>
              )}
              <DialogFooter>
                <Button variant="default" type="submit">
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
