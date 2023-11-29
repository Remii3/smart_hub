import {
  ChangeEvent,
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FetchDataTypes,
  PostDataTypes,
  ProductTypes,
} from '@customTypes/interfaces';
import { UserContext } from '@context/UserProvider';
import StarRating from '@features/rating/StarRating';
import ProductForm from '@pages/product/ProductForm';
import { Button, buttonVariants } from '@components/UI/button';
import { Dialog, DialogContent, DialogTrigger } from '@components/UI/dialog';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import Comments from '@features/comments/Comments';
import { Textarea } from '@components/UI/textarea';
import { Input } from '@components/UI/input';
import { UserRoleTypes } from '@customTypes/types';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
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
import errorToast from '@components/UI/error/errorToast';
import SimilarProducts from '@features/product/SimilarProducts';
import type { Swiper as SwiperType } from 'swiper';
import { CartContext } from '@context/CartProvider';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import ProductDescription from '@features/product/ProductDescription';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/UI/accordion';
import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import CreatableSelect from 'react-select/creatable';
import SwiperArrowRight from '@components/swiper/navigation/SwiperArrowRight';
import SwiperArrowLeft from '@components/swiper/navigation/SwiperArrowLeft';
import SwiperDots from '@components/swiper/pagination/SwiperDots';
import MarketplaceBadge from '@components/UI/badges/MarketplaceBadge';
import { TrashIcon } from '@radix-ui/react-icons';
import RatingSummary from '@features/product/RatingSummary';

interface ProductTypesLocal extends FetchDataTypes {
  data: null | ProductTypes;
}

type SelectedImgsTypes = {
  isDirty: boolean;
  imgs: {
    id: string;
    data?: File;
    url: string;
  }[];
};

const formSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least 2 characters.',
  }),
  authors: z.array(
    z.object({
      _id: z.string(),
      authors_info: z.any(),
    })
  ),
  categories: z.any(),
  shortDescription: z.string(),
  marketplace: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
});
interface ProductRating {
  quantity: number;
  value: number;
  reviews: [];
}
interface EditingTypes extends PostDataTypes {
  isEditing: boolean;
}
export default function ProductPage() {
  const [activeThumb, setActiveThumb] = useState<SwiperType | null>(null);
  const [deleteDialogState, setDeleteDialogState] = useState(false);

  const [productState, setProductState] = useState<ProductTypesLocal>({
    isLoading: false,
    hasError: null,
    data: null,
  });
  const [newDescription, setNewDescription] = useState('');
  const [isMyProduct, setIsMyProduct] = useState(false);
  const { userData, fetchUserData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState<EditingTypes>({
    hasError: null,
    isLoading: false,
    isSuccess: false,
    isEditing: false,
  });
  const [selectedImgs, setSelectedImgs] = useState<SelectedImgsTypes>({
    imgs: [],
    isDirty: false,
  });
  const [imgsToRemove, setImgsToRemove] = useState<string[]>([]);
  const [imgsToAdd, setImgsToAdd] = useState<{ id: string; data: File }[]>([]);

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
  const [productRating, setProductRating] = useState<ProductRating>();

  const headerHeight = 124;
  const shortDescriptionRef = useRef<null | HTMLDivElement>(null);
  const detailsRef = useRef<null | HTMLDivElement>(null);
  const descriptionRef = useRef<null | HTMLDivElement>(null);
  const similarRef = useRef<null | HTMLDivElement>(null);
  const commentsRef = useRef<null | HTMLDivElement>(null);

  const productId = window.location.href.split('/').at(-1);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const fetchAllCategories = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.CATEGORY_ALL,
    });
    setCategoryState((prevState) => {
      return { ...prevState, options: [...data] };
    });
  }, []);

  const fetchComments = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.RATING_RATING,
      params: { targetId: productId },
    });
    setProductRating({
      quantity: data.quantity,
      value: data.avgRating,
      reviews: data.reviews,
    });
  }, [productId]);

  const fetchAllAuthors = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_AUTHORS,
    });
    setAuthorState((prevState) => {
      return { ...prevState, options: [...data] };
    });
  }, []);

  const fetchData = useCallback(async () => {
    setProductState((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_ONE,
      params: { _id: productId },
    });
    if (error) {
      errorToast(error);
      return setProductState((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setProductState({ data, isLoading: false, hasError: null });

    setSelectedImgs({ imgs: data.imgs, isDirty: false });
    setNewDescription(data.description);
    form.reset({
      title: data.title,
      authors: data.authors,
      categories: data.categories,
      price: data.price.value && Number(data.price.value.slice(1)),
      quantity: data.quantity,
      shortDescription: data.shortDescription,
      marketplace: data.marketplace,
    });
  }, [productId]);

  const clearForm = () => {
    setNewDescription(productState.data ? productState.data.description : '');
    setSelectedImgs({
      imgs: productState.data ? productState.data.imgs : [],
      isDirty: false,
    });
    form.reset({
      title: productState.data ? productState.data.title : '',
      shortDescription: productState.data
        ? productState.data.shortDescription
        : '',
      quantity: productState.data ? productState.data.quantity : 0,
      price: productState.data
        ? Number(productState.data.price.value.slice(1))
        : 0,
      marketplace: productState.data ? productState.data.marketplace : '',
      authors: productState.data ? productState.data.authors : [],
      categories: productState.data ? productState.data.categories : [],
    });
  };

  useEffect(() => {
    fetchData();
    fetchComments();
  }, [productId]);

  useEffect(() => {
    if (
      userData.data &&
      ((userData.data.role == UserRoleTypes.AUTHOR &&
        userData.data.author_info.my_products.find(
          (product: ProductTypes) => product._id === productState.data?._id
        )) ||
        userData.data.role == UserRoleTypes.ADMIN)
    ) {
      setIsMyProduct(true);
      fetchAllAuthors();
      fetchAllCategories();
    }
  }, [userData.data]);

  const removeImg = (clieckedId: string) => {
    const updatedImgs = [...selectedImgs.imgs];
    const indexToRemove = updatedImgs.findIndex(
      (item) => item.id === clieckedId
    );
    setImgsToRemove((prevState) => {
      return [...prevState, clieckedId];
    });
    if (indexToRemove !== -1) {
      const newArray = updatedImgs.filter((item) => item.id !== clieckedId);
      setSelectedImgs({ imgs: newArray, isDirty: true });
    }
  };

  const onImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    clickedId: string
  ) => {
    const newArray = [...selectedImgs.imgs];
    if (e.target.files && e.target.files[0]) {
      const index = selectedImgs.imgs.findIndex(
        (item) => item.id === clickedId
      );
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
      setSelectedImgs({ imgs: newArray, isDirty: true });
    }
  };

  const updateProductData = async () => {
    if (!userData.data) return;
    setIsEditing((prevState) => {
      return { ...prevState, isLoading: true };
    });

    let filteredImgs = selectedImgs.imgs;

    if (imgsToRemove.length > 0) {
      if (!productState.data) return;
      for (let i = 0; i < imgsToRemove.length; i++) {
        const checkIndex = productState.data.imgs.findIndex(
          (img) => img.id === imgsToRemove[i]
        );
        if (checkIndex != -1) {
          if (!productId) return;
          await useDeleteImg({
            imgId: imgsToRemove[i],
            ownerId: productId,
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
        const index = selectedImgs.imgs.findIndex(
          (img) => img.id === imgsToAdd[i].id
        );
        const url = await useUploadImg({
          ownerId: productId,
          selectedFile: imgsToAdd[i].data,
          targetLocation: 'Product_imgs',
          currentId: imgsToAdd[i].id,
        });
        if (url) {
          filteredImgs[index] = url;
        }
      }
    }

    const dirtyData = Object.fromEntries(
      Object.keys(form.formState.dirtyFields).map((x: string) => [
        x,
        form.getValues(x as keyof z.infer<typeof formSchema>),
      ])
    );
    if (newDescription !== newDescription) {
      dirtyData.description = newDescription;
    }

    if (selectedImgs.isDirty) {
      dirtyData.imgs = selectedImgs.imgs;
    }

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_UPDATE,
      body: { _id: productId, ...dirtyData },
    });

    if (error) {
      errorToast(error);
      return setIsEditing((prevState) => {
        return { ...prevState, hasError: error, isLoading: false };
      });
    }

    fetchData();
    setIsEditing({
      hasError: null,
      isEditing: false,
      isLoading: false,
      isSuccess: true,
    });
    setImgsToAdd([]);
    setImgsToRemove([]);
    setTimeout(() => {
      setIsEditing((prevState) => {
        return { ...prevState, isSuccess: false };
      });
    }, 2000);
  };

  const deleteHandler = async () => {
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_DELETE,
      body: { productId },
    });
    if (error) {
      return errorToast(error);
    }

    fetchUserData();
    navigate(-1);
  };

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const { addProductToCart, cartState } = useContext(CartContext);

  let itemCapacity = false;
  let itemBtnCapacity = false;

  const addToCartHandler = async () => {
    if (productId) {
      addProductToCart({
        productId: productId,
        productQuantity: selectedQuantity,
      });
      setSelectedQuantity(1);
    }
  };
  const incrementQuantityHandler = () => {
    if (productState.data && productState.data.quantity! <= selectedQuantity)
      return;
    setSelectedQuantity((prevState) => (prevState += 1));
  };
  const decrementQuantityHandler = () => {
    if (selectedQuantity <= 1) return;
    setSelectedQuantity((prevState) => (prevState -= 1));
  };

  const currentItem = cartState.products.find((product) => {
    return product.productData._id === productId;
  });
  if (!productState.data) return;
  if (currentItem) {
    itemCapacity =
      productState.data.quantity! <= selectedQuantity ||
      currentItem.inCartQuantity + selectedQuantity >=
        productState.data.quantity! ||
      false;
    itemBtnCapacity =
      productState.data.quantity! < selectedQuantity ||
      currentItem.inCartQuantity + selectedQuantity >
        productState.data.quantity! ||
      false;
  } else {
    itemCapacity = productState.data.quantity! <= selectedQuantity || false;
    itemBtnCapacity = productState.data.quantity! < selectedQuantity || false;
  }
  return (
    <section
      ref={shortDescriptionRef}
      className="relative min-h-[calc(100vh-64px)]"
    >
      {productState.isLoading && <LoadingCircle />}
      {productState.hasError && (
        <ErrorMessage message={productState.hasError} />
      )}
      {!productState.isLoading && productState.data && (
        <div className="flex flex-col gap-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateProductData)}>
              {isMyProduct && (
                <div className="mb-3 flex w-full justify-end gap-3">
                  <DeleteDialog
                    deleteHandler={deleteHandler}
                    openState={deleteDialogState}
                    openStateHandler={setDeleteDialogState}
                  >
                    <Button
                      variant={'destructive'}
                      size={'default'}
                      disabled={isEditing.isLoading}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </DeleteDialog>
                  {isEditing.isEditing && (
                    <Button
                      type="submit"
                      variant={'outline'}
                      disabled={isEditing.isLoading}
                      className="relative text-green-600 hover:text-green-600"
                    >
                      {isEditing.isLoading && <LoadingCircle />}
                      <span className={`${isEditing.isLoading && 'invisible'}`}>
                        Accept
                      </span>
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant={'outline'}
                    disabled={isEditing.isLoading}
                    onClick={() => {
                      clearForm();
                      setIsEditing((prevState) => {
                        return {
                          ...prevState,
                          isEditing: !prevState.isEditing,
                        };
                      });
                    }}
                  >
                    <span className={`${!isEditing.isEditing && 'invisible'}`}>
                      Cancel
                    </span>
                    <span
                      className={`${
                        isEditing.isEditing && 'invisible'
                      } absolute`}
                    >
                      Edit
                    </span>
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
                <div>
                  {isEditing.isEditing && (
                    <div className="mb-4 flex flex-wrap gap-4">
                      {selectedImgs.imgs.map((item) => (
                        <div
                          key={item.id}
                          className="group relative basis-1/4 cursor-pointer"
                          onClick={() => removeImg(item.id)}
                        >
                          <XCircleIcon className="absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-slate-200 opacity-75 transition-[opacity,filter] group-hover:opacity-100" />
                          <img
                            key={item.id}
                            id={item.id}
                            alt="Product preview remove img."
                            className="aspect-[4/3] w-full rounded-md object-cover brightness-[40%] transition group-hover:brightness-[20%]"
                            src={item.url}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedImgs.imgs.length > 0 ? (
                    <div className="space-y-3">
                      <Swiper
                        navigation={{
                          nextEl: `.swiper-thumbPreview-button-next`,
                          prevEl: `.swiper-thumbPreview-button-prev`,
                        }}
                        spaceBetween={12}
                        modules={[Navigation, Thumbs]}
                        grabCursor
                        thumbs={{
                          swiper:
                            activeThumb && !activeThumb.destroyed
                              ? activeThumb
                              : null,
                        }}
                        className="relative"
                      >
                        {selectedImgs.imgs.map((el, index) => {
                          return (
                            <SwiperSlide key={el.id} className="relative">
                              <Dialog>
                                {isEditing.isEditing && (
                                  <Label className="group absolute left-0 top-0 z-20 block h-full w-full cursor-pointer ">
                                    <Input
                                      name="file"
                                      accept=".jpg, .jpeg, .png"
                                      type="file"
                                      value={''}
                                      onChange={(e) => onImageChange(e, el.id)}
                                      className="hidden"
                                    />
                                    <img
                                      src={el.url}
                                      key={el.id}
                                      alt="product_img"
                                      className={`${
                                        isEditing.isEditing
                                          ? 'w-full brightness-50 transition-[filter] group-hover:brightness-[25%]'
                                          : ''
                                      } aspect-[4/3] rounded-md object-cover`}
                                    />

                                    <PlusCircleIcon className="absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 transform text-slate-300 opacity-95 brightness-95 transition-[opacity,filter] group-hover:opacity-100 group-hover:brightness-100" />
                                  </Label>
                                )}

                                <DialogTrigger className="block">
                                  <img
                                    src={el.url}
                                    key={el.id}
                                    alt="product_img"
                                    className={`aspect-[4/3] rounded-md object-cover`}
                                  />
                                </DialogTrigger>
                                <DialogContent className="w-screen max-w-[100vw] p-0 sm:w-auto sm:max-w-3xl">
                                  <Swiper
                                    navigation={{
                                      nextEl: `.swiper-preview-button-next`,
                                      prevEl: `.swiper-preview-button-prev`,
                                    }}
                                    pagination={{
                                      clickable: true,
                                      el: '.swiper-latest-news-pagination',
                                    }}
                                    grabCursor
                                    spaceBetween={4}
                                    initialSlide={index}
                                    nested={true}
                                    slidesPerView={'auto'}
                                    direction="horizontal"
                                    modules={[Pagination, Navigation]}
                                  >
                                    {selectedImgs.imgs.map((nestedImgs) => {
                                      return (
                                        <SwiperSlide key={nestedImgs.id}>
                                          <div className="relative">
                                            <img
                                              src={nestedImgs.url}
                                              alt={'Preview: ' + nestedImgs.id}
                                              className="aspect-[16/10] h-full w-full object-cover"
                                            />
                                          </div>
                                        </SwiperSlide>
                                      );
                                    })}
                                    <SwiperArrowRight elId="swiper-preview-button-next" />
                                    <SwiperArrowLeft elId="swiper-preview-button-prev" />
                                    <SwiperDots elId="swiper-latest-news-pagination" />
                                  </Swiper>
                                </DialogContent>
                              </Dialog>
                            </SwiperSlide>
                          );
                        })}
                        <SwiperArrowRight elId="swiper-thumbPreview-button-next" />
                        <SwiperArrowLeft elId="swiper-thumbPreview-button-prev" />
                      </Swiper>
                      <Swiper
                        onSwiper={setActiveThumb}
                        navigation={{
                          nextEl: '.swiper-thumbs-button-next',
                          prevEl: '.swiper-thumbs-button-prev',
                        }}
                        spaceBetween={12}
                        slidesPerView={5}
                        watchSlidesProgress={true}
                        modules={[Navigation, Thumbs]}
                      >
                        {selectedImgs.imgs.map((image) => (
                          <SwiperSlide key={image.id}>
                            <img
                              src={image.url}
                              alt={`Thumb ${image.id}`}
                              className="aspect-square cursor-pointer rounded-md object-cover"
                            />
                          </SwiperSlide>
                        ))}
                        {isEditing.isEditing && (
                          <SwiperSlide>
                            <div className="relative aspect-square rounded-md object-cover">
                              <Label className="absolute left-0 top-0 block h-full w-full">
                                <Input
                                  name="file"
                                  accept=".jpg, .jpeg, .png"
                                  type="file"
                                  value={''}
                                  onChange={(e) => onImageChange(e, v4())}
                                  className="hidden"
                                />
                                <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black/20 p-1 transition-colors duration-150 ease-out hover:bg-black/30">
                                  <PlusCircleIcon className="h-12 w-12" />
                                </div>
                              </Label>
                            </div>
                          </SwiperSlide>
                        )}
                        <SwiperArrowRight elId="swiper-thumbs-button-next" />
                        <SwiperArrowLeft elId="swiper-thumbs-button-prev" />
                      </Swiper>
                    </div>
                  ) : (
                    <div className="relative">
                      {isEditing.isEditing && (
                        <Label className="absolute left-0 top-0 block h-full w-full">
                          <Input
                            name="file"
                            accept=".jpg, .jpeg, .png"
                            type="file"
                            value={''}
                            onChange={(e) => onImageChange(e, v4())}
                            className="hidden"
                          />

                          <div className="flex h-full w-full cursor-pointer items-center justify-center rounded-md bg-black/30 p-1 transition-colors duration-150 ease-out hover:bg-black/40"></div>

                          <PlusCircleIcon className="absolute left-1/2 top-1/2 z-10 h-24 w-24 -translate-x-1/2 -translate-y-1/2 transform text-slate-300 opacity-95 brightness-95 transition-[opacity,filter] group-hover:opacity-100 group-hover:brightness-100" />
                        </Label>
                      )}
                      <img
                        src={
                          'https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167'
                        }
                        alt="product_img"
                        className="aspect-[4/3] rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
                <div className="sticky top-16">
                  {!isEditing.isEditing && (
                    <div>
                      <h2 className="text-4xl">{productState.data.title}</h2>
                      <div className="flex items-start gap-4">
                        <div>
                          Seller:{' '}
                          <Link
                            to={`/account/${productState.data.creatorData._id}`}
                            className={`${buttonVariants({
                              variant: 'link',
                            })}`}
                          >
                            {productState.data.creatorData.pseudonim}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 py-1">
                          <StarRating
                            rating={
                              productRating && productRating.value
                                ? productRating.value
                                : productState.data.rating.avgRating || 0
                            }
                            showOnly
                          />
                          <span className="pt-[3px] text-sm text-slate-400">
                            ({' '}
                            {productRating && productRating.value
                              ? productRating.quantity
                              : productState.data.rating.quantity || 0}{' '}
                            )
                          </span>
                        </div>
                      </div>
                      <div className="mb-2 flex gap-4">
                        <div>
                          In stock: <span>{productState.data.quantity}</span>
                        </div>
                        <MarketplaceBadge
                          type={productState.data.marketplace}
                        />
                      </div>
                      <div className="mb-2">
                        <h3 className="text-3xl">
                          {productState.data.price.value}
                        </h3>
                      </div>
                      <div className="mb-3">
                        <ProductForm
                          addToCartHandler={addToCartHandler}
                          decrementQuantityHandler={decrementQuantityHandler}
                          incrementQuantityHandler={incrementQuantityHandler}
                          isEditing={isEditing.isEditing}
                          itemBtnCapacity={itemBtnCapacity}
                          itemCapacity={itemCapacity}
                          productId={productId || ''}
                          productQuantity={productState.data.quantity}
                          selectedQuantity={selectedQuantity}
                          sold={productState.data.sold}
                        />
                      </div>
                      <div className="mb-2 grid grid-cols-2">
                        <span>Detailed information:</span>
                        <div>
                          <Button
                            variant={'link'}
                            type="button"
                            className="py-0"
                            onClick={() =>
                              window.scrollTo({
                                top:
                                  window.scrollY +
                                  detailsRef.current!.getBoundingClientRect()
                                    .top -
                                  headerHeight,
                                behavior: 'smooth',
                              })
                            }
                          >
                            Show
                          </Button>
                        </div>
                      </div>
                      <div className="mb-2 grid grid-cols-2">
                        <span>Commencement date: </span>
                        <span>{productState.data.createdAt.slice(0, 10)}</span>
                      </div>
                      <div className="mb-2 grid grid-cols-2">
                        <span>Authors: </span>
                        <div>
                          {productState.data.authors.map((author) => (
                            <Link
                              key={author._id}
                              to={`/account/${author._id}`}
                              className={`${buttonVariants({
                                variant: 'link',
                                size: 'clear',
                              })} mr-4`}
                            >
                              {author.author_info.pseudonim}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="mb-2 grid grid-cols-2">
                        <span>Short description: </span>
                        <div>{productState.data.shortDescription}</div>
                      </div>
                    </div>
                  )}
                  {isEditing.isEditing && (
                    <div>
                      <FormField
                        name="title"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the book's title that will be shown in the
                              offer.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="categories"
                        render={({ field }) => {
                          return (
                            <FormItem>
                              <FormLabel>Categories</FormLabel>
                              <FormControl>
                                <CreatableSelect
                                  {...field}
                                  isMulti
                                  options={categoryState.options}
                                  filterOption={(option, rawInput) => {
                                    const label = option.label.toLowerCase();
                                    const input = rawInput.toLowerCase();
                                    return label.includes(input);
                                  }}
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
                                        border:
                                          '1px var hsl(214, 30%, 95%) solid',
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
                      <FormField
                        name="shortDescription"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Short description</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormDescription>
                              This is the book's short description that will be
                              shown in the offer.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
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
                                        border:
                                          '1px var hsl(214, 30%, 95%) solid',
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
                          );
                        }}
                      />
                      <FormField
                        name="quantity"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              This is the book's quantity that will be shown in
                              the offer.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name="price"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              This is the book's price that will be shown in the
                              offer.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
          <section className="sticky top-[63px] z-10 -mx-4 bg-background shadow-sm sm:top-16">
            <article className="hidden items-center justify-around lg:flex">
              <div className="flex gap-4">
                <img
                  src={
                    productState.data.imgs.length > 0
                      ? productState.data.imgs[0].url
                      : 'https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167'
                  }
                  alt="bar_img"
                  className="aspect-square h-14 rounded-md object-cover"
                />
                <div>
                  <h4>{productState.data.title}</h4>
                  <span>{productState.data.price.value}</span>
                </div>
              </div>
              <div>
                <Button
                  variant={'link'}
                  onClick={() =>
                    window.scrollTo({
                      top:
                        window.scrollY +
                        shortDescriptionRef.current!.getBoundingClientRect()
                          .top -
                        headerHeight,
                      behavior: 'smooth',
                    })
                  }
                >
                  Overview
                </Button>
                <Button
                  variant={'link'}
                  onClick={() =>
                    window.scrollTo({
                      top:
                        window.scrollY +
                        detailsRef.current!.getBoundingClientRect().top -
                        headerHeight,
                      behavior: 'smooth',
                    })
                  }
                >
                  Details
                </Button>
                <Button
                  variant={'link'}
                  onClick={() =>
                    window.scrollTo({
                      top:
                        window.scrollY +
                        descriptionRef.current!.getBoundingClientRect().top -
                        headerHeight,
                      behavior: 'smooth',
                    })
                  }
                >
                  Description
                </Button>
                <Button
                  variant={'link'}
                  onClick={() =>
                    window.scrollTo({
                      top:
                        window.scrollY +
                        commentsRef.current!.getBoundingClientRect().top -
                        headerHeight,
                      behavior: 'smooth',
                    })
                  }
                >
                  Comments
                </Button>
              </div>
              <div>
                <ProductForm
                  addToCartHandler={addToCartHandler}
                  decrementQuantityHandler={decrementQuantityHandler}
                  incrementQuantityHandler={incrementQuantityHandler}
                  isEditing={isEditing.isEditing}
                  itemBtnCapacity={itemBtnCapacity}
                  itemCapacity={itemCapacity}
                  productId={productId || ''}
                  productQuantity={productState.data.quantity}
                  selectedQuantity={selectedQuantity}
                  sold={productState.data.sold}
                />
              </div>
            </article>
            <Accordion type="single" collapsible className="block lg:hidden">
              <AccordionItem value="item-1" className="px-4">
                <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]]:bg-background">
                  <div className="flex gap-4">
                    <img
                      src={
                        productState.data.imgs.length > 0
                          ? productState.data.imgs[0].url
                          : 'https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167'
                      }
                      alt="bar_img"
                      className="aspect-square h-14 rounded-md object-cover"
                    />
                    <div>
                      <h4>{productState.data.title}</h4>
                      <span className="text-base">
                        {productState.data.price.value}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mt-2">
                    <Button
                      variant={'link'}
                      onClick={() =>
                        window.scrollTo({
                          top:
                            window.scrollY +
                            shortDescriptionRef.current!.getBoundingClientRect()
                              .top -
                            headerHeight,
                          behavior: 'smooth',
                        })
                      }
                    >
                      Overview
                    </Button>
                    <Button
                      variant={'link'}
                      onClick={() =>
                        window.scrollTo({
                          top:
                            window.scrollY +
                            detailsRef.current!.getBoundingClientRect().top -
                            headerHeight,
                          behavior: 'smooth',
                        })
                      }
                    >
                      Details
                    </Button>
                    <Button
                      variant={'link'}
                      onClick={() =>
                        window.scrollTo({
                          top:
                            window.scrollY +
                            descriptionRef.current!.getBoundingClientRect()
                              .top -
                            headerHeight,
                          behavior: 'smooth',
                        })
                      }
                    >
                      Description
                    </Button>
                    <Button
                      variant={'link'}
                      onClick={() =>
                        window.scrollTo({
                          top:
                            window.scrollY +
                            commentsRef.current!.getBoundingClientRect().top -
                            headerHeight,
                          behavior: 'smooth',
                        })
                      }
                    >
                      Comments
                    </Button>
                  </div>
                  <div className="mt-2">
                    <ProductForm
                      addToCartHandler={addToCartHandler}
                      decrementQuantityHandler={decrementQuantityHandler}
                      incrementQuantityHandler={incrementQuantityHandler}
                      isEditing={isEditing.isEditing}
                      itemBtnCapacity={itemBtnCapacity}
                      itemCapacity={itemCapacity}
                      productId={productId || ''}
                      productQuantity={productState.data.quantity}
                      selectedQuantity={selectedQuantity}
                      sold={productState.data.sold}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
          <article ref={detailsRef}>
            <h3 className="mb-2 text-4xl">Details:</h3>
            <div className="mb-2 grid grid-cols-2">
              <span>Title: </span>
              <div>{productState.data.title}</div>
            </div>
            <div className="mb-2 grid grid-cols-2">
              <span>Authors: </span>
              <div>
                {productState.data.authors.map((author) => (
                  <Link
                    key={author._id}
                    to={`/account/${author._id}`}
                    className={`${buttonVariants({
                      variant: 'link',
                      size: 'clear',
                    })} mr-4`}
                  >
                    {author.author_info.pseudonim}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-2 grid grid-cols-2">
              <span>Categories: </span>
              <div>
                {productState.data.categories.map((category) => (
                  <Link
                    key={category._id}
                    to={{
                      pathname: '/search',
                      search: `category=${category.value}`,
                    }}
                    className={`${buttonVariants({
                      variant: 'link',
                      size: 'clear',
                    })} mr-4`}
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mb-2 grid grid-cols-2">
              <span>Short description: </span>
              <div>{productState.data.shortDescription}</div>
            </div>
          </article>
          <div ref={descriptionRef}>
            <ProductDescription
              show={isEditing.isEditing}
              descriptionToShow={productState.data.description}
              newDescription={newDescription}
              setNewDescription={setNewDescription}
            />
          </div>
          <div ref={similarRef}>
            <SimilarProducts
              authorId={productState.data.authors[0]._id}
              authorPseudonim={
                productState.data.authors[0].author_info.pseudonim
              }
            />
          </div>
          <div ref={commentsRef} className="space-y-5">
            <h3 className="text-4xl border-b-2 border-border inline-block">
              Comments
            </h3>
            {productRating && (
              <RatingSummary
                avgRating={productRating.value}
                quantity={productRating.quantity}
                reviews={productRating.reviews}
              />
            )}
            <Comments
              starRating
              target="Product"
              targetId={productState.data._id}
              updateTargetData={fetchComments}
            />
          </div>
        </div>
      )}
    </section>
  );
}
