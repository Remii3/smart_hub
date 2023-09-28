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
import { Input } from '@components/UI/input';
import { Skeleton } from '@components/UI/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/UI/tooltip';
import { UserContext } from '@context/UserProvider';
import { UserTypes } from '@customTypes/interfaces';
import { COMMENT_TARGET, DATABASE_ENDPOINTS } from '@data/endpoints';
import { TrashIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
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
interface RatingTypes {
  vote: string | null;
  quantity: { like: number; dislike: number } | null;
}
interface ArticleDataTypes {
  isLoading: boolean;
  data: null | {
    user: UserTypes;
    _id: string;
    title: string;
    subtitle: string;
    img: null | string;
    content: string;
    rating: {
      votes: { user: string; vote: number }[];
      quantity: { like: number; dislike: number };
    };
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

export default function NewsArticle({
  newsId,
  deleteArticleHandler,
}: {
  newsId: string;
  deleteArticleHandler: (newsId: string) => void;
}) {
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

  const [vote, setVote] = useState<RatingTypes>({
    vote: null,
    quantity: null,
  });

  const checkUserVoted = (votes: { user: string; vote: number }[]) => {
    const voted = votes.find((item) => item.user === userData?._id);
    let result = null;
    if (voted) {
      result = voted.vote === 1 ? 'like' : 'dislike';
    }
    return result;
  };

  const fetchVotes = async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_VOTES_ALL,
      params: { newsId },
    });
    const userVote = checkUserVoted(data.rating.votes);
    setVote({ vote: userVote, quantity: data.rating.quantity });
  };

  const commentsQuantity = 5;

  const fetchData = useCallback(async () => {
    setArticleData((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ONE,
      params: { newsId },
    });
    const commentsData = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ALL,
      params: { targetId: newsId },
    });
    setArticleData((prevState) => {
      return {
        ...prevState,
        comments: { ...prevState.comments, data: commentsData.data },
        data: data,
        isLoading: false,
      };
    });
    const userVote = checkUserVoted(data.rating.votes);
    setVote({ vote: userVote, quantity: data.rating.quantity });
  }, []);

  const fetchUpdateComments = async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ALL,
      params: { targetId: newsId },
    });
    setArticleData((prevState) => {
      return {
        ...prevState,
        comments: { ...prevState.comments, data, isLoading: false },
      };
    });
  };

  const addCommentHandler = async () => {
    if (newCommentState.data !== '') {
      setNewCommentState((prevState) => {
        return { ...prevState, isLoading: true };
      });
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.COMMENT_ONE,
        body: {
          userId: userData?._id,
          targetId: newsId,
          value: newCommentState.data,
          target: COMMENT_TARGET.NEWS,
        },
      });
      setNewCommentState({ isLoading: false, data: '' });
      setArticleData((prevState) => {
        return {
          ...prevState,
          comments: { ...prevState.comments, isLoading: true },
        };
      });
      await fetchUpdateComments();
    }
  };

  const deleteCommentHandler = async (commentId: string) => {
    setArticleData((prevState) => {
      return {
        ...prevState,
        comments: { ...prevState.comments, isLoading: true },
      };
    });
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_DELETE,
      body: {
        commentId,
        userId: userData?._id,
      },
    });
    if (error === null) {
      await fetchUpdateComments();
    }
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

  const preparedComments =
    !articleData.comments.showAll && articleData.comments.data
      ? articleData.comments.data.slice(0, 5)
      : articleData.comments.data;

  const handleVote = async (voteType: any) => {
    if (voteType === vote.vote) {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.NEWS_VOTE_REMOVE,
        body: { userId: userData?._id, newsId, vote: voteType },
      });
      await fetchVotes();
    } else {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.NEWS_VOTE_ADD,
        body: { userId: userData?._id, newsId, vote: voteType },
      });
      await fetchVotes();
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
              {userData ? (
                <div>
                  <button
                    onClick={() => handleVote('like')}
                    disabled={vote.vote === 'dislike'}
                  >
                    Like
                  </button>
                  <button
                    onClick={() => handleVote('dislike')}
                    disabled={!userData || vote.vote === 'like'}
                  >
                    Dislike
                  </button>
                </div>
              ) : (
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400" disabled={true}>
                          Like
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sign in to add vote</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-slate-400" disabled={true}>
                          Dislike
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sign in to add vote</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              <p>Likes: {vote.quantity?.like}</p>
              <p>Dislikes: {vote.quantity?.dislike}</p>
              {articleData.data.img && (
                <img src={articleData.data.img} alt="article_img" />
              )}
              <h3>{articleData.data.title}</h3>
              <h6 className="text-slate-600">{articleData.data.subtitle}</h6>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant={'destructive'}
                    type="button"
                    className="text-red-400"
                  >
                    Delete
                    <TrashIcon className="h-6 w-6" />
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
                      onClick={() => deleteArticleHandler(newsId)}
                      className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      Delete
                    </Button>
                    <DialogTrigger asChild>
                      <button type="button">Cancel</button>
                    </DialogTrigger>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                      <div className="h-14 w-14">
                        {userData && userData.user_info.profile_img ? (
                          <img
                            src={userData.user_info.profile_img}
                            className="h-full w-full rounded-lg object-cover"
                            alt="profile_img"
                          />
                        ) : (
                          <UserCircleIcon className="h-full w-full" />
                        )}
                      </div>
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
                        disabled={!userData?._id || newCommentState.data === ''}
                        onClick={addCommentHandler}
                        className="w-1/3"
                      >
                        <LoadingCircle isLoading={newCommentState.isLoading}>
                          Publish
                        </LoadingCircle>
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
              {articleData.comments.isLoading && (
                <div className="space-y-8">
                  <Skeleton className="flex h-[92px] w-full items-center px-4">
                    <div className="space-y-3">
                      <Skeleton className="h-3 w-5" />
                      <Skeleton className="h-3 w-10" />
                      <Skeleton className="h-3 w-14" />
                    </div>
                  </Skeleton>
                </div>
              )}
              {!articleData.comments.isLoading && articleData.comments.data && (
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
                              <div className="h-14 w-14">
                                {comment.user.user_info.profile_img ? (
                                  <img
                                    src={comment.user.user_info.profile_img}
                                    className="h-full w-full rounded-lg object-cover"
                                    alt="profile_img"
                                  />
                                ) : (
                                  <UserCircleIcon className="h-full w-full" />
                                )}
                              </div>
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant={'destructive'}
                                  type="button"
                                  className="text-red-400"
                                >
                                  <TrashIcon className="h-6 w-6" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Are you sure?</DialogTitle>
                                  <DialogDescription>
                                    Deleting this will permamently remove the
                                    item from the database.
                                  </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    type="button"
                                    onClick={() =>
                                      deleteCommentHandler(comment._id)
                                    }
                                    className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                                  >
                                    Delete
                                  </Button>
                                  <DialogTrigger asChild>
                                    <button type="button">Cancel</button>
                                  </DialogTrigger>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
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
              )}
              {!articleData.comments.isLoading &&
                !articleData.comments.data && <div>No data</div>}
            </div>
          </div>
        </div>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}
