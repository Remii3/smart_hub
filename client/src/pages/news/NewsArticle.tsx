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
import Comments from '@features/comments/Comments';
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
    img: null | { id: string; url: string };
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
    const userVote = checkUserVoted(data.voting.votes);
    setVote({ vote: userVote, quantity: data.voting.quantity });
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
    const userVote = checkUserVoted(data.voting.votes);
    setVote({ vote: userVote, quantity: data.voting.quantity });
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
              {articleData.data.img?.url && (
                <img src={articleData.data.img.url} alt="article_img" />
              )}
              <h3>{articleData.data.title}</h3>
              <h6 className="text-slate-600">{articleData.data.subtitle}</h6>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant={'destructive'} type="button">
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
                      variant={'destructive'}
                      onClick={() => deleteArticleHandler(newsId)}
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
              <Comments
                target="News"
                targetId={articleData.data._id}
                withRating={false}
                updateProductStatus={fetchUpdateComments}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>No data</div>
      )}
    </div>
  );
}
