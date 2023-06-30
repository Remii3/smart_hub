import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { InitialStateType } from '../types/interfaces';
import { UserContext } from './UserProvider';
import {
  postAddProductToCart,
  postDecrementCartItem,
  postIncrementCartItem,
  getFetchCartData,
  postRemoveProductFromCart,
} from '../helpers/cartFunctions';
import getCookie from '../helpers/getCookie';

const initialState = {
  cart: null,
  cartIsLoading: false,
};

export const CartContext = createContext<{
  cartState: InitialStateType;
  fetchCartData: () => void;
  addProductToCart: ({
    productId,
    productQuantity,
  }: {
    productId: string;
    productQuantity: number;
  }) => void;
  incrementCartItem: (productId: string) => void;
  decrementCartItem: (productId: string) => void;
  removeProductFromCart: (productId: string) => void;
}>({
  cartState: initialState,
  fetchCartData: () => null,
  addProductToCart: () => null,
  incrementCartItem: () => null,
  decrementCartItem: () => null,
  removeProductFromCart: () => null,
});

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartState, setCart] = useState<InitialStateType>(initialState);

  const { userData } = useContext(UserContext);
  const userId = userData?._id || getCookie('guestToken');

  const fetchCartData = useCallback(async () => {
    if (userId) {
      const res = await getFetchCartData({ userId });
      setCart((prevState) => {
        return { ...prevState, cart: res };
      });
    }
  }, [userId]);

  const addProductToCart = useCallback(
    async ({
      productId,
      productQuantity,
    }: {
      productId: string;
      productQuantity: number;
    }) => {
      setCart((prevState) => {
        return { ...prevState, cartIsLoading: true };
      });

      postAddProductToCart({ userId, productId, productQuantity })
        .then(() => fetchCartData())
        .then(() => {
          setCart((prevState) => {
            return { ...prevState, cartIsLoading: false };
          });
        });
    },
    [userId, fetchCartData]
  );

  const incrementCartItem = useCallback(
    (productId: string) => {
      if (!cartState.cart) return;

      const newProducts = cartState.cart.products;

      const productIndex = cartState.cart.products.findIndex(
        (product) => product.productData._id === productId
      );

      newProducts[productIndex].inCartQuantity += 1;

      setCart((prevState) => {
        return { ...prevState, cartIsLoading: true };
      });

      postIncrementCartItem({ userId, productId })
        .then(() => fetchCartData())
        .then(() => {
          setCart((prevState) => {
            return { ...prevState, cartIsLoading: false };
          });

          setCart((prevState) => {
            return {
              ...prevState,
              cart: {
                cartPrice: prevState.cart?.cartPrice || 0,
                products: newProducts,
              },
            };
          });
        });

      // eslint-disable-next-line consistent-return
    },
    [cartState.cart, fetchCartData, userId]
  );
  const decrementCartItem = useCallback(
    (productId: string) => {
      if (!cartState.cart) return;

      const newProducts = cartState.cart.products;

      const productIndex = cartState.cart.products.findIndex(
        (product) => product.productData._id === productId
      );

      newProducts[productIndex].inCartQuantity -= 1;

      setCart((prevState) => {
        return { ...prevState, cartIsLoading: true };
      });

      postDecrementCartItem({ userId, productId })
        .then(() => fetchCartData())
        .then(() => {
          setCart((prevState) => {
            return { ...prevState, cartIsLoading: false };
          });

          setCart((prevState) => {
            return {
              ...prevState,
              cart: {
                cartPrice: prevState.cart?.cartPrice || 0,
                products: newProducts,
              },
            };
          });
        });
    },
    [cartState.cart, fetchCartData, userId]
  );

  const removeProductFromCart = useCallback(
    (productId: string) => {
      if (!cartState.cart) return;

      const newProducts = cartState.cart?.products.filter(
        (product) => product.productData._id !== productId
      );
      postRemoveProductFromCart({ userId, productId })
        .then(() => fetchCartData())
        .then(() => {
          setCart((prevState) => {
            return {
              ...prevState,
              cart: {
                cartPrice: prevState.cart?.cartPrice || 0,
                products: newProducts,
              },
            };
          });
        });
    },
    [cartState.cart, fetchCartData, userId]
  );

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const contextValues = useMemo(
    () => ({
      cartState,
      fetchCartData,
      addProductToCart,
      incrementCartItem,
      decrementCartItem,
      removeProductFromCart,
    }),
    [
      cartState,
      fetchCartData,
      addProductToCart,
      incrementCartItem,
      decrementCartItem,
      removeProductFromCart,
    ]
  );

  return (
    <CartContext.Provider value={contextValues}>
      {children}
    </CartContext.Provider>
  );
}

export function useTasks() {
  return useContext(CartContext);
}
