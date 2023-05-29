import axios from 'axios';
import { useEffect, useState } from 'react';
import { ProductTypes } from '../types/interfaces';
import BasicProductCollection from '../components/productCollection/BasicProductCollection';

function ShopPage() {
  const mainCategories = ['Categories', 'Prices', 'Types', 'Something'];

  const [shopProducts, setShopProducts] = useState<ProductTypes[]>([]);

  useEffect(() => {
    axios.get('/product/shop-get').then((res) => setShopProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="h-[40vh] w-full bg-blue-200">{/* banner */}</div>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 py-10">
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
        {/* map fetched type products */}
        {shopProducts && (
          <BasicProductCollection
            category="action"
            title="New collection"
            allProducts={shopProducts}
          />
        )}
        {shopProducts && (
          <BasicProductCollection
            category="adventure"
            title="New title"
            showMore
            subTitle="adsasd asdasd"
            allProducts={shopProducts}
          />
        )}
        {shopProducts && (
          <BasicProductCollection
            category="science"
            title="New series"
            showMore
            subTitle="
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste
              ipsum tenetur dicta vero id sint ad, natus maxime labore deserunt
              dignissimos facere assumenda in accusamus dolor nihil, minima
              neque beatae.
            "
            allProducts={shopProducts}
          />
        )}
      </div>
    </div>
  );
}

export default ShopPage;
