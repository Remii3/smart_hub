import axios from 'axios';
import { useEffect, useState } from 'react';
import { UnknownProductTypes } from '@customTypes/interfaces';
import BasicProductCollection from '@features/productCollections/BasicProductCollection';

export default function ShopPage() {
  const [shopProducts, setShopProducts] = useState<UnknownProductTypes[]>([]);

  useEffect(() => {
    axios
      .get('/product/shop-products')
      .then((res) => setShopProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="h-[40vh] w-full bg-blue-200">{/* banner */}</div>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 py-10">
        {shopProducts && (
          <BasicProductCollection
            category="action"
            title="New collection"
            allProducts={shopProducts}
            marketPlace="Shop"
          />
        )}
        {shopProducts && (
          <BasicProductCollection
            category="adventure"
            title="New title"
            showMore
            subTitle="adsasd asdasd"
            allProducts={shopProducts}
            marketPlace="Shop"
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
            marketPlace="Shop"
          />
        )}
      </div>
    </div>
  );
}
