import { ProductTypes } from '@customTypes/interfaces';

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
  products: ProductTypes[];
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
    filteredProducts = products.filter((product: ProductTypes) => {
      return marketplaces.includes(product.marketplace.toLowerCase());
    });
  }

  if (filterData.filterType === 'Price') {
    if (minPrice === '' && maxPrice === '') {
      filteredProducts = products;
    } else if (minPrice === '') {
      filteredProducts = products.filter(
        (product) => Number(product.price.value.slice(1)) <= Number(maxPrice)
      );
    } else if (maxPrice === '') {
      filteredProducts = products.filter(
        (product) => Number(product.price.value.slice(1)) >= Number(minPrice)
      );
    } else {
      filteredProducts = products.filter((product) => {
        return (
          Number(product.price.value.slice(1)) >= Number(minPrice) &&
          Number(product.price.value.slice(1)) <= Number(maxPrice)
        );
      });
    }
  }
  return { filteredProducts };
}
