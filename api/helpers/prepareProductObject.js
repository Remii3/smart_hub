const cashFormatter = require('./cashFormatter');

const prepareProductObject = product => {
  let {
    _id,
    title,
    description,
    imgs,
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

  if (rating) {
    let preparedRating = 0;
    let count = 0;
    for (let i = 0; i < rating.length; i++) {
      if (rating[i].value) {
        count += rating[i].value;
      }
    }
    preparedRating = count / rating.length;
    rating = { rating: Math.ceil(preparedRating), count: rating.length };
  }

  const preparedObject = {
    _id,
    title,
    description,
    imgs,
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
    shop_info: {
      price: cashFormatter({ number: shop_info ? shop_info.price : 0 }),
    },
  };

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
