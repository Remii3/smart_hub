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
    console.log(rating);
    let preparedRating = 0;
    let count = 0;
    for (let i = 0; i < rating.length; i++) {
      if (rating[i].rating) {
        count += rating[i].rating;
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
