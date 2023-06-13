import axios from 'axios';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useReducer,
  Reducer,
  Dispatch,
} from 'react';
import { ProductTypes } from '../types/interfaces';
import { UserContext } from './UserProvider';
import getCookie from '../helpers/getCookie';
import { cartReducer, CartActions, Types } from '../reducers/cartReducers';

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
  dispatch: Dispatch<CartActions>;
}>({
  cartState: initialState,
  dispatch: () => null,
});

function CartProvider({ children }: { children: ReactNode }) {
  const [cartState, dispatch] = useReducer(cartReducer, initialState);

  // const [cart, setCart] = useState(null);
  // const [cartUpdateStatus, setCartUpdateStatus] = useState(false);
  const { userData } = useContext(UserContext);

  const fetchCartData = useCallback(async () => {
    const userId = userData?._id || getCookie('guestToken');

    if (userId) {
      // setCartUpdateStatus(true);
      dispatch({ type: Types.IsLoadingUpdate, payload: { status: true } });
      const res = await axios.get('/cart/cart', {
        params: { userId },
      });
      // setCart(res.data.cartData);
      dispatch({ type: Types.IsLoadingUpdate, payload: { status: false } });
    }
  }, [userData]);

  // const changeCartUpdateStatus = useCallback((status: boolean) => {
  //   setCartUpdateStatus(status);
  // }, []);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <CartContext.Provider value={{ cartState, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useTasks() {
  return useContext(CartContext);
}

// export function useTasksDispatch() {
//   return useContext(CartDispatchContext);
// }

export default CartProvider;
