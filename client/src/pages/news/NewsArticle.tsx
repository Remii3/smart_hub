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
import { Skeleton } from '@components/UI/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/UI/tooltip';
import { UserContext } from '@context/UserProvider';
import { FetchDataTypes, UserTypes } from '@customTypes/interfaces';
import { ImgTypes, VotingTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import Comments from '@features/comments/Comments';
import StarRating from '@features/starRating/StarRating';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
interface RatingTypes extends FetchDataTypes {
  data: VotingTypes;
}
interface ArticleDataTypes extends FetchDataTypes {
  data: null | {
    user: UserTypes;
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

export default function NewsArticle({
  newsId,
  updateNewsList,
  dialogOpenedHandler,
}: PropsTypes) {
  const [openedDialog, setOpenedDialog] = useState(false);

  const [articleData, setArticleData] = useState<ArticleDataTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });

  const [vote, setVote] = useState<RatingTypes>({
    hasError: null,
    isLoading: false,
    data: { likes: null, dislikes: null },
  });

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
    }, 100);
  };

  const checkUserVoted = (votes: { user: string; vote: number }[]) => {
    const voted = votes.find((item) => item.user === userData.data?._id);
    let result = null;
    if (voted) {
      result = voted.vote === 1 ? 'like' : 'dislike';
    }
    return result;
  };

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
    const userVote = checkUserVoted(data.voting.votes);
    setVote({
      data: { vote: userVote, quantity: data.voting.quantity },
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
    const userVote = checkUserVoted(data.voting.votes);
    setVote({
      data: { vote: userVote, quantity: data.voting.quantity },
      hasError: null,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleVote = async (voteType: any) => {
    if (voteType === vote.data.vote) {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.NEWS_VOTE_REMOVE,
        body: { userId: userData.data?._id, newsId, vote: voteType },
      });
      await fetchVotes();
    } else {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.NEWS_VOTE_ADD,
        body: { userId: userData.data?._id, newsId, vote: voteType },
      });
      await fetchVotes();
    }
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
          <div className="space-y-6">
            <div className="space-y-2">
              {userData ? (
                <div>
                  <button
                    onClick={() => handleVote('like')}
                    disabled={vote.data.vote === 'dislike'}
                  >
                    Like
                  </button>
                  <button
                    onClick={() => handleVote('dislike')}
                    disabled={!userData || vote.data.vote === 'like'}
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
              <p>Likes: {vote.data.quantity?.like}</p>
              <p>Dislikes: {vote.data.quantity?.dislike}</p>
              {articleData.data.img?.url && (
                <img src={articleData.data.img.url} alt="article_img" />
              )}
              <h3>{articleData.data.title}</h3>
              <h6 className="text-slate-600">{articleData.data.subtitle}</h6>
              <Dialog
                open={openedDialog}
                onOpenChange={() => setOpenedDialog(false)}
              >
                <Button
                  onClick={() => setOpenedDialog(true)}
                  variant={'destructive'}
                  type="button"
                >
                  Delete
                  <TrashIcon className="h-6 w-6" />
                </Button>
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
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
