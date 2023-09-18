import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button } from '@components/UI/button';
import { Input } from '@components/UI/input';
import { Skeleton } from '@components/UI/skeleton';
import { UserContext } from '@context/UserProvider';
import { UserTypes } from '@customTypes/interfaces';
import { COMMENT_TARGET, DATABASE_ENDPOINTS } from '@data/endpoints';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

interface ArticleDataTypes {
  isLoading: boolean;
  data: null | {
    user: UserTypes;
    _id: string;
    title: string;
    subtitle: string;
    headImage: null;
    content: string;
  };
  comments: {
    data:
      | null
      | {
          _id: string;
          product_id: string;
          user: UserTypes;
          value: { rating: number; text: string };
          created_at: string;
        }[];
    isLoading: boolean;
    showAll: boolean;
  };
}

interface CommentDataTypes {
  data: string;
  isLoading: boolean;
}

export default function NewsArticle({ newsId }: { newsId: string }) {
  const [articleData, setArticleData] = useState<ArticleDataTypes>({
    isLoading: false,
    data: null,
    comments: {
      data: null,
      isLoading: false,
      showAll: false,
    },
  });

  const [newCommentState, setNewCommentState] = useState<CommentDataTypes>({
    data: '',
    isLoading: false,
  });

  const { userData } = useContext(UserContext);

  const commentsQuantity = 5;

  const fetchData = useCallback(async () => {
    setArticleData((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ONE,
      params: { newsId },
    });
    setArticleData((prevState) => {
      return {
        ...prevState,
        comments: { ...prevState.comments, data: data.comments },
        data: data.data,
        isLoading: false,
      };
    });
  }, []);

  const fetchUpdateComments = async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_COMMENTS,
      params: { newsId },
    });
    setArticleData((prevState) => {
      return {
        ...prevState,
        comments: { ...prevState.comments, data, isLoading: false },
      };
    });
  };

  const addCommentHandler = async () => {
    setArticleData((prevState) => {
      return {
        ...prevState,
        comments: { ...prevState.comments, isLoading: true },
      };
    });
    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ONE,
      body: {
        userId: userData?._id,
        productId: newsId,
        value: newCommentState.data,
        target: COMMENT_TARGET.NEWS,
      },
    });
    await fetchUpdateComments();
    setNewCommentState((prevState) => {
      return { ...prevState, data: '' };
    });
  };

  const deleteCommentHandler = async (commentId: string) => {
    setArticleData((prevState) => {
      return {
        ...prevState,
        comments: { ...prevState.comments, isLoading: true },
      };
    });
    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_DELETE,
      body: {
        commentId,
      },
    });
    await fetchUpdateComments();
  };

  const newCommentChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewCommentState((prevState) => {
      return {
        ...prevState,
        data: e.target.value,
      };
    });
  };

  const showAllCommentsHandler = () => {
    setArticleData((prevState) => {
      return {
        ...prevState,
        comments: {
          ...prevState.comments,
          showAll: !prevState.comments.showAll,
        },
      };
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  console.log('first');
  const preparedComments =
    !articleData.comments.showAll && articleData.comments.data
      ? articleData.comments.data.slice(0, 5)
      : articleData.comments.data;

  const [vote, setVote] = useState(null); // null means no vote has been cast yet

  const handleVote = async (voteType: any) => {
    if (voteType === vote) {
      setVote(null);
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.NEWS_VOTE_REMOVE,
        body: { vote: voteType },
      });
    } else {
      setVote(voteType);
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.NEWS_VOTE_ADD,
        body: { vote: voteType },
      });
    }
  };

  return (
    <div>
      {articleData.isLoading && !articleData.data && (
        <div>
          <Skeleton className="mb-3 h-4 w-1/3" />
          <Skeleton className="mb-2 h-3 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      )}
      {!articleData.isLoading && articleData.data ? (
        <div>
          <div className="space-y-6">
            <div className="space-y-2">
              <button
                onClick={() => handleVote('like')}
                disabled={vote === 'dislike'}
              >
                Like
              </button>
              <button
                onClick={() => handleVote('dislike')}
                disabled={vote === 'like'}
              >
                Dislike
              </button>
              <p>Likes: {vote === 'like' ? 1 : 0}</p>
              <p>Dislikes: {vote === 'dislike' ? 1 : 0}</p>

              <h3>{articleData.data.title}</h3>
              <h6 className="text-slate-600">{articleData.data.subtitle}</h6>
            </div>
            <div>
              <p>Author:</p>
              <Link to={`/account/${articleData.data.user._id}`}>
                {articleData.data.user.username}
              </Link>
            </div>
            <p>{articleData.data.content}</p>
            <div className="mt-8">
              <h5 className="pb-2">Comments</h5>
              <section className="mb-16">
                <div className="flex flex-col-reverse gap-8 md:flex-row">
                  <div>
                    <p className="mb-3">rating</p>
                    <div className="flex gap-4">
                      <img src="#" alt="profile_img" />
                      <p>{userData?.username}</p>
                    </div>
                  </div>

                  <div className="w-full max-w-[580px] overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                    <label htmlFor="newComment" className="sr-only">
                      New comment
                    </label>

                    <textarea
                      id="newComment"
                      className="w-full resize-none border-none align-top focus:ring-0 sm:text-sm"
                      name="newComment"
                      rows={4}
                      placeholder="Enter new comment..."
                      value={newCommentState.data}
                      onChange={(e) => newCommentChangeHandler(e)}
                    />

                    <div className="flex items-center justify-end gap-2 bg-white p-3">
                      <Button
                        variant="default"
                        disabled={!userData?._id}
                        onClick={addCommentHandler}
                      >
                        <LoadingCircle
                          isLoading={articleData.comments.isLoading}
                        >
                          Publish
                        </LoadingCircle>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
              {articleData.comments.isLoading && (
                <div className="space-y-8">
                  {[...Array(3)].map((el, index) => (
                    <Skeleton
                      key={index}
                      className="flex h-[92px] w-full items-center px-4"
                    >
                      <div className="space-y-3">
                        <Skeleton className="h-3 w-5" />
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-3 w-14" />
                      </div>
                    </Skeleton>
                  ))}
                </div>
              )}
              {!articleData.comments.isLoading && articleData.comments.data ? (
                <section>
                  <div>
                    {preparedComments &&
                      preparedComments.map((comment) => (
                        <div
                          key={comment._id}
                          className="mb-8 flex w-full flex-col-reverse gap-8 rounded-md bg-gray-50 p-4 sm:flex-row"
                        >
                          <div>
                            <div className="flex gap-4">
                              <img src="#" alt="profile_img" />
                              <p className="font-semibold">
                                {comment.user.username}
                              </p>
                            </div>
                          </div>
                          <div className="flex w-full flex-col gap-4">
                            <div className="flex justify-end">
                              <small className="text-sm">
                                {comment.created_at.slice(0, 10)}
                              </small>
                            </div>
                            <div>{comment.value.text}</div>
                          </div>
                          {(userData?._id === comment.user._id ||
                            (articleData.data &&
                              userData?.news.includes(articleData.data._id)) ||
                            userData?.role === 'Admin') && (
                            <Button
                              variant={'destructive'}
                              className="hover:text-red-600"
                              onClick={() => deleteCommentHandler(comment._id)}
                            >
                              <TrashIcon className="h-6 w-6" />
                            </Button>
                          )}
                        </div>
                      ))}
                    {articleData.comments.data.length > commentsQuantity && (
                      <Button
                        variant={'default'}
                        onClick={showAllCommentsHandler}
                      >
                        {articleData.comments.showAll
                          ? 'Show less'
                          : 'Show all'}
                      </Button>
                    )}
                  </div>
                </section>
              ) : (
                <div>No data</div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}
