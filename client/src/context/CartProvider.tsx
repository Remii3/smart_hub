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
};

export const CartContext = createContext<{
  cartState: CartTypes;
  fetchCartData: () => void;
  addProductToCart: ({
    productId,
    productQuantity,
    type,
  }: {
    productId: string;
    productQuantity: number;
    type: string;
  }) => void;
  incrementCartItem: (productId: string, type: string) => void;
  decrementCartItem: (productId: string, type: string) => void;
  removeProductFromCart: (productId: string, type: string) => void;
}>({
  cartState: initialState,
  fetchCartData: () => null,
  addProductToCart: () => null,
  incrementCartItem: () => null,
  decrementCartItem: () => null,
  removeProductFromCart: () => null,
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
          products: data.products,
          cartPrice: data.cartPrice,
        };
      });
    }
  }, [userId]);

  const addProductToCart = useCallback(
    async ({
      productId,
      productQuantity,
      type,
    }: {
      productId: string;
      productQuantity: number;
      type: string;
    }) => {
      setCart((prevState) => {
        return { ...prevState, isAdding: productId };
      });

      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_ADD,
        body: { userId, productId, productQuantity, type },
      });

      await fetchCartData();

      setCart((prevState) => {
        return { ...prevState, isAdding: false };
      });
    },
    [userId, fetchCartData]
  );

  const incrementCartItem = useCallback(
    async (productId: string, type: string) => {
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
        body: { userId, productId, type },
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
    async (productId: string, type: string) => {
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
        body: { userId, productId, type },
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
    async (productId: string, type: string) => {
      if (!cartState) return;

      const newProducts = cartState.products.filter(
        (product) => product.productData._id !== productId
      );

      setCart((prevState) => {
        return { ...prevState, isDeleting: productId };
      });
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_REMOVE,
        body: { userId, productId, type },
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
