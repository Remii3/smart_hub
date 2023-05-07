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
  marketPlace: string;
  shippingData?: { height: number; width: number; depth: number } | undefined;
}

export interface ProductCategories {
  _id: string;
  name: string;
  description: string;
}
