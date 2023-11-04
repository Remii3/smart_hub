import {
  ChangeEvent,
  useEffect,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AuthorTypes,
  ProductCategories,
  UnknownProductTypes,
} from '@customTypes/interfaces';
import { UserContext } from '@context/UserProvider';
import ProductPill from './ProductPill';
import StarRating from '@features/rating/StarRating';
import ProductForm from '@pages/product/ProductForm';
import { Button } from '@components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/UI/dialog';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import Comments from '@features/comments/Comments';
import { Skeleton } from '@components/UI/skeleton';
import { Textarea } from '@components/UI/textarea';
import { Input } from '@components/UI/input';
import { UserRoleTypes } from '@customTypes/types';
import { useToast } from '@components/UI/use-toast';
import { ToastAction } from '@components/UI/toast';
import MainContainer from '@layout/MainContainer';
import SuspenseComponent from '@components/suspense/SuspenseComponent';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { v4 } from 'uuid';
import { Label } from '@components/UI/label';
import useDeleteImg from '@hooks/useDeleteImg';
import useUploadImg from '@hooks/useUploadImg';
import { z } from 'zod';
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

interface ProductTypes {
  isLoading: boolean;
  data: null | UnknownProductTypes;
}
interface ProductRating {
  quantity: number;
  value: number;
}
interface ProductEditTypes {
  isEditing: boolean;
  isLoading: boolean;
  data: {
    title: null | string;
    price: null | number;
    categories: null | { value: string; label: string; _id: string }[];
    authors: null | AuthorTypes[];
    quantity: null | number;
    description: null | string;
  };
  imgsArray: { id: string; url: string; data?: File }[];
}
type SelectedImgsTypes = {
  id: string;
  data?: File;
  url: string;
}[];

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: 'Title must be at least 2 characters.',
    })
    .optional(),
  authors: z
    .array(
      z.object({
        _id: z.string(),
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
  categories: z.array(
    z.object({
      _id: z.string(),
      label: z.string(),
      value: z.string(),
    })
  ),
  description: z.string().optional(),
  quantity: z.number().min(1).optional(),
  price: z.string().or(z.number()).optional(),
});

export default function ProductPage() {
  const [productState, setProductState] = useState<ProductTypes>({
    isLoading: false,
    data: null,
  });
  const [selectedImgs, setSelectedImgs] = useState<SelectedImgsTypes>([]);
  const [imgsToRemove, setImgsToRemove] = useState<string[]>([]);
  const [imgsToAdd, setImgsToAdd] = useState<{ id: string; data: File }[]>([]);
  const [isMyProduct, setIsMyProduct] = useState(false);
  const [authorState, setAuthorState] = useState<{
    isLoading: boolean;
    options: any;
  }>({
    isLoading: false,
    options: [],
  });
  const [categoryState, setCategoryState] = useState<{
    isLoading: boolean;
    options: any;
  }>({
    isLoading: false,
    options: [],
  });
  const [productEditState, setProductEditState] = useState<ProductEditTypes>({
    isEditing: false,
    isLoading: false,
    data: {
      title: null,
      price: null,
      categories: null,
      authors: null,
      quantity: null,
      description: null,
    },
    imgsArray: [],
  });

  const { userData, fetchUserData } = useContext(UserContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  const path = useLocation();
  const [productRating, setProductRating] = useState<ProductRating>();
  let unPreparedProdId: string | any[] | null = null;
  unPreparedProdId = path.pathname.split('/');
  const prodId: string = unPreparedProdId[unPreparedProdId.length - 1];

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
  });
  const { handleSubmit, control, reset } = form;

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

  const fetchComments = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_RATING,
      params: { _id: prodId },
    });
    setProductRating({ quantity: data.rating.length, value: data.avgRating });
  }, []);

  const fetchData = useCallback(async () => {
    setProductState((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_ONE,
      params: { productId: prodId },
    });
    if (error) {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
        action: (
          <ToastAction onClick={() => location.reload()} altText="Try again">
            Try again
          </ToastAction>
        ),
      });
    }

    setSelectedImgs(data.imgs);
    setProductEditState((prevState) => {
      return {
        ...prevState,
        data: {
          title: data.title,
          authors: data.authors,
          categories: data.categories,
          price: data.shop_info.price,
          quantity: data.quantity,
          description: data.description,
        },
        imgsArray: data.imgs,
      };
    });
    setProductRating({
      quantity: data.rating.count,
      value: data.rating.rating,
    });
    setProductState({ data, isLoading: false });
  }, [prodId]);

  useEffect(() => {
    fetchData();
    fetchAllAuthors();
    fetchAllCategories();
  }, [fetchData]);

  useEffect(() => {
    if (
      userData.data &&
      ((userData.data.role == UserRoleTypes.AUTHOR &&
        userData.data.author_info.my_products.find(
          (product: UnknownProductTypes) =>
            product._id === productState.data?._id
        )) ||
        userData.data.role == UserRoleTypes.ADMIN)
    ) {
      setIsMyProduct(true);
      if (!productState.data) return;
      let preparedAuthors = [];
      for (let i = 0; i < productState.data.authors.length; i++) {
        if (!productState.data.authors[i].author_info) break;
        preparedAuthors.push({
          label: productState.data.authors[i].author_info.pseudonim,
          value: productState.data.authors[i].author_info.pseudonim,
          _id: productState.data.authors[i]._id,
        });
      }
      let preparedCategories = [];
      if (productState.data.categories) {
        for (let i = 0; i < productState.data.categories.length; i++) {
          preparedCategories.push({
            label: productState.data.categories[i].label,
            value: productState.data.categories[i].value,
            _id: productState.data.categories[i]._id,
          });
        }
      }
      reset({
        title: productState.data.title,
        price: productState.data.shop_info.price,
        authors: preparedAuthors,
        categories: preparedCategories,
        quantity: productState.data.quantity,
        description: productState.data.description,
      });
    }
  }, [userData.data, productState]);
  const removeImg = (clieckedId: string) => {
    const updatedImgs = [...selectedImgs];
    const indexToRemove = updatedImgs.findIndex(
      (item) => item.id === clieckedId
    );
    setImgsToRemove((prevState) => {
      return [...prevState, clieckedId];
    });
    if (indexToRemove !== -1) {
      const newArray = updatedImgs.filter((item) => item.id !== clieckedId);
      setSelectedImgs(newArray);
    }
  };

  const onImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    clickedId: string
  ) => {
    const newArray = [...selectedImgs];
    if (e.target.files && e.target.files[0]) {
      const index = selectedImgs.findIndex((item) => item.id === clickedId);
      const eventFiles = e.target.files;
      if (index != -1) {
        newArray[index] = {
          id: newArray[index].id,
          data: eventFiles[0],
          url: URL.createObjectURL(eventFiles[0]),
        };
      } else {
        newArray.push({
          id: clickedId,
          data: eventFiles[0],
          url: URL.createObjectURL(eventFiles[0]),
        });
      }
      setImgsToAdd((prevState) => {
        return [...prevState, { id: clickedId, data: eventFiles[0] }];
      });
      setSelectedImgs(newArray);
    }
  };

  const toggleEditting = () => {
    if (productEditState.isEditing) {
      setImgsToAdd([]);
      setImgsToRemove([]);
      setSelectedImgs(productEditState.imgsArray);
      reset();
      if (!productState.data) return;
      setProductEditState((prevState) => {
        return {
          ...prevState,
          isEditing: false,
          data: {
            authors: productState.data!.authors,
            categories: productState.data!.categories ?? [],
            description: productState.data!.description ?? '',
            price: productState.data!.shop_info.price,
            quantity: productState.data!.quantity,
            title: productState.data!.title,
          },
        };
      });
    } else {
      setProductEditState((prevState) => {
        return { ...prevState, isEditing: true };
      });
    }
  };

  const updateProductData = async (
    formResponse: z.infer<typeof formSchema>
  ) => {
    if (productState.data) {
      setProductState((prevState) => {
        return { ...prevState, isLoading: true };
      });
      setProductEditState((prevState) => {
        return { ...prevState, isLoading: true };
      });

      let filteredImgs = selectedImgs;

      if (imgsToRemove.length > 0) {
        for (let i = 0; i < imgsToRemove.length; i++) {
          const checkIndex = productState.data.imgs.findIndex(
            (img) => img.id === imgsToRemove[i]
          );
          if (checkIndex != -1) {
            await useDeleteImg({
              imgId: imgsToRemove[i],
              ownerId: prodId,
              targetLocation: 'Product_imgs',
            });
            filteredImgs = filteredImgs.filter((item) => {
              for (const id of imgsToRemove) {
                if (item.id.includes(id)) {
                  return false;
                }
              }
              return true;
            });
          }
        }
      }

      if (imgsToAdd.length > 0) {
        for (let i = 0; i < imgsToAdd.length; i++) {
          const index = selectedImgs.findIndex(
            (img) => img.id === imgsToAdd[i].id
          );
          const url = await useUploadImg({
            ownerId: prodId,
            selectedFile: imgsToAdd[i].data,
            targetLocation: 'Product_imgs',
            currentId: imgsToAdd[i].id,
          });
          if (url) {
            filteredImgs[index] = url;
          }
        }
      }
      function differentAuthors(array1, array2) {
        if (array1.length === array2.length) {
          return array1.every((element, index) => {
            if (element.label === array2[index].author_info.pseudonim) {
              return false;
            }
            return true;
          });
        }
        return true;
      }
      function differentCategories(array1, array2) {
        if (array1.length === array2.length) {
          return array1.every((element, index) => {
            if (element.value === array2[index].value) {
              return false;
            }
            return true;
          });
        }
        return true;
      }
      function validImgsArray(array1: SelectedImgsTypes) {
        array1.forEach((item) => {
          if (item.data) {
            return true;
          }
        });

        return false;
      }
      const productData = {
        _id: productState.data._id,
        market_place: productState.data.market_place,
      } as {
        _id: string;
        market_place: string;
        title?: string;
        price?: string | number;
        quantity?: string | number;
        description?: string;
        authors?: any[];
        categories?: any[];
        imgs?: any[];
      };
      if (formResponse.title !== productState.data.title)
        productData.title = formResponse.title;
      if (formResponse.price !== productState.data.shop_info.price)
        productData.price = formResponse.price;
      if (formResponse.description! == productState.data.description)
        productData.description = formResponse.description;
      if (formResponse.quantity !== formResponse.quantity)
        productData.quantity = formResponse.quantity;
      if (differentAuthors(formResponse.authors, productState.data.authors))
        productData.authors = formResponse.authors;
      if (
        differentCategories(
          formResponse.categories,
          productState.data.categories
        )
      )
        productData.categories = formResponse.categories;
      if (validImgsArray(filteredImgs)) productData.imgs = filteredImgs;
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.PRODUCT_UPDATE,
        body: productData,
      });
      setImgsToAdd([]);
      setImgsToRemove([]);
      await fetchData();
      setProductEditState((prevState) => {
        return { ...prevState, isEditing: false, isLoading: false };
      });
    }
  };

  const deleteItemHandler = async () => {
    if (productState.data) {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.PRODUCT_DELETE,
        body: { _id: productState.data._id, userId: userData.data?._id },
      });
      fetchUserData();
      navigate(-1);
    }
  };
  console.log('productState', productState.data);
  if (!productState.data || userData.isLoading) return <></>;
  return (
    <MainContainer className="relative py-8">
      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
        <div className="grid grid-cols-1 items-center space-y-4">
          {productState.isLoading && (
            <div className="max-w-[500px]">
              <Skeleton className="aspect-square h-full w-full rounded-xl object-cover" />
              <div className="flex gap-4 lg:mt-4">
                <Skeleton className="aspect-square w-full rounded-xl object-cover" />
                <Skeleton className="aspect-square w-full rounded-xl object-cover" />
                <Skeleton className="aspect-square w-full rounded-xl object-cover" />
                <Skeleton className="aspect-square w-full rounded-xl object-cover" />
              </div>
            </div>
          )}
          {!productState.isLoading && productState.data.imgs && (
            <div className="space-y-2">
              {productEditState.isEditing &&
                selectedImgs.map((item) => (
                  <div
                    key={item.id}
                    className="group relative me-2 inline-block cursor-pointer"
                    onClick={() => removeImg(item.id)}
                  >
                    <img
                      key={item.id}
                      id={item.id}
                      alt="preview_image"
                      className="aspect-auto h-24 w-24"
                      src={item.url}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 opacity-0 transition duration-150 ease-out group-hover:opacity-90">
                      <XCircleIcon className="h-12 w-12" />
                    </div>
                  </div>
                ))}
              <div className="relative">
                <Dialog>
                  {productEditState.isEditing && selectedImgs.length >= 1 && (
                    <Label className="absolute left-0 top-0 block h-full w-full">
                      <Input
                        name="file"
                        accept=".jpg, .jpeg, .png"
                        type="file"
                        value={''}
                        onChange={(e) => onImageChange(e, selectedImgs[0].id)}
                        className="hidden"
                      />
                      <div className="flex h-full w-full cursor-pointer items-center justify-center bg-black/20 p-1 transition-colors duration-150 ease-out hover:bg-black/30">
                        <PlusCircleIcon className="h-12 w-12" />
                      </div>
                    </Label>
                  )}

                  <DialogTrigger className="mx-auto block">
                    {productEditState.isEditing && selectedImgs.length > 0 && (
                      <img
                        src={selectedImgs[0].url}
                        className="mx-auto aspect-auto h-full w-full max-w-[500px] rounded-xl object-cover lg:xl:w-[90%] xl:w-[80%]"
                      />
                    )}
                    {!productEditState.isEditing &&
                      productState.data.imgs.length > 0 && (
                        <img
                          src={productState.data.imgs[0].url}
                          className="mx-auto aspect-auto h-full w-full max-w-[500px] rounded-xl object-cover lg:xl:w-[90%] xl:w-[80%]"
                        />
                      )}
                  </DialogTrigger>
                  {!productEditState.isEditing &&
                    productState.data.imgs.length <= 0 && (
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                        className="mx-auto aspect-auto h-full w-full max-w-[500px] rounded-xl object-cover lg:xl:w-[90%] xl:w-[80%]"
                      />
                    )}
                  <DialogContent>
                    {productState.data.imgs.length > 0 && (
                      <img
                        src={productState.data.imgs[0].url}
                        className="mx-auto aspect-square h-full w-full max-w-[500px] rounded-xl object-cover lg:xl:w-[90%] xl:w-[80%]"
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div>
                <Swiper
                  navigation={{
                    nextEl: `.swiper-productImage-button-next`,
                    prevEl: `.swiper-productImage-button-prev`,
                    enabled: false,
                  }}
                  slidesPerView={2.2}
                  modules={[Navigation]}
                  breakpoints={{
                    640: {
                      slidesPerView: 2.2,
                      navigation: {
                        enabled: true,
                      },
                    },
                    1024: {
                      slidesPerView: 3.2,
                      navigation: {
                        enabled: true,
                      },
                    },
                    1280: {
                      slidesPerView: 4.2,
                      navigation: {
                        enabled: true,
                      },
                    },
                  }}
                  className="-mr-4"
                >
                  <SuspenseComponent fallback={<LoadingCircle />}>
                    {productEditState.isEditing ? (
                      <div>
                        {selectedImgs.map((el, index) => {
                          if (index !== 0) {
                            return (
                              <SwiperSlide key={el.id} className="pr-6">
                                <div className="relative">
                                  <Label className="absolute left-0 top-0 block h-full w-full">
                                    <Input
                                      name="file"
                                      accept=".jpg, .jpeg, .png"
                                      type="file"
                                      value={''}
                                      onChange={(e) => onImageChange(e, el.id)}
                                      className="hidden"
                                    />
                                    <div className="flex h-full w-full cursor-pointer items-center justify-center bg-black/20 p-1 transition-colors duration-150 ease-out hover:bg-black/30">
                                      <PlusCircleIcon className="h-12 w-12" />
                                    </div>
                                  </Label>
                                  <img
                                    src={el.url}
                                    key={index}
                                    alt="product_img"
                                    className="aspect-square rounded-xl object-cover"
                                  />
                                </div>
                              </SwiperSlide>
                            );
                          }
                        })}
                        <SwiperSlide className="pr-6">
                          <div className="relative">
                            <Label className="absolute left-0 top-0 block h-full w-full">
                              <Input
                                name="file"
                                accept=".jpg, .jpeg, .png"
                                type="file"
                                value={''}
                                onChange={(e) => onImageChange(e, v4())}
                                className="hidden"
                              />
                              <div className="flex h-full w-full cursor-pointer items-center justify-center bg-black/20 p-1 transition-colors duration-150 ease-out hover:bg-black/30">
                                <PlusCircleIcon className="h-12 w-12" />
                              </div>
                            </Label>
                            <div className="aspect-square h-full w-full rounded-xl bg-primary/20 object-cover" />
                          </div>
                        </SwiperSlide>
                      </div>
                    ) : (
                      productState.data.imgs.map((el, index) => {
                        if (index !== 0) {
                          return (
                            <SwiperSlide key={el.id} className=" pr-6">
                              <div className="relative">
                                <Dialog>
                                  <DialogTrigger className="block">
                                    <img
                                      src={el.url}
                                      key={index}
                                      alt="product_img"
                                      className="aspect-square rounded-xl object-cover"
                                    />
                                  </DialogTrigger>
                                  <DialogContent>
                                    <Swiper
                                      navigation={{
                                        nextEl: `.swiper-bigProductImg-button-next`,
                                        prevEl: `.swiper-bigProductImg-button-prev`,
                                      }}
                                      grabCursor
                                      initialSlide={index - 1}
                                      nested={true}
                                      slidesPerView={'auto'}
                                      pagination={{
                                        clickable: true,
                                      }}
                                      direction="horizontal"
                                      modules={[Pagination, Navigation]}
                                    >
                                      <SuspenseComponent
                                        fallback={<LoadingCircle />}
                                      >
                                        {!productState.data && 'No items'}
                                        {productState.data &&
                                        productState.data.imgs
                                          ? productState.data.imgs.map(
                                              (nestedImgs, nestedIndex) => {
                                                if (nestedIndex === 0) return;
                                                return (
                                                  <SwiperSlide
                                                    key={nestedImgs.id}
                                                  >
                                                    <div className="relative">
                                                      <img
                                                        src={nestedImgs.url}
                                                        alt="product_img"
                                                        className="aspect-square rounded-xl object-cover"
                                                      />
                                                    </div>
                                                  </SwiperSlide>
                                                );
                                              }
                                            )
                                          : 'Hello'}
                                      </SuspenseComponent>
                                      <div
                                        className={`swiper-button-next swiper-bigProductImg-button-next color-primary right-0 flex items-center justify-center rounded-full bg-white p-8 opacity-90 backdrop-blur-sm`}
                                      ></div>
                                      <div
                                        className={`swiper-button-prev swiper-bigProductImg-button-prev color-primary left-0 flex items-center justify-center rounded-full bg-white p-8 opacity-90 backdrop-blur-sm`}
                                      ></div>
                                    </Swiper>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </SwiperSlide>
                          );
                        }
                      })
                    )}
                  </SuspenseComponent>

                  <div
                    className={`swiper-button-next swiper-productImage-button-next color-primary right-0 flex items-center justify-center rounded-full bg-white p-8 opacity-90 backdrop-blur-sm`}
                  ></div>
                  <div
                    className={`swiper-button-prev swiper-productImage-button-prev color-primary left-0 flex items-center justify-center rounded-full bg-white p-8 opacity-90 backdrop-blur-sm`}
                  ></div>
                </Swiper>
              </div>
            </div>
          )}
        </div>

        <div className="sticky top-24">
          <Form {...form}>
            <form onSubmit={handleSubmit(updateProductData)}>
              <div className="relative mb-3 w-full">
                <ProductPill
                  text={productState.data && productState.data.market_place}
                />

                {(isMyProduct ||
                  (userData.data &&
                    userData.data.role === UserRoleTypes.ADMIN)) && (
                  <div className="absolute right-0 top-0 flex gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant={'ghost'}
                          className="hover:text-400 text-red-400"
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            Deleting this will permamently remove the item from
                            the database.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            type="button"
                            onClick={() => deleteItemHandler()}
                            variant={'destructive'}
                          >
                            Delete
                          </Button>
                          <DialogTrigger asChild>
                            <Button variant={'outline'} type="button">
                              Cancel
                            </Button>
                          </DialogTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      type="button"
                      variant={'outline'}
                      onClick={toggleEditting}
                    >
                      {productEditState.isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                    {productEditState.isEditing && (
                      <Button
                        type="submit"
                        variant={'outline'}
                        className="text-green-600 hover:text-green-600"
                      >
                        Accept
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-between">
                <div className="max-w-[35ch] space-y-2">
                  {productEditState.isEditing ? (
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
                  ) : (
                    !productState.isLoading && (
                      <h1 className="text-xl font-bold sm:text-3xl">
                        {productState.data && productState.data.title}
                      </h1>
                    )
                  )}
                  {productState.isLoading && <Skeleton className="h-9" />}
                  <div>
                    {productEditState.isEditing ? (
                      <FormField
                        control={control}
                        name="categories"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Categories</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  isMulti
                                  options={categoryState.options}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormDescription>
                                This is the categories of your book.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    ) : (
                      <>
                        <h6>Categories</h6>
                        {productState.data.categories &&
                          productState.data.categories.map((category) => {
                            return (
                              <Link
                                key={category._id}
                                to={{
                                  pathname: '/search',
                                  search: `category=${category.value}`,
                                }}
                                className="pr-2"
                              >
                                {category.label}
                              </Link>
                            );
                          })}
                      </>
                    )}
                    {productState.isLoading && (
                      <Skeleton className="h-4"></Skeleton>
                    )}
                  </div>
                  <div>
                    Added:{' '}
                    {productState.data &&
                      productState.data.created_at.slice(0, 10)}
                  </div>
                  <div>
                    <p>Seller:</p>
                    {productState.data && !productState.isLoading && (
                      <Link
                        key={productState.data.seller_data._id}
                        className="pr-4"
                        to={`/account/${productState.data.seller_data._id}`}
                      >
                        {productState.data.seller_data.pseudonim}
                      </Link>
                    )}
                    {productState.isLoading && <Skeleton className="h-4" />}
                  </div>
                  <div>
                    {productEditState.isEditing ? (
                      <FormField
                        control={control}
                        name="authors"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Authors</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  isMulti
                                  options={authorState.options}
                                  onChange={field.onChange}
                                  // defaultInputValue={
                                  //   field.value.author_info.pseudonim
                                  // }
                                  // defaultValue={field.value}
                                />
                              </FormControl>
                              <FormDescription>
                                This is the authors of your book.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    ) : (
                      !productState.isLoading &&
                      productState.data.authors && (
                        <>
                          <p>Authors:</p>
                          {productState.data.authors.map((author) => (
                            <Link
                              key={author._id}
                              className="pr-4"
                              to={`/account/${author._id}`}
                            >
                              {author.author_info
                                ? author.author_info.pseudonim
                                : ''}
                            </Link>
                          ))}
                        </>
                      )
                    )}
                    {productState.isLoading && <Skeleton className="h-4" />}
                  </div>
                  <p className="text-sm">Highest Rated Product</p>
                  <div className="">
                    <StarRating
                      showOnly
                      rating={(productRating && productRating.value) || 0}
                    />
                  </div>
                  <span className="text-sm">
                    votes: {productRating?.quantity}
                  </span>
                </div>
                <div>
                  {productEditState.isEditing ? (
                    <FormField
                      name="price"
                      control={control}
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
                  ) : (
                    !productState.isLoading && (
                      <p className="text-xl font-bold">
                        $
                        {productState.data &&
                          productState.data.shop_info &&
                          productState.data.shop_info.price}
                      </p>
                    )
                  )}
                </div>

                {productState.isLoading && <Skeleton className="h-6" />}
              </div>

              <div className="mt-4">
                <div className="block max-w-none">
                  <span className="inline-block">Available: </span>
                  {productEditState.isEditing ? (
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
                  ) : (
                    !productState.isLoading && (
                      <span className="inline-block">
                        {productState.data && productState.data.quantity}
                      </span>
                    )
                  )}
                  {productState.isLoading && <Skeleton className="h-4" />}
                </div>
                <div className="prose  max-w-none pt-4">
                  {productEditState.isEditing ? (
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
                  ) : (
                    !productState.isLoading &&
                    productState.data &&
                    productState.data.description && (
                      <>
                        <h6 className="mb-1">Description: </h6>
                        <p>
                          {productState.data && productState.data.description}
                        </p>
                      </>
                    )
                  )}
                  {productState.isLoading && (
                    <>
                      <Skeleton className="mb-2 h-4 w-10" />
                      <Skeleton className="mb-1 h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </>
                  )}
                </div>

                {productState.data &&
                  productState.data.description &&
                  productState.data.description.length > 600 && (
                    <Button
                      type="button"
                      variant={'default'}
                      className="mt-2 text-sm font-medium underline"
                    >
                      Read More
                    </Button>
                  )}
              </div>
            </form>
          </Form>
          <ProductForm
            productId={productState.data?._id}
            productQuantity={productState.data?.quantity}
            sold={(productState.data && productState.data.sold) || false}
            isLoading={productEditState.isEditing}
          />
        </div>
      </div>
      {prodId && (
        <Comments
          withRating={true}
          target={'Product'}
          targetId={prodId}
          updateProductStatus={fetchComments}
        />
      )}
    </MainContainer>
  );
}
