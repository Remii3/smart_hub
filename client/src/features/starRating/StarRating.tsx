import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

export default function StarRating({
  initialValue,
  showOnly = false,
}: {
  initialValue: number;
  showOnly: boolean;
}) {
  const [hoveredValue, setHoveredValue] = useState(0);
  const [clickedValue, setClickedValue] = useState(0);

  const handleStarClick = (value: number) => {
    if (value === clickedValue) {
      setClickedValue(0);
    } else {
      setClickedValue(value);
    }
  };
  const handleStarHover = (value: number) => {
    setHoveredValue(value);
  };

  const handleStarLeave = () => {
    setHoveredValue(0);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isClicked = i <= clickedValue;
      const isHovered = i <= hoveredValue;

      const colorClass = isClicked || isHovered ? 'text-yellow-400' : '';

      stars.push(
        <StarIcon
          key={i}
          className={`cursor-pointer ${colorClass} transition duration-150 ease-out`}
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
