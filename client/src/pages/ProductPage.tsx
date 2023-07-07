import {
  ChangeEvent,
  useEffect,
  useState,
  useContext,
  useCallback,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProductTypes } from '../types/interfaces';
import { UserContext } from '../context/UserProvider';
import CustomDialog from '../components/UI/headlessUI/CustomDialog';
import ProductImage from '../components/product/ProductImage';
import ProductPill from '../components/product/ProductPill';
import StarRating from '../components/product/StarRating';
import ProductForm from '../components/product/ProductForm';

export default function ProductPage() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [isMyProduct, setIsMyProduct] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productData, setProductData] = useState<ProductTypes | null>(null);
  const [newData, setNewData] = useState({
    newTitle: productData?.title,
    newPrice: productData?.price.value,
    newDescription: productData?.description,
    newQuantity: productData?.quantity,
  });

  const { userData } = useContext(UserContext);

  const creatorPath =
    productData?.userProp.id === userData?._id
      ? 'my'
      : productData?.userProp.id;

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
              <ProductPill text={productData && productData.marketPlace} />
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
                    {productData && productData.title}
                  </h1>
                )}
                <div>
                  {productData &&
                    productData.categories?.map((category) => (
                      <span key={category._id}>{category.value}</span>
                    ))}
                </div>
                <p className="text-xs">
                  Added: {productData && productData.addedDate.slice(0, 10)}
                </p>
                <p className="text-xs">
                  by:{' '}
                  <Link to={`/account/${creatorPath}`}>
                    {productData?.userProp.email}
                  </Link>
                </p>
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
                <p className="text-lg font-bold">
                  {productData && productData.price.value}€
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
            />
          </div>
        </div>
      </div>
    </section>
  );
}
