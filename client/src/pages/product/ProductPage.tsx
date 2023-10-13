import {
  ChangeEvent,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AuthorTypes,
  ProductCategories,
  UnknownProductTypes,
} from '@customTypes/interfaces';
import { UserContext } from '@context/UserProvider';
import ProductPill from './ProductPill';
import StarRating from '@features/starRating/StarRating';
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
interface ProductTypes {
  isLoading: boolean;
  data: null | UnknownProductTypes;
}
interface ProductEditTypes {
  isEditing: boolean;
  data: {
    title: null | string;
    price: null | number;
    categories: null | { value: string; label: string; _id: string }[];
    authors: null | AuthorTypes[];
    quantity: null | number;
    description: null | string;
  };
}

interface CommentTypes {
  value: string;
  isAdding: boolean;
}

export default function ProductPage() {
  const [productState, setProductState] = useState<ProductTypes>({
    isLoading: false,
    data: null,
  });
  const [isMyProduct, setIsMyProduct] = useState(false);
  const [newSelectedImgs, setNewSelectedImgs] = useState([]);
  const [productEditState, setProductEditState] = useState<ProductEditTypes>({
    isEditing: false,
    data: {
      title: null,
      price: null,
      categories: null,
      authors: null,
      quantity: null,
      description: null,
    },
  });

  const { userData, fetchUserData } = useContext(UserContext);
  const { toast } = useToast();
  const navigate = useNavigate();
  const path = useLocation();

  let unPreparedProdId: string | any[] | null = null;
  unPreparedProdId = path.pathname.split('/');
  const prodId: string = unPreparedProdId[unPreparedProdId.length - 1];

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
      };
    });
    setProductState({ data, isLoading: false });
  }, [prodId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (
      userData &&
      userData.role !== 'User' &&
      userData.author_info.my_products.find(
        (product: UnknownProductTypes) => product._id === productState.data?._id
      )
    ) {
      setIsMyProduct(true);
    }
  }, [userData, productState]);

  const newDataChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setProductEditState((prevState) => {
      return {
        ...prevState,
        data: {
          ...prevState.data,
          [e.target.name]: e.target.value,
        },
      };
    });
  };

  const updateProductData = async () => {
    if (productState.data) {
      setProductEditState((prevState) => {
        return { ...prevState, isEditing: true };
      });
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.PRODUCT_UPDATE,
        body: {
          _id: productState.data._id,
          market_place: productState.data.market_place,
          title: productEditState.data.title,
          price: productEditState.data.price,
          quantity: productEditState.data.quantity,
          description: productEditState.data.description,
        },
      });
      await fetchData();
      setProductEditState((prevState) => {
        return { ...prevState, isEditing: false };
      });
    }
  };

  const toggleEditting = () => {
    if (productEditState.isEditing) {
      setProductEditState((prevState) => {
        return { ...prevState, isEditing: false };
      });
    } else {
      setProductEditState((prevState) => {
        return { ...prevState, isEditing: true };
      });
    }
  };

  const deleteItemHandler = async () => {
    if (productState.data) {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.PRODUCT_DELETE,
        body: { _id: productState.data._id, userId: userData?._id },
      });
      fetchUserData();
      navigate(-1);
    }
  };
  console.log(productEditState);
  const uploadNewImgs = () => {};
  if (!productState.data) return <></>;
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
              <Dialog>
                {<div className="absolute">{'newimg'}</div>}
                <DialogTrigger className="mx-auto block">
                  <img
                    src={productState.data.imgs[0]}
                    className="mx-auto aspect-square h-full w-full max-w-[500px] rounded-xl object-cover lg:xl:w-[90%] xl:w-[80%]"
                  />
                </DialogTrigger>
                <DialogContent>
                  <img
                    src={productState.data.imgs[0]}
                    className="mx-auto aspect-square h-full w-full max-w-[500px] rounded-xl object-cover lg:xl:w-[90%] xl:w-[80%]"
                  />
                </DialogContent>
              </Dialog>
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
                  <SuspenseComponent fallback={<LoadingCircle isLoading />}>
                    {productState.data.imgs.map((el, index) => {
                      if (index !== 0) {
                        return (
                          <SwiperSlide className="pr-6">
                            <Dialog>
                              <DialogTrigger className="block">
                                <img
                                  src={el}
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
                                    fallback={<LoadingCircle isLoading />}
                                  >
                                    {!productState.data && 'No items'}
                                    {productState.data && productState.data.imgs
                                      ? productState.data.imgs.map(
                                          (nestedImgs, nestedIndex) => {
                                            if (nestedIndex === 0) return;
                                            return (
                                              <SwiperSlide key={nestedIndex}>
                                                <div className="relative">
                                                  <img
                                                    src={nestedImgs}
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
                          </SwiperSlide>
                        );
                      }
                    })}
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
          <div className="relative mb-3 w-full">
            <ProductPill
              text={productState.data && productState.data.market_place}
            />
            {(isMyProduct ||
              (userData && userData.role === UserRoleTypes.ADMIN)) && (
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
                        Deleting this will permamently remove the item from the
                        database.
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
                    type="button"
                    onClick={() => updateProductData()}
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
                <Input
                  name="title"
                  type="text"
                  value={productEditState.data.title || ''}
                  className="border-1 border"
                  onChange={(e) => newDataChangeHandler(e)}
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
                {productState.data &&
                  !productState.isLoading &&
                  productState.data.categories &&
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
                {productState.isLoading && (
                  <Skeleton className="h-4"></Skeleton>
                )}
              </div>
              <div>
                Added:{' '}
                {productState.data && productState.data.created_at.slice(0, 10)}
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
                <p>Authors:</p>
                {!productState.isLoading &&
                  productState.data &&
                  productState.data.authors.map((author) => (
                    <Link
                      key={author._id}
                      className="pr-4"
                      to={`/account/${author._id}`}
                    >
                      {author.author_info.pseudonim}
                    </Link>
                  ))}
                {productState.isLoading && <Skeleton className="h-4" />}
              </div>
              <p className="text-sm">Highest Rated Product</p>
              <div className="">
                <StarRating
                  showOnly
                  rating={
                    productState.data?.rating
                      ? productState.data.rating.rating
                      : 0
                  }
                />
              </div>
              <span className="text-sm">
                votes:{' '}
                {productState.data?.rating ? productState.data.rating.count : 0}
              </span>
            </div>
            <div>
              {productEditState.isEditing ? (
                <Input
                  name="price"
                  type="text"
                  value={productEditState.data.price || 0}
                  className="h-min"
                  onChange={(e) => newDataChangeHandler(e)}
                />
              ) : (
                !productState.isLoading && (
                  <p className="text-xl font-bold">
                    {productState.data &&
                      productState.data.shop_info &&
                      productState.data.shop_info.price}
                    €
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
                <Input
                  type="number"
                  name="quantity"
                  value={productEditState.data.quantity || 0}
                  onChange={(e) => newDataChangeHandler(e)}
                  className="inline-block w-auto max-w-[70px]"
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
              <h6 className="mb-1">Description: </h6>

              {productEditState.isEditing ? (
                <Textarea
                  name="description"
                  className="resize-none"
                  value={productEditState.data.description || ''}
                  onChange={(e) => newDataChangeHandler(e)}
                />
              ) : (
                !productState.isLoading && (
                  <p>{productState.data && productState.data.description}</p>
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

          <ProductForm
            productId={productState.data?._id}
            productQuantity={productState.data?.quantity}
            sold={(productState.data && productState.data.sold) || false}
          />
        </div>
      </div>
      {prodId && (
        <Comments
          withRating={true}
          target={'Product'}
          targetId={prodId}
          updateProductStatus={fetchData}
        />
      )}
    </MainContainer>
  );
}
