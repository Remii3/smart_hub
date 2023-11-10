import { useCallback, useEffect, useState } from 'react';
import { CollectionCardTypes, FetchDataTypes } from '@customTypes/interfaces';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import errorToast from '@components/UI/error/errorToast';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import CollectionCard from '@components/cards/CollectionCard';

interface CollectionsTypes extends FetchDataTypes {
  data: null | CollectionCardTypes[];
}
interface PropsTypes {
  title: string;
  subtitle?: string;
  showMore?: boolean;
  category: string;
}
const defaultProps = {
  showMore: false,
  subtitle: null,
};
export default function BasicCollectionWidget({
  title,
  subtitle,
  showMore,
  category,
}: PropsTypes) {
  const [collections, setCollections] = useState<CollectionsTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });

  const fetchData = useCallback(async () => {
    setCollections((prevState) => {
      return { ...prevState, isLoading: false };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COLLECTION_ALL,
    });
    if (error) {
      errorToast(error);
      return setCollections((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setCollections({ data, hasError: null, isLoading: false });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <article className="relative">
      <h3 className="mb-4">{title}</h3>
      {subtitle && <div>{subtitle}</div>}
      <section>
        {collections.isLoading && <LoadingCircle />}
        {collections.hasError && (
          <ErrorMessage message={collections.hasError} />
        )}
        {collections.data && collections.data.length <= 0 && (
          <div>There are no collections!</div>
        )}
        {collections.data &&
          collections.data.map((collection) => (
            <CollectionCard
              key={collection._id}
              _id={collection._id}
              imgs={collection.imgs}
              price={collection.price}
              rating={collection.rating}
              shortDescription={collection.shortDescription}
              title={collection.title}
            />
          ))}
      </section>
    </article>
  );
}

BasicCollectionWidget.defaultProps = defaultProps;
