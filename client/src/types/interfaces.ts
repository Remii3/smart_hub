export interface ProductTypes {
  _id: string;
  title: string;
  description?: string;
  price: number;
  imgs?: string[];
  categories?: { value: string; label: string; _id: string }[];
  authors?: string[];
  rating?: number;
  quantity: number;
  userProp: { email: string; id: string };
  marketPlace: 'Shop' | 'Auction';
  addedDate: string;
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
}

export interface SimpleFetchDataTypes {
  isLoading: boolean;
  hasError: null | string;
}
