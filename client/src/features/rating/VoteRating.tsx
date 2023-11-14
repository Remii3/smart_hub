import LoadingCircle from '@components/Loaders/LoadingCircle';
import errorToast from '@components/UI/error/errorToast';
import { FetchDataTypes, VotingTypes } from '@customTypes/interfaces';
import { VoteType } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/outline';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { useEffect, useState } from 'react';

interface PropsTypes {
  userId?: string;
  newsId: string;
  updateTopRated?: () => void;
}

interface RatingTypes extends FetchDataTypes {
  data: VotingTypes;
}
export default function VoteRating({
  userId,
  newsId,
  updateTopRated,
}: PropsTypes) {
  const [vote, setVote] = useState<RatingTypes>({
    hasError: null,
    isLoading: false,
    data: { quantity: { likes: null, dislikes: null }, votes: [] },
  });

  const [userVote, setUserVote] = useState<null | VoteType>(null);

  const fetchVotes = async () => {
    setVote((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.RATING_VOTES_ALL,
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

  const changeVoteHandler = async (voteType: VoteType) => {
    if (
      (userVote === 'Like' && voteType === 'Like') ||
      (userVote === 'Dislike' && voteType === 'Dislike')
    ) {
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.RATING_VOTE_REMOVE,
        body: {
          userId,
          newsId,
          vote: voteType,
        },
      });

      if (error) {
        return errorToast(error);
      }

      fetchVotes();
    } else {
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.RATING_VOTE_ADD,
        body: {
          userId,
          newsId,
          vote: voteType,
        },
      });

      if (error) {
        return errorToast(error);
      }

      fetchVotes();
    }
  };

  useEffect(() => {
    const userVote = vote.data.votes.find((vote) => vote.userId === userId);
    if (userVote) {
      setUserVote(userVote.vote);
    } else {
      setUserVote(null);
    }
  }, [vote.data.votes]);

  useEffect(() => {
    fetchVotes();
  }, []);

  return (
    <article className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Like"
        name="Like"
        onClick={() => changeVoteHandler('Like')}
        disabled={userVote === 'Dislike' || !userId || vote.isLoading}
        className="flex items-center gap-1 p-1"
      >
        <HandThumbUpIcon
          className={`${
            userVote === 'Like'
              ? 'fill-green-600 text-green-600'
              : 'fill-transparent text-black'
          } h-6 w-6 transition-colors ease-out`}
        />
        <div className={`relative ${vote.isLoading && ''}`}>
          {vote.isLoading && !vote.data && <LoadingCircle />}
          <span className={`${vote.isLoading && !vote.data && 'invisible'}`}>
            {vote.data.quantity.likes}
          </span>
        </div>
      </button>
      <button
        type="button"
        aria-label="Dislike"
        onClick={() => changeVoteHandler('Dislike')}
        disabled={userVote === 'Like' || !userId || vote.isLoading}
        className="flex items-center gap-1 p-1"
      >
        <HandThumbDownIcon
          className={`${
            userVote === 'Dislike'
              ? 'fill-red-600 text-red-600'
              : 'fill-transparent text-black'
          } h-6 w-6 transition-colors ease-out`}
        />
        <div className={`relative ${vote.isLoading && ''}`}>
          {vote.isLoading && !vote.data && <LoadingCircle />}
          <span className={`${vote.isLoading && !vote.data && 'invisible'} `}>
            {vote.data.quantity.dislikes}
          </span>
        </div>
      </button>
    </article>
  );
}
