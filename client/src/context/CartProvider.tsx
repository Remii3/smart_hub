import axios from 'axios';
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
import getCookie from '../helpers/getCookie';

type CartTypes = {
  cartProducts:
    | null
    | {
        inCartQuantity: number;
        productData: ProductTypes;
        totalPrice: number;
      }[];
  fetchCartData: () => void;
};

export const CartContext = createContext<CartTypes>({
  cartProducts: null,
  fetchCartData() {},
});

function CartProvider({ children }: { children: ReactNode }) {
  const [cartProducts, setCartProducts] = useState(null);

  const { userData } = useContext(UserContext);

  const fetchCartData = useCallback(async () => {
    const userCartId = userData?.cartData._id || getCookie('guestToken');

    if (userCartId) {
      const res = await axios.get('/cart/cart-get', {
        params: { cartId: userCartId },
      });
      setCartProducts(res.data.products);
    }
  }, [userData]);

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  const cartValues = useMemo(
    () => ({
      cartProducts,
      fetchCartData,
    }),
    [cartProducts, fetchCartData]
  );

  return (
    <CartContext.Provider value={cartValues}>{children}</CartContext.Provider>
  );
}

export default CartProvider;
