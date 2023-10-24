import { Checkbox } from '@components/UI/checkbox';
import { Label } from '@components/UI/label';
import { useSearchParams } from 'react-router-dom';

export default function MarketplaceSelector() {
  const [searchParams, setSearchParams] = useSearchParams();

  const marketplaces = ['shop', 'collection'];

  const selectHandler = (state: boolean | string, name: string) => {
    const all = searchParams.getAll('marketplace');
    if (all.includes(name)) {
      const newList = all.filter((item) => item !== name);
      console.log('newList', newList);
      if (newList.length > 0) {
        newList.forEach((item) => searchParams.set('marketplace', item));
      } else {
        searchParams.delete('marketplace');
      }
    } else {
      searchParams.append('marketplace', name);
    }
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <>
      {marketplaces.map((option) => (
        <div key={option} className="mb-2 flex items-center gap-1">
          <Label
            htmlFor={`filter-${option}`}
            className="font-normal first-letter:uppercase"
          >
            {option}
          </Label>
          <Checkbox
            id={`filter-${option}`}
            name={option}
            onCheckedChange={(state) => selectHandler(state, option)}
            checked={
              searchParams.getAll('marketplace').includes(option) || false
            }
          />
        </div>
      ))}
    </>
  );
}
