import { Link } from 'react-router-dom';

function ShopPage() {
  const mainCategories = ['Categories', 'Prices', 'Types', 'Something'];
  const products = [
    { id: 0, isbn: 123123123, title: 'name1', category: 'book' },
    { id: 1, isbn: 123123123, title: 'name1', category: 'book' },
    { id: 2, isbn: 123123123, title: 'name1', category: 'book' },
    { id: 3, isbn: 123123123, title: 'name1', category: 'book' },
    { id: 4, isbn: 123123123, title: 'name1', category: 'book' },
  ];

  return (
    <div className="min-h-screen">
      <div className="h-[40vh] bg-blue-200">{/* banner */}</div>
      <div className="flex flex-col gap-10 py-10">
        <section>
          <ul className=" mx-auto grid max-w-2xl grid-cols-1 py-5 text-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {mainCategories.map((category, id) => (
              <li
                key={id}
                className="border-r-2 first:border-l-0 last:border-r-0"
              >
                <button type="button" className="w-full py-3">
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h3 className="pb-5 text-center">New series</h3>
          <div className="mx-auto grid max-w-7xl auto-cols-max grid-cols-1 items-center justify-center gap-10 px-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, id) => (
              <Link
                key={id}
                to={`/product/${product.isbn}`}
                className="flex min-h-[200px] w-full items-center justify-center rounded p-1 shadow transition-[transform,box-shadow] duration-300 ease-out hover:scale-105 sm:w-auto"
              >
                {product.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ShopPage;
