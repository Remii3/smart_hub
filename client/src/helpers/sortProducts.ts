import { UnknownProductTypes } from '../types/interfaces';

export const sortProductsTypes = {
  DATE_DESC: 'Date, DESC',
  DATE_ASC: 'Date, ASC',
  TITLE_DESC: 'Title, DESC',
  TITLE_ASC: 'Title, ASC',
  PRICE_DESC: 'Price, DESC',
  PRICE_ASC: 'Price, ASC',
};

export default function sortProducts({
  products,
  sortType,
}: {
  products: UnknownProductTypes[];
  sortType: string;
}) {
  switch (sortType) {
    case sortProductsTypes.DATE_DESC:
      return products.sort((a, b) => {
        return a.created_at > b.created_at ? -1 : 1;
      });
    case sortProductsTypes.DATE_ASC:
      return products.sort((a, b) => {
        return b.created_at > a.created_at ? -1 : 1;
      });
    case sortProductsTypes.TITLE_DESC:
      return products.sort((a, b) => {
        return a.title > b.title ? -1 : 1;
      });
    case sortProductsTypes.TITLE_ASC:
      return products.sort((a, b) => {
        return b.title > a.title ? -1 : 1;
      });
    case sortProductsTypes.PRICE_DESC: {
      const filteredData = products.filter((product) => {
        return product.shop_info;
      });
      return filteredData.sort((a, b) => {
        return a.shop_info.price > b.shop_info.price ? -1 : 1;
      });
    }

    case sortProductsTypes.PRICE_ASC: {
      const filteredData = products.filter(
        (product) => product.shop_info.price
      );

      return filteredData.sort((a, b) => {
        return b.shop_info.price > a.shop_info.price ? -1 : 1;
      });
    }
    default:
      return products;
  }
}
