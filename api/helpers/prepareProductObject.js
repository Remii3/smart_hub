const prepareProductObject = product => {
  const {
    _id,
    title,
    description,
    img,
    categories,
    authors,
    rating,
    quantity,
    market_place,
    created_at,
    sold,
    comments,
    currency,
    shop_info,
    auction_info,
    seller_data,
    deleted,
  } = product;

  const preparedObject = {
    _id,
    title,
    description,
    img,
    categories,
    authors,
    rating,
    quantity,
    market_place,
    created_at,
    sold,
    comments,
    currency,
    seller_data,
    deleted,
  };

  if (shop_info) {
    preparedObject.shop_info = { price: parseFloat(shop_info.price) };
  }

  if (auction_info) {
    preparedObject.auction_info = {
      starting_price: parseFloat(auction_info.starting_price),
      current_price: auction_info.current_price,
      auction_end_date: auction_info.auction_end_date,
    };
  }

  return preparedObject;
};

module.exports = prepareProductObject;
