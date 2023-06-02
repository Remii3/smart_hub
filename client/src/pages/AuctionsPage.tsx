import axios from 'axios';
import { useEffect, useState } from 'react';
import BasicProductCollection from '../components/productCollection/BasicProductCollection';
import { ProductTypes } from '../types/interfaces';

function AuctionsPage() {
  const [auctionProducts, setAuctionProducts] = useState<ProductTypes[]>([]);

  useEffect(() => {
    axios
      .get('/product/auction-products')
      .then((res) => setAuctionProducts(res.data));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="h-[40vh] w-full bg-blue-200">{/* banner */}</div>
      <div className="mx-auto flex max-w-7xl flex-col gap-10 py-10">
        {auctionProducts && (
          <BasicProductCollection
            title="New collection"
            allProducts={auctionProducts}
          />
        )}
        {auctionProducts && (
          <BasicProductCollection
            title="New title"
            showMore
            subTitle="adsasd asdasd"
            allProducts={auctionProducts}
          />
        )}
        {auctionProducts && (
          <BasicProductCollection
            title="New series"
            showMore
            subTitle="
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste
          ipsum tenetur dicta vero id sint ad, natus maxime labore deserunt
          dignissimos facere assumenda in accusamus dolor nihil, minima
          neque beatae.
        "
            allProducts={auctionProducts}
          />
        )}
      </div>
    </div>
  );
}

export default AuctionsPage;
