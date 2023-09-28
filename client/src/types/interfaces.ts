// eslint-disable-next-line import/no-cycle
import { MarketPlaceTypes, UserRoleType } from './types';

// * Product types

export interface UnknownProductTypes
  extends ProductTypes,
    ShopProductTypes,
    AuctionProductTypes {}

export interface ProductTypes {
  seller_data: {
    _id: string;
    pseudonim: string;
  };
  _id: string;
  title: string;
  description?: string;
  imgs?: string[];
  categories?: { value: string; label: string; _id: string }[];
  authors: AuthorTypes[];
  rating?: number;
  quantity: number;
  market_place: MarketPlaceTypes;
  created_at: string;
  sold: boolean;
  comments: [
    {
      _id: string;
      product_id: string;
      user: UserTypes;
      value: { rating: number; text: string };
      created_at: string;
    }
  ];
  currency: string;
}

export interface ShopProductTypes extends ProductTypes {
  shop_info: { price: number };
}

export interface AuctionProductTypes extends ProductTypes {
  auction_info: {
    starting_price: number;
    current_price: number;
    auction_end_date: Date;
  };
}

//  * Categories types

export interface ProductCategories {
  _id: string;
  label: string;
  value: string;
  description: string;
}

// * User types
export interface UserTypes {
  _id: string;
  email: string;
  username: string;
  user_info: {
    profile_img: any;
    background_img: any;
    credentials: { first_name: string; last_name: string; full_name: string };
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    phone: string;
  };
  cart_data: { products: UnknownProductTypes[]; _id: string };
  following: string[];
  orders: OrderTypes[];
  role: UserRoleType | string;
  security_settings: {
    hide_private_information: boolean;
  };
  news: string[];
}

export interface AuthorTypes extends UserTypes {
  author_info: {
    categories: string[];
    pseudonim: string;
    short_description: string;
    quote: string;
    avg_products_grade: number;
    sold_books_quantity: number;
    my_products: UnknownProductTypes[];
    followers: string[];
  };
}

// * Transaction History types

export interface TransactionHistoryTypes {
  status: string;
  data: UnknownProductTypes;
}

// * Order types

export interface OrderTypes {
  _id: string;
  buyer_id: string;
  products: {
    product: UnknownProductTypes;
    in_cart_quantity: number;
    total_price: number;
  }[];
  created_at: string;
}

// * Fetch types

export interface SimpleFetchDataTypes {
  isLoading: boolean;
  hasError: null | string;
}

// * Cart types

export interface CartProductTypes {
  inCartQuantity: number;
  productData: UnknownProductTypes;
  productsTotalPrice: number;
}

export interface CartTypes {
  products:
    | {
        inCartQuantity: number;
        productData: UnknownProductTypes;
        productsTotalPrice: number;
      }[]
    | [];
  cartPrice: number;
  isLoading: boolean;
}

// * Card types

export interface ProductCardTypes {
  _id: string;
  title: string;
  description?: string;
  authors: AuthorTypes[];
}

export interface ProductSpecialAuctionCardTypes extends ProductCardTypes {
  img?: string;
  swipedFlag: boolean;
  startingPrice: number;
  currentPrice: number;
  auctionEndDate: Date;
}

export interface ProductShopCardType extends ProductCardTypes {
  price: number;
  img?: string;
  description?: string;
  productQuantity: number;
}

export interface ProductAuctionCardType extends ProductCardTypes {
  img?: string;
  startingPrice: number;
  currentPrice: number;
  auctionEndDate: Date;
}

// * news types

export interface NewsTypes {
  _id: string;
  title: string;
  subtitle?: string;
  content: string;
}
