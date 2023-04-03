import axios from 'axios';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import PrimaryBtn from '../components/UI/PrimaryBtn';
import { UserContext } from '../context/UserProvider';

function AuthPage() {
  const [searchParams] = useSearchParams();
  const overlayPosition = searchParams.get('auth');
  const [overlaySwitch, setOverlaySwitch] = useState(
    overlayPosition !== 'login'
  );
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const [logUserData, setLogUserData] = useState({
    data: {
      email: '',
      password: '',
    },
    errors: {
      email: null,
      password: null,
    },
    touched: {
      email: false,
      password: false,
    },
  });
  const [regUserData, setRegUserData] = useState({
    data: {
      email: '',
      username: '',
      password: '',
    },
    errors: {
      email: null,
      username: null,
      password: null,
    },
    touched: {
      email: false,
      username: false,
      password: false,
    },
  });

  const loginOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    setLogUserData((prevState) => {
      return {
        ...prevState,
        touched: { ...prevState.touched, [e.target.name]: true },
      };
    });
  };

  const registerOnBlur = (e: ChangeEvent<HTMLInputElement>) => {
    setRegUserData((prevState) => {
      return {
        ...prevState,
        touched: { ...prevState.touched, [e.target.name]: true },
      };
    });
  };

  const loginHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let error = '';

    if (e.target.name === 'email') {
      if (inputValue.length < 3 && inputValue.length > 0) {
        error = 'Email min length is 3 characters.';
      }
    }

    if (e.target.name === 'password') {
      if (inputValue.length > 16) {
        error = 'Password max length is 16 characters.';
      }
      if (inputValue.length < 3) {
        error = 'Password min length is 3 characters.';
      }
    }

    setLogUserData((prevState) => {
      return {
        ...prevState,
        data: { ...prevState.data, [e.target.name]: e.target.value },
        errors: { ...prevState.errors, [e.target.name]: error },
      };
    });
  };

  const registerHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let error = '';

    if (e.target.name === 'email') {
      if (inputValue.length < 3 && inputValue.length > 0) {
        error = 'Email min length is 3 characters.';
      }
    }

    if (e.target.name === 'username') {
      if (inputValue.length < 3 && inputValue.length > 0) {
        error = 'Username min length is 3 characters.';
      }
    }

    if (e.target.name === 'password') {
      if (inputValue.length < 3 && inputValue.length > 0) {
        error = 'Password min length is 3 characters.';
      }
      if (inputValue.length > 16) {
        error = 'Password max length is 16 characters.';
      }
    }

    setRegUserData((prevState) => {
      return {
        ...prevState,
        data: { ...prevState.data, [e.target.name]: e.target.value },
        errors: { ...prevState.errors, [e.target.name]: error },
      };
    });
  };

  const overlaySwitchHandler = () => {
    setOverlaySwitch((prevState) => !prevState);
    navigate(
      {
        pathname: '/account',
        search: `auth=${overlaySwitch ? 'login' : 'register'}`,
      },
      { replace: true }
    );
    setTimeout(() => {
      setLogUserData({
        touched: { email: false, password: false },
        errors: { email: null, password: null },
        data: { email: '', password: '' },
      });
      setRegUserData({
        touched: { email: false, username: false, password: false },
        errors: { email: null, username: null, password: null },
        data: { email: '', username: '', password: '' },
      });
    }, 300);
  };

  const signInHandler = async (e: FormEvent) => {
    e.preventDefault();

    const { email, password } = logUserData.data;

    try {
      await axios.post('/account/login', {
        email,
        password,
      });

      axios.get('/account/profile').then((res) => setUserData(res.data));

      navigate('/');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response)
          setLogUserData((prevState) => {
            return {
              ...logUserData,
              touched: { ...prevState.touched, [err.response.data.name]: true },
              errors: {
                ...prevState.errors,
                [err.response.data.name]: err.response.data.message,
              },
            };
          });
      } else {
        alert(err);
      }
    }
  };

  const signUpHandler = async (e: FormEvent) => {
    e.preventDefault();

    const { email, password, username } = regUserData.data;

    try {
      await axios.post('/account/register', {
        email,
        username,
        password,
      });

      axios.get('/account/profile').then((res) => setUserData(res.data));

      navigate('/');
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response)
          setRegUserData((prevState) => {
            return {
              ...regUserData,
              touched: { ...prevState.touched, [err.response.data.name]: true },
              errors: {
                ...prevState.errors,
                [err.response.data.name]: err.response.data.message,
              },
            };
          });
      } else {
        alert(err);
      }
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-pageBackground">
      <div className="relative flex h-[648px] w-full max-w-3xl rounded-lg bg-white py-16 shadow-lg">
        <section
          className={`${
            overlaySwitch ? 'opacity-0' : 'opacity-100'
          } basis-1/2 px-8 transition-[opacity] duration-300 ease-in-out`}
        >
          <form
            onSubmit={signInHandler}
            className="flex flex-col items-center gap-5"
          >
            <h3>Sign in</h3>
            <div className="w-full text-center">
              <button
                type="button"
                className="w-full rounded-lg border border-dark py-2"
              >
                Google Account
              </button>
            </div>
            <p>or</p>
            <div className="flex w-full flex-col items-center gap-3">
              <div className="flex w-full flex-col gap-4">
                <div>
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-lg bg-gray900 px-4 py-3 shadow"
                    placeholder="Email"
                    value={logUserData.data.email}
                    onChange={(e) => loginHandler(e)}
                    onBlur={(e) => loginOnBlur(e)}
                    required
                  />
                  <p
                    className={`${
                      logUserData.touched.email && logUserData.errors.email
                        ? 'max-h-5 opacity-100'
                        : 'max-h-0 opacity-0'
                    } h-auto pl-1 pt-1 text-sm  text-red-500 transition-[max-height,opacity] duration-300 ease-out`}
                  >
                    {logUserData.errors.email}
                  </p>
                </div>
                <div>
                  <input
                    name="password"
                    type="password"
                    className="w-full rounded-lg bg-gray900 px-4 py-3 shadow"
                    placeholder="Password"
                    value={logUserData.data.password}
                    onChange={(e) => loginHandler(e)}
                    onBlur={(e) => loginOnBlur(e)}
                    required
                  />
                  <p
                    className={`${
                      logUserData.touched.password &&
                      logUserData.errors.password
                        ? 'max-h-5'
                        : 'max-h-0'
                    } h-auto pl-1 pt-1 text-sm text-red-500 transition-[max-height,opacity] duration-300 ease-out`}
                  >
                    {logUserData.errors.password}
                  </p>
                </div>
              </div>
              <Link to="/account/forgot-password">Forgot password?</Link>
            </div>
            <div>
              <PrimaryBtn
                text="Sign in"
                usecase="normal"
                customCSS="px-12"
                onClick={(e) => signInHandler(e)}
              />
            </div>
          </form>
        </section>
        <section
          className={`${
            overlaySwitch ? 'opacity-100' : 'opacity-0'
          } basis-1/2 px-8 transition-[opacity] duration-300 ease-in-out`}
        >
          <form
            onSubmit={signUpHandler}
            className="flex flex-col items-center gap-5"
          >
            <h3>Sign up</h3>
            <div className="w-full text-center">
              <button
                type="button"
                className="w-full rounded-lg border border-dark py-2"
              >
                Google Account
              </button>
            </div>
            <p>or</p>
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex  w-full flex-col justify-center gap-3">
                <div>
                  <input
                    name="email"
                    type="email"
                    className="w-full rounded-lg bg-gray900 px-4 py-3 shadow-md"
                    placeholder="Email"
                    value={regUserData.data.email}
                    onChange={(e) => registerHandler(e)}
                    onBlur={(e) => registerOnBlur(e)}
                    required
                  />
                  <p
                    className={`${
                      regUserData.touched.email && regUserData.errors.email
                        ? 'max-h-5'
                        : 'max-h-0'
                    } h-auto pl-1 pt-1 text-sm text-red-500 transition-[max-height] duration-300 ease-out`}
                  >
                    {regUserData.errors.email}
                  </p>
                </div>
                <div>
                  <input
                    name="username"
                    type="text"
                    className="w-full rounded-lg bg-gray900 px-4 py-3 shadow-md"
                    placeholder="Username"
                    value={regUserData.data.username}
                    onChange={(e) => registerHandler(e)}
                    onBlur={(e) => registerOnBlur(e)}
                    required
                  />
                  <p
                    className={`${
                      regUserData.touched.username &&
                      regUserData.errors.username
                        ? 'max-h-5 opacity-100'
                        : 'max-h-0 opacity-0'
                    } h-auto pl-1 pt-1 text-sm text-red-500 transition-[max-height] duration-300 ease-out`}
                  >
                    {regUserData.errors.username}
                  </p>
                </div>
                <div>
                  <input
                    name="password"
                    type="password"
                    className="w-full rounded-lg bg-gray900 px-4 py-3 shadow-md"
                    placeholder="Password"
                    value={regUserData.data.password}
                    onChange={(e) => registerHandler(e)}
                    onBlur={(e) => registerOnBlur(e)}
                    required
                  />
                  <p
                    className={`${
                      regUserData.touched.password &&
                      regUserData.errors.password
                        ? 'max-h-5 opacity-100'
                        : 'max-h-0 opacity-0'
                    } h-auto pl-1 pt-1 text-sm text-red-500 transition-[max-height] duration-300 ease-out`}
                  >
                    {regUserData.errors.password}
                  </p>
                </div>
              </div>
              <Link to="/account/forgot-password">Forgot password?</Link>
            </div>
            <div>
              <PrimaryBtn
                text="Sign up"
                usecase="normal"
                customCSS="px-12"
                onClick={(e) => signUpHandler(e)}
              />
            </div>
          </form>
        </section>

        <section
          className={`${
            overlaySwitch ? 'left-0 rounded-l-lg' : 'left-1/2 rounded-r-lg'
          } absolute top-0 h-full w-1/2 overflow-hidden bg-primary text-white transition-[left] duration-300 ease-in-out`}
        >
          <div
            className={`${
              overlaySwitch ? '-right-full opacity-0' : 'right-0 opacity-100'
            } absolute top-0 h-full w-full pb-24 transition-[right,opacity] duration-500 ease-in-out`}
          >
            <div className="flex h-full w-full flex-col items-center justify-center px-8 ">
              <h4 className="pb-1">No account yet?</h4>
              <p className="w-full pb-4 text-center">Press the button below</p>
              <PrimaryBtn
                usecase="normal"
                text="Sign up"
                customCSS="border border-white px-12"
                onClick={overlaySwitchHandler}
              />
            </div>
          </div>
          <div
            className={`${
              overlaySwitch ? 'left-0 opacity-100' : '-left-full opacity-0'
            } absolute top-0 h-full w-full pb-24  transition-[left,opacity] duration-500 ease-in-out`}
          >
            <div className="flex h-full w-full flex-col items-center justify-center px-8">
              <h4 className="pb-1">Already a user?</h4>
              <p className="w-full pb-4 text-center">
                Waste no more time, sign in now!
              </p>
              <PrimaryBtn
                text="Sign in"
                usecase="normal"
                customCSS="border border-white px-12"
                onClick={overlaySwitchHandler}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuthPage;