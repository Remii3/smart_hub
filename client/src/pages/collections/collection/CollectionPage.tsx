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
import { Form, FormControl, FormField, FormItem } from '@components/UI/form';
import { Input } from '@components/UI/input';
import SushiSwiper from '@components/swiper/SushiSwiper';
import { UserContext } from '@context/UserProvider';
import {
  CollectionObjectTypes,
  FetchDataTypes,
  PostDataTypes,
} from '@customTypes/interfaces';
import { UserRoleTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import Comments from '@features/comments/Comments';
import StarRating from '@features/rating/StarRating';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from 'html-react-parser';
import ProductForm from '@pages/shop/product/ProductForm';
import CollectionForm from './CollectionForm';

interface CollectionTypes extends FetchDataTypes {
  data: null | CollectionObjectTypes;
}

const formSchema = z.object({
  title: z.string().nonempty(),
  shortDescription: z.string(),
  quantity: z.number(),
  price: z.number(),
});

interface EditingTypes extends PostDataTypes {
  isEditing: boolean;
}

export default function CollectionPage() {
  const [collection, setCollection] = useState<CollectionTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });
  const [newDescription, setNewDescription] = useState('');
  const [isMyCollection, setIsMyCollection] = useState(false);
  const { userData, fetchUserData } = useContext(UserContext);
  const [isEditing, setIsEditing] = useState<EditingTypes>({
    hasError: null,
    isLoading: false,
    isSuccess: false,
    isEditing: false,
  });

  const collectionId = window.location.href.split('/').at(-1);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

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

    setNewDescription(data.description);
    form.reset({
      title: data.title,
      shortDescription: data.shortDescription,
      quantity: data.quantity,
      price: Number(data.price.value.slice(1)),
    });
  }, []);
  const clearForm = () => {
    form.reset({
      title: collection.data ? collection.data.title : '',
      shortDescription: collection.data ? collection.data.shortDescription : '',
      quantity: collection.data ? collection.data.quantity : 0,
      price: collection.data ? Number(collection.data.price.value.slice(1)) : 0,
    });
  };
  useEffect(() => {
    fetchData();
    if (
      userData.data &&
      ((userData.data.role == UserRoleTypes.ADMIN &&
        userData.data.author_info.myCollections.find(
          (collection: CollectionObjectTypes) => collection._id === collectionId
        )) ||
        userData.data.role == UserRoleTypes.ADMIN)
    ) {
      setIsMyCollection(true);
    }
  }, [userData.data]);

  const updateDataHandler = async () => {
    if (!userData.data) return;
    setIsEditing((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const dirtyData = Object.fromEntries(
      Object.keys(form.formState.dirtyFields).map((x: string) => [
        x,
        form.getValues(x as keyof z.infer<typeof formSchema>),
      ])
    );

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COLLECTION_UPDATE_ONE,
      body: { collectionId, description: newDescription, ...dirtyData },
    });

    if (error) {
      errorToast(error);
      return setIsEditing((prevState) => {
        return { ...prevState, hasError: error, isLoading: false };
      });
    }

    fetchData();

    setIsEditing({
      hasError: null,
      isEditing: false,
      isLoading: false,
      isSuccess: true,
    });
    setTimeout(() => {
      setIsEditing((prevState) => {
        return { ...prevState, isSuccess: false };
      });
    }, 2000);
  };

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(updateDataHandler)}>
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
                            Deleting this will permamently remove the item from
                            the database.
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
                      onClick={() => {
                        clearForm();
                        setIsEditing((prevState) => {
                          return {
                            ...prevState,
                            isEditing: !prevState.isEditing,
                          };
                        });
                      }}
                    >
                      {isEditing.isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                    {isEditing.isEditing && (
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
                  {isEditing.isEditing ? (
                    <FormField
                      name="title"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ) : (
                    <h2>{collection.data.title}</h2>
                  )}
                </section>
                <section>
                  <div>{collection.data.updatedAt}</div>
                  <div>
                    {isEditing.isEditing ? (
                      <FormField
                        name="shortDescription"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ) : (
                      <span>{collection.data.shortDescription}</span>
                    )}
                  </div>
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
                  <div>
                    {isEditing.isEditing ? (
                      <FormField
                        name="quantity"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ) : (
                      <span>{collection.data.quantity}</span>
                    )}
                  </div>
                  <div>
                    {isEditing.isEditing ? (
                      <FormField
                        name="price"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ) : (
                      <span>{collection.data.price.value}</span>
                    )}
                  </div>
                </section>
              </form>
            </Form>
            <CollectionForm
              productId={collectionId}
              productQuantity={collection.data.quantity}
              isEditing={isEditing.isEditing}
              sold={collection.data.sold}
            />
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
            <div>
              {isEditing.isEditing ? (
                <CKEditor
                  editor={ClassicEditor}
                  data={newDescription}
                  config={{
                    mediaEmbed: { previewsInData: true },
                    toolbar: {
                      shouldNotGroupWhenFull: true,
                      items: [
                        'alignment',
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',

                        'blockQuote',
                        'insertTable',
                        'mediaEmbed',
                        'undo',
                        'redo',
                      ],
                    },
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setNewDescription(data);
                  }}
                />
              ) : (
                <article className="prose">
                  {parse(collection.data.description)}
                </article>
              )}
            </div>
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
