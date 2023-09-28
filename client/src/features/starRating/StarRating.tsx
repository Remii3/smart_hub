import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface NewCommentTypes {
  rating: null | number;
  value: string;
  isLoading: boolean;
  error: null | string;
}

export default function StarRating({
  initialValue,
  showOnly = false,
  rating,
  setRating,
}: {
  initialValue?: number | null;
  showOnly?: boolean;
  rating: number;
  setRating?: React.Dispatch<React.SetStateAction<NewCommentTypes>>;
}) {
  const [hoveredValue, setHoveredValue] = useState(0);
  // const [clickedValue, setClickedValue] = useState(initialValue || 0);

  const handleStarClick = (value: number) => {
    if (!showOnly && setRating) {
      if (value === rating) {
        setRating((prevState) => {
          return { ...prevState, rating: 0 };
        });
      } else {
        setRating((prevState) => {
          return { ...prevState, rating: value };
        });
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
          } ${colorClass} transition duration-150 ease-out`}
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
