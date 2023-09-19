const MAIN_ROUTES = {
  CATEGORY: '/category',
  CART: '/cart',
  ADMIN: '/admin',
  COMMENT: '/comment',
  PRODUCT: '/product',
  ORDER: '/order',
  USER: '/user',
  NEWS: '/news',
};

export const DATABASE_ENDPOINTS = {
  CATEGORY_ALL: `${MAIN_ROUTES.CATEGORY}/all`,
  CATEGORY_ONE: `${MAIN_ROUTES.CATEGORY}/one`,
  CART_ALL: `${MAIN_ROUTES.CART}/all`,
  CART_ADD: `${MAIN_ROUTES.CART}/add`,
  CART_REMOVE: `${MAIN_ROUTES.CART}/remove`,
  CART_INCREMENT: `${MAIN_ROUTES.CART}/increment`,
  CART_DECREMENT: `${MAIN_ROUTES.CART}/decrement`,
  CART_PAYMENT_INTENT: `${MAIN_ROUTES.CART}/create-payment-intent`,
  ADMIN_ALL_USERS: `${MAIN_ROUTES.ADMIN}/users`,
  ADMIN_ONE_USER: `${MAIN_ROUTES.ADMIN}/user`,
  COMMENT_ALL: `${MAIN_ROUTES.COMMENT}/all`,
  COMMENT_ONE: `${MAIN_ROUTES.COMMENT}/one`,
  COMMENT_DELETE: `${MAIN_ROUTES.COMMENT}/delete`,
  ORDER_ALL: `${MAIN_ROUTES.ORDER}/all`,
  ORDER_ONE: `${MAIN_ROUTES.ORDER}/one`,
  PRODUCT_ALL: `${MAIN_ROUTES.PRODUCT}/all`,
  PRODUCT_SHOP_ALL: `${MAIN_ROUTES.PRODUCT}/shop`,
  PRODUCT_AUCTION_ALL: `${MAIN_ROUTES.PRODUCT}/auction`,
  PRODUCT_ONE: `${MAIN_ROUTES.PRODUCT}/one`,
  PRODUCT_SEARCHED: `${MAIN_ROUTES.PRODUCT}/searched`,
  PRODUCT_UPDATE: `${MAIN_ROUTES.PRODUCT}/update`,
  PRODUCT_DELETE: `${MAIN_ROUTES.PRODUCT}/delete`,
  USER_PROFILE: `${MAIN_ROUTES.USER}/profile`,
  USER_OTHER_PROFILE: `${MAIN_ROUTES.USER}/other-profile`,
  USER_GUEST: `${MAIN_ROUTES.USER}/guest`,
  USER_AUTHORS: `${MAIN_ROUTES.USER}/authors`,
  USER_ADMINS: `${MAIN_ROUTES.USER}/admins`,
  USER_REGISTER: `${MAIN_ROUTES.USER}/register`,
  USER_LOGIN: `${MAIN_ROUTES.USER}/login`,
  USER_FOLLOW_ADD: `${MAIN_ROUTES.USER}/follow-add`,
  USER_FOLLOW_REMOVE: `${MAIN_ROUTES.USER}/follow-remove`,
  USER_UPDATE: `${MAIN_ROUTES.USER}/update`,
  NEWS_ALL: `${MAIN_ROUTES.NEWS}/all`,
  NEWS_ONE: `${MAIN_ROUTES.NEWS}/one`,
  NEWS_DELETE: `${MAIN_ROUTES.NEWS}/delete`,
  NEWS_COMMENTS: `${MAIN_ROUTES.NEWS}/comments`,
  NEWS_VOTES_ALL: `${MAIN_ROUTES.NEWS}/votes`,
  NEWS_VOTE_ADD: `${MAIN_ROUTES.NEWS}/vote-add`,
  NEWS_VOTE_REMOVE: `${MAIN_ROUTES.NEWS}/vote-remove`,
};

export const COMMENT_TARGET = {
  NEWS: 'News',
  PRODUCT: 'Product',
};
