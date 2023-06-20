import { ProductTypes } from '../../types/interfaces';
import DefaultCard from '../card/DefaultCard';
import SecondaryBtn from '../UI/Btns/SecondaryBtn';

export default function MyProducts({
  shownAllProducts,
  myProducts,
  onClick,
}: {
  shownAllProducts: boolean;
  myProducts: ProductTypes[];
  onClick: () => void;
}) {
  return (
    <div>
      <div
        className={`${
          shownAllProducts ? 'max-h-fit' : 'max-h-[554px]'
        } grid h-full grid-cols-1 gap-4 overflow-hidden py-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 xl:grid-cols-3`}
      >
        {myProducts.map((product, id) => (
          <DefaultCard
            key={id}
            _id={product._id}
            title={product.title}
            price={product.price}
          />
        ))}
      </div>

      {myProducts.length > 3 && (
        <div className="mt-3 flex w-full justify-center">
          <SecondaryBtn
            text={shownAllProducts ? 'Hide more' : 'Show more'}
            type="button"
            usecase="outline"
            onClick={onClick}
            additionalStyles={`${
              shownAllProducts
                ? 'bg-gray-400 text-white'
                : 'text-gray-600 bg-white'
            } px-3 py-2`}
          />
        </div>
      )}
    </div>
  );
}
