import { useState } from 'react';
import { UnknownProductTypes } from '@customTypes/interfaces';
import AuctionCard from '@components/cards/AuctionCard';
import ShopCard from '@components/cards/ShopCard';
import { Button } from '@components/UI/button';
import useSortProducts from '@hooks/useSortProducts';

interface PropsTypes {
  myProducts: UnknownProductTypes[];
  quantity?: number;
  unfold: boolean;
}

const defaultProps = {
  quantity: 3,
};

export default function MyProducts({
  myProducts,
  quantity,
  unfold,
}: PropsTypes) {
  const [showMore, setShowMore] = useState(false);

  let { sortedProducts } = useSortProducts({
    products: myProducts,
    sortType: 'Date, DESC',
  });
  sortedProducts = sortedProducts.slice(
    0,
    showMore ? myProducts.length : quantity
  );

  return (
    <div>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedProducts.map((product) => {
          return product.market_place === 'Shop' ? (
            <ShopCard
              key={product._id}
              _id={product._id}
              price={product.shop_info.price}
              productQuantity={product.quantity}
              title={product.title}
              authors={product.authors}
              description={product.description}
              img={(product.imgs && product.imgs[0].url) || null}
              rating={product.rating}
            />
          ) : (
            <AuctionCard
              key={product._id}
              _id={product._id}
              title={product.title}
              authors={product.authors}
              description={product.description}
              img={(product.imgs && product.imgs[0].url) || null}
              startingPrice={product.auction_info.starting_price}
              currentPrice={product.auction_info.current_price}
              auctionEndDate={product.auction_info.auction_end_date}
            />
          );
        })}
      </div>
      {unfold && quantity && myProducts.length > quantity && (
        <div className="flex items-center justify-center">
          <Button
            variant="default"
            onClick={() => setShowMore((prevState) => !prevState)}
          >
            {showMore ? 'Show less' : 'Show more'}
          </Button>
        </div>
      )}
    </div>
  );
}
MyProducts.defaultProps = defaultProps;
