import { useCallback, useEffect, useState } from 'react';
import { CollectionTypes, FetchDataTypes } from '@customTypes/interfaces';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import errorToast from '@components/UI/error/errorToast';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import LoadingCircle from '@components/Loaders/LoadingCircle';

interface CollectionsTypes extends FetchDataTypes {
  data: null | CollectionTypes[];
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
      params: { authorId: 'asd' },
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
          collections.data.map((collection) => <section></section>)}
      </section>
    </article>
  );
}

BasicCollectionWidget.defaultProps = defaultProps;
