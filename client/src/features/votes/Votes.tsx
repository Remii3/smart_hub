import { VotingTypes } from '@customTypes/interfaces';
import { VoteType } from '@customTypes/types';
import {
  HandThumbUpIcon as EmptyHandThumbUpIcon,
  HandThumbDownIcon as EmptyHandThumbDownIcon,
} from '@heroicons/react/24/outline';
import {
  HandThumbUpIcon as FilledHandThumbUpIcon,
  HandThumbDownIcon as FilledHandThumbDownIcon,
} from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

interface PropsTypes extends VotingTypes {
  userId: string;
  newsId: string;
}

export default function Votes({
  likes,
  dislikes,
  votes,
  userId,
  newsId,
}: PropsTypes) {
  const [userVote, setUserVote] = useState<null | VoteType>(null);

  const changeVoteHandler = () => {};

  useEffect(() => {
    const userVote = votes.find((vote) => vote.user._id === userId);
    if (userVote) {
      setUserVote(userVote.vote);
    }
  }, []);

  return (
    <article>
      <section>
        <button type="button" aria-label="Like" onClick={}>
          {userVote === 'Like' ? (
            <FilledHandThumbUpIcon className="h-6 w-6" />
          ) : (
            <EmptyHandThumbUpIcon className="h-6 w-6" />
          )}
        </button>
        <span>{likes}</span>
      </section>
      <section>
        <button type="button" aria-label="Dislike" onClick={}>
          {userVote === 'Dislike' ? (
            <FilledHandThumbDownIcon className="h-6 w-6" />
          ) : (
            <EmptyHandThumbDownIcon className="h-6 w-6" />
          )}
        </button>
        <span>{dislikes}</span>
      </section>
    </article>
  );
}
