import { ProductTypes } from '../../types/interfaces';
import DefaultCard from '../card/DefaultCard';

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
        {shortenedProducts.map((product, id) => (
          <DefaultCard
            key={id}
            _id={product._id}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>
    </div>
  );
}
