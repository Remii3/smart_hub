import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SunRiseIcon } from '@assets/icons/Icons';
import { UserContext } from '@context/UserProvider';
import { Button } from '@components/UI/button';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { useToast } from '@components/UI/use-toast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const formSchema = z
  .object({
    firstName: z.string().nonempty().min(2),
    lastName: z.string().nonempty().min(2),
    email: z.string().email().nonempty().min(2),
    username: z.string().nonempty().min(2),
    password: z.string().nonempty().min(2),
    passwordConfirmation: z.string().nonempty().min(2),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['passwordConfirmation'],
      });
    }
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const { changeUserData } = useContext(UserContext);
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmation: false,
  });
  const { toast } = useToast();
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const signUpHandler = async (formResponse: z.infer<typeof formSchema>) => {
    const {
      email,
      username,
      password,
      passwordConfirmation,
      firstName,
      lastName,
    } = formResponse;

    const { error: registerError, name } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_REGISTER,
      body: {
        credentials: { firstName, lastName },
        email,
        username,
        password,
        passwordConfirmation,
      },
    });
    if (registerError) {
      form.setError(name, { type: 'value', message: registerError });
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: registerError,
      });
    }
    const { data, error: updateProfileDataError } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_PROFILE,
    });
    if (updateProfileDataError) {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: updateProfileDataError,
      });
    }
    changeUserData(data);
    if (data) {
      navigate('/');
    }
  };

  return (
    <section className="bg-background">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <aside className="relative -ml-4 -mr-4 -mt-6 block h-24 lg:order-last lg:col-span-5 lg:ml-0 lg:h-full xl:col-span-6">
          <img
            alt="Pattern"
            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2FauthMainPhoto.webp?alt=media&token=74727027-d0c0-4c96-879c-972c9fefac85&_gl=1*1jnc41l*_ga*NDYxNzIyMDYxLjE2OTU3NTEwNzA.*_ga_CW55HF8NVT*MTY5OTIwNjYzOC42OC4xLjE2OTkyMDY2NTAuNDguMC4w"
            className="absolute inset-0 h-full w-full object-cover"
            width={716}
            height={950}
          />
        </aside>

        <main
          aria-label="Main"
          className="flex items-center justify-center py-4 sm:px-12 lg:col-span-7 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <Link className="inline-block text-blue-600" to="/">
              <span className="sr-only">Home</span>
              <SunRiseIcon className="h-10 w-10" />
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to SmartHub 🦑
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              nam dolorum aliquam, quibusdam aperiam voluptatum.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(signUpHandler)}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <FormField
                  name="firstName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-6 sm:col-span-3">
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="First name..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter your first name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="lastName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-6 sm:col-span-3">
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Last name..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter your last name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Email..." {...field} />
                      </FormControl>
                      <FormDescription>Enter your email</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="username"
                          type="text"
                          placeholder="Username..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Enter your username</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-6 sm:col-span-3">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            autoComplete="new-password"
                            type={showPasswords.password ? 'text' : 'password'}
                            placeholder="Password..."
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-0 top-1/2 h-full -translate-y-1/2 cursor-pointer rounded-r-md px-3"
                            onClick={() =>
                              setShowPasswords((prevState) => {
                                return {
                                  ...prevState,
                                  password: !prevState.password,
                                };
                              })
                            }
                          >
                            {showPasswords.password ? (
                              <EyeIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>Enter your password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="passwordConfirmation"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-6 sm:col-span-3">
                      <FormLabel>Password Confirmation</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            autoComplete="new-password"
                            type={
                              showPasswords.confirmation ? 'text' : 'password'
                            }
                            placeholder="Password confirmation..."
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-0 top-1/2 h-full -translate-y-1/2 cursor-pointer rounded-r-md px-3"
                            onClick={() =>
                              setShowPasswords((prevState) => {
                                return {
                                  ...prevState,
                                  confirmation: !prevState.confirmation,
                                };
                              })
                            }
                          >
                            {showPasswords.confirmation ? (
                              <EyeIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>Confirm your password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    By creating an account, you agree to our{' '}
                    <Link
                      to="/terms_conditions"
                      className="text-gray-700 underline"
                    >
                      terms and conditions
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/privacy_policy"
                      className="text-gray-700 underline"
                    >
                      privacy policy
                    </Link>
                    .
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <Button variant="default" type="submit" size="default">
                    Sign up
                  </Button>
                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    Already have an account?{' '}
                    <Link
                      to="/account/login"
                      className="text-gray-700 underline"
                    >
                      Log in
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </section>
  );
}
