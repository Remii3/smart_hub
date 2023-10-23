import { ReactNode, createContext, useMemo, useReducer, useState } from 'react';

export const SearchContext = createContext({
  marketplaceState: [
    {
      name: 'shop',
      isChecked: true,
    },
    {
      name: 'collection',
      isChecked: false,
    },
  ],
  priceRangeState: {
    minPrice: '',
    maxPrice: '',
  },
  ratingState: {
    rating: 0,
    touched: false,
  },
});

const defaultData = {
  data: 'hello',
};

const searchReducer = (state, action) => {};

export default function SearchProvider({ children }: { children: ReactNode }) {
  const [searchState, dispatch] = useReducer();
  const searchValues = useMemo();
  return (
    <SearchContext.Provider value={null}>{children}</SearchContext.Provider>
  );
}
