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
import { UserContext } from '@context/UserProvider';
import {
  AuthorTypes,
  FetchDataTypes,
  VotingTypes,
} from '@customTypes/interfaces';
import { ImgTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import Comments from '@features/comments/Comments';
import Votes from '@features/votes/Votes';
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
    data: { quantity: { likes: null, dislikes: null }, votes: [] },
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
    }, 150);
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
              <Votes
                userId={userData.data?._id}
                newsId={articleData.data._id}
                votes={vote.data.votes}
                quantity={vote.data.quantity}
                updateVotesHandler={fetchVotes}
              />
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
                {articleData.data.user.author_info.pseudonim}
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
