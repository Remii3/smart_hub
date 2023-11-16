import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@components/UI/form';
import { z } from 'zod';
import { Input } from '@components/UI/input';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Suspense } from 'react';

const formSchema = z.object({
  search: z.string(),
});

interface PropsTypes {
  changeSearchQUery: React.Dispatch<React.SetStateAction<string>>;
  changePage: React.Dispatch<React.SetStateAction<number>>;
}

export default function SearchNews({
  changePage,
  changeSearchQUery,
}: PropsTypes) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { search: '' },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const searchHandler = (formResponse: z.infer<typeof formSchema>) => {
    changeSearchQUery(formResponse.search || 'all');
    changePage(1);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className="h-full w-full"
        onSubmit={form.handleSubmit(searchHandler)}
      >
        <FormField
          name="search"
          control={form.control}
          render={({ field }) => (
            <FormItem className="h-full w-full">
              <FormControl className="h-full">
                <div className="relative">
                  <Input
                    className="h-full"
                    type="text"
                    placeholder="News title..."
                    {...field}
                  />
                  <button
                    type="submit"
                    aria-label="Search for news"
                    className="absolute right-0 top-1/2 h-full w-auto min-w-[40px] -translate-y-1/2 transform border-0 bg-transparent px-2 text-gray-600 transition"
                  >
                    <Suspense fallback={<LoadingCircle />}>
                      <MagnifyingGlassIcon className="h-6 w-6 fill-current font-bold text-gray-600" />
                    </Suspense>
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
