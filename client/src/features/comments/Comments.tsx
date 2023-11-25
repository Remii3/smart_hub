import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button } from '@components/UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/UI/dialog';
import errorToast from '@components/UI/error/errorToast';
import { Skeleton } from '@components/UI/skeleton';
import { UserContext } from '@context/UserProvider';
import { AuthorTypes, UserTypes } from '@customTypes/interfaces';
import { UserRoleTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import StarRating from '@features/rating/StarRating';
import { TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon as UserIcon } from '@heroicons/react/24/solid';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { DialogClose } from '@radix-ui/react-dialog';
import { useCallback, useContext, useEffect, useState } from 'react';
import parse from 'html-react-parser';

type CommentTargetTypes = 'Product' | 'News' | 'Collection';

type CommentsTypes = {
  isLoading: boolean;
  error: null | string;
  data:
    | null
    | {
        _id: string;
        creatorData: AuthorTypes;
        targetData: {
          _id: string;
        };
        value: { rating: number; text: string };
        createdAt: string;
        updatedAt: string;
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
  updateProductStatus?: () => void;
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
  const [showDeleteDialog, setShowDeleteDialog] = useState<null | string>(null);
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
  }, [targetId]);

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
        userId: userData.data?._id,
        targetData: {
          _id: targetId,
          type: target,
        },
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
    if (updateProductStatus) {
      updateProductStatus();
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const deleteCommentHandler = async (
    commentId: string,
    value: { text: string; rating: number }
  ) => {
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_DELETE,
      body: {
        target,
        targetId,
        commentId,
        userId: userData.data?._id,
        value,
      },
    });
    if (error) {
      return errorToast(error);
    }
    if (updateProductStatus) {
      updateProductStatus();
    }
    setShowDeleteDialog(null);
    setTimeout(() => {
      fetchData();
    }, 150);
  };

  function limitLines(value: string, maxLines: number) {
    const lines = value.split('\n');

    if (lines.length > maxLines) {
      return (value = lines.slice(0, maxLines).join('\n'));
    }
    return value;
  }
  return (
    <article>
      <h3 className="mb-2 text-4xl">Comments</h3>
      <section className="mb-8">
        <div className="flex flex-col-reverse gap-8 md:flex-row">
          <div>
            {withRating && (
              <div className={`${!userData.data && 'opacity-20'} mb-3`}>
                <StarRating
                  rating={newComment.rating || 0}
                  showOnly={!userData.data}
                  changeRatingHandler={(e) =>
                    setNewComment((prevState) => {
                      return { ...prevState, rating: e };
                    })
                  }
                />
              </div>
            )}
            <div className="flex gap-4">
              {userData.data ? (
                <>
                  {userData.data.user_info.profile_img.url ? (
                    <div className="h-14 w-14">
                      <img
                        src={userData.data.user_info.profile_img.url}
                        className="h-8 w-8 rounded-full object-cover"
                        alt="profile_img"
                      />
                    </div>
                  ) : (
                    <UserIcon className="h-8 w-8" />
                  )}

                  <p>
                    {userData.data.role !== UserRoleTypes.USER
                      ? userData.data.author_info.pseudonim
                      : userData.data.username}
                  </p>
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
                disabled={!userData.data}
                placeholder={!userData.data ? '' : 'Enter new comment...'}
                value={newComment.value}
                onChange={(e) => {
                  const test = limitLines(e.target.value, 10);
                  setNewComment((prevState) => {
                    return { ...prevState, value: test };
                  });
                }}
              />
              {!userData.data && (
                <div className="absolute top-0 flex h-full w-full items-center justify-center bg-slate-300/20">
                  <span className="text-lg">Register to upload a message</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 bg-background p-3">
              <Button
                variant="default"
                disabled={!userData.data || newComment.isLoading}
                className={`${!userData.data && 'bg-slate-300'} relative`}
                onClick={() => addNewCommentHandler()}
              >
                {newComment.isLoading && <LoadingCircle />}
                <span className={`${newComment.isLoading && 'invisible'}`}>
                  Publish
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="relative">
        {comments.isLoading && (
          <div className="absolute top-0 w-full space-y-8">
            <Skeleton className="flex h-[92px] w-full items-center px-4">
              <div className="space-y-3">
                <Skeleton className="h-3 w-5" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-14" />
              </div>
            </Skeleton>
          </div>
        )}
        {!comments.isLoading && comments.data && comments.data.length <= 0 && (
          <div className="text-center text-slate-600">No comments</div>
        )}
        {comments.data &&
          comments.data.length > 0 &&
          comments.data.map((comment) => (
            <div
              key={comment._id}
              className={`${
                comments.isLoading && 'invisible'
              } mb-8 flex w-full flex-col-reverse gap-8 rounded-md bg-gray-50 p-4 sm:flex-row`}
            >
              <div>
                {withRating && (
                  <div className="mb-3">
                    {comment.value.rating > 0 && (
                      <StarRating rating={comment.value.rating} showOnly />
                    )}
                  </div>
                )}
                <div className="flex gap-4">
                  <div className="h-14 w-14">
                    {comment.creatorData.user_info.profile_img.url ? (
                      <img
                        src={comment.creatorData.user_info.profile_img.url}
                        alt="profile_img"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 rounded-full object-cover" />
                    )}
                  </div>
                  <p className="font-semibold">
                    {comment.creatorData.role !== UserRoleTypes.USER
                      ? comment.creatorData.author_info.pseudonim
                      : comment.creatorData.username}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-col gap-4">
                <div className="flex justify-end">
                  <small className="text-sm">
                    {comment.createdAt.slice(0, 10)}
                  </small>
                </div>
                <div>{parse(comment.value.text.replaceAll('\n', '<br/>'))}</div>
              </div>
              {(userData.data?._id === comment.creatorData._id ||
                userData.data?.role == UserRoleTypes.ADMIN) && (
                <Dialog
                  open={showDeleteDialog === comment._id}
                  onOpenChange={() => setShowDeleteDialog(null)}
                >
                  <div className="flex items-center">
                    <Button
                      variant={'destructive'}
                      onClick={() => setShowDeleteDialog(comment._id)}
                      type="button"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </Button>
                  </div>
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
                        onClick={() =>
                          deleteCommentHandler(comment._id, comment.value)
                        }
                      >
                        Delete
                      </Button>
                      <DialogClose asChild>
                        <Button variant={'outline'} type="button">
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          ))}
      </section>
    </article>
  );
}
