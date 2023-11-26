import { AuthorTypes } from './interfaces';

export enum UserRoleTypes {
  USER = 'User',
  AUTHOR = 'Author',
  ADMIN = 'Admin',
}

export type UserRoleType =
  | UserRoleTypes.USER
  | UserRoleTypes.AUTHOR
  | UserRoleTypes.ADMIN;

export const USER_ROLES = [
  UserRoleTypes.ADMIN,
  UserRoleTypes.AUTHOR,
  UserRoleTypes.USER,
];

// export const MARKETPLACES = [MarketPlaceTypes.SHOP];

export type ImgTypes = { id: string; url: string };

export type MarketplaceTypes = 'shop' | 'collection';

export type VoteType = 'Like' | 'Dislike';

export type RatingTypes = {
  avgRating: number;
  quantity: number;
};

export type PriceTypes = {
  value: string;
  currency: string;
};
