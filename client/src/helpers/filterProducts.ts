import { ProductTypes } from '../types/interfaces';
import { MarketPlaceTypes } from '../types/types';

export function filterProductsByPrice({
  minPrice,
  maxPrice,
  products,
}: {
  minPrice: number | string;
  maxPrice: number | string;
  products: ProductTypes[];
}) {
  if (minPrice === '' && maxPrice === '') {
    return products;
  }

  if (minPrice === '') {
    return products.filter(
      (product) => product.price.value <= Number(maxPrice)
    );
  }

  if (maxPrice === '') {
    return products.filter(
      (product) => product.price.value >= Number(minPrice)
    );
  }

  return products.filter((product) => {
    return (
      product.price.value >= Number(minPrice) &&
      product.price.value <= Number(maxPrice)
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
  products: ProductTypes[];
}) {
  const marketplaces = [] as string[];
  for (const type of selectedMarketplace) {
    if (type.isChecked) {
      marketplaces.push(type.name.toLowerCase());
    }
  }
  return products.filter((product) => {
    return marketplaces.includes(product.marketPlace.toLowerCase());
  });
}
