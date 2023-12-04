import StarRating from '@features/rating/StarRating';
import { useSearchParams } from 'react-router-dom';

export default function RatingFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="flex items-end gap-2">
      <StarRating rating={Number(searchParams.get('rating'))} changeUrl />
      <span className="text-sm text-muted-foreground">
        {searchParams.get('rating') || 5}/5
      </span>
    </div>
  );
}
