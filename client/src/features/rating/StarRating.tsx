import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { useSearchParams } from 'react-router-dom';

export default function StarRating({
  showOnly = false,
  rating,
  changeUrl,
  changeRatingHandler,
}: {
  showOnly?: boolean;
  rating: number;
  changeUrl?: boolean;
  changeRatingHandler?: (rateValue: number) => void;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [hoveredValue, setHoveredValue] = useState(0);

  const changeUrlHandler = (rateValue: number) => {
    searchParams.set('rating', `${rateValue}`);
    setSearchParams(searchParams, { replace: true });
  };

  const handleStarClick = (value: number) => {
    if (!showOnly && (changeRatingHandler || changeUrlHandler)) {
      if (value === rating) {
        if (changeUrl) {
          changeUrlHandler(0);
        } else if (changeRatingHandler) {
          changeRatingHandler(0);
        }
      } else {
        if (changeUrl) {
          changeUrlHandler(value);
        } else if (changeRatingHandler) {
          changeRatingHandler(value);
        }
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
          } ${colorClass} h-5 w-5 transition ease-out`}
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
