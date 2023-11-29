import { Card, CardContent, CardHeader } from '@components/UI/card';
import { CommentsPropsTypes } from './Comments';
import { useContext, useState } from 'react';
import { UserContext } from '@context/UserProvider';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import errorToast from '@components/UI/error/errorToast';
import { CommentTypes } from '@customTypes/interfaces';
import StarRating from '@features/rating/StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@components/UI/avatar';
import parse from 'html-react-parser';
import { UserRoleTypes } from '@customTypes/types';
import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import { Separator } from '@components/UI/separator';
import { Button } from '@components/UI/button';
import { TrashIcon } from '@radix-ui/react-icons';

export interface CommentPropsTypes extends CommentsPropsTypes {
  commentData: CommentTypes;
  updateComments: () => void;
}

export default function Comment({
  starRating,
  commentData,
  updateComments,
  target,
  targetId,
  updateTargetData,
}: CommentPropsTypes) {
  const [showDeleteDialog, setShowDeleteDialog] = useState<null | string>(null);
  const { userData } = useContext(UserContext);

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
    if (updateTargetData) {
      updateTargetData();
    }
    setShowDeleteDialog(null);
    setTimeout(() => {
      if (updateComments) {
        updateComments();
      }
    }, 150);
  };
  return (
    <Card className="p-4 space-y-4">
      <section className="flex justify-between">
        <div className="flex gap-2 items-center">
          {commentData.creatorData.user_info.profile_img.url ? (
            <Avatar>
              <AvatarImage
                src={commentData.creatorData.user_info.profile_img.url}
                alt="Comment user picture."
              />
              <AvatarFallback>Test</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar>
              <AvatarImage
                src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                alt="Profile image."
              />
              <AvatarFallback>Test2</AvatarFallback>
            </Avatar>
          )}
          <span className="text-lg font-semibold">
            {commentData.value.nickname}
          </span>
          {starRating && commentData.value.rating > 0 && (
            <StarRating rating={commentData.value.rating} showOnly />
          )}
        </div>
        {(userData.data?._id === commentData.creatorData._id ||
          userData.data?.role == UserRoleTypes.ADMIN) && (
          <DeleteDialog
            deleteHandler={() =>
              deleteCommentHandler(commentData._id, commentData.value)
            }
            openState={showDeleteDialog === commentData._id}
            openStateHandler={setShowDeleteDialog}
            targetId={commentData._id}
          >
            <Button
              aria-label="Remove comment"
              onClick={() => setShowDeleteDialog(commentData._id)}
              variant={'ghost'}
              type="button"
              className="text-destructive hover:text-destructive p-2 rounded-xl"
            >
              <TrashIcon className="h-6 w-6" />
            </Button>
          </DeleteDialog>
        )}
      </section>
      <section className="text-foreground">
        {parse(commentData.value.text.replaceAll('\n', '<br/>'))}
      </section>
      <Separator />
      <div>
        <small className="text-sm text-muted-foreground">
          {commentData.createdAt.slice(0, 10)}
        </small>
      </div>
    </Card>
  );
}
