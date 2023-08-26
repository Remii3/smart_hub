export enum UserRoleTypes {
  USER = 'User',
  AUTHOR = 'Author',
  ADMIN = 'Admin',
}
export enum MarketPlaceTypes {
  AUCTION = 'Auction',
  SHOP = 'Shop',
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
