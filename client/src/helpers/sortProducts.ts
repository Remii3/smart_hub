import { ProductTypes } from '../types/interfaces';

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
  products: ProductTypes[];
  sortType: string;
}) {
  switch (sortType) {
    case sortProductsTypes.DATE_DESC:
      return products.sort((a, b) => {
        return a.addedDate.getTime() > b.addedDate.getTime() ? -1 : 1;
      });
    case sortProductsTypes.DATE_ASC:
      return products.sort((a, b) => {
        return b.addedDate.getTime() > a.addedDate.getTime() ? -1 : 1;
      });
    case sortProductsTypes.TITLE_DESC:
      return products.sort((a, b) => {
        return a.title > b.title ? -1 : 1;
      });
    case sortProductsTypes.TITLE_ASC:
      return products.sort((a, b) => {
        return b.title > a.title ? -1 : 1;
      });
    case sortProductsTypes.PRICE_DESC:
      return products.sort((a, b) => {
        return a.price > b.price ? -1 : 1;
      });
    case sortProductsTypes.PRICE_ASC:
      return products.sort((a, b) => {
        return b.price > a.price ? -1 : 1;
      });
    default:
      return products;
  }
}
