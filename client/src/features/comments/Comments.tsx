import { CommentTypes, FetchDataTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useGetAccessDatabase } from '@hooks/useAaccessDatabase';
import { useCallback, useEffect, useState } from 'react';
import NewComment from './NewComment';
import Comment from './Comment';
import errorToast from '@components/UI/error/errorToast';

type CommentTargetTypes = 'Product' | 'News';

interface CommentsTypes extends FetchDataTypes {
  data: null | CommentTypes[];
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
    data: null,
    hasError: null,
    isLoading: false,
  });

  const fetchData = useCallback(async () => {
    setComments((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ALL,
      params: { targetId },
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
      data,
      hasError: null,
      isLoading: false,
    });
  }, [targetId]);

  useEffect(() => {
    fetchData();
  }, [targetId]);

  return (
    <article>
      <h3 className="mb-2 text-4xl">Comments</h3>
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
          comments.data &&
          comments.data.length <= 0 && (
            <div className="text-center">
              <span className="text-muted-foreground">No comments.</span>
            </div>
          )}
        {comments.data &&
          !comments.isLoading &&
          !comments.hasError &&
          comments.data.length > 0 && (
            <div className="space-y-4">
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
            </div>
          )}
      </section>
    </article>
  );
}
