import { Button } from '@components/UI/button';
import errorToast from '@components/UI/error/errorToast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/UI/form';
import { Input } from '@components/UI/input';
import { Textarea } from '@components/UI/textarea';
import { FetchDataTypes } from '@customTypes/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { sendForm } from '@emailjs/browser';
import LoadingCircle from '@components/Loaders/LoadingCircle';
const formSchema = z.object({
  firstName: z.string().nonempty().min(2),
  lastName: z.string().optional(),
  email: z.string().email().nonempty().min(2),
  content: z.string().min(2),
});
interface StatusTypes extends FetchDataTypes {
  isSuccess: boolean;
}
export default function ContactUsPage() {
  const [mailStatus, setMailStatus] = useState<StatusTypes>({
    hasError: null,
    isLoading: false,
    isSuccess: false,
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      content: '',
    },
  });

  const sendMailHandler = async (formResponse: z.infer<typeof formSchema>) => {
    setMailStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });
    sendForm(
      'service_mx3ad8h',
      'template_f072vi8',
      '#contactForm',
      'UIcvXyl_S3eMW2iFl'
    )
      .then(() => {
        setMailStatus({ hasError: null, isLoading: false, isSuccess: true });
        form.reset();
        setTimeout(() => {
          setMailStatus((prevState) => {
            return { ...prevState, isSuccess: false };
          });
        }, 1000);
      })
      .catch((err) => {
        if (err) {
          errorToast(err);
          return setMailStatus((prevState) => {
            return { ...prevState, hasError: err, isLoading: false };
          });
        }
      });
  };

  return (
    <div className="mx-auto mt-20 flex h-full max-w-7xl flex-col items-center justify-between gap-10 py-4 lg:flex-row lg:items-stretch lg:gap-4">
      <article className="h-full max-w-none md:max-w-3xl">
        <h2 className="mb-10 text-7xl">Contact us</h2>
        <div className="ml-1">
          Need to get in touch with us? Either fill out the form with your
          inquiry or send an email to our support department at
          smarthub@gmail.com.
        </div>
      </article>
      <Form {...form}>
        <form
          id="contactForm"
          onSubmit={form.handleSubmit(sendMailHandler)}
          className="rounded-md p-4 shadow-sm lg:min-w-[300px] "
        >
          <div className="mb-1 flex  gap-4 lg:flex-col xl:flex-row">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="basis-[100%] md:basis-[50%]">
                  <FormLabel>
                    <span>First name </span>
                    <span className="text-red-600">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="basis-[100%] md:basis-[50%]">
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-1">
                <FormLabel>
                  <span>Email </span> <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel>
                  <span>What can we help you with? </span>
                  <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={'default'}
            className={`${mailStatus.isSuccess && 'bg-green-600'} relative`}
            disabled={mailStatus.isLoading || mailStatus.isSuccess}
          >
            {mailStatus.isSuccess && <CheckIcon className="absolute w-6" />}
            {mailStatus.isLoading && <LoadingCircle />}
            <span
              className={`${
                mailStatus.isSuccess || (mailStatus.isLoading && 'invisible')
              }`}
            >
              Send
            </span>
          </Button>
          {mailStatus.hasError && (
            <div className="text-red-600">{mailStatus.hasError}</div>
          )}
          {mailStatus.isSuccess && (
            <div className="text-green-600">Mail has been sent!</div>
          )}
        </form>
      </Form>
    </div>
  );
}
