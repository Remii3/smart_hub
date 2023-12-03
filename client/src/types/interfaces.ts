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
  imgs: ImgTypes[];
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
      productId: string;
      user: UserTypes;
      value: { rating: number; text: string };
      createdAt: string;
    },
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
  userInfo: {
    profileImg: { url: string; id: string };
    credentials: { firstName: string; lastName: string };
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    phone: string;
  };
  following: string[];
  role: UserRoleType;
  securitySettings: {
    hidePrivateInformation: boolean;
  };
}

export interface AuthorTypes extends UserTypes {
  authorInfo: {
    pseudonim: string;
    shortDescription: string;
    quote: string;
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
  buyerId: string;
  status: string;
  products: {
    product: ProductTypes;
    inCartQuantity: number;
    totalPrice: number;
  }[];
  orderPrice: string;
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

export interface CartTypes {
  products: CartProductType[];
  cartPrice: number | null;
  isLoading: boolean;
  isAdding: boolean | string;
  isIncrementing: boolean | string;
  isDecrementing: boolean | string;
  isDeleting: boolean | string;
  additionalData: {
    [index: string]: unknown;
  };
}
export interface CartProductType {
  inCartQuantity: number;
  productData: ProductTypes;
  totalPrice: number;
}
// * Card types

export interface ProductCardTypes {
  _id: string;
  title: string;
  shortDescription: string;
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
  creatorData: { _id: string; pseudonim: string; profileImg: ImgTypes };
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
  creatorData: AuthorTypes;
  targetData: {
    _id: string;
  };
  value: { rating: number; text: string; nickname: string };
  createdAt: string;
  updatedAt: string;
  productId: string;
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
  marketplace: MarketplaceTypes;
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
