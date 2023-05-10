import { ChangeEvent, useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserProvider';
import CustomInput from '../UI/form/CustomInput';

type NewDataNameTypes = 'email' | 'username' | 'password';

function EditUserData() {
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
    <div>
      <h4>My data</h4>
      <div>
        <div className="flex flex-col gap-4 md:flex-row">
          <fieldset>
            <CustomInput
              name="email"
              type="email"
              optional={false}
              labelValue="Email"
              placeholder="JohnDoe@gmail.com..."
              disabled={!newDataFieldShow.email}
              hasError={newUserData.errors.email}
              errorValue={newUserData.errors.email}
              inputValue={
                newDataFieldShow.email ? newUserData.data.email : userData.email
              }
              onChange={(e) => newUserDataChangeHandler(e)}
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
          </fieldset>
          <fieldset>
            <CustomInput
              name="username"
              type="text"
              optional={false}
              labelValue="Username"
              placeholder="JohnDoe..."
              disabled={!newDataFieldShow.username}
              hasError={newUserData.errors.username}
              errorValue={newUserData.errors.username}
              inputValue={
                newDataFieldShow.username
                  ? newUserData.data.username
                  : userData.username
              }
              onChange={(e) => newUserDataChangeHandler(e)}
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
          </fieldset>
        </div>
        <fieldset>
          <div
            className={`${
              newDataFieldShow.password
                ? 'max-h-20 opacity-100'
                : 'max-h-0 opacity-0'
            } overflow-hidden py-1 transition-[max-height,opacity] duration-300 ease-in-out`}
          >
            <CustomInput
              name="password"
              type="text"
              optional={false}
              labelValue="New Password"
              placeholder="Password..."
              hasError={newUserData.errors.password}
              errorValue={newUserData.errors.password}
              inputValue={newUserData.data.password}
              onChange={(e) => newUserDataChangeHandler(e)}
            />
          </div>
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
        </fieldset>
      </div>
    </div>
  );
}

export default EditUserData;
