import { CommentTypes, FetchDataTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';
import NewComment from './NewComment';
import Comment from './Comment';
import errorToast from '@components/UI/error/errorToast';
import { Button } from '@components/UI/button';

type CommentTargetTypes = 'Product' | 'News';

interface CommentsTypes extends FetchDataTypes {
  data: CommentTypes[];
  rawData: null | {
    [index: string]: unknown;
    canShowMoreDocuments: boolean;
  };
}

export interface CommentsPropsTypes {
  starRating: boolean;
  targetId: string;
  target: CommentTargetTypes;
  updateTargetData?: () => void;
}

export default function Comments({
  targetId,
  target,
  updateTargetData,
  starRating,
}: CommentsPropsTypes) {
  const [comments, setComments] = useState<CommentsTypes>({
    data: [],
    rawData: null,
    hasError: null,
    isLoading: false,
  });
  const [shownComments, setShownComments] = useState({
    limit: 6,
    additionalShownComments: 0,
  });

  const fetchData = useCallback(async () => {
    setComments((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ALL,
      params: {
        targetId,
        skip: shownComments.additionalShownComments,
        limit: shownComments.limit,
      },
    });
    if (error) {
      errorToast(error);
      return setComments((prevState) => {
        return {
          ...prevState,
          isLoading: false,
          hasError: error,
        };
      });
    }
    setComments({
      data: [...comments.data, ...data.data],
      rawData: data.rawData,
      hasError: null,
      isLoading: false,
    });
  }, [targetId, shownComments]);

  useEffect(() => {
    fetchData();
  }, [targetId, shownComments]);

  return (
    <article className="space-y-5">
      <h3 className="text-4xl border-b-2 border-border inline-block">
        Comments
      </h3>
      <NewComment
        starRating={starRating}
        target={target}
        targetId={targetId}
        updateComments={fetchData}
        updateTargetData={updateTargetData}
      />
      <section>
        {!comments.isLoading &&
          !comments.hasError &&
          comments.data.length <= 0 && (
            <div className="text-center">
              <span className="text-muted-foreground">No comments.</span>
            </div>
          )}
        {comments.data && !comments.hasError && comments.data.length > 0 && (
          <div className="space-y-5">
            {comments.data.map((comment) => (
              <Comment
                key={comment._id}
                commentData={comment}
                starRating={starRating}
                target={target}
                targetId={targetId}
                updateComments={fetchData}
                updateTargetData={updateTargetData}
              />
            ))}
            {comments.rawData && comments.rawData.canShowMoreDocuments && (
              <div className="text-center">
                <Button
                  variant={'outline'}
                  onClick={() =>
                    setShownComments((prevState) => {
                      return {
                        ...prevState,
                        additionalShownComments:
                          prevState.additionalShownComments + prevState.limit,
                      };
                    })
                  }
                >
                  Show more
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
    </article>
  );
}
