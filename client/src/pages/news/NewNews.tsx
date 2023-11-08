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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/UI/form';
import { Input } from '@components/UI/input';
import errorToast from '@components/UI/error/errorToast';
import { UserContext } from '@context/UserProvider';
import { FetchDataTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import useUploadImg from '@hooks/useUploadImg';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import ErrorMessage from '@components/UI/error/ErrorMessage';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Skeleton } from '@components/UI/skeleton';

interface PropsTypes {
  updateNewsList: () => void;
}

const formSchema = z.object({
  title: z.string().nonempty(),
  subtitle: z.string(),
});

export default function NewNews({ updateNewsList }: PropsTypes) {
  const [selectedImg, setSelectedImg] = useState<null | FileList>(null);
  const [openedDialog, setOpenedDialog] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);
  const [contentData, setContentData] = useState('');
  const { userData } = useContext(UserContext);
  const [pushStatus, setPushStatus] = useState<FetchDataTypes>({
    hasError: null,
    isLoading: false,
  });
  const form = useForm({
    resolver: zodResolver<typeof formSchema>(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
    },
  });
  const addNewNewsHandler = async (
    formResponse: z.infer<typeof formSchema>
  ) => {
    if (!userData.data) return;
    const { title, subtitle } = formResponse;
    setPushStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ONE,
      body: {
        userId: userData.data._id,
        title,
        subtitle,
        content: contentData,
      },
    });
    if (error) {
      errorToast(error);
      return setPushStatus({ hasError: error, isLoading: false });
    }
    if (selectedImg) {
      const imgResData = await useUploadImg({
        ownerId: data.id,
        targetLocation: 'News_img',
        selectedFile: selectedImg[0],
      });
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.NEWS_UPDATE,
        body: { img: imgResData, _id: data.id },
      });
      if (error) {
        errorToast(error);
        return setPushStatus({ hasError: error, isLoading: false });
      }
    }
    updateNewsList();
    setOpenedDialog(false);
    setTimeout(() => {
      setPushStatus({ hasError: null, isLoading: false });
      setSelectedImg(null);
      setContentData('');
      form.reset();
    }, 100);
  };
  const changeDialogVisiblity = () => {
    setOpenedDialog(false);
    setTimeout(() => {
      setReadyToShow(false);
      setPushStatus({ hasError: null, isLoading: false });
      setSelectedImg(null);
      setContentData('');
      form.reset();
    }, 100);
  };
  return (
    <Dialog open={openedDialog} onOpenChange={() => changeDialogVisiblity()}>
      <Button
        variant="default"
        onClick={() => {
          setTimeout(() => {
            setReadyToShow(true);
          }, 100);
          setOpenedDialog(true);
        }}
      >
        Add new
      </Button>
      <DialogContent className="max-h-[90%] overflow-y-scroll">
        {pushStatus.isLoading && (
          <div>
            <LoadingCircle />
          </div>
        )}
        {!pushStatus.isLoading && pushStatus.hasError && (
          <ErrorMessage message={pushStatus.hasError} />
        )}
        {!pushStatus.hasError && (
          <Form {...form}>
            <form
              className={`${pushStatus.isLoading && 'invisible'} space-y-4`}
              onSubmit={form.handleSubmit(addNewNewsHandler)}
            >
              <DialogHeader>
                <DialogTitle>News</DialogTitle>
                <DialogDescription>Add new news</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <FormField
                  name="title"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" className="block" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input type="text" className="block" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      className="block"
                      name="mainImg"
                      onChange={(e) => setSelectedImg(e.target.files)}
                      accept="image/png, image/jpg, image/jpeg"
                    />
                  </FormControl>
                  {selectedImg && selectedImg.length > 0 && (
                    <img
                      src={URL.createObjectURL(selectedImg[0])}
                      alt="preview_img"
                      className="aspect-square w-full object-cover"
                    />
                  )}
                  <FormMessage />
                </FormItem>
                <div>
                  {readyToShow ? (
                    <div className="ck-body-wrapper">
                      <CKEditor
                        editor={ClassicEditor}
                        data={contentData}
                        config={{
                          mediaEmbed: { previewsInData: true },
                          toolbar: {
                            shouldNotGroupWhenFull: true,
                            items: [
                              'alignment',
                              'heading',
                              '|',
                              'bold',
                              'italic',
                              'link',
                              'bulletedList',
                              'numberedList',
                              '|',
                              'outdent',
                              'indent',
                              '|',

                              'blockQuote',
                              'insertTable',
                              'mediaEmbed',
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
                    <Skeleton className="flex h-[132px] w-full gap-4 p-4">
                      {[...Array(4)].map((el, index) => (
                        <Skeleton key={index} className="h-6 w-10" />
                      ))}
                    </Skeleton>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="default" type="submit">
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
