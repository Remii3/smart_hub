import getCookie from '../helpers/getCookie';
import { ProductTypes } from '../types/interfaces';

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum Types {
  Update = 'Update',
  Remove = 'Remove',
  Increment = 'Increment',
  Decrement = 'Decrement',
  IsLoadingUpdate = 'IsLoadingUpdate',
}

// Product

type CartType = {
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

type ProductPayload = {
  [Types.Update]: {
    price: number;
  };
  [Types.Increment]: {
    id: number;
  };
  [Types.Decrement]: {
    id: number;
  };
  [Types.Remove]: {
    id: number;
  };
  [Types.IsLoadingUpdate]: {
    status: boolean;
  };
};

export type CartActions =
  ActionMap<ProductPayload>[keyof ActionMap<ProductPayload>];

export const cartReducer = (state: CartType, action: CartActions) => {
  switch (action.type) {
    case Types.Update:
      console.log('first');
      return state;
    case Types.Increment:
      console.log('second');
      return state;
    case Types.Decrement:
      console.log('second');
      return state;
    case Types.Remove:
      console.log('second');
      return state;
    case Types.IsLoadingUpdate:
      return { ...state, cartIsLoading: action.payload.status };

    default:
      return state;
  }
};
