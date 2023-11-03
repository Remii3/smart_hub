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
import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import errorToast from '@components/UI/error/errorToast';
import { Form, FormControl, FormField, FormItem } from '@components/UI/form';
import { Input } from '@components/UI/input';
import { UserContext } from '@context/UserProvider';
import {
  AuthorTypes,
  FetchDataTypes,
  VotingTypes,
} from '@customTypes/interfaces';
import { ImgTypes, UserRoleTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import Comments from '@features/comments/Comments';
import VoteRating from '@features/rating/VoteRating';
import { TrashIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import useUploadImg from '@hooks/useUploadImg';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
interface RatingTypes extends FetchDataTypes {
  data: VotingTypes;
}
interface ArticleDataTypes extends FetchDataTypes {
  data: null | {
    user: AuthorTypes;
    _id: string;
    title: string;
    subtitle: null | string;
    img: null | ImgTypes;
    content: null | string;
    votes: VotingTypes;
  };
}

interface PropsTypes {
  updateNewsList: () => void;
  dialogOpenedHandler: React.Dispatch<React.SetStateAction<string | null>>;
  newsId: string;
}

const newArticleDataSchema = z.object({
  title: z.string().nonempty(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
});

export default function NewsArticle({
  newsId,
  updateNewsList,
  dialogOpenedHandler,
}: PropsTypes) {
  const [openedDialog, setOpenedDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [articleData, setArticleData] = useState<ArticleDataTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });

  const [vote, setVote] = useState<RatingTypes>({
    hasError: null,
    isLoading: false,
    data: { quantity: { likes: null, dislikes: null }, votes: [] },
  });
  const [selectedImg, setSelectedImg] = useState<null | FileList>(null);

  const { userData } = useContext(UserContext);

  const deleteArticleHandler = async (newsId: string) => {
    if (!userData.data) return;
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_DELETE,
      body: { userId: userData.data?._id, newsId },
    });
    if (error) {
      return errorToast(error);
    }
    setOpenedDialog(false);
    dialogOpenedHandler(null);
    setTimeout(() => {
      updateNewsList();
    }, 150);
  };
  const form = useForm<any>({
    resolver: zodResolver(newArticleDataSchema),
  });
  const fetchVotes = async () => {
    setVote((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_VOTES_ALL,
      params: { newsId },
    });
    if (error) {
      errorToast(error);
      return setVote((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setVote({
      data: {
        quantity: {
          likes: data.voting.quantity.likes,
          dislikes: data.voting.quantity.dislikes,
        },
        votes: data.voting.votes,
      },
      hasError: null,
      isLoading: false,
    });
  };

  const fetchData = useCallback(async () => {
    setArticleData((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ONE,
      params: { newsId },
    });
    if (error) {
      return setArticleData((prevState) => {
        return { ...prevState, isLoading: false };
      });
    }
    setArticleData((prevState) => {
      return {
        ...prevState,
        data,
        isLoading: false,
      };
    });
    form.reset({
      title: data.title,
      subtitle: data.subtitle,
      content: data.content,
    });
    setVote({
      data: {
        votes: data.voting.votes,
        quantity: {
          dislikes: data.voting.quantity.dislikes,
          likes: data.voting.quantity.likes,
        },
      },
      hasError: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uploadNewDataHandler = async (
    formResponse: z.infer<typeof newArticleDataSchema>
  ) => {
    const newArticleData = {} as any;
    let img = null;
    for (const [key, value] of Object.entries(formResponse)) {
      if (form.getFieldState(key).isDirty) {
        newArticleData[key] = value;
      }
    }
    if (selectedImg) {
      img = await useUploadImg({
        ownerId: newsId,
        targetLocation: 'News_img',
        selectedFile: selectedImg[0],
      });
    }
    const { data, error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_UPDATE,
      body: { _id: newsId, newData: newArticleData, img },
    });
    if (error) {
      return errorToast(error);
    }
    console.log(newArticleData);
    setIsEditing(false);
    fetchData();
    updateNewsList();
  };
  const editArticleHandler = () => {
    setIsEditing((prevState) => !prevState);
    setSelectedImg(null);
    form.reset();
  };
  return (
    <div>
      {articleData.isLoading && (
        <div>
          <LoadingCircle />
        </div>
      )}
      {articleData.hasError && <ErrorMessage message={articleData.hasError} />}
      {articleData.data && (
        <div className={`${articleData.isLoading && 'invisible'}`}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(uploadNewDataHandler)}>
              {userData.data &&
                (userData.data._id === articleData.data.user._id ||
                  userData.data.role === UserRoleTypes.ADMIN) && (
                  <div>
                    <DeleteDialog
                      deleteHandler={() => deleteArticleHandler(newsId)}
                      openState={openedDialog}
                      openStateHandler={(state) => setOpenedDialog(state)}
                    />
                    <Button
                      variant={'outline'}
                      type="button"
                      onClick={() => editArticleHandler()}
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
              <div className="space-y-6">
                <div className="space-y-2">
                  <VoteRating
                    userId={userData.data?._id}
                    newsId={articleData.data._id}
                    votes={vote.data.votes}
                    quantity={vote.data.quantity}
                    updateVotesHandler={fetchVotes}
                  />
                  {isEditing ? (
                    <>
                      <FormItem>
                        <FormControl>
                          <Input
                            type="file"
                            className="block"
                            name="mainImg"
                            onChange={(e) => setSelectedImg(e.target.files)}
                            accept="image/png, image/jpg, image/jpeg"
                          />
                        </FormControl>
                      </FormItem>
                      {selectedImg && selectedImg.length > 0 && (
                        <img
                          src={URL.createObjectURL(selectedImg[0])}
                          alt="imgPreview"
                          className="aspect-square w-full object-cover"
                        />
                      )}
                    </>
                  ) : (
                    articleData.data.img?.url && (
                      <img src={articleData.data.img.url} alt="article_img" />
                    )
                  )}

                  {isEditing ? (
                    <FormField
                      name="title"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  ) : (
                    <h3>{articleData.data.title}</h3>
                  )}
                  {isEditing ? (
                    <FormField
                      name="subtitle"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                  ) : (
                    articleData.data.subtitle && (
                      <h6 className="text-slate-600">
                        {articleData.data.subtitle}
                      </h6>
                    )
                  )}
                </div>
                <div>
                  <p>Author:</p>
                  <Link to={`/account/${articleData.data.user._id}`}>
                    {articleData.data.user.author_info.pseudonim}
                  </Link>
                </div>

                {isEditing ? (
                  <FormField
                    name="content"
                    control={form.control}
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                ) : (
                  articleData.data.content && <p>{articleData.data.content}</p>
                )}

                <div className="mt-8">
                  <Comments
                    target="News"
                    targetId={articleData.data._id}
                    withRating={false}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
