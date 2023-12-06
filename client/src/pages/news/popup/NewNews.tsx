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
import { Textarea } from '@components/UI/textarea';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Label } from '@components/UI/label';
import { Card } from '@components/UI/card';
import { Switch } from '@components/UI/switch';

interface PropsTypes {
  updateAllNews: () => void;
  updateLatestNews: () => void;
}

const formSchema = z.object({
  title: z.string().nonempty(),
  subtitle: z.string(),
  shortDescription: z.string(),
});

export default function NewNews({
  updateAllNews,
  updateLatestNews,
}: PropsTypes) {
  const [selectedImg, setSelectedImg] = useState<null | FileList>(null);
  const [openedDialog, setOpenedDialog] = useState(false);
  const [readyToShow, setReadyToShow] = useState(false);
  const [newDescription, setNewDescription] = useState({
    value: '',
    show: false,
  });
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
      shortDescription: '',
    },
  });
  const addNewNewsHandler = async () => {
    if (!userData.data) return;

    const dirtyData = Object.fromEntries(
      Object.keys(form.formState.dirtyFields).map((x: string) => [
        x,
        form.getValues(x as keyof z.infer<typeof formSchema>),
      ])
    );

    setPushStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.NEWS_ONE,
      body: {
        creatorData: userData.data._id,
        content: newDescription.value,
        ...dirtyData,
      },
    });
    if (error) {
      errorToast(error);
      return setPushStatus({ hasError: error, isLoading: false });
    }
    if (selectedImg) {
      const imgResData = await useUploadImg({
        ownerId: data.id,
        targetLocation: 'NewsImg',
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
    updateAllNews();
    updateLatestNews();
    setOpenedDialog(false);
    setTimeout(() => {
      setPushStatus({ hasError: null, isLoading: false });
      setSelectedImg(null);
      setNewDescription({ value: '', show: false });
      form.reset();
    }, 100);
  };
  const changeDialogVisiblity = () => {
    setOpenedDialog(false);
    setTimeout(() => {
      setReadyToShow(false);
      setPushStatus({ hasError: null, isLoading: false });
      setSelectedImg(null);
      setNewDescription({ value: '', show: false });
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
        className="whitespace-nowrap"
        type="button"
      >
        Add news
      </Button>
      <DialogContent className="h-full w-full p-7">
        {pushStatus.isLoading && (
          <div className="relative min-h-[1vh]">
            <LoadingCircle />
          </div>
        )}
        {!pushStatus.isLoading && pushStatus.hasError && (
          <ErrorMessage message={pushStatus.hasError} />
        )}
        {!pushStatus.hasError && !pushStatus.isLoading && (
          <Form {...form}>
            <form
              className={`flex flex-col space-y-4`}
              onSubmit={form.handleSubmit(addNewNewsHandler)}
            >
              <DialogHeader>
                <DialogTitle>News</DialogTitle>
                <DialogDescription>Add new news</DialogDescription>
              </DialogHeader>

              <div className="flex flex-grow flex-col gap-4">
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
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="block resize-y"
                          maxLength={94}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Label className="cursor-pointer space-y-2">
                      {selectedImg && selectedImg.length > 0 && (
                        <div className="group relative">
                          <PlusCircleIcon className="absolute left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform text-slate-300 opacity-75 brightness-75 transition-[opacity,filter] group-hover:opacity-100 group-hover:brightness-100" />
                          <img
                            src={URL.createObjectURL(selectedImg[0])}
                            alt="preview_img"
                            className="aspect-square w-full rounded-xl object-cover brightness-75 transition-[filter] group-hover:brightness-50"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        className="block cursor-pointer"
                        name="mainImg"
                        onChange={(e) => setSelectedImg(e.target.files)}
                        accept="image/png, image/jpg, image/jpeg"
                      />
                    </Label>
                  </FormControl>

                  <FormMessage />
                </FormItem>
                <div className="space-y-2">
                  <Label>Additional data</Label>
                  <div>
                    <Card className="inline-block">
                      <Label
                        className="p-3 flex gap-1 items-center"
                        htmlFor="descriptionNewSwitch"
                      >
                        Description
                        <Switch
                          id="descriptionNewSwitch"
                          onCheckedChange={(checked: boolean) =>
                            setNewDescription((prevState) => {
                              return { ...prevState, show: checked };
                            })
                          }
                        />
                      </Label>
                    </Card>
                  </div>
                  {newDescription.show && (
                    <CKEditor
                      editor={ClassicEditor}
                      data={newDescription.value}
                      config={{
                        toolbar: {
                          shouldNotGroupWhenFull: true,
                          items: [
                            'undo',
                            'redo',
                            '|',
                            'bold',
                            'italic',
                            '|',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'outdent',
                            'indent',
                            '|',
                            'blockQuote',
                          ],
                        },
                      }}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setNewDescription({ show: true, value: data });
                      }}
                    />
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
