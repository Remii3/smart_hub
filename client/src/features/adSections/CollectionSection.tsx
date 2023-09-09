import axios from 'axios';
import { useEffect, useState } from 'react';
import { ProductTypes } from '@customTypes/interfaces';
import MainPageHeading from '@features/headings/MainPageHeading';
import CollectionCard from '@components/cards/CollectionCard';

export default function CollectionSection() {
  const [collection, setCollection] = useState<ProductTypes[]>([]);

  useEffect(() => {
    axios.get('/product/all').then((res) => {
      setCollection(res.data);
    });
  }, []);

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
