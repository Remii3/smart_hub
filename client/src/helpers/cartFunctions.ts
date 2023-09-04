import axios from 'axios';

type CartItemTypes = {
  userId?: string;
  productId?: string;
  productQuantity?: number;
};

export const getFetchCartData = async ({ userId }: CartItemTypes) => {
  if (userId) {
    const res = await axios.get('/cart/all', {
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
  await axios.post('/cart/add', {
    userId,
    productId,
    productQuantity,
  });
};

export const postIncrementCartItem = async ({
  userId,
  productId,
}: CartItemTypes) => {
  await axios.post('cart/increment-one', {
    userId,
    productId,
  });
};

export const postDecrementCartItem = async ({
  userId,
  productId,
}: CartItemTypes) => {
  await axios.post('cart/decrement-one', {
    userId,
    productId,
  });
};

export const postRemoveProductFromCart = async ({
  userId,
  productId,
}: CartItemTypes) => {
  await axios.post('/cart/remove-one', {
    userId,
    productId,
  });
};
