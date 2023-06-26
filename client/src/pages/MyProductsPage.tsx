import { useContext } from 'react';
import { UserContext } from '../context/UserProvider';
import DefaultCard from '../components/card/DefaultCard';

export default function MyProductsPage() {
  const { userData } = useContext(UserContext);
  return (
    <section className="mx-auto max-w-7xl">
      <p className="pb-2 pt-4 text-lg">All products:</p>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 xl:grid-cols-3">
        {userData &&
          userData.my_products &&
          userData.my_products.map((product, id) => (
            <DefaultCard
              key={id}
              _id={product._id}
              title={product.title}
              price={product.price}
            />
          ))}
      </div>
    </section>
  );
}
