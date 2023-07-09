import React from 'react';

type MarketplaceSelectorTypes = {
  options: { name: string; isChecked: boolean }[];
  selectMarketplace: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function MarketplaceSelector({
  options,
  selectMarketplace,
}: MarketplaceSelectorTypes) {
  return (
    <div>
      {options.map((option) => (
        <div key={option.name}>
          <span className="first-letter:uppercase">{option.name}</span>
          <input
            type="checkbox"
            name={option.name}
            onChange={(e) => selectMarketplace(e)}
            checked={option.isChecked}
          />
        </div>
      ))}
    </div>
  );
}
