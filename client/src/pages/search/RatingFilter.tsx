import StarRating from '@features/starRating/StarRating';
import { useSearchParams } from 'react-router-dom';

export default function RatingFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (rateValue: number) => {
    searchParams.set('rating', `${rateValue}`);
    setSearchParams(searchParams, { replace: true });
  };
  return (
    <div className="flex items-end gap-1">
      <StarRating
        rating={Number(searchParams.get('rating'))}
        changeRatingHandler={handleChange}
      />
      <span className="block text-sm text-slate-400">
        {searchParams.get('rating') || 5}/5
      </span>
    </div>
  );
}
