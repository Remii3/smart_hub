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
import { Skeleton } from '@components/UI/skeleton';
import { UserContext } from '@context/UserProvider';
import { UserTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import StarRating from '@features/starRating/StarRating';
import { TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon as UserIcon } from '@heroicons/react/24/solid';
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
  withRating: boolean;
}

export default function Comments({
  targetId,
  target,
  updateProductStatus,
  withRating,
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
    const preparedValue = {} as {
      text?: string;
      rating?: number;
    };

    if (newComment.rating) {
      preparedValue.rating = newComment.rating;
    }
    if (newComment.value) {
      preparedValue.text = newComment.value;
    }
    if (!preparedValue.rating && !preparedValue.text) return;

    setNewComment((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ONE,
      body: {
        userId: userData?._id,
        targetId,
        target: target,
        value: preparedValue,
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

  const deleteCommentHandler = async (commentId: string) => {
    // setArticleData((prevState) => {
    //   return {
    //     ...prevState,
    //     comments: { ...prevState.comments, isLoading: true },
    //   };
    // });
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_DELETE,
      body: {
        target,
        targetId,
        commentId,
        userId: userData?._id,
      },
    });
    if (error === null) {
      await fetchData();
      updateProductStatus();
    }
  };

  return (
    <div className="mt-8">
      <h5 className="pb-2">Comments</h5>
      <section className="mb-16">
        <div className="flex flex-col-reverse gap-8 md:flex-row">
          <div>
            {withRating && (
              <div className="mb-3">
                <StarRating
                  rating={newComment.rating ? newComment.rating : 0}
                  setRating={setNewComment}
                />
              </div>
            )}
            <div className="flex gap-4">
              {userData ? (
                <>
                  {userData.user_info.profile_img ? (
                    <div className="h-14 w-14">
                      <img
                        src={userData?.user_info.profile_img}
                        className="h-full w-full rounded-md object-cover"
                        alt="profile_img"
                      />
                    </div>
                  ) : (
                    <UserIcon className="h-8 w-8" />
                  )}

                  <p>{userData?.username}</p>
                </>
              ) : (
                <>
                  <UserCircleIcon className="h-8 w-8" />
                  <p>Guest</p>
                </>
              )}
            </div>
          </div>
          <div className="relative w-full max-w-[580px] overflow-hidden rounded-lg border border-gray-200 shadow-sm focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
            <label htmlFor="newComment" className="sr-only">
              New comment
            </label>
            <div>
              <textarea
                id="newComment"
                className="w-full resize-none border-none align-top focus:ring-0 sm:text-sm"
                name="newComment"
                rows={4}
                disabled={!userData}
                placeholder={userData ? 'Enter new comment...' : ''}
                value={newComment.value}
                onChange={(e) =>
                  setNewComment((prevState) => {
                    return { ...prevState, value: e.target.value };
                  })
                }
              />
              {!userData && (
                <div className="absolute top-0 flex h-full w-full items-center justify-center bg-slate-300/20">
                  <span className="text-lg">Register to upload a message</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 bg-white p-3">
              <Button
                variant="default"
                disabled={!userData}
                className={`${!userData && 'bg-slate-300'}`}
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
        {comments.isLoading && (
          <div className="space-y-8">
            <Skeleton className="flex h-[92px] w-full items-center px-4">
              <div className="space-y-3">
                <Skeleton className="h-3 w-5" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-14" />
              </div>
            </Skeleton>
          </div>
        )}
        {!comments.isLoading && !comments.data && <div>No data</div>}
        {!comments.isLoading &&
          comments.data &&
          comments.data.map((comment) => (
            <div
              key={comment._id}
              className="mb-8 flex w-full flex-col-reverse gap-8 rounded-md bg-gray-50 p-4 sm:flex-row"
            >
              <div>
                {withRating && (
                  <div className="mb-3">
                    <StarRating rating={comment.value.rating} showOnly />
                  </div>
                )}
                <div className="flex gap-4">
                  <div className="h-14 w-14">
                    <img
                      src={comment.user.user_info.profile_img}
                      alt="profile_img"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  </div>
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
              {(userData?._id === comment.user._id ||
                userData?.role === 'Admin') && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant={'destructive'}
                      type="button"
                      className="text-red-400"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </Button>
                  </DialogTrigger>
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
                        onClick={() => deleteCommentHandler(comment._id)}
                        className="rounded-md bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                      >
                        Delete
                      </Button>
                      <DialogTrigger asChild>
                        <button type="button">Cancel</button>
                      </DialogTrigger>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
      </section>
    </div>
  );
}
