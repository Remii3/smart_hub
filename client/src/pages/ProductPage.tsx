import {
  ChangeEvent,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UnknownProductTypes } from '../types/interfaces';
import { UserContext } from '../context/UserProvider';
import CustomDialog from '../components/UI/headlessUI/CustomDialog';
import ProductImage from '../components/product/ProductImage';
import ProductPill from '../components/product/ProductPill';
import StarRating from '../components/product/StarRating';
import ProductForm from '../components/product/ProductForm';
import { Button } from '../components/UI/Btns/Button';
import LoadingCircle from '../components/UI/Loaders/LoadingCircle';

export default function ProductPage() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isMyProduct, setIsMyProduct] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productData, setProductData] = useState<UnknownProductTypes>();
  const [newData, setNewData] = useState({
    newTitle: productData?.title,
    newPrice: productData?.shop_info?.price,
    newDescription: productData?.description,
    newQuantity: productData?.quantity,
  });
  const { userData } = useContext(UserContext);
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const navigate = useNavigate();
  const path = useLocation();

  let prodId: string | any[] | null = null;
  prodId = path.pathname.split('/');
  prodId = prodId[prodId.length - 1];

  const fetchProductData = useCallback(() => {
    setIsFetchingData(true);
    axios
      .get('/product/product', { params: { productId: prodId } })
      .then((res) => {
        setNewData({
          newDescription: res.data.description,
          newPrice: res.data.price,
          newTitle: res.data.title,
          newQuantity: res.data.quantity,
        });
        setProductData(res.data);
      });
    setIsFetchingData(false);
  }, [prodId]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  useEffect(() => {
    if (
      userData &&
      userData.role !== 'User' &&
      userData.author_info.my_products.find(
        (product: UnknownProductTypes) => product._id === productData?._id
      )
    ) {
      setIsMyProduct(true);
    }
  }, [userData, productData]);

  const newDataChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    setNewData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const updateProductData = async () => {
    await axios.post('/product/update', {
      _id: productData?._id,
      title: newData.newTitle,
      price: newData.newPrice,
      description: newData.newDescription,
      quantity: newData.newQuantity,
    });
    fetchProductData();
    setIsEditing(false);
  };

  const toggleEditting = () => {
    if (isEditing) {
      fetchProductData();
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const deleteItemHandler = async () => {
    await axios.post('/product/delete', { _id: productData?._id });
    setShowDeleteDialog(false);
    fetchProductData();
    navigate('/');
  };

  if (productData === undefined && isFetchingData) return <p>Loading</p>;
  if (productData === undefined) return <p> No data</p>;
  const DUMMYIMGS = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  const addNewCommentHandler = async () => {
    setIsAddingComment(true);
    await axios.post('/comment/one', {
      userId: userData?._id,
      productId: prodId,
      value: { rating: 2, text: newComment },
    });
    setNewComment('');
    setIsAddingComment(false);
    fetchProductData();
  };

  return (
    <section className="relative">
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              <ProductImage />
              <div className="grid grid-cols-2 gap-4 lg:mt-4">
                {DUMMYIMGS.map((img) => (
                  <ProductImage key={img.id} />
                ))}
              </div>
            </div>
          </div>

          <div className="sticky top-24">
            <div className="relative mb-3 w-full">
              <ProductPill text={productData && productData.market_place} />
              {isMyProduct && (
                <div className="absolute right-0 top-0 flex gap-3">
                  <CustomDialog
                    isOpen={showDeleteDialog}
                    changeIsOpen={() => setShowDeleteDialog(false)}
                    title="Are you sure?"
                    description="Deleting this will permamently remove the item from the
                    database."
                  >
                    <div className="flex w-full justify-end gap-3">
                      <button type="button" onClick={() => deleteItemHandler()}>
                        Delete
                      </button>
                      <button
                        type="button"
                        className="rounded-md bg-red-500 px-3 py-1 text-white"
                        onClick={() => setShowDeleteDialog(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </CustomDialog>

                  <button
                    type="button"
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="inline-block rounded-md border border-gray-300 px-2"
                    onClick={toggleEditting}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                  {isEditing && (
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
                {isEditing ? (
                  <input
                    name="newTitle"
                    type="text"
                    value={newData.newTitle}
                    className="border-1 border"
                    onChange={(e) => newDataChangeHandler(e)}
                  />
                ) : (
                  <h1 className="text-xl font-bold sm:text-3xl">
                    {productData && productData.title}
                  </h1>
                )}
                <div>
                  {productData &&
                    productData.categories?.map((category) => (
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
                  Added: {productData && productData.created_at.slice(0, 10)}
                </div>
                <div>
                  <p>Authors:</p>
                  {productData?.authors?.map((author) => (
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
              {isEditing ? (
                <input
                  name="newPrice"
                  type="number"
                  value={newData.newPrice}
                  className="h-min"
                  onChange={(e) => newDataChangeHandler(e)}
                />
              ) : (
                <p className="text-xl font-bold">
                  {productData?.shop_info && productData.shop_info.price}€
                </p>
              )}
            </div>

            <div className="mt-4">
              <div className="max-w-none">
                <span>Available: </span>
                {isEditing ? (
                  <input
                    name="newQuantity"
                    value={newData.newQuantity}
                    onChange={(e) => newDataChangeHandler(e)}
                  />
                ) : (
                  <span>{productData && productData.quantity}</span>
                )}
              </div>
              <div className="prose max-w-none">
                {isEditing ? (
                  <textarea
                    name="newDescription"
                    className="resize-none"
                    value={newData.newDescription}
                    onChange={(e) => newDataChangeHandler(e)}
                  />
                ) : (
                  <p>{productData && productData.description}</p>
                )}
              </div>

              {productData &&
                productData.description &&
                productData.description.length > 600 && (
                  <button
                    type="button"
                    className="mt-2 text-sm font-medium underline"
                  >
                    Read More
                  </button>
                )}
            </div>

            <ProductForm
              productId={productData?._id}
              productQuantity={productData?.quantity}
              sold={productData.sold}
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
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <div className="flex items-center justify-end gap-2 bg-white p-3">
                  <Button
                    variant="primary"
                    isDisabled={!userData?._id ? 'yes' : 'no'}
                    disabled={!userData?._id}
                    onClick={() => addNewCommentHandler()}
                  >
                    <LoadingCircle isLoading={isAddingComment}>
                      Publish
                    </LoadingCircle>
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section>
            {productData?.comments.map((comment) => (
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
