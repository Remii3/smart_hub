import errorToast from '@components/UI/error/errorToast';
import CollectionCard from '@components/cards/CollectionCard';
import { CollectionObjectTypes, FetchDataTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';

interface CollectionsTypes extends FetchDataTypes {
  data: null | CollectionObjectTypes[];
}

export default function MyCollections() {
  const [collections, setCollections] = useState<CollectionsTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });

  const fetchData = useCallback(async () => {
    setCollections((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COLLECTION_ALL,
    });
    if (error) {
      errorToast(error);
      return setCollections({ data: null, hasError: error, isLoading: false });
    }
    setCollections({ data, hasError: null, isLoading: false });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);
  console.log(collections);
  return (
    <div>
      {collections.data &&
        collections.data.length > 0 &&
        !collections.hasError &&
        !collections.isLoading && (
          <div>
            {collections.data.map((collection) => (
              <CollectionCard
                key={collection._id}
                _id={collection._id}
                title={collection.title}
                price={collection.price}
                rating={collection.rating}
                imgs={collection.imgs}
                shortDescription={collection.shortDescription}
              />
            ))}
          </div>
        )}
    </div>
  );
}
