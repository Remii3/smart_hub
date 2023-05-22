import axios from 'axios';
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ProductTypes } from '../types/interfaces';

type CartTypes = {
  cartProducts: null | ProductTypes[];
  setCartProducts:
    | Dispatch<SetStateAction<ProductTypes[]>>
    | Dispatch<SetStateAction<never[]>>;
};

export const CartContext = createContext<CartTypes>({
  cartProducts: [],
  setCartProducts: () => {},
});

function CartProvider({ children }: { children: ReactNode }) {
  const [cartProducts, setCartProducts] = useState([]);

  const fetchData = async () => {
    const defaultUrl = `/account/cart`;
    const res = await axios.get(defaultUrl);
    // setCartProducts(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [cartProducts]);

  const cartValues = useMemo(
    () => ({
      cartProducts,
      setCartProducts,
    }),
    [cartProducts]
  );
  console.log(cartProducts);
  return (
    <CartContext.Provider value={cartValues}>{children}</CartContext.Provider>
  );
}

export default CartProvider;
