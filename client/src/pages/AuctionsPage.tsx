import { useCallback, useEffect, useState } from 'react';
import BasicProductCollection from '@features/productCollections/BasicProductCollection';
import { UnknownProductTypes } from '@customTypes/interfaces';
import { useGetAccessDatabase } from '../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../data/endpoints';

export default function AuctionsPage() {
  const [auctionProducts, setAuctionProducts] = useState<UnknownProductTypes[]>(
    []
  );

  const fetchData = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_AUCTION_ALL,
    });
    setAuctionProducts(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
