import errorToast from '@components/UI/error/errorToast';
import { VotingTypes } from '@customTypes/interfaces';
import { VoteType } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
} from '@heroicons/react/24/outline';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import { useEffect, useState } from 'react';

interface PropsTypes extends VotingTypes {
  userId?: string;
  newsId: string;
  updateVotesHandler?: () => void;
}

export default function VoteRating({
  quantity,
  votes,
  userId,
  newsId,
  updateVotesHandler,
}: PropsTypes) {
  const [userVote, setUserVote] = useState<null | VoteType>(null);

  const changeVoteHandler = async (voteType: VoteType) => {
    if (
      (userVote === 'Like' && voteType === 'Like') ||
      (userVote === 'Dislike' && voteType === 'Dislike')
    ) {
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.NEWS_VOTE_REMOVE,
        body: {
          userId,
          newsId,
          vote: voteType,
        },
      });

      if (error) {
        return errorToast(error);
      }

      if (updateVotesHandler) {
        updateVotesHandler();
      }
    } else {
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.NEWS_VOTE_ADD,
        body: {
          userId,
          newsId,
          vote: voteType,
        },
      });

      if (error) {
        return errorToast(error);
      }

      if (updateVotesHandler) {
        updateVotesHandler();
      }
    }
  };

  useEffect(() => {
    const userVote = votes.find((vote) => vote.userId === userId);
    if (userVote) {
      setUserVote(userVote.vote);
    } else {
      setUserVote(null);
    }
  }, [votes]);

  return (
    <article className="space-x-2">
      <section className="inline-block">
        <button
          type="button"
          aria-label="Like"
          name="Like"
          onClick={() => changeVoteHandler('Like')}
          disabled={userVote === 'Dislike' || !userId}
          className="block p-2 pb-0"
        >
          <HandThumbUpIcon
            className={`${
              userVote === 'Like'
                ? 'fill-green-600 text-green-600'
                : 'fill-transparent text-black'
            } h-6 w-6 transition-colors ease-out`}
          />
        </button>
        <div className="text-center">{quantity.likes}</div>
      </section>
      <section className="inline-block">
        <button
          type="button"
          aria-label="Dislike"
          onClick={() => changeVoteHandler('Dislike')}
          disabled={userVote === 'Like' || !userId}
          className="block rounded-full"
        >
          <HandThumbDownIcon
            className={`${
              userVote === 'Dislike'
                ? 'fill-red-600 text-red-600'
                : 'fill-transparent text-black'
            } h-6 w-6 transition-colors ease-out`}
          />
        </button>
        <div className="text-center">{quantity.dislikes}</div>
      </section>
    </article>
  );
}
