import { UnknownProductTypes } from '@customTypes/interfaces';

export type SortType =
  | 'Date, DESC'
  | 'Date, ASC'
  | 'Title, DESC'
  | 'Title, ASC'
  | 'Price, DESC'
  | 'Price, ASC';

type SortOptionsType =
  | 'DATE_DESC'
  | 'DATE_ASC'
  | 'TITLE_DESC'
  | 'TITLE_ASC'
  | 'PRICE_DESC'
  | 'PRICE_ASC';

export const sortOptions: Record<SortOptionsType, SortType> = {
  DATE_DESC: 'Date, DESC',
  DATE_ASC: 'Date, ASC',
  TITLE_DESC: 'Title, DESC',
  TITLE_ASC: 'Title, ASC',
  PRICE_DESC: 'Price, DESC',
  PRICE_ASC: 'Price, ASC',
};

type SortOptionEntryType = [string, SortType];
type SortOptionObjectType = { key: string; value: SortType };

export const sortOptionsArray: SortOptionObjectType[] = Object.entries(
  sortOptions
).map(([key, value]: SortOptionEntryType) => ({ key, value }));

export default function useSortProducts({
  products,
  sortType,
}: {
  products: UnknownProductTypes[];
  sortType: SortType;
}) {
  let sortedProducts = null;
  switch (sortType) {
    case sortOptions.DATE_DESC: {
      sortedProducts = products.sort((a, b) => {
        return a.created_at > b.created_at ? -1 : 1;
      });
      break;
    }
    case sortOptions.DATE_ASC: {
      sortedProducts = products.sort((a, b) => {
        return b.created_at > a.created_at ? -1 : 1;
      });
      break;
    }
    case sortOptions.TITLE_DESC: {
      sortedProducts = products.sort((a, b) => {
        return a.title > b.title ? -1 : 1;
      });
      break;
    }
    case sortOptions.TITLE_ASC: {
      sortedProducts = products.sort((a, b) => {
        return b.title > a.title ? -1 : 1;
      });
      break;
    }
    case sortOptions.PRICE_DESC: {
      const filteredData = products.filter((product) => {
        return product.shop_info;
      });
      sortedProducts = filteredData.sort((a, b) => {
        return Number(a.shop_info.price) > Number(b.shop_info.price) ? -1 : 1;
      });
      break;
    }

    case sortOptions.PRICE_ASC: {
      const filteredData = products.filter((product) => {
        return product.shop_info;
      });
      sortedProducts = filteredData.sort((a, b) => {
        return Number(a.shop_info.price) < Number(b.shop_info.price) ? -1 : 1;
      });
      break;
    }
    default:
      sortedProducts = products;
      break;
  }
  return { sortedProducts };
}
