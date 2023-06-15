import axios from 'axios';

type CartItemTypes = {
  userId?: string;
  productId?: string;
  productQuantity?: number;
};
export const fetchCartData = async ({ userId }: CartItemTypes) => {
  if (userId) {
    const res = await axios.get('/cart/cart', {
      params: { userId },
    });
    return res.data;
  }
  return null;
};

export const addProductToCart = async ({
  userId,
  productId,
  productQuantity,
}: CartItemTypes) => {
  await axios.post('/cart/cart', {
    userId,
    productId,
    productQuantity,
  });
};

export const incrementCartItem = async ({
  userId,
  productId,
}: CartItemTypes) => {
  await axios.post('cart/cartItem-increment', {
    userId,
    productId,
  });
};

export const decrementCartItem = async ({
  userId,
  productId,
}: CartItemTypes) => {
  await axios.post('cart/cartItem-decrement', {
    userId,
    productId,
  });
};

export const removeCartItem = async ({ userId, productId }: CartItemTypes) => {
  await axios.post('/cart/cart-remove', {
    userId,
    productId,
  });
};
