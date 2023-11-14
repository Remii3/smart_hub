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
  search: z.string().nonempty().min(2),
});

interface PropsTypes {
  updateAllNews: () => void;
}

export default function SearchNews({ updateAllNews }: PropsTypes) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { search: '' },
  });

  const searchHandler = (formResponse: z.infer<typeof formSchema>) => {};

  return (
    <Form {...form}>
      <form
        className="relative mx-auto w-full items-center justify-end text-gray-600 lg:flex"
        onSubmit={form.handleSubmit(searchHandler)}
      >
        <FormField
          name="search"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <div className="relative w-full">
                  <Input type="text" placeholder="Search" {...field} />
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
