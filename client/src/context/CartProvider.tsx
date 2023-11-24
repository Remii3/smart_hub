import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { UserContext } from './UserProvider';
import { getCookie } from '@lib/utils';
import { CartTypes } from '@customTypes/interfaces';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';

const initialState = {
  products: [],
  cartPrice: null,
  isLoading: false,
  isAdding: false,
  isIncrementing: false,
  isDecrementing: false,
  isDeleting: false,
  additionalData: {
    discount: 0,
  },
};

export const CartContext = createContext<{
  cartState: CartTypes;
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
  fetchCartData: () => undefined,
  addProductToCart: () => undefined,
  incrementCartItem: () => undefined,
  decrementCartItem: () => undefined,
  removeProductFromCart: () => undefined,
});

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartState, setCart] = useState<CartTypes>(initialState);

  const { userData } = useContext(UserContext);
  const userId = userData.data?._id || getCookie('guestToken');

  const fetchCartData = useCallback(async () => {
    if (userId) {
      const { data } = await useGetAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_ALL,
        params: { userId },
      });
      setCart((prevState) => {
        return {
          ...prevState,
          ...data,
        };
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
        return { ...prevState, isAdding: productId };
      });
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_ADD,
        body: { userId, productId, productQuantity },
      });

      await fetchCartData();

      setCart((prevState) => {
        return { ...prevState, isAdding: false };
      });
    },
    [userId, fetchCartData]
  );

  const incrementCartItem = useCallback(
    async (productId: string) => {
      if (!cartState) return;

      const newProducts = cartState.products;
      const productIndex = cartState.products.findIndex(
        (product) => product.productData._id === productId
      );

      newProducts[productIndex].inCartQuantity += 1;

      setCart((prevState) => {
        return { ...prevState, isIncrementing: productId };
      });

      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_INCREMENT,
        body: { userId, productId },
      });
      await fetchCartData();

      setCart((prevState) => {
        return { ...prevState, isIncrementing: false };
      });

      setCart((prevState) => {
        return {
          ...prevState,
          cartPrice: prevState.cartPrice || 0,
          products: newProducts,
        };
      });
    },
    [cartState, fetchCartData, userId]
  );

  const decrementCartItem = useCallback(
    async (productId: string) => {
      if (!cartState) return;

      const newProducts = cartState.products;

      const productIndex = cartState.products.findIndex(
        (product) => product.productData._id === productId
      );

      newProducts[productIndex].inCartQuantity -= 1;

      setCart((prevState) => {
        return { ...prevState, isDecrementing: productId };
      });

      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_DECREMENT,
        body: { userId, productId },
      });
      await fetchCartData();
      setCart((prevState) => {
        return { ...prevState, isDecrementing: false };
      });

      setCart((prevState) => {
        return {
          ...prevState,
          cartPrice: prevState.cartPrice || 0,
          products: newProducts,
        };
      });
    },
    [cartState, fetchCartData, userId]
  );

  const removeProductFromCart = useCallback(
    async (productId: string) => {
      if (!cartState) return;

      const newProducts = cartState.products.filter(
        (product) => product.productData._id !== productId
      );

      setCart((prevState) => {
        return { ...prevState, isDeleting: productId };
      });
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_REMOVE,
        body: { userId, productId },
      });

      await fetchCartData();
      setCart((prevState) => {
        return { ...prevState, isDeleting: false };
      });
      setCart((prevState) => {
        return {
          ...prevState,
          cartPrice: prevState.cartPrice || 0,
          products: newProducts,
        };
      });
    },
    [cartState, fetchCartData, userId]
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
