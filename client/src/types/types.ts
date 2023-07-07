// cards
export type SepcialAuctionCardType = {
  _id: string;
  title: string;
  description?: string;
  price: { value: number; currency: string };
  imgs?: string[];
  highBid?: number;
  swipedFlag: boolean;
  deadline: Date | null;
};

export type ProductCardType = {
  _id: string;
  title: string;
  authors?: string[];
  price: { value: number; currency: string };
  imgs?: string[];
  description?: string;
  productQuantity: number;
};

export type AuctionCardType = {
  _id: string;
  title: string;
  authors?: string[];
  price: { value: number; currency: string };
  imgs?: string[];
  deadline?: Date | null;
  description?: string;
};

export type CategoryCardType = {
  _id: string;
  label: string;
  value: string;
  description: string;
};
