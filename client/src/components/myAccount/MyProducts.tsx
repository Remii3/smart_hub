import { ProductTypes } from '../../types/interfaces';
import AuctionCard from '../card/AuctionCard';
import ProductCard from '../card/ProductCard';

export default function MyProducts({
  myProducts,
}: {
  myProducts: ProductTypes[];
}) {
  const shortenedProducts = myProducts.slice(0, 3);
  console.log(shortenedProducts);
  return (
    <div>
      <p className="pb-2 pt-4 text-lg">Latest:</p>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 xl:grid-cols-3">
        {shortenedProducts.map((product) => {
          return product.market_place === 'Shop' ? (
            <ProductCard
              key={product._id}
              _id={product._id}
              price={product.shop_info.price}
              productQuantity={product.quantity}
              title={product.title}
              authors={product.authors}
              description={product.description}
              img={product.img}
            />
          ) : (
            <AuctionCard
              key={product._id}
              _id={product._id}
              title={product.title}
              authors={product.authors}
              description={product.description}
              img={product.img}
              startingPrice={product.auction_info.starting_price}
              currentPrice={product.auction_info.current_price}
              auctionEndDate={product.auction_info.auction_end_date}
            />
          );
        })}
      </div>
    </div>
  );
}
