export interface ProductTypes {
  _id: string;
  title: string;
  description?: string;
  price: number;
  imgs?: string[];
  categories?: string[];
  authors?: string[];
  rating?: number;
  quantity: number;
  marketPlace: 'Shop' | 'Auction';
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
