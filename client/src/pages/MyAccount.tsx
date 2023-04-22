import { ChangeEvent, useContext, useState } from 'react';
import axios from 'axios';
import Header from '../layout/Header';
import AccountTab from '../components/UI/AccountTab';
import { AccountTabsTypes } from '../types/types';
import { UserContext } from '../context/UserProvider';
import InputField from '../components/form/InputField';

type NewDataNameTypes = 'email' | 'username' | 'password';

function MyAccount() {
  const [currentTab, setCurrentTab] =
    useState<AccountTabsTypes>('personalInfo');

  const { userData, setUserData } = useContext(UserContext);
  const [newDataFieldShow, setNewDataFieldShow] = useState({
    email: false,
    username: false,
    password: false,
  });
  const [newUserData, setNewUserData] = useState({
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
  });

  const newDataSwitchHandler = (newDataName: NewDataNameTypes) => {
    if (newDataName === 'email') {
      setNewDataFieldShow((prevState) => {
        return { username: false, email: !prevState.email, password: false };
      });
    } else if (newDataName === 'username') {
      setNewDataFieldShow((prevState) => {
        return { username: !prevState.username, email: false, password: false };
      });
    } else if (newDataName === 'password') {
      setNewDataFieldShow((prevState) => {
        return { username: false, email: false, password: !prevState.password };
      });
    }
    setNewUserData({
      data: { email: '', password: '', username: '' },
      errors: { email: null, password: null, username: null },
    });
  };

  const newUserDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUserData((prevState) => {
      return {
        ...prevState,
        data: { ...prevState.data, [e.target.name]: e.target.value },
      };
    });
  };

  if (!userData) return <div>No data</div>;

  const uploadNewUserDataHandler = async (dataName: string) => {
    const { data } = newUserData;
    try {
      await axios.post('/account/newData', {
        currentEmail: userData.email,
        data,
        dataName,
      });
      axios.get('/account/profile').then((res) => {
        setNewDataFieldShow({ email: false, password: false, username: false });
        setNewUserData({
          data: { email: '', password: '', username: '' },
          errors: { email: null, password: null, username: null },
        });
        setUserData(res.data);
      });
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response)
          setNewUserData((prevState) => {
            return {
              ...newUserData,
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
    <div className="relative h-screen w-full bg-pageBackground">
      <Header />

      <section className="relative top-[15%] mx-auto flex min-h-[75%] w-full max-w-5xl flex-col rounded-md bg-white p-10 sm:flex-row">
        <div className="relative border-b border-gray-200 pb-5 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-10">
          <ul className="flex flex-row flex-wrap gap-5 sm:flex-col">
            <AccountTab
              tabName="personalInfo"
              tabText="Personal Info"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            <AccountTab
              tabName="myShop"
              tabText="My Shop"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
            <AccountTab
              tabName="history"
              tabText="History"
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
          </ul>
        </div>
        <div className="relative pt-5 sm:pl-10 sm:pt-0">
          <h3 className="pb-5">My account</h3>
          {currentTab === 'personalInfo' && (
            <div className="grid grid-cols-1 gap-5">
              <div>
                <InputField
                  name="email"
                  type="email"
                  text="Email"
                  placeholder="JohnDoe@gmail.com..."
                  initiallyDisabled={!newDataFieldShow.email}
                  error={newUserData.errors.email}
                  errorMessage={newUserData.errors.email}
                  value={
                    newDataFieldShow.email
                      ? newUserData.data.email
                      : userData.email
                  }
                  valueChange={(e) => newUserDataChangeHandler(e)}
                />
                <div className="flex justify-between">
                  <button
                    className="text-base text-primaryText"
                    onClick={() => newDataSwitchHandler('email')}
                    type="button"
                  >
                    Change email
                  </button>
                  <button
                    className={`${
                      newDataFieldShow.email ? 'block' : 'hidden'
                    } text-base text-green-600`}
                    type="button"
                    onClick={() => uploadNewUserDataHandler('email')}
                  >
                    Accept
                  </button>
                </div>
              </div>
              <div>
                <InputField
                  name="username"
                  type="text"
                  text="Username"
                  placeholder="JohnDoe..."
                  initiallyDisabled={!newDataFieldShow.username}
                  error={newUserData.errors.username}
                  errorMessage={newUserData.errors.username}
                  value={
                    newDataFieldShow.username
                      ? newUserData.data.username
                      : userData.username
                  }
                  valueChange={(e) => newUserDataChangeHandler(e)}
                />
                <div className="flex justify-between">
                  <button
                    className="text-base text-primaryText"
                    onClick={() => newDataSwitchHandler('username')}
                    type="button"
                  >
                    Change username
                  </button>
                  <button
                    className={`${
                      newDataFieldShow.username ? 'block' : 'hidden'
                    } text-base text-green-600`}
                    type="button"
                    onClick={() => uploadNewUserDataHandler('username')}
                  >
                    Accept
                  </button>
                </div>
              </div>
              <div>
                <InputField
                  name="password"
                  type="text"
                  text="New Password"
                  placeholder="Password..."
                  initiallyHidden={!newDataFieldShow.password}
                  error={newUserData.errors.password}
                  errorMessage={newUserData.errors.password}
                  value={newUserData.data.password}
                  valueChange={(e) => newUserDataChangeHandler(e)}
                />
                <div className="flex justify-between">
                  <button
                    className="text-base text-primaryText"
                    onClick={() => newDataSwitchHandler('password')}
                    type="button"
                  >
                    Change password
                  </button>
                  <button
                    className={`${
                      newDataFieldShow.password ? 'block' : 'hidden'
                    } text-base text-green-600`}
                    type="button"
                    onClick={() => uploadNewUserDataHandler('password')}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default MyAccount;
