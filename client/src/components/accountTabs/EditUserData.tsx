import { ChangeEvent, useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserProvider';
import CustomInput from '../UI/form/CustomInput';

type NewDataNameTypes = 'email' | 'firstName' | 'lastName' | 'password';

function EditUserData() {
  const { userData, changeUserData } = useContext(UserContext);

  const [newDataFieldShow, setNewDataFieldShow] = useState({
    credentials: { firstName: false, lastName: false },
    email: false,
    password: false,
  });

  const [newUserData, setNewUserData] = useState({
    data: {
      credentials: { firstName: '', lastName: '' },
      email: '',
      password: '',
    },
    errors: {
      credentials: { firstName: null, lastName: null },
      email: null,
      password: null,
    },
  });

  const newDataSwitchHandler = (newDataName: NewDataNameTypes) => {
    if (newDataName === 'email') {
      setNewDataFieldShow((prevState) => {
        return {
          credentials: { firstName: false, lastName: false },
          email: !prevState.email,
          password: false,
        };
      });
    } else if (newDataName === 'firstName') {
      setNewDataFieldShow((prevState) => {
        return {
          credentials: {
            firstName: !prevState.credentials.firstName,
            lastName: false,
          },
          email: false,
          password: false,
        };
      });
    } else if (newDataName === 'lastName') {
      setNewDataFieldShow((prevState) => {
        return {
          credentials: {
            firstName: false,
            lastName: !prevState.credentials.lastName,
          },
          email: false,
          password: false,
        };
      });
    } else if (newDataName === 'password') {
      setNewDataFieldShow((prevState) => {
        return {
          credentials: { firstName: false, lastName: false },
          email: false,
          password: !prevState.password,
        };
      });
    }
    setNewUserData({
      data: {
        email: '',
        password: '',
        credentials: { firstName: '', lastName: '' },
      },
      errors: {
        email: null,
        password: null,
        credentials: { firstName: null, lastName: null },
      },
    });
  };

  const newUserDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'firstName' || e.target.name === 'lastName') {
      setNewUserData((prevState) => {
        return {
          ...prevState,
          data: {
            ...prevState.data,
            credentials: {
              ...prevState.data.credentials,
              [e.target.name]: e.target.value,
            },
          },
        };
      });
    } else {
      setNewUserData((prevState) => {
        return {
          ...prevState,
          data: { ...prevState.data, [e.target.name]: e.target.value },
        };
      });
    }
  };

  if (!userData) return <div>No data</div>;

  const uploadNewUserDataHandler = async (name: string) => {
    let newValue = null;
    switch (name) {
      case 'firstName':
        newValue = newUserData.data.credentials.firstName;
        break;
      case 'lastName':
        newValue = newUserData.data.credentials.lastName;
        break;
      case 'email':
        newValue = newUserData.data.email;
        break;
      case 'password':
        newValue = newUserData.data.password;
        break;
      default:
        newValue = null;
    }

    try {
      await axios.post('/user/newData', {
        userEmail: userData.email,
        name,
        newValue,
      });
      axios.get('/user/profile').then((res) => {
        setNewDataFieldShow({
          email: false,
          password: false,
          credentials: { firstName: false, lastName: false },
        });
        setNewUserData({
          data: {
            email: '',
            password: '',
            credentials: { firstName: '', lastName: '' },
          },
          errors: {
            email: null,
            password: null,
            credentials: { firstName: null, lastName: null },
          },
        });
        changeUserData(res.data);
      });
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response)
          if (typeof Object.values(err.response.data)[0] !== 'string') {
            err.response.data.forEach(
              (error: { name: string; message: string }) => {
                if (error.name === 'firstName' || error.name === 'lastName') {
                  setNewUserData((prevState) => {
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
                  setNewUserData((prevState) => {
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
            setNewUserData((prevState) => {
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
            setNewUserData((prevState) => {
              return {
                ...prevState,

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
    <div>
      <h4>My data</h4>
      <div>
        <div className="flex flex-col gap-4">
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
            <div className="flex justify-between gap-4">
              <button
                className="text-base text-primaryText"
                onClick={() => newDataSwitchHandler('email')}
                type="button"
              >
                Change email
              </button>
              <button
                className={`${
                  newDataFieldShow.email ? 'opacity-100' : 'opacity-0'
                } text-base text-green-600 transition-[opacity] ease-out`}
                type="button"
                onClick={() => uploadNewUserDataHandler('email')}
              >
                Accept
              </button>
            </div>
          </fieldset>
          <div className="flex gap-4">
            <fieldset>
              <CustomInput
                name="firstName"
                type="text"
                optional={false}
                labelValue="First Name"
                placeholder="John..."
                disabled={!newDataFieldShow.credentials.firstName}
                hasError={newUserData.errors.credentials.firstName}
                errorValue={newUserData.errors.credentials.firstName}
                inputValue={
                  newDataFieldShow.credentials.firstName
                    ? newUserData.data.credentials.firstName
                    : userData.credentials.firstName
                }
                onChange={(e) => newUserDataChangeHandler(e)}
              />
              <div className="flex justify-between gap-4">
                <button
                  className="whitespace-nowrap text-base text-primaryText"
                  onClick={() => newDataSwitchHandler('firstName')}
                  type="button"
                >
                  Change first name
                </button>
                <button
                  className={`${
                    newDataFieldShow.credentials.firstName
                      ? 'opacity-100'
                      : 'opacity-0'
                  } text-base text-green-600 transition-[opacity] ease-out`}
                  type="button"
                  onClick={() => uploadNewUserDataHandler('firstName')}
                >
                  Accept
                </button>
              </div>
            </fieldset>
            <fieldset>
              <CustomInput
                name="lastName"
                type="text"
                optional={false}
                labelValue="Last Name"
                placeholder="Doe..."
                disabled={!newDataFieldShow.credentials.lastName}
                hasError={newUserData.errors.credentials.lastName}
                errorValue={newUserData.errors.credentials.lastName}
                inputValue={
                  newDataFieldShow.credentials.lastName
                    ? newUserData.data.credentials.lastName
                    : userData.credentials.lastName
                }
                onChange={(e) => newUserDataChangeHandler(e)}
              />
              <div className="flex justify-between gap-4">
                <button
                  className="whitespace-nowrap text-base text-primaryText"
                  onClick={() => newDataSwitchHandler('lastName')}
                  type="button"
                >
                  Change last name
                </button>
                <button
                  className={`${
                    newDataFieldShow.credentials.lastName
                      ? 'opacity-100'
                      : 'opacity-0'
                  } text-base text-green-600 transition-[opacity] ease-out`}
                  type="button"
                  onClick={() => uploadNewUserDataHandler('lastName')}
                >
                  Accept
                </button>
              </div>
            </fieldset>
          </div>
        </div>
        <fieldset>
          <div
            className={`${
              newDataFieldShow.password
                ? 'max-h-20 opacity-100'
                : 'max-h-0 opacity-0'
            } overflow-hidden p-1 transition-[max-height,opacity] duration-300 ease-in-out`}
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
                newDataFieldShow.password ? 'opacity-100' : 'opacity-0'
              } text-base  text-green-600 transition-[opacity] ease-out`}
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
