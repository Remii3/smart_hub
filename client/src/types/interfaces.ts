export interface ProductTypes {
  _id: string;
  title: string;
  author?: string | undefined;
  categories?: string[] | undefined;
  description?: string | undefined;
  imgs?: string[] | undefined;
  quantity?: number | undefined;
  language?: string | undefined;
  price: number;
  marketPlace: 'Shop' | 'Auction';
  shippingData?: { height: number; width: number; depth: number } | undefined;
}

export interface ProductCategories {
  _id: string;
  name: string;
  description: string;
}

export interface UserDataTypes {
  _id: string;
  email: string;
  cartData: { products: ProductTypes[]; _id: string };
  credentials: { firstName: string; lastName: string };
  my_products: ProductTypes[];
}

export interface SimpleFetchDataTypes {
  isLoading: boolean;
  hasError: null | string;
}
