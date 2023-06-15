import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ProductTypes } from '../types/interfaces';
import { UserContext } from './UserProvider';
import {
  addProductToCart,
  decrementCartItem,
  fetchCartData,
  incrementCartItem,
  removeCartItem,
} from '../helpers/cartFunctions';
import getCookie from '../helpers/getCookie';

type InitialStateType = {
  cart: null | {
    products:
      | {
          inCartQuantity: number;
          productData: ProductTypes;
          totalPrice: number;
        }[];
    cartPrice: number;
  };
  cartIsLoading: boolean;
};

const initialState = {
  cart: null,
  cartIsLoading: false,
};

export const CartContext = createContext<{
  cartState: InitialStateType;
  fetchCartDatahandler: () => void;
  incrementDataHandler: (productId: string) => void;
  decrementDataHandler: (productId: string) => void;
  addProductToCartHandler: ({
    productId,
    productQuantity,
  }: {
    productId: string;
    productQuantity: number;
  }) => void;
  removeCartItemHandler: (productId: string) => void;
}>({
  cartState: initialState,
  addProductToCartHandler: () => null,
  fetchCartDatahandler: () => null,
  incrementDataHandler: () => null,
  decrementDataHandler: () => null,
  removeCartItemHandler: () => null,
});

function CartProvider({ children }: { children: ReactNode }) {
  const [cartState, setCart] = useState<InitialStateType>(initialState);

  const { userData } = useContext(UserContext);
  const userId = userData?._id || getCookie('guestToken');

  const fetchCartDatahandler = useCallback(async () => {
    const res = await fetchCartData({ userId });
    setCart((prevState) => {
      return { ...prevState, cart: res };
    });
  }, [userId]);

  const incrementDataHandler = useCallback(
    async (productId: string) => {
      if (!cartState.cart) return;

      const newProducts = cartState.cart.products;

      const productIndex = cartState.cart.products.findIndex(
        (product) => product.productData._id === productId
      );

      newProducts[productIndex].inCartQuantity += 1;

      await incrementCartItem({ userId, productId });

      setCart((prevState) => {
        return {
          ...prevState,
          cart: { ...prevState.cart, products: newProducts },
        };
      });
    },
    [cartState.cart, userId]
  );
  const decrementDataHandler = useCallback(
    async (productId: string) => {
      if (!cartState.cart) return;

      const newProducts = cartState.cart.products;

      const productIndex = cartState.cart.products.findIndex(
        (product) => product.productData._id === productId
      );

      newProducts[productIndex].inCartQuantity -= 1;

      await decrementCartItem({ userId, productId });

      setCart((prevState) => {
        return {
          ...prevState,
          cart: { ...prevState.cart, products: newProducts },
        };
      });
    },
    [cartState.cart, userId]
  );

  const removeCartItemHandler = useCallback(
    async (productId: string) => {
      const newProducts = cartState.cart?.products.filter(
        (product) => product.productData._id !== productId
      );
      await removeCartItem({ userId, productId });

      setCart((prevState) => {
        return {
          ...prevState,
          cart: { ...prevState.cart, products: newProducts },
        };
      });
    },
    [cartState.cart?.products, userId]
  );

  const addProductToCartHandler = useCallback(
    async ({
      productId,
      productQuantity,
    }: {
      productId: string;
      productQuantity: number;
    }) => {
      await addProductToCart({ userId, productId, productQuantity });
      const res = await fetchCartData({ userId });
      setCart((prevState) => {
        return { ...prevState, cart: res };
      });
    },
    [userId]
  );

  useEffect(() => {
    fetchCartDatahandler();
  }, [fetchCartDatahandler]);

  const contextValues = useMemo(
    () => ({
      cartState,
      addProductToCartHandler,
      fetchCartDatahandler,
      incrementDataHandler,
      decrementDataHandler,
      removeCartItemHandler,
    }),
    [
      cartState,
      addProductToCartHandler,
      fetchCartDatahandler,
      incrementDataHandler,
      decrementDataHandler,
      removeCartItemHandler,
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

export default CartProvider;
