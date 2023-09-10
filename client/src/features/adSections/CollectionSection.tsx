import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { ProductTypes } from '@customTypes/interfaces';
import MainPageHeading from '@features/headings/MainPageHeading';
import CollectionCard from '@components/cards/CollectionCard';
import { useGetAccessDatabase } from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';

export default function CollectionSection() {
  const [collection, setCollection] = useState<ProductTypes[]>([]);

  const fetchData = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.PRODUCT_ALL,
    });
    setCollection(data);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="relative flex w-full flex-col items-center gap-12 pb-16">
      <div className="w-full bg-white">
        <MainPageHeading
          color="dark"
          usecase="main"
          mainTitle="Discover your next great read"
          subTitle="Unleash the power of imagination, explore new worlds and find
        your next favorite book with us"
        />
      </div>
      <div className="w-full">
        {/* {collection.slice(0, 4).map((collection_data, id) => (
          <CollectionCard
            key={collection_data._id}
            backcolor={(id + 1) % 2 ? 'pageBackground' : 'white'}
            collectionData={collection_data}
            lastItem={collection.length === id + 1}
          />
        ))} */}
      </div>
    </section>
  );
}
