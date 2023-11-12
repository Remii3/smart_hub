import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button } from '@components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/UI/dialog';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import errorToast from '@components/UI/error/errorToast';
import SushiSwiper from '@components/swiper/SushiSwiper';
import { UserContext } from '@context/UserProvider';
import { CollectionObjectTypes, FetchDataTypes } from '@customTypes/interfaces';
import { UserRoleTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import Comments from '@features/comments/Comments';
import StarRating from '@features/rating/StarRating';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CollectionTypes extends FetchDataTypes {
  data: null | CollectionObjectTypes;
}

export default function CollectionPage() {
  const [collection, setCollection] = useState<CollectionTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });
  const [isMyCollection, setIsMyCollection] = useState(false);
  const { userData, fetchUserData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState(false);
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
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
    if (
      userData.data &&
      ((userData.data.role == UserRoleTypes.AUTHOR &&
        userData.data.author_info.myCollections.find(
          (collection: CollectionObjectTypes) => collection._id === collectionId
        )) ||
        userData.data.role == UserRoleTypes.ADMIN)
    ) {
      setIsMyCollection(true);
    }
  }, []);
  const deleteHandler = async () => {
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COLLECTION_DELETE_ONE,
      body: { collectionId },
    });
    if (error) {
      errorToast(error);
    }
    fetchUserData();
    navigate(-1);
  };
  return (
    <section className="relative">
      {collection.isLoading && <LoadingCircle />}
      {collection.hasError && <ErrorMessage message={collection.hasError} />}
      {collection.data && (
        <div>
          <article>
            {isMyCollection && (
              <div className="absolute right-0 top-0 flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={'ghost'}
                      className="hover:text-400 text-red-400"
                    >
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you sure?</DialogTitle>
                      <DialogDescription>
                        Deleting this will permamently remove the item from the
                        database.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        type="button"
                        onClick={deleteHandler}
                        variant={'destructive'}
                      >
                        Delete
                      </Button>
                      <DialogTrigger asChild>
                        <Button variant={'outline'} type="button">
                          Cancel
                        </Button>
                      </DialogTrigger>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  type="button"
                  variant={'outline'}
                  onClick={() => setIsEditing((prevState) => !prevState)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                {isEditing && (
                  <Button
                    type="submit"
                    variant={'outline'}
                    className="text-green-600 hover:text-green-600"
                  >
                    Accept
                  </Button>
                )}
              </div>
            )}
            <section>
              <h2>{collection.data.title}</h2>
            </section>
            <section>
              <div>{collection.data.updatedAt}</div>
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
              itemsType="shop"
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
