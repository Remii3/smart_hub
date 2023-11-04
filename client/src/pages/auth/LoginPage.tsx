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

const formSchema = z.object({
  email: z.string().email().nonempty().min(2),
  password: z.string().nonempty().min(2),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { changeUserData } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signInHandler = async (formResponse: z.infer<typeof formSchema>) => {
    const { email, password } = formResponse;
    const { error: logInError, name } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_LOGIN,
      body: {
        email,
        password,
      },
    });
    if (logInError) {
      form.setError(name, { type: 'value', message: logInError });
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: logInError,
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
        <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt="Pattern"
            src="https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </aside>

        <main
          aria-label="Main"
          className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
        >
          <div className="max-w-xl lg:max-w-3xl">
            <Link className="inline-block text-blue-600" to="/">
              <span className="sr-only">Home</span>
              <SunRiseIcon className="h-10 w-10" />
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome Back 🦑
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              nam dolorum aliquam, quibusdam aperiam voluptatum.
            </p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(signInHandler)}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Email..."
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Your email</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="col-span-6">
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password..."
                            autoComplete="current-password"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer px-3"
                            onClick={() =>
                              setShowPassword((prevState) => !prevState)
                            }
                          >
                            {showPassword ? (
                              <EyeIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                              <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>Your password</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-6">
                  <p className="text-sm text-gray-500">
                    By having an account on this site, you agree to our{' '}
                    <Link to="/" className="text-gray-700 underline">
                      terms and conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/" className="text-gray-700 underline">
                      privacy policy
                    </Link>
                    .
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <Button variant="default" type="submit" size="default">
                    Sign in
                  </Button>

                  <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                    No account yet?{' '}
                    <Link
                      to="/account/register"
                      className="text-gray-700 underline"
                    >
                      Register
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
