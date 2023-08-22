import { ChangeEvent, useContext, useReducer } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserProvider';
import CustomInput from '../UI/form/CustomInput';

type NewDataNameTypes = 'email' | 'first_name' | 'last_name' | 'password';

type StateVisibleTypes = {
  [key: string]: boolean;
  first_name: boolean;
  last_name: boolean;
  email: boolean;
  password: boolean;
};

type StateDataTypes = {
  [key: string]: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};
type StateErrorTypes = {
  [key: string]: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
};

type State = {
  data: StateDataTypes;
  errors: StateErrorTypes;
  visible: StateVisibleTypes;
};

const initialNewUserDataState: State = {
  data: {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  },
  errors: {
    first_name: null,
    last_name: null,
    email: null,
    password: null,
  },
  visible: {
    first_name: false,
    last_name: false,
    email: false,
    password: false,
  },
};
enum ActionKind {
  ValueChange = 'value_change',
  VisibleChange = 'visible_change',
  ErrorChange = 'error_change',
  ClearData = 'clear_data',
  ClearError = 'clear_error',
}
type Action = {
  type: ActionKind;
  payload?: { label: string; value: boolean | string | null };
};

const changeDataHandler = (state: State, action: Action): State => {
  const { type, payload } = action;
  switch (type) {
    case ActionKind.ValueChange:
      if (payload === undefined || typeof payload.value !== 'string') {
        return state;
      }
      return {
        ...state,
        data: { ...state.data, [payload.label]: payload.value },
      };
    case ActionKind.VisibleChange: {
      if (payload === undefined) return state;
      const newVisibleState = {} as StateVisibleTypes;

      Object.keys(state.visible).forEach((key: keyof StateVisibleTypes) => {
        if (key === payload.label && typeof payload.value === 'boolean') {
          newVisibleState[key] = payload.value;
        } else {
          newVisibleState[key] = false;
        }
      });

      return {
        ...state,
        visible: newVisibleState,
      };
    }
    case ActionKind.ErrorChange:
      if (payload === undefined || typeof payload.value !== 'string')
        return state;
      return {
        ...state,
        errors: { ...state.errors, [payload.label]: payload.value },
      };
    case ActionKind.ClearData: {
      const newDataState = {} as StateDataTypes;

      Object.keys(state.data).forEach((key: keyof StateDataTypes) => {
        newDataState[key] = '';
      });
      return {
        ...state,
        data: newDataState,
      };
    }
    case ActionKind.ClearError: {
      const newDataState = {} as StateErrorTypes;

      Object.keys(state.data).forEach((key: keyof StateErrorTypes) => {
        newDataState[key] = null;
      });
      return {
        ...state,
        errors: newDataState,
      };
    }
    default:
      return state;
  }
};

function EditUserData() {
  const { userData, changeUserData } = useContext(UserContext);

  const [newUserDatastate, dispatch] = useReducer(
    changeDataHandler,
    initialNewUserDataState
  );

  const newDataSwitchHandler = (newDataName: NewDataNameTypes) => {
    dispatch({
      type: ActionKind.ClearData,
    });
    dispatch({
      type: ActionKind.VisibleChange,
      payload: {
        label: newDataName,
        value: !newUserDatastate.visible[newDataName],
      },
    });
  };

  const newUserDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ActionKind.ValueChange,
      payload: { label: e.target.name, value: e.target.value },
    });
  };

  const uploadNewUserDataHandler = async (name: string) => {
    if (!userData) return;
    try {
      dispatch({
        type: ActionKind.ClearError,
        payload: { label: name, value: null },
      });

      await axios.post('/user/newData', {
        userEmail: userData.email,
        fieldKey: name,
        newValue: newUserDatastate.data[name],
      });
      await axios.get('/user/myProfile').then((res) => {
        changeUserData(res.data);
        dispatch({
          type: ActionKind.VisibleChange,
          payload: { label: name, value: false },
        });
      });
    } catch (err: any) {
      dispatch({
        type: ActionKind.ErrorChange,
        payload: {
          label: err.response.data.name,
          value: err.response.data.message,
        },
      });
    }
  };

  if (!userData) return <div>No data</div>;

  return (
    <div>
      <h4>My data</h4>
      <div>
        <div className="flex flex-col gap-4">
          <fieldset>
            <CustomInput
              autoComplete="email"
              name="email"
              type="email"
              optional={false}
              labelValue="Email"
              placeholder="JohnDoe@gmail.com..."
              disabled={!newUserDatastate.visible.email}
              hasError={!!newUserDatastate.errors.email}
              errorValue={newUserDatastate.errors.email}
              inputValue={
                newUserDatastate.visible.email
                  ? newUserDatastate.data.email
                  : userData.email
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
                  newUserDatastate.visible.email ? 'opacity-100' : 'opacity-0'
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
                name="first_name"
                type="text"
                optional={false}
                labelValue="First Name"
                placeholder="John..."
                disabled={!newUserDatastate.visible.first_name}
                hasError={!!newUserDatastate.errors.first_name}
                errorValue={newUserDatastate.errors.first_name}
                inputValue={
                  newUserDatastate.visible.first_name
                    ? newUserDatastate.data.first_name
                    : userData.user_info.credentials.first_name
                }
                onChange={(e) => newUserDataChangeHandler(e)}
              />
              <div className="flex justify-between gap-4">
                <button
                  className="whitespace-nowrap text-base text-primaryText"
                  onClick={() => newDataSwitchHandler('first_name')}
                  type="button"
                >
                  Change first name
                </button>
                <button
                  className={`${
                    newUserDatastate.visible.first_name
                      ? 'opacity-100'
                      : 'opacity-0'
                  } text-base text-green-600 transition-[opacity] ease-out`}
                  type="button"
                  onClick={() => uploadNewUserDataHandler('first_name')}
                >
                  Accept
                </button>
              </div>
            </fieldset>
            <fieldset>
              <CustomInput
                name="last_name"
                type="text"
                optional={false}
                labelValue="Last Name"
                placeholder="Doe..."
                disabled={!newUserDatastate.visible.last_name}
                hasError={!!newUserDatastate.errors.last_name}
                errorValue={newUserDatastate.errors.last_name}
                inputValue={
                  newUserDatastate.visible.last_name
                    ? newUserDatastate.data.last_name
                    : userData.user_info.credentials.last_name
                }
                onChange={(e) => newUserDataChangeHandler(e)}
              />
              <div className="flex justify-between gap-4">
                <button
                  className="whitespace-nowrap text-base text-primaryText"
                  onClick={() => newDataSwitchHandler('last_name')}
                  type="button"
                >
                  Change last name
                </button>
                <button
                  className={`${
                    newUserDatastate.visible.last_name
                      ? 'opacity-100'
                      : 'opacity-0'
                  } text-base text-green-600 transition-[opacity] ease-out`}
                  type="button"
                  onClick={() => uploadNewUserDataHandler('last_name')}
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
              newUserDatastate.visible.password
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
              hasError={!!newUserDatastate.errors.password}
              errorValue={newUserDatastate.errors.password}
              inputValue={newUserDatastate.data.password}
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
                newUserDatastate.visible.password ? 'opacity-100' : 'opacity-0'
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
