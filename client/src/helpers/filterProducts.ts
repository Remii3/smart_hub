import { ProductTypes } from '../types/interfaces';

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
    return products.filter((product) => product.price <= Number(maxPrice));
  }

  if (maxPrice === '') {
    return products.filter((product) => product.price >= Number(minPrice));
  }

  return products.filter((product) => {
    return (
      product.price >= Number(minPrice) && product.price <= Number(maxPrice)
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
