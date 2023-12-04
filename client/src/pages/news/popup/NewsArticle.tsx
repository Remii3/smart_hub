import LoadingCircle from '@components/Loaders/LoadingCircle';
import { Button } from '@components/UI/button';

import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import errorToast from '@components/UI/error/errorToast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/UI/form';
import { Input } from '@components/UI/input';
import { UserContext } from '@context/UserProvider';
import { FetchDataTypes, NewsType } from '@customTypes/interfaces';
import { UserRoleTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import Comments from '@features/comments/Comments';
import VoteRating from '@features/rating/VoteRating';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import useUploadImg from '@hooks/useUploadImg';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import parse from 'html-react-parser';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Label } from '@radix-ui/react-label';
import { Badge } from '@components/UI/badge';
import { Separator } from '@components/UI/separator';
import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Textarea } from '@components/UI/textarea';

interface ArticleDataTypes extends FetchDataTypes {
  data: null | NewsType;
}

interface PropsTypes {
  updateNewsList: () => void;
  dialogOpenedHandler: React.Dispatch<React.SetStateAction<string | null>>;
  newsId: string;
  updateTopRated?: () => void;
}

const newArticleDataSchema = z.object({
  title: z.string().nonempty(),
  subtitle: z.string().optional(),
  shortDescription: z.string().optional(),
});

export default function NewsArticle({
  newsId,
  updateNewsList,
  dialogOpenedHandler,
  updateTopRated,
}: PropsTypes) {
  const [openedDialog, setOpenedDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [articleData, setArticleData] = useState<ArticleDataTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });
  const [contentData, setContentData] = useState('');

  const [selectedImg, setSelectedImg] = useState<null | FileList>(null);

  const { userData } = useContext(UserContext);

  const form = useForm<any>({
    resolver: zodResolver(newArticleDataSchema),
  });

  const fetchData = useCallback(async () => {
    setArticleData((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ONE,
      params: { newsId },
    });

    if (error) {
      return setArticleData((prevState) => {
        return { ...prevState, isLoading: false };
      });
    }

    setContentData(data.content);
    setArticleData({
      data,
      isLoading: false,
      hasError: null,
    });

    form.reset({
      title: data.title,
      subtitle: data.subtitle || '',
      shortDescription: data.shortDescription || '',
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uploadNewDataHandler = async (
    formResponse: z.infer<typeof newArticleDataSchema>
  ) => {
    const newArticleData = {} as any;

    let img = null;
    for (const [key, value] of Object.entries(formResponse)) {
      if (form.getFieldState(key).isDirty) {
        newArticleData[key] = value;
      }
    }
    if (contentData !== articleData.data?.content) {
      newArticleData.content = contentData;
    }
    if (selectedImg) {
      img = await useUploadImg({
        ownerId: newsId,
        targetLocation: 'NewsImg',
        selectedFile: selectedImg[0],
      });
    }
    const { data, error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_UPDATE,
      body: { _id: newsId, newData: newArticleData, img },
    });
    if (error) {
      return errorToast(error);
    }
    setIsEditing(false);
    fetchData();
    updateNewsList();
  };

  const editArticleHandler = () => {
    setIsEditing((prevState) => !prevState);
    setSelectedImg(null);
    setContentData(
      articleData.data && articleData.data.content
        ? articleData.data.content
        : ''
    );
    form.reset({
      title: articleData.data ? articleData.data.title : '',
      subtitle: articleData.data ? articleData.data.subtitle : '',
      shortDescription: articleData.data
        ? articleData.data.shortDescription
        : '',
    });
  };

  const deleteArticleHandler = async (newsId: string) => {
    if (!userData.data) return;
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_DELETE,
      body: { newsId },
    });
    if (error) {
      return errorToast(error);
    }
    setOpenedDialog(false);
    dialogOpenedHandler(null);
    setTimeout(() => {
      updateNewsList();
    }, 150);
  };

  return (
    <div>
      {articleData.isLoading && <LoadingCircle />}
      {articleData.hasError && <ErrorMessage message={articleData.hasError} />}
      {articleData.data && (
        <div
          className={`${
            articleData.isLoading ? 'invisible' : 'visible'
          } relative`}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(uploadNewDataHandler)}>
              {userData.data &&
                (userData.data._id === articleData.data.creatorData._id ||
                  userData.data.role === UserRoleTypes.ADMIN) && (
                  <div className="mb-4 space-x-2 bg-white">
                    <DeleteDialog
                      deleteHandler={() => deleteArticleHandler(newsId)}
                      openState={openedDialog}
                      openStateHandler={(state) => setOpenedDialog(state)}
                    >
                      <Button
                        variant={'ghost'}
                        size={'sm'}
                        className="text-red-400 hover:text-red-400"
                        onClick={() => setOpenedDialog(true)}
                      >
                        <TrashIcon className="h-6 w-6" />
                      </Button>
                    </DeleteDialog>
                    <Button
                      variant={'outline'}
                      type="button"
                      onClick={() => editArticleHandler()}
                    >
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                    {isEditing && (
                      <Button
                        type="submit"
                        variant={'outline'}
                        className="text-green-600 hover:text-green-600"
                      >
                        Accept
                      </Button>
                    )}
                  </div>
                )}
              <div>
                <div className="mb-2 space-y-2">
                  {isEditing ? (
                    <>
                      <FormItem>
                        <FormControl>
                          <>
                            <Label className="cursor-pointer space-y-2">
                              <div className="group relative">
                                {((selectedImg && selectedImg.length > 0) ||
                                  (articleData.data.img?.url &&
                                    !selectedImg)) && (
                                  <PlusCircleIcon className="absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-slate-300 opacity-75 brightness-75 transition-[opacity,filter] group-hover:opacity-100 group-hover:brightness-100" />
                                )}
                                {selectedImg && selectedImg.length > 0 && (
                                  <img
                                    src={URL.createObjectURL(selectedImg[0])}
                                    alt="imgPreview"
                                    className="aspect-[16/9] w-full rounded-xl object-cover brightness-75 transition-[filter] group-hover:brightness-50"
                                  />
                                )}
                                {articleData.data.img?.url && !selectedImg && (
                                  <img
                                    src={articleData.data.img.url}
                                    alt="article_img"
                                    className="aspect-[16/9] w-full rounded-xl object-cover brightness-75 transition-[filter] group-hover:brightness-50"
                                  />
                                )}
                              </div>

                              <Input
                                type="file"
                                className="block cursor-pointer"
                                name="mainImg"
                                onChange={(e) => setSelectedImg(e.target.files)}
                                accept="image/png, image/jpg, image/jpeg"
                              />
                            </Label>
                          </>
                        </FormControl>
                        <FormDescription>Change image.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    </>
                  ) : (
                    articleData.data.img?.url && (
                      <img
                        src={articleData.data.img.url}
                        alt="article_img"
                        className="aspect-[16/9] w-full rounded-xl object-cover"
                      />
                    )
                  )}
                  <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
                    <div>
                      {isEditing ? (
                        <FormField
                          name="title"
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>Change title.</FormDescription>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      ) : (
                        <strong className="text-3xl">
                          {articleData.data.title}
                        </strong>
                      )}
                      {isEditing ? (
                        <FormField
                          name="subtitle"
                          control={form.control}
                          render={({ field }) => {
                            return (
                              <FormItem>
                                <FormLabel>Subtitle</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                  Change subtitle.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      ) : (
                        <span className="block text-lg text-slate-800">
                          {articleData.data.subtitle}
                        </span>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="pr-4">
                        <VoteRating
                          userId={userData.data?._id}
                          newsId={articleData.data._id}
                          updateTopRated={updateTopRated}
                        />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <FormField
                      name="shortDescription"
                      control={form.control}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Short description</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="min-h-[14vh]" />
                            </FormControl>
                            <FormDescription>
                              Change short description.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  )}
                  <div className="flex flex-col gap-1">
                    <div className="mr-2">Author:</div>
                    <Link
                      to={`/account/${articleData.data.creatorData._id}`}
                      className="flex items-center gap-1 text-sm"
                    >
                      <img
                        src={articleData.data.creatorData.profileImg.url}
                        alt="profile_img"
                        className="h-8 w-8 rounded-full"
                      />
                      <span>{articleData.data.creatorData.pseudonim}</span>
                    </Link>
                  </div>
                </div>
                <Separator className="my-4" />
                {isEditing ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Description
                    </Label>
                    <CKEditor
                      editor={ClassicEditor}
                      data={contentData}
                      config={{
                        mediaEmbed: { previewsInData: true },
                        toolbar: {
                          shouldNotGroupWhenFull: true,
                          items: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            'mediaEmbed',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'outdent',
                            'indent',
                            '|',
                            'blockQuote',
                            'insertTable',
                            'undo',
                            'redo',
                          ],
                        },
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setContentData(data);
                      }}
                    />
                  </div>
                ) : (
                  articleData.data.content && (
                    <article className="prose">
                      {parse(articleData.data.content)}
                    </article>
                  )
                )}
              </div>
            </form>
          </Form>
          <div>
            <Comments
              target="News"
              targetId={articleData.data._id}
              starRating={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
