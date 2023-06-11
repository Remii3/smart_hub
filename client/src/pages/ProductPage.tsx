import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProductTypes } from '../types/interfaces';
import { UserContext } from '../context/UserProvider';
import { CartContext } from '../context/CartProvider';
import getCookie from '../helpers/getCookie';
import CustomDialog from '../components/dialog/CustomDialog';

function ProductPage() {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isMyProduct, setIsMyProduct] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [productData, setProductData] = useState<ProductTypes>();
  const [newData, setNewData] = useState({
    newTitle: productData?.title,
    newPrice: productData?.price,
    newDescription: productData?.description,
  });

  const { userData } = useContext(UserContext);
  const { fetchCartData } = useContext(CartContext);
  const navigate = useNavigate();

  const quantityChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSelectedQuantity(Number(e.target.value));
  };
  const path = useLocation();
  let prodId: string | any[] | null = null;
  prodId = path.pathname.split('/');
  prodId = prodId[prodId.length - 1];

  const fetchProductData = useCallback(() => {
    axios
      .get('/product/product', { params: { productId: prodId } })
      .then((res) => {
        setNewData({
          newDescription: res.data.description,
          newPrice: res.data.price,
          newTitle: res.data.title,
        });
        setProductData(res.data);
      });
  }, [prodId]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const addToCartHandler = async (e: FormEvent) => {
    e.preventDefault();

    const currentUserId = userData?._id || getCookie('guestToken');

    if (productData) {
      setIsLoading(true);
      await axios.post('/cart/cart', {
        userId: currentUserId,
        productId: productData._id,
        productQuantity: productData.quantity,
      });
      fetchCartData();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.my_products.find((item) => item._id === productData?._id)) {
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
    console.log('object');
    setDeleteDialog(false);
    fetchProductData();
    navigate('/');
  };
  if (productData === undefined) return <p> No data</p>;
  return (
    <section>
      <div className="relative mx-auto max-w-screen-xl px-4 py-8">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
              <img
                alt="Les Paul"
                src="https://images.unsplash.com/photo-1456948927036-ad533e53865c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                className="aspect-square w-full rounded-xl object-cover"
              />

              <div className="grid grid-cols-2 gap-4 lg:mt-4">
                <img
                  alt="Les Paul"
                  src="https://images.unsplash.com/photo-1456948927036-ad533e53865c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  className="aspect-square w-full rounded-xl object-cover"
                />

                <img
                  alt="Les Paul"
                  src="https://images.unsplash.com/photo-1456948927036-ad533e53865c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  className="aspect-square w-full rounded-xl object-cover"
                />

                <img
                  alt="Les Paul"
                  src="https://images.unsplash.com/photo-1456948927036-ad533e53865c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  className="aspect-square w-full rounded-xl object-cover"
                />

                <img
                  alt="Les Paul"
                  src="https://images.unsplash.com/photo-1456948927036-ad533e53865c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                  className="aspect-square w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </div>

          <div className="sticky top-0">
            <div className="relative w-full">
              {productData.marketPlace === 'Shop' && (
                <strong className="rounded-full border border-blue-600 bg-gray-100 px-3 py-0.5 text-xs font-medium tracking-wide text-blue-600">
                  {productData.marketPlace}
                </strong>
              )}
              {productData.marketPlace === 'Auction' && (
                <strong className="rounded-full border border-pink-600 bg-gray-100 px-3 py-0.5 text-xs font-medium tracking-wide text-pink-600">
                  {productData.marketPlace}
                </strong>
              )}
              {isMyProduct && (
                <div className="absolute right-0 top-0 flex gap-3">
                  <CustomDialog
                    isOpen={deleteDialog}
                    changeIsOpen={() => setDeleteDialog(false)}
                    title="Are you sure?"
                    description="Deleting this will permamently remove the item from the
                    database."
                  >
                    <div className="flex w-full justify-end gap-3">
                      <button type="button" onClick={() => deleteItemHandler()}>
                        Delete
                      </button>
                      <button
                        className="rounded-md bg-red-500 px-3 py-1 text-white"
                        onClick={() => setDeleteDialog(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </CustomDialog>

                  <button
                    type="button"
                    onClick={() => setDeleteDialog(true)}
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
                  <h1 className="text-xl font-bold sm:text-2xl">
                    {productData.title}
                  </h1>
                )}

                <p className="text-sm">Highest Rated Product</p>

                <div className="-ms-0.5 flex">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>

                  <svg
                    className="h-5 w-5 text-gray-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
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
                <p className="text-lg font-bold">€{productData.price}</p>
              )}
            </div>

            <div className="mt-4">
              <div className="prose max-w-none">
                {isEditing ? (
                  <textarea
                    name="newDescription"
                    className="resize-none"
                    value={newData.newDescription}
                    onChange={(e) => newDataChangeHandler(e)}
                  />
                ) : (
                  <p>{productData.description}</p>
                )}
              </div>

              {productData.description &&
                productData.description.length > 600 && (
                  <button
                    type="button"
                    className="mt-2 text-sm font-medium underline"
                  >
                    Read More
                  </button>
                )}
            </div>

            <form className="mt-8">
              <div className="mt-8 flex gap-4">
                <div>
                  <label htmlFor="quantity" className="sr-only">
                    Qty
                  </label>

                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    step="1"
                    value={selectedQuantity}
                    onChange={(e) => quantityChangeHandler(e)}
                    className="w-12 rounded border-gray-200 py-3 text-center text-xs [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                  />
                </div>

                <button
                  className={`${
                    !isLoading && ''
                  } block rounded bg-[#5469d4] px-5 py-3 text-xs font-medium text-white`}
                  type="button"
                  onClick={(e) => addToCartHandler(e)}
                  disabled={isLoading}
                >
                  <span id="button-text">
                    {isLoading ? (
                      <div className="spinner" id="spinner" />
                    ) : (
                      'Add to Cart'
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductPage;
