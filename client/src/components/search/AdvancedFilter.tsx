import TertiaryBtn from '../UI/Btns/TertiaryBtn';
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
        <TertiaryBtn
          type="button"
          usecase="default"
          onClick={clearAllSelectors}
        >
          Clear all
        </TertiaryBtn>
      </div>
      <div>
        <div>
          <h6>Type of offer</h6>
          <TertiaryBtn
            type="button"
            usecase="default"
            onClick={clearMarketplaceSelectors}
          >
            Clear
          </TertiaryBtn>
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
