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
} from 'react';
import { ProductTypes } from '../types/interfaces';
import { UserContext } from './UserProvider';
import getCookie from '../helpers/getCookie';

type CartTypes = {
  cart: null | {
    products: {
      inCartQuantity: number;
      productData: ProductTypes;
      totalPrice: number;
    }[];
    cartPrice: number;
  };
  cartUpdateStatus: boolean;
  changeCartUpdateStatus: (status: boolean) => void;
  fetchCartData: () => void;
};

export const CartContext = createContext<CartTypes>({
  cart: null,
  cartUpdateStatus: false,
  fetchCartData() {},
  changeCartUpdateStatus(status) {},
});

const initialTasks = { data: '' };
const cartReducer = (state, action) => {};

function CartProvider({ children }: { children: ReactNode }) {
  const [cartTest, dispatch] = useReducer(cartReducer, initialTasks);
  const [cart, setCart] = useState(null);
  const [cartUpdateStatus, setCartUpdateStatus] = useState(false);
  const { userData } = useContext(UserContext);

  const fetchCartData = useCallback(async () => {
    const userId = userData?._id || getCookie('guestToken');

    if (userId) {
      setCartUpdateStatus(true);
      const res = await axios.get('/cart/cart', {
        params: { userId },
      });
      setCart(res.data.cartData);
      setCartUpdateStatus(false);
    }
  }, [userData]);

  const changeCartUpdateStatus = (status: boolean) => {
    setCartUpdateStatus(status);
  };

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const cartValues = useMemo(
    () => ({
      cart,
      cartUpdateStatus,
      fetchCartData,
      changeCartUpdateStatus,
    }),
    [cart, cartUpdateStatus, fetchCartData, changeCartUpdateStatus]
  );

  return (
    <CartContext.Provider value={cartValues}>{children}</CartContext.Provider>
  );
}
export default CartProvider;
