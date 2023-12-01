import ProductCard from '@components/cards/ProductCard';
import Pagination from '@components/paginations/Pagination';
import { ProductTypes } from '@customTypes/interfaces';

interface AllCollectionsListTypes {
  limit: number;
  collections: ProductTypes[];
  page: number;
  totalPages?: number;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}

export default function AllCollectionsList({
  limit,
  collections,
  onPageChange,
  page,
  totalPages,
}: AllCollectionsListTypes) {
  return (
    <>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {collections.length <= 0 && <div>No collections.</div>}
        {collections.length > 0 &&
          collections.map((collection) => (
            <ProductCard
              key={collection._id}
              _id={collection._id}
              title={collection.title}
              price={collection.price.value}
              rating={collection.rating}
              img={
                collection.imgs && collection.imgs.length > 0
                  ? collection.imgs[0].url
                  : ''
              }
              shortDescription={collection.shortDescription}
              authors={collection.authors}
              categories={collection.categories}
              type="collection"
              productQuantity={collection.quantity}
            />
          ))}
      </div>

      {totalPages !== undefined && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            pageSize={limit}
            onPageChange={(newPageNumber: number) =>
              onPageChange(newPageNumber)
            }
            totalCount={totalPages}
            siblingCount={1}
          />
        </div>
      )}
    </>
  );
}
