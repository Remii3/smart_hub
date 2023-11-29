import { Progress } from '@components/UI/progress';
import { CommentTypes } from '@customTypes/interfaces';
import { StarIcon } from '@heroicons/react/24/solid';

interface PropsRatingSummaryTypes {
  avgRating: number;
  quantity: number;
  reviews: CommentTypes[];
}

export default function RatingSummary({
  avgRating,
  quantity,
  reviews,
}: PropsRatingSummaryTypes) {
  const ratingComments = reviews.filter((comment) => comment.value.rating);
  const countVotes = (value: number) =>
    ratingComments.filter((comment) => comment.value.rating === value).length;

  return (
    <article className="flex gap-4">
      <section className="p-4 rounded-md flex flex-col items-center justify-around shadow-sm border-border border">
        <div className="text-4xl">{avgRating.toFixed(1)}</div>
        <div className="text-base">
          {quantity} <span>votes</span>
        </div>
      </section>
      <section className="flex-grow">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-3">5</span>{' '}
            <StarIcon className="w-5 text-yellow-400" />
          </div>
          <Progress
            max={ratingComments.length}
            value={countVotes(5)}
            className="max-w-xs flex-grow"
          />
          <div className="gap-1 hidden sm:flex text-sm text-muted-foreground">
            <span className="min-w-[8px]">{countVotes(5)}</span>
            <span>{countVotes(5) !== 1 ? 'votes' : 'vote'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-3">4</span>{' '}
            <StarIcon className="w-5 text-yellow-400" />
          </div>
          <Progress
            max={ratingComments.length}
            value={countVotes(4)}
            className="max-w-xs flex-grow"
          />
          <div className="gap-1 hidden sm:flex text-sm text-muted-foreground">
            <span className="min-w-[8px]">{countVotes(4)}</span>
            <span>{countVotes(4) !== 1 ? 'votes' : 'vote'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-3">3</span>{' '}
            <StarIcon className="w-5 text-yellow-400" />
          </div>
          <Progress
            max={ratingComments.length}
            value={countVotes(3)}
            className="max-w-xs flex-grow"
          />
          <div className="gap-1 hidden sm:flex text-sm text-muted-foreground">
            <span className="min-w-[8px]">{countVotes(3)}</span>
            <span>{countVotes(3) !== 1 ? 'votes' : 'vote'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-3">2</span>{' '}
            <StarIcon className="w-5 text-yellow-400" />
          </div>
          <Progress
            max={ratingComments.length}
            value={countVotes(2)}
            className="max-w-xs flex-grow"
          />
          <div className="gap-1 hidden sm:flex text-sm text-muted-foreground">
            <span className="min-w-[8px]">{countVotes(2)}</span>
            <span>{countVotes(2) !== 1 ? 'votes' : 'vote'}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-3">1</span>{' '}
            <StarIcon className="w-5 text-yellow-400" />
          </div>
          <Progress
            max={ratingComments.length}
            value={countVotes(1)}
            className="max-w-xs flex-grow"
          />
          <div className="gap-1 hidden sm:flex text-sm text-muted-foreground">
            <span className="min-w-[8px]">{countVotes(1)}</span>
            <span>{countVotes(1) !== 1 ? 'votes' : 'vote'}</span>
          </div>
        </div>
      </section>
    </article>
  );
}
