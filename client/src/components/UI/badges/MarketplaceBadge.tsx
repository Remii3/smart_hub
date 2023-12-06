import { MarketplaceTypes } from '@customTypes/types';
import { Badge } from '../badge';

export default function MarketplaceBadge({ type }: { type: MarketplaceTypes }) {
  return (
    <Badge
      variant={'outline'}
      className={`${type === 'shop' && 'text-blue-600'} ${
        type === 'collection' && 'text-fuchsia-600'
      } bg-white`}
    >
      {type}
    </Badge>
  );
}
