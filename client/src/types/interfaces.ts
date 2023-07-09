import { MarketPlaceTypes } from './types';

export interface ProductTypes {
  _id: string;
  title: string;
  description?: string;
  price: { value: number; currency: string };
  imgs?: string[];
  categories?: { value: string; label: string; _id: string }[];
  authors?: string[];
  rating?: number;
  quantity: number;
  userProp: { email: string; id: string };
  marketPlace: MarketPlaceTypes;
  addedDate: string;
  comments: [CommentTypes];
}

export interface CommentTypes {
  _id: string;
  user: UserDataTypes;
  productId: string;
  value: { rating: number; comment: string };
}

export interface ProductCategories {
  _id: string;
  label: string;
  value: string;
  description: string;
}

export interface UserDataTypes {
  _id: string;
  email: string;
  cartData: { products: ProductTypes[]; _id: string };
  credentials: { firstName: string; lastName: string };
  my_products: ProductTypes[];
  followers: string[];
  following: string[];
}

export interface SimpleFetchDataTypes {
  isLoading: boolean;
  hasError: null | string;
}
export type InitialStateType = {
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
