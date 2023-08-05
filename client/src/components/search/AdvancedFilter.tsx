// import TertiaryBtn from '../UI/Btns/TertiaryBtn';
import { Button, buttonVariants } from '../UI/Btns/Button';
import MarketplaceSelector from './MarketplaceSelector';

type AdvancedFilterTypes = {
  selectedMarketplace: { name: string; isChecked: boolean }[];
  selectMarketplace: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AdvancedFilter({
  selectedMarketplace,
  selectMarketplace,
}: AdvancedFilterTypes) {
  const clearMarketplaceSelectors = () => {};
  const clearAllSelectors = () => {};
  return (
    <div>
      <div>
        <p>Advanced filter</p>
        <Button
          variant="tertiary"
          size="default"
          onClick={() => clearAllSelectors()}
        >
          Clear
        </Button>
      </div>
      <div>
        <div>
          <h6>Type of offer</h6>
          <Button
            variant="tertiary"
            size="default"
            onClick={() => clearMarketplaceSelectors()}
          >
            Clear all
          </Button>
        </div>
        <MarketplaceSelector
          options={selectedMarketplace}
          selectMarketplace={selectMarketplace}
        />
      </div>
      <div>{/* Add price filter */}</div>
      <div>{/* Add star filter */}</div>
    </div>
  );
}
