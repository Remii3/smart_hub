import {
  ChangeEvent,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthorTypes, UnknownProductTypes } from '@customTypes/interfaces';
import { UserContext } from '@context/UserProvider';
import ProductImage from '@features/product/ProductImage';
import ProductPill from '@features/product/ProductPill';
import StarRating from '@features/product/StarRating';
import ProductForm from '@features/product/ProductForm';
import { Button } from '@components/UI/button';
import LoadingCircle from '@components/Loaders/LoadingCircle';
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
} from '../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../data/endpoints';

interface ProductTypes {
  isLoading: boolean;
  data: null | UnknownProductTypes;
}
interface ProductEditTypes {
  isMyProduct: boolean;
  isEditing: boolean;
  newData: {
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
  const [productEditState, setProductEditState] = useState<ProductEditTypes>({
    isMyProduct: false,
    isEditing: false,
    newData: {
      title: null,
      price: null,
      categories: null,
      authors: null,
      quantity: null,
      description: null,
    },
  });
  const [commentState, setCommentState] = useState<CommentTypes>({
    value: '',
    isAdding: false,
  });

  const { fetchUserData } = useContext(UserContext);
  const { userData } = useContext(UserContext);

  const navigate = useNavigate();
  const path = useLocation();

  let prodId: string | any[] | null = null;
  prodId = path.pathname.split('/');
  prodId = prodId[prodId.length - 1];

  const fetchData = useCallback(async () => {
    setProductState((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_ONE,
      params: { productId: prodId },
    });

    setProductEditState((prevState) => {
      return {
        ...prevState,
        newData: {
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
      setProductEditState((prevState) => {
        return { ...prevState, isMyProduct: true };
      });
    }
  }, [userData]);

  const newDataChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setProductEditState((prevState) => {
      return {
        ...prevState,
        newData: {
          ...prevState.newData,
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
          title: productEditState.newData.title,
          price: productEditState.newData.price,
          quantity: productEditState.newData.quantity,
          description: productEditState.newData.description,
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
      fetchData();
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
        body: { _id: productState.data._id },
      });
      fetchUserData();
      navigate(-1);
    }
  };

  const addNewCommentHandler = async () => {
    setCommentState((prevState) => {
      return { ...prevState, isAdding: true };
    });
    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ONE,
      body: {
        userId: userData?._id,
        productId: prodId,
        value: { rating: 2, text: commentState.value },
      },
    });
    setCommentState({ isAdding: false, value: '' });
    fetchData();
  };

  if (!productState.data && productState.isLoading) return <p>Loading</p>;
  if (!productState.data && !productState.isLoading) return <p> No data</p>;
  return (
    <section className="relative">
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              <ProductImage />
              <div className="grid grid-cols-2 gap-4 lg:mt-4">
                {[...Array(4)].map((el, index) => (
                  <ProductImage key={index} />
                ))}
              </div>
            </div>
          </div>

          <div className="sticky top-24">
            <div className="relative mb-3 w-full">
              <ProductPill
                text={productState.data && productState.data.market_place}
              />
              {productEditState.isMyProduct && (
                <div className="absolute right-0 top-0 flex gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="text-red-400">
                        Delete
                      </button>
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
                        <button
                          type="button"
                          onClick={() => deleteItemHandler()}
                          className="rounded-md bg-red-500 px-3 py-1 text-white"
                        >
                          Delete
                        </button>
                        <DialogTrigger asChild>
                          <button type="button">Cancel</button>
                        </DialogTrigger>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <button
                    type="button"
                    className="inline-block rounded-md border border-gray-300 px-2"
                    onClick={toggleEditting}
                  >
                    {productEditState.isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  {productEditState.isEditing && (
                    <button
                      type="button"
                      className="inline-block rounded-md border border-gray-300 px-2 text-green-500"
                      onClick={() => updateProductData()}
                    >
                      Accept
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-between">
              <div className="max-w-[35ch] space-y-2">
                {productEditState.isEditing ? (
                  <input
                    name="title"
                    type="text"
                    value={productEditState.newData.title || ''}
                    className="border-1 border"
                    onChange={(e) => newDataChangeHandler(e)}
                  />
                ) : (
                  <h1 className="text-xl font-bold sm:text-3xl">
                    {productState.data && productState.data.title}
                  </h1>
                )}
                <div>
                  {productEditState.newData.categories?.map((category) => (
                    <Link
                      key={category._id}
                      to={{
                        pathname: '/search',
                        search: `category=${category.label}`,
                      }}
                      className="pr-2"
                    >
                      {category.label}
                    </Link>
                  ))}
                </div>
                <div>
                  Added:{' '}
                  {productState.data &&
                    productState.data.created_at.slice(0, 10)}
                </div>
                <div>
                  <p>Authors:</p>
                  {productState.data &&
                    productState.data.authors.map((author) => (
                      <Link
                        key={author._id}
                        className="pr-4"
                        to={`/account/${author._id}`}
                      >
                        {author.author_info.pseudonim}
                      </Link>
                    ))}
                </div>
                <p className="text-sm">Highest Rated Product</p>

                <StarRating />
              </div>
              {productEditState.isEditing ? (
                <input
                  name="price"
                  type="number"
                  value={productEditState.newData.price || 0}
                  className="h-min"
                  onChange={(e) => newDataChangeHandler(e)}
                />
              ) : (
                <p className="text-xl font-bold">
                  {productState.data &&
                    productState.data.shop_info &&
                    productState.data.shop_info.price}
                  €
                </p>
              )}
            </div>

            <div className="mt-4">
              <div className="max-w-none">
                <span>Available: </span>
                {productEditState.isEditing ? (
                  <input
                    name="quantity"
                    value={productEditState.newData.quantity || 0}
                    onChange={(e) => newDataChangeHandler(e)}
                  />
                ) : (
                  <span>{productState.data && productState.data.quantity}</span>
                )}
              </div>
              <div className="prose max-w-none">
                {productEditState.isEditing ? (
                  <textarea
                    name="description"
                    className="resize-none"
                    value={productEditState.newData.description || ''}
                    onChange={(e) => newDataChangeHandler(e)}
                  />
                ) : (
                  <p>{productState.data && productState.data.description}</p>
                )}
              </div>

              {productState.data &&
                productState.data.description &&
                productState.data.description.length > 600 && (
                  <button
                    type="button"
                    className="mt-2 text-sm font-medium underline"
                  >
                    Read More
                  </button>
                )}
            </div>

            <ProductForm
              productId={productState.data?._id}
              productQuantity={productState.data?.quantity}
              sold={(productState.data && productState.data.sold) || false}
            />
          </div>
        </div>
        <div className="mt-8">
          <h5 className="pb-2">Comments</h5>
          <section className="mb-16">
            <div className="flex flex-col-reverse gap-8 md:flex-row">
              <div>
                <p className="mb-3">rating</p>
                <div className="flex gap-4">
                  <img src="#" alt="profile_img" />
                  <p>{userData?.username}</p>
                </div>
              </div>
              <div className="] w-full max-w-[580px] overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                <label htmlFor="newComment" className="sr-only">
                  New comment
                </label>
                <textarea
                  id="newComment"
                  className="w-full resize-none border-none align-top focus:ring-0 sm:text-sm"
                  name="newComment"
                  rows={4}
                  placeholder="Enter new comment..."
                  value={commentState.value}
                  onChange={(e) =>
                    setCommentState((prevState) => {
                      return { ...prevState, value: e.target.value };
                    })
                  }
                />

                <div className="flex items-center justify-end gap-2 bg-white p-3">
                  <Button
                    variant="default"
                    disabled={!userData?._id}
                    onClick={() => addNewCommentHandler()}
                  >
                    <LoadingCircle isLoading={commentState.isAdding}>
                      Publish
                    </LoadingCircle>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section>
            {productState.data &&
              productState.data.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="mb-8 flex w-full flex-col-reverse gap-8 rounded-md bg-gray-50 p-4 sm:flex-row"
                >
                  <div>
                    <p className="mb-3">{comment.value.rating}</p>
                    <div className="flex gap-4">
                      <img src="#" alt="profile_img" />
                      <p className="font-semibold">{comment.user.username}</p>
                    </div>
                  </div>
                  <div className="flex w-full flex-col gap-4">
                    <div className="flex justify-end">
                      <small className="text-sm">
                        {comment.created_at.slice(0, 10)}
                      </small>
                    </div>
                    <div>{comment.value.text}</div>
                  </div>
                </div>
              ))}
          </section>
        </div>
      </div>
    </section>
  );
}
