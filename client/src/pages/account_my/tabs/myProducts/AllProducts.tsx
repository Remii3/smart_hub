import { ProductTypes } from '@customTypes/interfaces';
import Pagination from '@components/paginations/Pagination';
import ProductCard from '@components/cards/ProductCard';

interface PropsTypes {
  products: ProductTypes[];
  limit: number;
  totalPages?: number;
  page: number;
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
}

export default function AllProducts({
  products,
  limit,
  onPageChange,
  page,
  totalPages,
}: PropsTypes) {
  return (
    <>
      <div className="grid h-full grid-cols-1 gap-4 overflow-hidden pb-4 transition-[max-height] duration-300 ease-in-out sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.length <= 0 && <div>No products.</div>}
        {products.length > 0 &&
          products.map((product) => {
            return (
              <ProductCard
                key={product._id}
                _id={product._id}
                categories={product.categories}
                price={product.price.value}
                productQuantity={product.quantity}
                title={product.title}
                authors={product.authors}
                shortDescription={product.shortDescription}
                type={product.marketplace}
                img={
                  (product.imgs &&
                    product.imgs.length > 0 &&
                    product.imgs[0].url) ||
                  null
                }
                rating={product.rating}
              />
            );
          })}
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
