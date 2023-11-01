import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

export default function StarRating({
  showOnly = false,
  rating,
  changeRatingHandler,
}: {
  showOnly?: boolean;
  rating: number;
  changeRatingHandler?: (rateValue: number) => void;
}) {
  const [hoveredValue, setHoveredValue] = useState(0);

  const handleStarClick = (value: number) => {
    if (!showOnly && changeRatingHandler) {
      if (value === rating) {
        changeRatingHandler(0);
      } else {
        changeRatingHandler(value);
      }
    }
  };
  const handleStarHover = (value: number) => {
    if (!showOnly) {
      setHoveredValue(value);
    }
  };

  const handleStarLeave = () => {
    if (!showOnly) {
      setHoveredValue(0);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isClicked = i <= rating;
      const isHovered = i <= hoveredValue;

      const colorClass = isClicked || isHovered ? 'text-yellow-400' : '';

      stars.push(
        <StarIcon
          key={i}
          className={`${
            showOnly ? '' : 'cursor-pointer'
          } ${colorClass} h-5 w-5 transition duration-150 ease-out`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
        />
      );
    }
    return stars;
  };

  return <div className="flex items-center space-x-1">{renderStars()}</div>;
}
