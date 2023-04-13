import { ChangeEvent, useContext, useState } from 'react';
import axios from 'axios';
import Header from '../layout/Header';
import AccountTab from '../components/UI/AccountTab';
import { AccountTabsTypes } from '../types/types';
import { UserContext } from '../context/UserProvider';

type NewDataNameTypes = 'email' | 'username' | 'password';

function MyAccount() {
  const [currentTab, setCurrentTab] =
    useState<AccountTabsTypes>('personalInfo');
  const { userData } = useContext(UserContext);
  const [newDataSwitch, setNewDataSwitch] = useState({
    email: false,
    username: false,
    password: false,
  });
  const [newData, setNewData] = useState('');

  const newDataSwitchHandler = (newDataName: NewDataNameTypes) => {
    if (newDataName === 'email') {
      setNewDataSwitch((prevState) => {
        return { username: false, email: !prevState.email, password: false };
      });
    } else if (newDataName === 'username') {
      setNewDataSwitch((prevState) => {
        return { username: !prevState.username, email: false, password: false };
      });
    } else {
      setNewDataSwitch((prevState) => {
        return { username: false, email: false, password: !prevState.password };
      });
    }

    setNewData('');
  };

  const newDataHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setNewData(e.target.value);
  };

  if (!userData) return <div>No data</div>;

  const uploadNewData = () => {
    axios.post('/account/newData', {
      email: userData.email,
      newData,
      newDataSwitch,
    });
  };

  return (
    <div className="relative h-screen w-full bg-pageBackground">
      <Header />

      <section className="relative top-1/4 mx-auto flex min-h-[50%] max-w-3xl flex-col gap-3 rounded-md bg-white p-5 sm:flex-row">
        <div className="relative">
          <ul className="flex flex-row flex-wrap gap-1 sm:flex-col">
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
        <div className="relative">
          <h3 className="pb-3">My account</h3>
          {currentTab === 'personalInfo' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex flex-col text-base brightness-50">
                  Email
                  <input
                    type="text"
                    value={userData.email}
                    disabled
                    className="mt-1 w-full rounded-lg bg-gray900 px-4 py-3 shadow"
                  />
                </label>
                <label
                  className={`${
                    newDataSwitch.email
                      ? 'max-h-20 opacity-100'
                      : ' max-h-0 opacity-0'
                  } flex flex-col overflow-hidden text-base transition-[max-height,opacity] duration-300 ease-out`}
                >
                  New email
                  <input
                    type="text"
                    value={newData}
                    className="mt-1 w-full rounded-lg bg-gray900 px-4 py-3 shadow"
                    onChange={(e) => newDataHandler(e)}
                  />
                </label>
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
                      newDataSwitch.email ? 'block' : 'hidden'
                    } text-base text-green-600`}
                    type="button"
                    onClick={uploadNewData}
                  >
                    Accept
                  </button>
                </div>
              </div>
              <div>
                <label className="flex flex-col text-base brightness-50">
                  Username
                  <input
                    type="text"
                    value={userData.username}
                    disabled
                    className="mt-1 w-full rounded-lg bg-gray900 px-4 py-3 shadow"
                  />
                </label>
                <label
                  className={`${
                    newDataSwitch.username
                      ? 'max-h-20 opacity-100'
                      : ' max-h-0 opacity-0'
                  } flex flex-col overflow-hidden text-base transition-[max-height,opacity] duration-300 ease-out`}
                >
                  New username
                  <input
                    type="text"
                    value={newData}
                    className="mt-1 w-full rounded-lg bg-gray900 px-4 py-3 shadow"
                    onChange={(e) => newDataHandler(e)}
                  />
                </label>
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
                      newDataSwitch.username ? 'block' : 'hidden'
                    } text-base text-green-600`}
                    type="button"
                    onClick={uploadNewData}
                  >
                    Accept
                  </button>
                </div>
              </div>
              <div>
                <label
                  className={`${
                    newDataSwitch.password
                      ? 'max-h-20 opacity-100'
                      : ' max-h-0 opacity-0'
                  } flex flex-col overflow-hidden text-base transition-[max-height,opacity] duration-300 ease-out`}
                >
                  New password
                  <input
                    type="text"
                    value={newData}
                    className="mt-1 w-full rounded-lg bg-gray900 px-4 py-3 shadow"
                    onChange={(e) => newDataHandler(e)}
                  />
                </label>
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
                      newDataSwitch.password ? 'block' : 'hidden'
                    } text-base text-green-600`}
                    type="button"
                    onClick={uploadNewData}
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
