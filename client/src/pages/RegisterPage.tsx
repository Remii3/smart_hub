import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PrimaryBtn from '../components/UI/Btns/PrimaryBtn';
import SquidIcon from '../assets/icons/SquidIcon';
import CustomInput from '../components/UI/form/CustomInput';
import { UserContext } from '../context/UserProvider';
import PasswordInput from '../components/UI/form/CustomPasswordInput';

function RegisterPage() {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const [regUserData, setRegUserData] = useState({
    data: {
      credentials: { firstName: '', lastName: '' },
      email: '',
      password: '',
      passwordConfirmation: '',
    },

    errors: {
      credentials: { firstName: null, lastName: null },
      email: null,
      password: null,
      passwordConfirmation: null,
    },
  });

  const registerChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'firstName' || e.target.name === 'lastName') {
      setRegUserData((prevState) => {
        return {
          ...prevState,
          data: {
            ...prevState.data,
            credentials: {
              ...prevState.data.credentials,
              [e.target.name]: e.target.value,
            },
          },
          errors: {
            ...prevState.errors,
            credentials: {
              ...prevState.errors.credentials,
              [e.target.name]: null,
            },
          },
        };
      });
    } else if (
      e.target.name === 'passwordConfirmation' ||
      e.target.name === 'password'
    ) {
      setRegUserData((prevState) => {
        return {
          ...prevState,
          data: { ...prevState.data, [e.target.name]: e.target.value },
          errors: {
            ...prevState.errors,
            passwordConfirmation: null,
            password: null,
          },
        };
      });
    } else {
      setRegUserData((prevState) => {
        return {
          ...prevState,
          data: { ...prevState.data, [e.target.name]: e.target.value },
          errors: {
            ...prevState.errors,
            [e.target.name]: null,
          },
        };
      });
    }
  };

  const signUpHandler = async (e: FormEvent) => {
    e.preventDefault();

    const { credentials, email, password, passwordConfirmation } =
      regUserData.data;
    try {
      await axios.post('/account/register', {
        credentials,
        email,
        password,
        passwordConfirmation,
      });

      axios.get('/account/profile').then((res) => setUserData(res.data));

      navigate('/');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          if (typeof Object.values(err.response.data)[0] !== 'string') {
            err.response.data.forEach(
              (error: { name: string; message: string }) => {
                if (error.name === 'firstName' || error.name === 'lastName') {
                  setRegUserData((prevState) => {
                    return {
                      ...prevState,

                      errors: {
                        ...prevState.errors,
                        credentials: {
                          ...prevState.errors.credentials,
                          [error.name]: error.message,
                        },
                      },
                    };
                  });
                } else {
                  setRegUserData((prevState) => {
                    return {
                      ...prevState,

                      errors: {
                        ...prevState.errors,
                        [error.name]: error.message,
                      },
                    };
                  });
                }
              }
            );
          } else if (
            err.response.data.name === 'firstName' ||
            err.response.data.name === 'lastName'
          ) {
            setRegUserData((prevState) => {
              return {
                ...prevState,

                errors: {
                  ...prevState.errors,
                  credentials: {
                    ...prevState.errors.credentials,
                    [err.response.data.name]: err.response.data.message,
                  },
                },
              };
            });
          } else {
            setRegUserData((prevState) => {
              return {
                ...prevState,

                errors: {
                  ...prevState.errors,
                  [err.response.data.name]: err.response.data.message,
                },
              };
            });
          }
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
              <SquidIcon />
            </Link>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Welcome to SmartHub 🦑
            </h1>

            <p className="mt-4 leading-relaxed text-gray-500">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
              nam dolorum aliquam, quibusdam aperiam voluptatum.
            </p>

            <form
              onSubmit={(e) => signUpHandler(e)}
              className="mt-8 grid grid-cols-6 gap-6"
              noValidate
            >
              <div className="col-span-6 sm:col-span-3">
                <CustomInput
                  type="text"
                  name="firstName"
                  hasError={regUserData.errors.credentials.firstName}
                  errorValue={regUserData.errors.credentials.firstName}
                  inputValue={regUserData.data.credentials.firstName}
                  labelValue="First Name"
                  onChange={(e) => registerChangeHandler(e)}
                  optional={false}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <CustomInput
                  hasError={regUserData.errors.credentials.lastName}
                  errorValue={regUserData.errors.credentials.lastName}
                  inputValue={regUserData.data.credentials.lastName}
                  labelValue="Last Name"
                  name="lastName"
                  onChange={(e) => registerChangeHandler(e)}
                  optional={false}
                  type="text"
                />
              </div>

              <div className="col-span-6">
                <CustomInput
                  hasError={regUserData.errors.email}
                  errorValue={regUserData.errors.email}
                  inputValue={regUserData.data.email}
                  labelValue="Email"
                  name="email"
                  onChange={(e) => registerChangeHandler(e)}
                  optional={false}
                  type="email"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <PasswordInput
                  hasError={regUserData.errors.password}
                  errorValue={regUserData.errors.password}
                  inputValue={regUserData.data.password}
                  labelValue="Password"
                  name="password"
                  onChange={(e) => registerChangeHandler(e)}
                  optional={false}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <PasswordInput
                  hasError={regUserData.errors.passwordConfirmation}
                  errorValue={regUserData.errors.passwordConfirmation}
                  inputValue={regUserData.data.passwordConfirmation}
                  labelValue="Password Confirmation"
                  name="passwordConfirmation"
                  onChange={(e) => registerChangeHandler(e)}
                  optional={false}
                />
              </div>

              <div className="col-span-6">
                <p className="text-sm text-gray-500">
                  By creating an account, you agree to our{' '}
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
                  text="Create an account"
                  usecase="default"
                  type="submit"
                  customCSS="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                />

                <p className="mt-4 text-sm text-gray-500 sm:mt-0">
                  Already have an account?{' '}
                  <Link to="/account/login" className="text-gray-700 underline">
                    Log in
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

export default RegisterPage;
