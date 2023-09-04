import axios from 'axios';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SunRiseIcon } from '../assets/icons/Icons';
import PrimaryBtn from '../components/UI/Btns/PrimaryBtn';
import { UserContext } from '../context/UserProvider';
import CustomInput from '../components/UI/form/CustomInput';
import CustomPasswordInput from '../components/UI/form/CustomPasswordInput';

export default function LoginPage() {
  const navigate = useNavigate();
  const { changeUserData } = useContext(UserContext);

  const [logUserData, setLogUserData] = useState({
    data: {
      email: '',
      password: '',
    },
    errors: {
      email: null,
      password: null,
    },
  });

  const loginHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLogUserData((prevState) => {
      return {
        ...prevState,
        data: { ...prevState.data, [e.target.name]: e.target.value },
        errors: { ...prevState.errors, [e.target.name]: null },
      };
    });
  };

  const signInHandler = async (e: FormEvent) => {
    e.preventDefault();

    const { email, password } = logUserData.data;

    try {
      await axios.post('/user/login', {
        email,
        password,
      });

      axios.get('/user/myProfile').then((res) => changeUserData(res.data));

      navigate('/');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response)
          if (typeof Object.values(err.response.data)[0] !== 'string') {
            err.response.data.forEach(
              (error: { name: string; message: string }) => {
                setLogUserData((prevState) => {
                  return {
                    ...prevState,

                    errors: {
                      ...prevState.errors,
                      [error.name]: error.message,
                    },
                  };
                });
              }
            );
          } else {
            setLogUserData((prevState) => {
              return {
                ...logUserData,
                errors: {
                  ...prevState.errors,
                  [err.response.data.name]: err.response.data.message,
                },
              };
            });
          }
      } else {
        alert(err);
      }
    }
  };
  return (
    <section className="bg-white">
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
              <SunRiseIcon height={8} width="auto" />
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome Back 🦑
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              nam dolorum aliquam, quibusdam aperiam voluptatum.
            </p>

            <form
              onSubmit={signInHandler}
              className="mt-8 grid grid-cols-6 gap-6"
              noValidate
            >
              <div className="col-span-6">
                <CustomInput
                  autoComplete="email"
                  hasError={logUserData.errors.email}
                  inputValue={logUserData.data.email}
                  labelValue="Email"
                  name="email"
                  onChange={(e) => loginHandler(e)}
                  optional={false}
                  type="email"
                  errorValue={logUserData.errors.email}
                />
              </div>

              <div className="col-span-6">
                <CustomPasswordInput
                  autoComplete="current-password"
                  hasError={logUserData.errors.password}
                  inputValue={logUserData.data.password}
                  labelValue="Password"
                  name="password"
                  onChange={(e) => loginHandler(e)}
                  optional={false}
                  errorValue={logUserData.errors.password}
                />
              </div>

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
                <PrimaryBtn
                  usecase="default"
                  type="submit"
                  customCSS="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                >
                  Log in
                </PrimaryBtn>

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
          </div>
        </main>
      </div>
    </section>
  );
}
