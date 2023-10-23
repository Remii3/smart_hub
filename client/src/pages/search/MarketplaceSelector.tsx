import { Checkbox } from '@components/UI/checkbox';
import { Label } from '@components/UI/label';
import { SearchActionKind, SearchActions } from './SearchPage';

interface DispatchTypes extends SearchActions {
  payload: { name: string; state: boolean | string };
}

type MarketplaceSelectorTypes = {
  options: { name: string; isChecked: boolean }[];
  dispatch: (e: DispatchTypes) => void;
};

export default function MarketplaceSelector({
  options,
  dispatch,
}: MarketplaceSelectorTypes) {
  const selectHandler = (state: boolean | string, name: string) => {
    dispatch({
      type: SearchActionKind.CHANGE_SELECTED_MARKETPLACE,
      payload: { state, name },
    });
  };
  return (
    <>
      {options.map((option) => (
        <div key={option.name} className="mb-2 flex items-center gap-1">
          <Label
            htmlFor={`filter-${option.name}`}
            className="font-normal first-letter:uppercase"
          >
            {option.name}
          </Label>
          <Checkbox
            id={`filter-${option.name}`}
            name={option.name}
            onCheckedChange={(state) => selectHandler(state, option.name)}
            checked={option.isChecked}
          />
        </div>
      ))}
    </>
  );
}
