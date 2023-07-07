import { useContext } from 'react';
import { UserContext } from '../context/UserProvider';
import ProductCard from '../components/card/ProductCard';
import AuctionCard from '../components/card/AuctionCard';

export default function MyProductsPage() {
  const { userData } = useContext(UserContext);
  return (
    <section className="mx-auto max-w-7xl">
      <p className="pb-2 pt-4 text-lg">All products:</p>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 xl:grid-cols-3">
        {userData &&
          userData.my_products &&
          userData.my_products.map((product) => {
            return product.marketPlace === 'Shop' ? (
              <ProductCard
                _id={product._id}
                price={product.price}
                productQuantity={product.quantity}
                title={product.title}
                authors={product.authors}
                description={product.description}
                imgs={product.imgs}
              />
            ) : (
              <AuctionCard
                _id={product._id}
                price={product.price}
                title={product.title}
                authors={product.authors}
                description={product.description}
                imgs={product.imgs}
              />
            );
          })}
      </div>
    </section>
  );
}
