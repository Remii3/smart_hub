import { useContext } from 'react';
import { UserContext } from '@context/UserProvider';
import ShopCard from '@components/cards/ShopCard';
import AuctionCard from '@components/cards/AuctionCard';

export default function MyProductsPage() {
  const { userData } = useContext(UserContext);
  return (
    <section className="mx-auto max-w-7xl">
      <p className="pb-2 pt-4 text-lg">All products:</p>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 xl:grid-cols-3">
        {userData &&
          userData.author_info.my_products &&
          userData.author_info.my_products.map((product) => {
            return product.market_place === 'Shop' ? (
              <ShopCard
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
                _id={product._id}
                title={product.title}
                authors={product.authors}
                description={product.description}
                img={product.img}
                auctionEndDate={product.auction_info.auction_end_date}
                currentPrice={product.auction_info.current_price}
                startingPrice={product.auction_info.starting_price}
              />
            );
          })}
      </div>
    </section>
  );
}
