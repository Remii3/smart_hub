import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button } from '@components/UI/button';
import { UserContext } from '@context/UserProvider';
import { UserTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import StarRating from '@features/starRating/StarRating';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { useCallback, useContext, useEffect, useState } from 'react';

type CommentTargetTypes = 'Product' | 'News';

type CommentsTypes = {
  isLoading: boolean;
  error: null | string;
  data:
    | null
    | {
        _id: string;
        product_id: string;
        user: UserTypes;
        value: { rating: number; text: string };
        created_at: string;
      }[];
};

interface NewCommentTypes {
  rating: null | number;
  value: string;
  isLoading: boolean;
  error: null | string;
}

interface PropsTypes {
  targetId: string;
  target: CommentTargetTypes;
  updateProductStatus: () => void;
}

export default function Comments({
  targetId,
  target,
  updateProductStatus,
}: PropsTypes) {
  const [comments, setComments] = useState<CommentsTypes>({
    data: null,
    error: null,
    isLoading: false,
  });
  const [newComment, setNewComment] = useState<NewCommentTypes>({
    rating: null,
    value: '',
    isLoading: false,
    error: null,
  });

  const { userData } = useContext(UserContext);

  const fetchData = useCallback(async () => {
    setComments((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ALL,
      params: { targetId },
    });
    if (error) {
      setComments((prevState) => {
        return {
          ...prevState,
          isLoading: false,
          error,
        };
      });
    } else {
      setComments({
        data,
        error: null,
        isLoading: false,
      });
    }
  }, []);

  const addNewCommentHandler = async () => {
    setNewComment((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ONE,
      body: {
        userId: userData?._id,
        targetId,
        target: target,
        value: { rating: newComment.rating, text: newComment.value },
      },
    });
    if (error) {
      setNewComment((prevState) => {
        return { ...prevState, isLoading: false, error };
      });
    } else {
      setNewComment({
        error: null,
        isLoading: false,
        rating: null,
        value: '',
      });
    }
    await fetchData();
    updateProductStatus();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="mt-8">
      <h5 className="pb-2">Comments</h5>
      <section className="mb-16">
        <div className="flex flex-col-reverse gap-8 md:flex-row">
          <div>
            <div className="mb-3">
              <StarRating
                rating={newComment.rating ? newComment.rating : 0}
                setRating={setNewComment}
              />
            </div>
            <div className="flex gap-4">
              <img src="#" alt="profile_img" />
              <p>{userData?.username}</p>
            </div>
          </div>
          <div className="] w-full max-w-[580px] overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
            <label htmlFor="newComment" className="sr-only">
              New comment
            </label>
            <textarea
              id="newComment"
              className="w-full resize-none border-none align-top focus:ring-0 sm:text-sm"
              name="newComment"
              rows={4}
              placeholder="Enter new comment..."
              value={newComment.value}
              onChange={(e) =>
                setNewComment((prevState) => {
                  return { ...prevState, value: e.target.value };
                })
              }
            />

            <div className="flex items-center justify-end gap-2 bg-white p-3">
              <Button
                variant="default"
                disabled={!userData?._id}
                onClick={() => addNewCommentHandler()}
              >
                <LoadingCircle isLoading={newComment.isLoading}>
                  Publish
                </LoadingCircle>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section>
        {comments.isLoading && <div>loading</div>}
        {!comments.isLoading && !comments.data && <div>No data</div>}
        {!comments.isLoading &&
          comments.data &&
          comments.data.map((comment) => (
            <div
              key={comment._id}
              className="mb-8 flex w-full flex-col-reverse gap-8 rounded-md bg-gray-50 p-4 sm:flex-row"
            >
              <div>
                <div className="mb-3">
                  <StarRating rating={comment.value.rating} showOnly />
                </div>
                <div className="flex gap-4">
                  <img src="#" alt="profile_img" />
                  <p className="font-semibold">{comment.user.username}</p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-4">
                <div className="flex justify-end">
                  <small className="text-sm">
                    {comment.created_at.slice(0, 10)}
                  </small>
                </div>
                <div>{comment.value.text}</div>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}