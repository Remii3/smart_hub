import { UnknownProductTypes } from '@customTypes/interfaces';

interface SortProductsTypes {
  DATE_DESC: 'Date, DESC';
  DATE_ASC: 'Date, ASC';
  TITLE_DESC: 'Title, DESC';
  TITLE_ASC: 'Title, ASC';
  PRICE_DESC: 'Price, DESC';
  PRICE_ASC: 'Price, ASC';
}
type SortTypePropsTypes =
  | 'Date, DESC'
  | 'Date, ASC'
  | 'Title, DESC'
  | 'Title, ASC'
  | 'Price, DESC'
  | 'Price, ASC';

export const sortProductsTypes = {
  DATE_DESC: 'Date, DESC',
  DATE_ASC: 'Date, ASC',
  TITLE_DESC: 'Title, DESC',
  TITLE_ASC: 'Title, ASC',
  PRICE_DESC: 'Price, DESC',
  PRICE_ASC: 'Price, ASC',
} as SortProductsTypes;

export default function useSortProducts({
  products,
  sortType,
}: {
  products: UnknownProductTypes[];
  sortType: SortTypePropsTypes;
}) {
  let sortedProducts = null;
  switch (sortType) {
    case sortProductsTypes.DATE_DESC: {
      sortedProducts = products.sort((a, b) => {
        return a.created_at > b.created_at ? -1 : 1;
      });
      break;
    }
    case sortProductsTypes.DATE_ASC: {
      sortedProducts = products.sort((a, b) => {
        return b.created_at > a.created_at ? -1 : 1;
      });
      break;
    }
    case sortProductsTypes.TITLE_DESC: {
      sortedProducts = products.sort((a, b) => {
        return a.title > b.title ? -1 : 1;
      });
      break;
    }
    case sortProductsTypes.TITLE_ASC: {
      sortedProducts = products.sort((a, b) => {
        return b.title > a.title ? -1 : 1;
      });
      break;
    }
    case sortProductsTypes.PRICE_DESC: {
      const filteredData = products.filter((product) => {
        return product.shop_info;
      });
      sortedProducts = filteredData.sort((a, b) => {
        return a.shop_info.price > b.shop_info.price ? 1 : -1;
      });
      break;
    }

    case sortProductsTypes.PRICE_ASC: {
      const filteredData = products.filter(
        (product) => product.shop_info.price
      );

      sortedProducts = filteredData.sort((a, b) => {
        return b.shop_info.price > a.shop_info.price ? -1 : 1;
      });
      break;
    }
    default:
      sortedProducts = products;
      break;
  }
  return { sortedProducts };
}
