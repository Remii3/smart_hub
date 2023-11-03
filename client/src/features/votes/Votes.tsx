import errorToast from '@components/UI/error/errorToast';
import { VotingTypes } from '@customTypes/interfaces';
import { VoteType } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import {
  HandThumbUpIcon as EmptyHandThumbUpIcon,
  HandThumbDownIcon as EmptyHandThumbDownIcon,
} from '@heroicons/react/24/outline';
import {
  HandThumbUpIcon as FilledHandThumbUpIcon,
  HandThumbDownIcon as FilledHandThumbDownIcon,
} from '@heroicons/react/24/solid';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import { useEffect, useState } from 'react';

interface PropsTypes extends VotingTypes {
  userId?: string;
  newsId: string;
  updateVotesHandler?: () => void;
}

export default function Votes({
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
    <article>
      <section>
        <button
          type="button"
          aria-label="Like"
          name="Like"
          onClick={() => changeVoteHandler('Like')}
          disabled={userVote === 'Dislike' || !userId}
        >
          {userVote === 'Like' ? (
            <FilledHandThumbUpIcon className="h-6 w-6" />
          ) : (
            <EmptyHandThumbUpIcon className="h-6 w-6" />
          )}
        </button>
        <span>{quantity.likes}</span>
      </section>
      <section>
        <button
          type="button"
          aria-label="Dislike"
          onClick={() => changeVoteHandler('Dislike')}
          disabled={userVote === 'Like' || !userId}
        >
          {userVote === 'Dislike' ? (
            <FilledHandThumbDownIcon className="h-6 w-6" />
          ) : (
            <EmptyHandThumbDownIcon className="h-6 w-6" />
          )}
        </button>
        <span>{quantity.dislikes}</span>
      </section>
    </article>
  );
}
