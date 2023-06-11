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
import ProductImage from '../components/productParts/ProductImage';
import ProductPill from '../components/productParts/ProductPill';
import StarRating from '../components/productParts/StarRating';
import PrimaryBtn from '../components/UI/Btns/PrimaryBtn';

function ProductPage() {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isMyProduct, setIsMyProduct] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productData, setProductData] = useState<ProductTypes>();
  const [newData, setNewData] = useState({
    newTitle: productData?.title,
    newPrice: productData?.price,
    newDescription: productData?.description,
  });
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { userData } = useContext(UserContext);
  const { fetchCartData } = useContext(CartContext);

  const navigate = useNavigate();

  const path = useLocation();

  let prodId: string | any[] | null = null;
  prodId = path.pathname.split('/');
  prodId = prodId[prodId.length - 1];

  const quantityChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedQuantity(Number(e.target.value));
  };

  const fetchProductData = useCallback(() => {
    setIsFetchingData(true);
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
    setIsFetchingData(false);
  }, [prodId]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const addToCartHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentUserId = userData?._id || getCookie('guestToken');

    if (productData) {
      setIsAddingToCart(true);
      await axios.post('/cart/cart', {
        userId: currentUserId,
        productId: productData._id,
        productQuantity: productData.quantity,
      });
      fetchCartData();
      setIsAddingToCart(false);
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
    setShowDeleteDialog(false);
    fetchProductData();
    navigate('/');
  };

  if (productData === undefined && isFetchingData) return <p>Loading</p>;
  if (productData === undefined) return <p> No data</p>;

  const DUMMYIMGS = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  return (
    <section>
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

          <div className="sticky top-0">
            <div className="relative w-full">
              <ProductPill text={productData.marketPlace} />
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
                  <h1 className="text-xl font-bold sm:text-2xl">
                    {productData.title}
                  </h1>
                )}

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

            <form className="mt-8" onSubmit={(e) => addToCartHandler(e)}>
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
                <PrimaryBtn type="button" usecase="action">
                  Hello
                </PrimaryBtn>
                <button
                  className={`
                   block rounded bg-[#5469d4] px-5 py-3 text-xs font-medium text-white`}
                  type="submit"
                  disabled={isAddingToCart}
                >
                  <span id="button-text">
                    {isAddingToCart ? (
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
