const calculateAvgRating = comments => {
  const ratingComments = comments.filter(comment => comment.value.rating);

  return {
    avgRating:
      ratingComments.length > 0
        ? ratingComments.reduce((accumulator, comment) => {
            return accumulator + comment.value.rating;
          }, 0) / ratingComments.length
        : 0,
    quantity: ratingComments.length,
  };
};

module.exports = calculateAvgRating;
