import { AuthorTypes } from './interfaces';

export enum UserRoleTypes {
  USER = 'User',
  AUTHOR = 'Author',
  ADMIN = 'Admin',
}
// export enum MarketPlaceTypes {
//   SHOP = 'Shop',
//   COLLECTION = 'Collection',
// }

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

export type MarketplaceTypes = 'Shop' | 'Collection';

export type VoteType = 'Like' | 'Dislike';

export type RatingTypes = {
  avgRating: number;
  quantity: number;
};

export type PriceTypes = {
  value: string;
  currency: string;
};