import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button } from '@components/UI/button';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import errorToast from '@components/UI/error/errorToast';
import SushiSwiper from '@components/swiper/SushiSwiper';
import { CollectionObjectTypes, FetchDataTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import Comments from '@features/comments/Comments';
import StarRating from '@features/rating/StarRating';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface CollectionTypes extends FetchDataTypes {
  data: null | CollectionObjectTypes;
}

export default function CollectionPage() {
  const [collection, setCollection] = useState<CollectionTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });

  const collectionId = window.location.href.split('/').at(-1);

  const fetchData = useCallback(async () => {
    setCollection((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COLLECTION_ONE,
      params: { _id: collectionId },
    });

    if (error) {
      errorToast(error);
      return setCollection({ data: null, hasError: error, isLoading: false });
    }

    setCollection({ data, hasError: null, isLoading: false });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="relative">
      {collection.isLoading && <LoadingCircle />}
      {collection.hasError && <ErrorMessage message={collection.hasError} />}
      {collection.data && (
        <div>
          <article>
            <section>
              <h2>{collection.data.title}</h2>
            </section>
            <section>
              <div>{collection.data.updated_at}</div>
              <div>{collection.data.shortDescription}</div>
              <div>
                <StarRating
                  rating={collection.data.rating.avgRating}
                  showOnly
                />
              </div>
              <div>
                {collection.data.authors.map((author) => (
                  <Link key={author._id} to={`/account/${author._id}`}>
                    {author.author_info.pseudonim}
                  </Link>
                ))}
              </div>

              <div>
                {collection.data.categories.map((category) => (
                  <Link
                    key={category._id}
                    to={{
                      pathname: '/search',
                      search: `category=${category.value}`,
                    }}
                    className="pr-2"
                  >
                    {category.label}
                  </Link>
                ))}
              </div>
              <div>{collection.data.quantity}</div>
              <div>{collection.data.price.value}</div>
              <Button variant={'default'}>Add to cart</Button>
            </section>
          </article>
          <article>
            <SushiSwiper
              arrayOfItems={collection.data.products}
              itemsType="Shop"
              swiperCategory="products"
            />
          </article>
          <article>
            <h3>Description</h3>
            <div>{collection.data.description}</div>
          </article>
          <article>
            <Comments
              withRating
              target="Collection"
              targetId={collection.data._id}
            />
          </article>
        </div>
      )}
    </section>
  );
}
