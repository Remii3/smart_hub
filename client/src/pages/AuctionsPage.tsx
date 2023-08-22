import axios from 'axios';
import { useEffect, useState } from 'react';
import BasicProductCollection from '../components/collections/BasicProductCollection';
import { UnknownProductTypes } from '../types/interfaces';

export default function AuctionsPage() {
  const [auctionProducts, setAuctionProducts] = useState<UnknownProductTypes[]>(
    []
  );

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
            category="adventure"
            title="New collection"
            allProducts={auctionProducts}
            marketPlace="Auction"
          />
        )}
        {auctionProducts && (
          <BasicProductCollection
            category="action"
            title="New title"
            showMore
            subTitle="adsasd asdasd"
            allProducts={auctionProducts}
            marketPlace="Auction"
          />
        )}
        {auctionProducts && (
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
            allProducts={auctionProducts}
            marketPlace="Auction"
          />
        )}
      </div>
    </div>
  );
}
