// eslint-disable-next-line import/no-cycle
import {
  ImgTypes,
  MarketplaceTypes,
  PriceTypes,
  RatingTypes,
  UserRoleType,
  VoteType,
} from './types';

// * Product types

export interface ProductTypes {
  creatorData: {
    _id: string;
    pseudonim: string;
  };
  _id: string;
  title: string;
  collections: CollectionObjectTypes[];
  description: string;
  shortDescription: string;
  quantity: number;
  imgs: { id: string; url: string }[];
  categories: { value: string; label: string; _id: string }[];
  authors: AuthorTypes[];
  rating: { avgRating: number; quantity: number };
  marketplace: MarketplaceTypes;
  createdAt: string;
  updatedAt: string;
  sold: boolean;
  comments: [
    {
      _id: string;
      product_id: string;
      user: UserTypes;
      value: { rating: number; text: string };
      createdAt: string;
    }
  ];
  price: {
    currency: string;
    value: string;
  };
}

//  * Categories types

export interface ProductCategories {
  _id: string;
  label: string;
  value: string;
  description?: string;
}

// * User types
export interface UserTypes {
  _id: string;
  email: string;
  username: string;
  user_info: {
    profile_img: { url: string; id: string };
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
  cart_data: { products: ProductTypes[]; _id: string };
  following: string[];
  orders: OrderTypes[];
  role: UserRoleType | string;
  security_settings: {
    hide_private_information: boolean;
  };
}

export interface AuthorTypes extends UserTypes {
  author_info: {
    categories: string[];
    pseudonim: string;
    short_description: string;
    quote: string;
    avg_products_grade: number;
    sold_books_quantity: number;
    my_products: ProductTypes[];
    myCollections: CollectionObjectTypes[];
    followers: string[];
  };
}

// * Transaction History types

export interface TransactionHistoryTypes {
  status: string;
  data: ProductTypes;
}

// * Order types

export interface OrderTypes {
  _id: string;
  buyer_id: string;
  products: {
    product: ProductTypes;
    in_cart_quantity: number;
    total_price: number;
  }[];
  createdAt: string;
}

// * Fetch types

export interface FetchDataTypes {
  isLoading: boolean;
  hasError: null | string;
}

export interface PostDataTypes {
  isLoading: boolean;
  isSuccess: boolean;
  hasError: null | string;
}

// * Cart types

export interface CartProductTypes {
  inCartQuantity: number;
  productData: ProductTypes;
}

export interface CartTypes {
  products: {
    inCartQuantity: number;
    productData: ProductTypes;
    productsTotalPrice: number;
  }[];
  cartPrice: number | null;
  isLoading: boolean;
  isAdding: boolean | string;
  isIncrementing: boolean | string;
  isDecrementing: boolean | string;
  isDeleting: boolean | string;
}

// * Card types

export interface ProductCardTypes {
  _id: string;
  title: string;
  description: string;
  authors: AuthorTypes[];
  price: string;
  img: string | null;
  productQuantity: number;
  rating: RatingTypes;
  type: MarketplaceTypes;
  categories: CategoryTypes[];
}

// * news types

export interface NewsType {
  _id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  content: string;
  creatorData: { _id: string; pseudonim: string; profile_img: ImgTypes };
  voting: { quantity: { likes: number; dislikes: number } };
  updatedAt: string;
  img: {
    id: string;
    url: string;
  };
}

export interface VotesType {
  userId: string;
  vote: VoteType;
}

export interface VotingTypes {
  quantity: {
    likes: null | number;
    dislikes: null | number;
  };
  votes: VotesType[];
}

export interface CategoryTypes {
  value: string;
  label: string;
  _id: string;
}
export interface CommentTypes {
  _id: string;
  product_id: string;
  user: AuthorTypes;
  value: { rating: number; text: string };
  createdAt: string;
}

export interface CollectionObjectTypes {
  _id: string;
  creatorData: {
    _id: string;
    pseudonim: string;
  };
  title: string;
  description: string;
  shortDescription: string;
  imgs: ImgTypes[];
  categories: CategoryTypes[];
  authors: AuthorTypes[];
  rating: RatingTypes;
  quantity: number;
  market_place: MarketplaceTypes;
  createdAt: string;
  updatedAt: string;
  sold: boolean;
  products: ProductTypes[];
  comments: CommentTypes[];
  price: PriceTypes;
}

export interface CollectionCardTypes
  extends Pick<
    CollectionObjectTypes,
    | '_id'
    | 'title'
    | 'price'
    | 'imgs'
    | 'rating'
    | 'shortDescription'
    | 'authors'
    | 'categories'
  > {
  showOnly?: boolean;
  productQuantity: number;
  type: MarketplaceTypes;
}
