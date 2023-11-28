import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Avatar, AvatarFallback, AvatarImage } from '@components/UI/avatar';
import { Button } from '@components/UI/button';
import errorToast from '@components/UI/error/errorToast';
import { UserContext } from '@context/UserProvider';
import { FetchDataTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import StarRating from '@features/rating/StarRating';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import { useContext, useState } from 'react';
import { CommentsPropsTypes } from './Comments';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem } from '@components/UI/form';
import { Separator } from '@components/UI/separator';
import { Textarea } from '@components/UI/textarea';
import { Card, CardContent } from '@components/UI/card';

interface NewCommentPropsTypes extends CommentsPropsTypes {
  updateComments?: () => void;
}

interface NewCommentTypes extends FetchDataTypes {
  rating: number;
}

const formSchema = z.object({
  text: z.string().optional(),
  rating: z.number().optional(),
});

const limitLines = (value: string, maxLines: number) => {
  const lines = value.split('\n');

  if (lines.length > maxLines) {
    return (value = lines.slice(0, maxLines).join('\n'));
  }
  return value;
};

export default function NewComment({
  starRating,
  targetId,
  target,
  updateComments,
  updateTargetData,
}: NewCommentPropsTypes) {
  const [newComment, setNewComment] = useState<NewCommentTypes>({
    rating: 0,
    isLoading: false,
    hasError: null,
  });

  const { userData } = useContext(UserContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      rating: 0,
    },
  });

  const addNewCommentHandler = async () => {
    if (!userData.data) return;

    let dirtyData = Object.fromEntries(
      Object.keys(form.formState.dirtyFields).map((x: string | number) => [
        x,
        form.getValues(x as keyof z.infer<typeof formSchema>),
      ])
    );

    if (newComment.rating > 0) {
      dirtyData.rating = newComment.rating;
    }

    if (!dirtyData) return;

    setNewComment((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COMMENT_ONE,
      body: {
        userId: userData.data._id,
        targetData: {
          _id: targetId,
          type: target,
        },
        nickname: userData.data.author_info.pseudonim || userData.data.username,
        value: dirtyData,
      },
    });
    if (error) {
      errorToast(error);
      return setNewComment((prevState) => {
        return { ...prevState, isLoading: false, hasError: error };
      });
    }
    setNewComment({
      hasError: null,
      isLoading: false,
      rating: 0,
    });

    if (updateComments) {
      updateComments();
    }

    if (updateTargetData) {
      updateTargetData();
    }
  };

  return (
    <Card className="p-4 mb-5">
      {userData.data ? (
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(addNewCommentHandler)}
          >
            <div className="flex flex-col gap-4">
              <section className="flex gap-2 items-center flex-wrap">
                {userData.data.user_info.profile_img.url ? (
                  <Avatar>
                    <AvatarImage
                      src={userData.data.user_info.profile_img.url}
                      alt="Profile image."
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
                  {userData.data.author_info.pseudonim ||
                    userData.data.username}
                </span>

                {starRating && (
                  <StarRating
                    rating={newComment.rating || 0}
                    changeRatingHandler={(e) =>
                      setNewComment((prevState) => {
                        return { ...prevState, rating: e };
                      })
                    }
                  />
                )}
              </section>
              <FormField
                name="text"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="basis-full ">
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={6}
                        disabled={!userData.data || newComment.isLoading}
                        placeholder="Enter new comment..."
                        className="resize-none rounded-xl"
                        onChange={(e) => {
                          field.onChange(limitLines(e.target.value, 10));
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <section className="flex items-center justify-end gap-2 bg-background">
              <Button
                variant="default"
                type="submit"
                disabled={!userData.data || newComment.isLoading}
                onClick={() => addNewCommentHandler()}
                className="rounded-xl"
              >
                {newComment.isLoading && <LoadingCircle />}
                <span className={`${newComment.isLoading && 'invisible'}`}>
                  Publish
                </span>
              </Button>
            </section>
          </form>
        </Form>
      ) : (
        <section className="text-center">
          <span className="text-muted-foreground ">Sign in to comment.</span>
        </section>
      )}
    </Card>
  );
}
