import { ProductTypes } from '../../types/interfaces';
import AuctionCard from '../card/AuctionCard';
import ProductCard from '../card/ProductCard';

export default function MyProducts({
  myProducts,
}: {
  myProducts: ProductTypes[];
}) {
  const shortenedProducts = myProducts.slice(0, 3);

  return (
    <div>
      <p className="pb-2 pt-4 text-lg">Latest:</p>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 xl:grid-cols-3">
        {shortenedProducts.map((product) => {
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
    </div>
  );
}
