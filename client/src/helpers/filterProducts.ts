import { UnknownProductTypes } from '../types/interfaces';

export function filterProductsByPrice({
  minPrice,
  maxPrice,
  products,
}: {
  minPrice: number | string;
  maxPrice: number | string;
  products: UnknownProductTypes[];
}) {
  if (minPrice === '' && maxPrice === '') {
    return products;
  }

  if (minPrice === '') {
    return products.filter(
      (product) => product.shop_info.price <= Number(maxPrice)
    );
  }

  if (maxPrice === '') {
    return products.filter(
      (product) => product.shop_info.price >= Number(minPrice)
    );
  }

  return products.filter((product) => {
    return (
      product.shop_info.price >= Number(minPrice) &&
      product.shop_info.price <= Number(maxPrice)
    );
  });
}

export function filterProductsById({
  minPrice,
  maxPrice,
}: {
  minPrice: number;
  maxPrice: number;
}) {}

export function filterProductsByMarketplace({
  selectedMarketplace,
  products,
}: {
  selectedMarketplace: {
    name: string;
    isChecked: boolean;
  }[];
  products: UnknownProductTypes[];
}) {
  const marketplaces = [] as string[];
  for (const type of selectedMarketplace) {
    if (type.isChecked) {
      marketplaces.push(type.name.toLowerCase());
    }
  }
  return products.filter((product: UnknownProductTypes) => {
    return marketplaces.includes(product.market_place.toLowerCase());
  });
}
