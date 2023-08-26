import { UnknownProductTypes } from '../types/interfaces';

type FilterTypes = 'Marketplace' | 'Price';

interface FilterProductsTypes {
  filterData: {
    filterType: FilterTypes;
    filterValues: {
      minPrice?: string | number;
      maxPrice?: string | number;
      selectedMarketplace?: {
        name: string;
        isChecked: boolean;
      }[];
    };
  };
  products: UnknownProductTypes[];
}

export default function useFilterProducts({
  products,
  filterData,
}: FilterProductsTypes) {
  const { maxPrice, minPrice, selectedMarketplace } = filterData.filterValues;
  let filteredProducts = products;

  if (filterData.filterType === 'Marketplace' && selectedMarketplace) {
    const marketplaces = [] as string[];
    for (const type of selectedMarketplace) {
      if (type.isChecked) {
        marketplaces.push(type.name.toLowerCase());
      }
    }
    filteredProducts = products.filter((product: UnknownProductTypes) => {
      return marketplaces.includes(product.market_place.toLowerCase());
    });
  }

  if (filterData.filterType === 'Price' && maxPrice && minPrice) {
    if (minPrice === '' && maxPrice === '') {
      filteredProducts = products;
    } else if (minPrice === '') {
      filteredProducts = products.filter(
        (product) => product.shop_info.price <= Number(maxPrice)
      );
    } else if (maxPrice === '') {
      filteredProducts = products.filter(
        (product) => product.shop_info.price >= Number(minPrice)
      );
    } else {
      filteredProducts = products.filter((product) => {
        return (
          product.shop_info.price >= Number(minPrice) &&
          product.shop_info.price <= Number(maxPrice)
        );
      });
    }
  }
  return { filteredProducts };
}
