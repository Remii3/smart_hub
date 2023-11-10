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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/UI/form';
import { Input } from '@components/UI/input';
import { Textarea } from '@components/UI/textarea';
import { UserContext } from '@context/UserProvider';
import { PostDataTypes } from '@customTypes/interfaces';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import useCashFormatter from '@hooks/useCashFormatter';
import { useContext, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  quantity: z.string().nonempty(),
  price: z.string().nonempty(),
});

export default function NewCollection() {
  const [dialogOpened, setDialogOpened] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<PostDataTypes>({
    hasError: null,
    isLoading: false,
    isSuccess: false,
  });

  const { userData } = useContext(UserContext);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      quantity: '',
      price: '',
    },
  });

  const uploadCollectionHandler = async () => {
    if (!userData.data) return;
    const dirtyData = Object.fromEntries(
      Object.keys(form.formState.dirtyFields).map((x: string) => [
        x,
        form.getValues(x as keyof z.infer<typeof formSchema>),
      ])
    );

    setUploadStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.COLLECTION_ADD_ONE,
      body: {
        ...dirtyData,
        creatorData: {
          _id: userData.data._id,
          pseudonim: userData.data.author_info.pseudonim,
        },
      },
    });

    if (error) {
      return setUploadStatus({
        hasError: error,
        isLoading: false,
        isSuccess: false,
      });
    }
    setUploadStatus({
      hasError: null,
      isLoading: false,
      isSuccess: true,
    });
  };

  const formClearHandler = () => {
    setDialogOpened(false);
    setTimeout(() => {
      setUploadStatus({ hasError: null, isLoading: false, isSuccess: false });
      form.reset();
    }, 100);
  };

  return (
    <Dialog open={dialogOpened} onOpenChange={formClearHandler}>
      <div className="mt-4 flex flex-col sm:mt-0 sm:flex-row sm:items-center">
        <Button variant="outline" onClick={() => setDialogOpened(true)}>
          Create collection
        </Button>
      </div>
      <DialogContent
        className={`${
          uploadStatus.isLoading ? 'overflow-y-hidden' : 'overflow-y-auto'
        } max-h-[80vh] transition-[height] duration-200 ease-in-out`}
      >
        {uploadStatus.isLoading && <LoadingCircle />}
        {uploadStatus.hasError && (
          <div className="h-auto">
            <DialogHeader className="mb-8 mt-4">
              <DialogTitle>Failed creating new collection</DialogTitle>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant={'outline'}
                onClick={() =>
                  setUploadStatus((prevState) => {
                    return { ...prevState, hasError: null };
                  })
                }
              >
                Try again
              </Button>
              <Button variant={'destructive'} onClick={formClearHandler}>
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
        {uploadStatus.isSuccess && (
          <>
            <DialogHeader className="mb-10">
              <h4>Success</h4>
              <p>Your collection has been successfully added!</p>
            </DialogHeader>
            <DialogFooter>
              <Button variant={'default'} onClick={formClearHandler}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
        {!uploadStatus.hasError &&
          !uploadStatus.isLoading &&
          !uploadStatus.isSuccess && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(uploadCollectionHandler)}
                className="space-y-8"
              >
                <DialogHeader>
                  <DialogTitle>Create new collection</DialogTitle>
                  <DialogDescription>
                    Fill in your collection data. Click the &apos;add&apos;
                    button when you&apos;re ready.
                  </DialogDescription>
                </DialogHeader>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Title..." {...field} />
                      </FormControl>
                      <FormDescription>Collection title.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desciption</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Description..." {...field} />
                      </FormControl>
                      <FormDescription>Collection description.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={1}
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How many collections you want to sell.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <div className="flex flex-row rounded-md shadow">
                          <span className="flex items-center rounded-md rounded-r-none border border-input px-3 text-foreground">
                            $
                          </span>
                          <Input
                            id="search-Min-PriceSelector"
                            className="rounded-l-none shadow-none"
                            placeholder={useCashFormatter({ number: 0 })}
                            step="0.01"
                            type="number"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        This is the price of your book.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button variant="default" type="submit">
                    Add
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
      </DialogContent>
    </Dialog>
  );
}
