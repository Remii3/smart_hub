import { ChangeEvent, FormEvent, useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import PrimaryBtn from '../components/UI/Btns/PrimaryBtn';
import { ProductTypes } from '../types/interfaces';
import { UserContext } from '../context/UserProvider';
import { CartContext } from '../context/CartProvider';

function ProductPage() {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [productData, setProductData] = useState<ProductTypes>();
  const { userData } = useContext(UserContext);
  const { cartProducts, setCartProducts } = useContext(CartContext);
  const quantityChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSelectedQuantity(Number(e.target.value));
  };
  const path = useLocation();
  let prodId: string | any[] | null = null;
  prodId = path.pathname.split('/');
  prodId = prodId[prodId.length - 1];

  useEffect(() => {
    axios
      .post('/product/get-book', { id: prodId })
      .then((res) => setProductData(res.data));
  }, [prodId]);

  const addToCartHandler = (e: FormEvent) => {
    e.preventDefault();
    if (userData) {
      setCartProducts((prevState: any) => {
        return {
          productData: [...prevState.productData, productData],
        };
      });
      axios.post('/account/cart-add', { product: productData });
    } else {
      setCartProducts((prevState: any) => {
        return { ...prevState, productData };
      });
    }
    console.log(cartProducts);
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

            <iframe
              title="YouTube video player"
              allowFullScreen
              width="420"
              height="315"
              src="https://www.youtube.com/embed/pNar3Dh9zDk"
              className="aspect-video w-full rounded-xl object-cover"
            />
          </div>

          <div className="sticky top-0">
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

            <div className="mt-8 flex justify-between">
              <div className="max-w-[35ch] space-y-2">
                <h1 className="text-xl font-bold sm:text-2xl">
                  {productData.title}
                </h1>

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

              <p className="text-lg font-bold">${productData.price}</p>
            </div>

            <div className="mt-4">
              <div className="prose max-w-none">
                <p>{productData.description}</p>
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
              <fieldset>
                <legend className="mb-1 text-sm font-medium">Cover</legend>

                <div className="flex flex-wrap gap-1">
                  <label htmlFor="color_tt" className="cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      id="color_tt"
                      className="peer sr-only"
                    />

                    <span className="group inline-block rounded-full border px-3 py-1 text-xs font-medium peer-checked:bg-black peer-checked:text-white">
                      Soft
                    </span>
                  </label>

                  <label htmlFor="color_fr" className="cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      id="color_fr"
                      className="peer sr-only"
                    />

                    <span className="group inline-block rounded-full border px-3 py-1 text-xs font-medium peer-checked:bg-black peer-checked:text-white">
                      Medium
                    </span>
                  </label>

                  <label htmlFor="color_cb" className="cursor-pointer">
                    <input
                      type="radio"
                      name="color"
                      id="color_cb"
                      className="peer sr-only"
                    />

                    <span className="group inline-block rounded-full border px-3 py-1 text-xs font-medium peer-checked:bg-black peer-checked:text-white">
                      Hard
                    </span>
                  </label>
                </div>
              </fieldset>

              <fieldset className="mt-4">
                <legend className="mb-1 text-sm font-medium">Size</legend>

                <div className="flex flex-wrap gap-1">
                  <label htmlFor="size_xs" className="cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      id="size_xs"
                      className="peer sr-only"
                    />

                    <span className="group inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium peer-checked:bg-black peer-checked:text-white">
                      XS
                    </span>
                  </label>

                  <label htmlFor="size_s" className="cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      id="size_s"
                      className="peer sr-only"
                    />

                    <span className="group inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium peer-checked:bg-black peer-checked:text-white">
                      S
                    </span>
                  </label>

                  <label htmlFor="size_m" className="cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      id="size_m"
                      className="peer sr-only"
                    />

                    <span className="group inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium peer-checked:bg-black peer-checked:text-white">
                      M
                    </span>
                  </label>

                  <label htmlFor="size_l" className="cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      id="size_l"
                      className="peer sr-only"
                    />

                    <span className="group inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium peer-checked:bg-black peer-checked:text-white">
                      L
                    </span>
                  </label>

                  <label htmlFor="size_xl" className="cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      id="size_xl"
                      className="peer sr-only"
                    />

                    <span className="group inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium peer-checked:bg-black peer-checked:text-white">
                      XL
                    </span>
                  </label>
                </div>
              </fieldset>

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

                <PrimaryBtn
                  text="Add to Cart"
                  usecase="default"
                  customCSS="block rounded bg-green-600 px-5 py-3 text-xs font-medium text-white hover:bg-green-500"
                  type="submit"
                  onClick={(e) => addToCartHandler(e)}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductPage;
