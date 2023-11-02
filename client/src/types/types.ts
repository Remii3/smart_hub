import { AuthorTypes } from './interfaces';

export enum UserRoleTypes {
  USER = 'User',
  AUTHOR = 'Author',
  ADMIN = 'Admin',
}
export enum MarketPlaceTypes {
  AUCTION = 'Auction',
  SHOP = 'Shop',
  COLLECTION = 'Collection',
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

export type MarketplaceType = MarketPlaceTypes.AUCTION | MarketPlaceTypes.SHOP;

export const MARKETPLACES = [MarketPlaceTypes.AUCTION, MarketPlaceTypes.SHOP];

export type ImgTypes = { id: string; url: string };

export type VoteType = 'Like' | 'Dislike';

export type RatingTypes = {
  value: number;
  quantity: number;
};
