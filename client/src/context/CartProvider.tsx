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
import { CartTypes } from '@customTypes/interfaces';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { AddingToCartTypes } from '@customTypes/types';
import { getCookie } from '@lib/utils';

const initialState = {
  products: [],
  cartPrice: null,
  isLoading: false,
  isAdding: false,
  addingToCartType: null,
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
    addingToCartType,
  }: {
    productId: string;
    productQuantity: number;
    addingToCartType: AddingToCartTypes;
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
  const userId = userData.data?._id;

  const fetchCartData = useCallback(async () => {
    setCart((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.CART_ALL,
      params: { userId },
    });

    setCart((prevState) => {
      return {
        ...prevState,
        isIncrementing: false,
        isAdding: false,
        addingToCartType: null,
        isDecrementing: false,
        isDeleting: false,
        isLoading: false,
        ...data,
      };
    });
  }, [userId]);

  const addProductToCart = useCallback(
    async ({
      productId,
      productQuantity,
      addingToCartType,
    }: {
      productId: string;
      productQuantity: number;
      addingToCartType: AddingToCartTypes;
    }) => {
      setCart((prevState) => {
        return {
          ...prevState,
          isAdding: productId,
          addingToCartType: addingToCartType,
        };
      });
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_ADD,
        body: { userId, productId, productQuantity },
      });

      await fetchCartData();
    },
    [userId, fetchCartData]
  );

  const incrementCartItem = useCallback(
    async (productId: string) => {
      if (!cartState) return;

      setCart((prevState) => {
        return { ...prevState, isIncrementing: productId };
      });

      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_INCREMENT,
        body: { userId, productId },
      });

      await fetchCartData();
    },
    [cartState, fetchCartData, userId]
  );

  const decrementCartItem = useCallback(
    async (productId: string) => {
      if (!cartState) return;

      setCart((prevState) => {
        return { ...prevState, isDecrementing: productId };
      });

      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_DECREMENT,
        body: { userId, productId },
      });
      await fetchCartData();
    },
    [cartState, fetchCartData, userId]
  );

  const removeProductFromCart = useCallback(
    async (productId: string) => {
      if (!cartState) return;

      setCart((prevState) => {
        return { ...prevState, isDeleting: productId };
      });
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.CART_REMOVE,
        body: { userId, productId },
      });

      await fetchCartData();
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
