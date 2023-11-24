import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button, buttonVariants } from '@components/UI/button';
import { Dialog, DialogContent, DialogTrigger } from '@components/UI/dialog';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import errorToast from '@components/UI/error/errorToast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/UI/form';
import { Input } from '@components/UI/input';
import SushiSwiper from '@components/swiper/SushiSwiper';
import { UserContext } from '@context/UserProvider';
import {
  CollectionObjectTypes,
  FetchDataTypes,
  PostDataTypes,
} from '@customTypes/interfaces';
import { UserRoleTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import Comments from '@features/comments/Comments';
import StarRating from '@features/rating/StarRating';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';
import CollectionForm from './CollectionForm';
import { Navigation, Pagination, Thumbs } from 'swiper';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import { Textarea } from '@components/UI/textarea';
import { CartContext } from '@context/CartProvider';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/UI/accordion';

interface CollectionTypes extends FetchDataTypes {
  data: null | CollectionObjectTypes;
}

const formSchema = z.object({
  title: z.string().nonempty(),
  shortDescription: z.string(),
  quantity: z.number(),
  price: z.number(),
});

interface EditingTypes extends PostDataTypes {
  isEditing: boolean;
}

export default function CollectionPage() {
  const [activeThumb, setActiveThumb] = useState<SwiperType | null>(null);
  const [deleteDialogState, setDeleteDialogState] = useState(false);
  const [collection, setCollection] = useState<CollectionTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });
  const [newDescription, setNewDescription] = useState('');
  const [isMyCollection, setIsMyCollection] = useState(false);
  const { userData, fetchUserData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState<EditingTypes>({
    hasError: null,
    isLoading: false,
    isSuccess: false,
    isEditing: false,
  });

  const headerHeight = 124;
  const shortDescriptionRef = useRef<null | HTMLDivElement>(null);
  const detailsRef = useRef<null | HTMLDivElement>(null);
  const descriptionRef = useRef<null | HTMLDivElement>(null);
  const similarRef = useRef<null | HTMLDivElement>(null);
  const commentsRef = useRef<null | HTMLDivElement>(null);

  const collectionId = window.location.href.split('/').at(-1);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const fetchData = useCallback(async () => {
    setCollection((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_ONE,
      params: { _id: collectionId },
    });

    if (error) {
      errorToast(error);
      return setCollection({ data: null, hasError: error, isLoading: false });
    }
    setCollection({ data, hasError: null, isLoading: false });

    setNewDescription(data.description);
    form.reset({
      title: data.title,
      shortDescription: data.shortDescription,
      quantity: data.quantity,
      price: Number(data.price.value.slice(1)),
    });
  }, []);

  const clearForm = () => {
    form.reset({
      title: collection.data ? collection.data.title : '',
      shortDescription: collection.data ? collection.data.shortDescription : '',
      quantity: collection.data ? collection.data.quantity : 0,
      price: collection.data ? Number(collection.data.price.value.slice(1)) : 0,
    });
  };

  useEffect(() => {
    if (
      userData.data &&
      ((userData.data.role == UserRoleTypes.ADMIN &&
        userData.data.author_info.myCollections.find(
          (collection: CollectionObjectTypes) => collection._id === collectionId
        )) ||
        userData.data.role == UserRoleTypes.ADMIN)
    ) {
      setIsMyCollection(true);
    }
  }, [userData.data]);

  useEffect(() => {
    fetchData();
  }, []);

  const updateDataHandler = async () => {
    if (!userData.data) return;
    setIsEditing((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const dirtyData = Object.fromEntries(
      Object.keys(form.formState.dirtyFields).map((x: string) => [
        x,
        form.getValues(x as keyof z.infer<typeof formSchema>),
      ])
    );

    const { error } = await usePostAccessDatabase({
      url: '#',
      body: { collectionId, description: newDescription, ...dirtyData },
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
    setTimeout(() => {
      setIsEditing((prevState) => {
        return { ...prevState, isSuccess: false };
      });
    }, 2000);
  };

  const deleteHandler = async () => {
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_DELETE,
      body: { collectionId },
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

  const addToCartHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('object');
    if (collectionId) {
      console.log(collectionId);
      addProductToCart({
        productId: collectionId,
        productQuantity: selectedQuantity,
        type: 'shop',
      });
      setSelectedQuantity(1);
    }
  };
  const incrementQuantityHandler = () => {
    if (collection.data && collection.data.quantity! <= selectedQuantity)
      return;
    setSelectedQuantity((prevState) => (prevState += 1));
  };
  const decrementQuantityHandler = () => {
    if (selectedQuantity <= 1) return;
    setSelectedQuantity((prevState) => (prevState -= 1));
  };

  const currentItem = cartState.products.find((product) => {
    return product.productData._id === collectionId;
  });
  if (!collection.data) return;
  if (currentItem) {
    itemCapacity =
      collection.data.quantity! <= selectedQuantity ||
      currentItem.inCartQuantity + selectedQuantity >=
        collection.data.quantity! ||
      false;
    itemBtnCapacity =
      collection.data.quantity! < selectedQuantity ||
      currentItem.inCartQuantity + selectedQuantity >
        collection.data.quantity! ||
      false;
  } else {
    itemCapacity = collection.data.quantity! <= selectedQuantity || false;
    itemBtnCapacity = collection.data.quantity! < selectedQuantity || false;
  }

  return (
    <section ref={shortDescriptionRef} className="relative">
      {collection.isLoading && <LoadingCircle />}
      {collection.hasError && <ErrorMessage message={collection.hasError} />}
      {collection.data && (
        <div className="space-y-10">
          {isMyCollection && (
            <div className="mb-3 flex w-full justify-end gap-3">
              <DeleteDialog
                deleteHandler={deleteHandler}
                openState={deleteDialogState}
                openStateHandler={setDeleteDialogState}
              />
              <Button
                type="button"
                variant={'outline'}
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
                {isEditing.isEditing ? 'Cancel' : 'Edit'}
              </Button>
              {isEditing.isEditing && (
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {collection.data.imgs ? (
              <div className="space-y-3">
                <Swiper
                  navigation={{
                    nextEl: `.swiper-productImage-button-next`,
                    prevEl: `.swiper-productImage-button-prev`,
                  }}
                  loop
                  spaceBetween={12}
                  modules={[Navigation, Thumbs]}
                  grabCursor
                  thumbs={{
                    swiper:
                      activeThumb && !activeThumb.destroyed
                        ? activeThumb
                        : null,
                  }}
                >
                  {collection.data.imgs.map((el, index) => {
                    return (
                      <SwiperSlide key={el.id}>
                        <Dialog>
                          <DialogTrigger className="block">
                            <img
                              src={el.url}
                              key={index}
                              alt="product_img"
                              className="aspect-[4/3] rounded-md object-cover"
                            />
                          </DialogTrigger>
                          <DialogContent className="w-[100vw] max-w-[100vw] overflow-y-hidden p-0 sm:w-auto sm:max-w-3xl">
                            <Swiper
                              navigation={{
                                nextEl: `.swiper-bigProductImg-button-next`,
                                prevEl: `.swiper-bigProductImg-button-prev`,
                              }}
                              grabCursor
                              loop
                              initialSlide={index}
                              nested={true}
                              slidesPerView={'auto'}
                              pagination={{
                                clickable: true,
                              }}
                              direction="horizontal"
                              modules={[Pagination, Navigation]}
                            >
                              {collection.data!.imgs.map((nestedImgs) => {
                                return (
                                  <SwiperSlide key={nestedImgs.id}>
                                    <div className="relative">
                                      <img
                                        src={nestedImgs.url}
                                        alt={'Preview: ' + nestedImgs.id}
                                        className="aspect-square h-full w-full object-cover"
                                      />
                                    </div>
                                  </SwiperSlide>
                                );
                              })}
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
                  })}
                  <div
                    className={`swiper-button-next swiper-productImage-button-next color-primary right-0 flex items-center justify-center rounded-full bg-white p-8 opacity-90 backdrop-blur-sm`}
                  ></div>
                  <div
                    className={`swiper-button-prev swiper-productImage-button-prev color-primary left-0 flex items-center justify-center rounded-full bg-white p-8 opacity-90 backdrop-blur-sm`}
                  ></div>
                </Swiper>
                <Swiper
                  onSwiper={setActiveThumb}
                  spaceBetween={12}
                  slidesPerView={5}
                  watchSlidesProgress={true}
                  modules={[Navigation, Thumbs]}
                >
                  {collection.data.imgs.map((image) => (
                    <SwiperSlide key={image.id}>
                      <img
                        src={image.url}
                        alt={`Thumb ${image.id}`}
                        className="aspect-square rounded-md object-cover"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <img
                src={
                  'https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167'
                }
                alt="product_img"
                className="aspect-[4/3] rounded-md object-cover"
              />
            )}
            {!isEditing.isEditing && (
              <div>
                <h2 className="text-4xl">{collection.data.title}</h2>
                <div className="flex items-start gap-4">
                  <div>
                    Seller:{' '}
                    <Link
                      to={`/account/${collection.data.creatorData._id}`}
                      className={`${buttonVariants({
                        variant: 'link',
                      })}`}
                    >
                      {collection.data.creatorData.pseudonim}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 py-1">
                    <StarRating
                      rating={collection.data.rating.avgRating}
                      showOnly
                    />
                    <span className="pt-[3px] text-sm text-slate-400">
                      ( {collection.data.rating.quantity} )
                    </span>
                  </div>
                </div>
                <div className="mb-2">
                  In stock: <span>{collection.data.quantity}</span>
                </div>
                <div className="mb-2">
                  <h3 className="text-3xl">{collection.data.price.value}</h3>
                </div>
                <div className="mb-3">
                  <CollectionForm
                    addToCartHandler={(e) => addToCartHandler(e)}
                    decrementQuantityHandler={decrementQuantityHandler}
                    incrementQuantityHandler={incrementQuantityHandler}
                    isEditing={isEditing.isEditing}
                    itemBtnCapacity={itemBtnCapacity}
                    itemCapacity={itemCapacity}
                    productId={collectionId || ''}
                    productQuantity={collection.data.quantity}
                    selectedQuantity={selectedQuantity}
                    sold={collection.data.sold}
                  />
                </div>
                <div className="mb-2 grid grid-cols-2">
                  <span>Detailed information:</span>
                  <div>
                    <Button
                      variant={'link'}
                      className="py-0"
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
                      Show
                    </Button>
                  </div>
                </div>
                <div className="mb-2 grid grid-cols-2">
                  <span>Commencement date: </span>
                  <span>{collection.data.createdAt.slice(0, 10)}</span>
                </div>
                <div className="mb-2 grid grid-cols-2">
                  <span>Authors: </span>
                  <div>
                    {collection.data.authors.map((author) => (
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
                  <div>{collection.data.shortDescription}</div>
                </div>
              </div>
            )}
            {isEditing.isEditing && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(updateDataHandler)}>
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
                          This is the book's quantity that will be shown in the
                          offer.
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
                </form>
              </Form>
            )}
          </div>
          <section className="sticky top-[63px] z-10 -mx-4 bg-background shadow-sm sm:top-16">
            <article className="hidden items-center justify-around lg:flex">
              <div className="flex gap-4">
                <img
                  src={collection.data.imgs[0].url}
                  alt="bar_img"
                  className="aspect-square h-14 rounded-md object-cover"
                />
                <div>
                  <h4>{collection.data.title}</h4>
                  <span>{collection.data.price.value}</span>
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
                <CollectionForm
                  addToCartHandler={(e) => addToCartHandler(e)}
                  decrementQuantityHandler={decrementQuantityHandler}
                  incrementQuantityHandler={incrementQuantityHandler}
                  isEditing={isEditing.isEditing}
                  itemBtnCapacity={itemBtnCapacity}
                  itemCapacity={itemCapacity}
                  productId={collectionId || ''}
                  productQuantity={collection.data.quantity}
                  selectedQuantity={selectedQuantity}
                  sold={collection.data.sold}
                />
              </div>
            </article>
            <Accordion
              type="single"
              collapsible
              onClick={() => console.log('first')}
              className="block lg:hidden"
            >
              <AccordionItem value="item-1" className="px-4">
                <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]]:bg-background">
                  <div className="flex gap-4">
                    <img
                      src={collection.data.imgs[0].url}
                      alt="bar_img"
                      className="aspect-square h-14 rounded-md object-cover"
                    />
                    <div>
                      <h4>{collection.data.title}</h4>
                      <span className="text-base">
                        {collection.data.price.value}
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
                    <CollectionForm
                      addToCartHandler={(e) => addToCartHandler(e)}
                      decrementQuantityHandler={decrementQuantityHandler}
                      incrementQuantityHandler={incrementQuantityHandler}
                      isEditing={isEditing.isEditing}
                      itemBtnCapacity={itemBtnCapacity}
                      itemCapacity={itemCapacity}
                      productId={collectionId || ''}
                      productQuantity={collection.data.quantity}
                      selectedQuantity={selectedQuantity}
                      sold={collection.data.sold}
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
              <div>{collection.data.title}</div>
            </div>
            <div className="mb-2 grid grid-cols-2">
              <span>Authors: </span>
              <div>
                {collection.data.authors.map((author) => (
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
                {collection.data.categories.map((category) => (
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
              <div>{collection.data.shortDescription}</div>
            </div>
            <span className="mb-2">Contains:</span>
            <SushiSwiper
              arrayOfItems={collection.data.products}
              itemsType="shop"
              swiperCategory="products"
            />
          </article>
          <article ref={descriptionRef}>
            <h3 className="mb-2 text-4xl">Description</h3>
            <div>
              {isEditing.isEditing ? (
                <CKEditor
                  editor={ClassicEditor}
                  data={newDescription}
                  config={{
                    mediaEmbed: { previewsInData: true },
                    toolbar: {
                      shouldNotGroupWhenFull: true,
                      items: [
                        'alignment',
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',

                        'blockQuote',
                        'insertTable',
                        'mediaEmbed',
                        'undo',
                        'redo',
                      ],
                    },
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setNewDescription(data);
                  }}
                />
              ) : (
                <article className="prose">
                  {parse(collection.data.description)}
                </article>
              )}
            </div>
          </article>
          <article ref={commentsRef}>
            <Comments
              withRating
              target="Collection"
              targetId={collection.data._id}
            />
          </article>
        </div>
      )}
    </section>
  );
}
