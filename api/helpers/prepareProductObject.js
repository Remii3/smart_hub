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
    marketplace,
    createdAt,
    sold,
    comments,
    currency,
    price,
    auctionInfo,
    sellerData,
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
    marketplace,
    createdAt,
    sold,
    comments,
    currency,
    sellerData,
    deleted,
    price,
  };

  return preparedObject;
};

module.exports = prepareProductObject;
