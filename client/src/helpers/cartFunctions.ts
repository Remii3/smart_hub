import axios from 'axios';

type CartItemTypes = {
  userId?: string;
  productId?: string;
  productQuantity?: number;
};
export const getFetchCartData = async ({ userId }: CartItemTypes) => {
  if (userId) {
    const res = await axios.get('/cart/cart', {
      params: { userId },
    });
    return res.data;
  }
  return null;
};

export const postAddProductToCart = async ({
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

export const postIncrementCartItem = async ({
  userId,
  productId,
}: CartItemTypes) => {
  await axios.post('cart/cartItem-increment', {
    userId,
    productId,
  });
};

export const postDecrementCartItem = async ({
  userId,
  productId,
}: CartItemTypes) => {
  await axios.post('cart/cartItem-decrement', {
    userId,
    productId,
  });
};

export const postRemoveProductFromCart = async ({
  userId,
  productId,
}: CartItemTypes) => {
  await axios.post('/cart/cart-remove', {
    userId,
    productId,
  });
};
