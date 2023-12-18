import { ProductTypes } from '@customTypes/interfaces';

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
