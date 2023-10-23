import StarRating from '@features/starRating/StarRating';
import { SearchActionKind, SearchActions } from './SearchPage';

interface PropsTypes {
  selectedRating: number;
  dispatch: (e: SearchActions) => void;
}

export default function RatingFilter({ selectedRating, dispatch }: PropsTypes) {
  const handleChange = (rateValue: number) => {
    dispatch({
      type: SearchActionKind.CHANGE_SELECTED_RATING,
      payload: rateValue,
    });
  };
  return (
    <div className="flex items-end gap-1">
      <StarRating rating={selectedRating} changeRatingHandler={handleChange} />
      <span className="block text-sm text-slate-400">{selectedRating}/5</span>
    </div>
  );
}
