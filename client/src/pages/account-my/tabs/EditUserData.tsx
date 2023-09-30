import {
  ChangeEvent,
  FormEvent,
  useContext,
  useReducer,
  useState,
} from 'react';
import { UserContext } from '@context/UserProvider';
import CustomInput from '@components/form/CustomInput';
import { Button } from '@components/UI/button';
import { Input } from '@components/UI/input';
import { Dialog, DialogContent, DialogTrigger } from '@components/UI/dialog';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';

type NewDataNameTypes =
  | 'email'
  | 'first_name'
  | 'last_name'
  | 'password'
  | 'phone'
  | 'address'
  | 'quote'
  | 'pseudonim'
  | 'short_description';

const NEWDATA_NAMES: { [key: string]: NewDataNameTypes } = {
  email: 'email',
  first_name: 'first_name',
  last_name: 'last_name',
  password: 'password',
  phone: 'phone',
  address: 'address',
  quote: 'quote',
  pseudonim: 'pseudonim',
  short_description: 'short_description',
};

type StateDataTypes = {
  [key: string]: string | object;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  quote: string;
  pseudonim: string;
  short_description: string;
};
type StateErrorTypes = {
  [key: string]: string | null | object;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  password: string | null;
  phone: string | null;
  address: {
    line1: string | null;
    line2: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
  };
  quote: string | null;
  pseudonim: string | null;
  short_description: string | null;
};

type State = {
  data: StateDataTypes;
  errors: StateErrorTypes;
};

const initialNewUserDataState: State = {
  data: {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
    quote: '',
    pseudonim: '',
    short_description: '',
  },
  errors: {
    first_name: null,
    last_name: null,
    email: null,
    password: null,
    phone: null,
    address: {
      line1: null,
      line2: null,
      city: null,
      state: null,
      postal_code: null,
      country: null,
    },
    quote: null,
    pseudonim: null,
    short_description: null,
  },
};
enum ActionKind {
  ValueChange = 'value_change',
  ErrorChange = 'error_change',
  ClearData = 'clear_data',
  ClearError = 'clear_error',
}
type Action = {
  type: ActionKind;
  payload?: {
    label: string;
    value: boolean | string | null;
    mainLabel?: string;
  };
};

const changeDataHandler = (state: State, action: Action): State => {
  const { type, payload } = action;

  switch (type) {
    case ActionKind.ValueChange:
      if (payload === undefined || typeof payload.value !== 'string') {
        return state;
      }
      if (payload.mainLabel && payload.mainLabel === 'address') {
        return {
          ...state,
          data: {
            ...state.data,
            address: { ...state.data.address, [payload.label]: payload.value },
          },
        };
      }
      return {
        ...state,
        data: { ...state.data, [payload.label]: payload.value },
      };

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
        if (key === 'address') {
          newDataState[key] = {
            line1: '',
            line2: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
          };
        } else {
          newDataState[key] = '';
        }
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

export default function EditUserData() {
  const [newUserDatastate, dispatch] = useReducer(
    changeDataHandler,
    initialNewUserDataState
  );

  const [openDialog, setOpenDialog] = useState<{
    state: boolean;
    element: null | string;
  }>({
    state: false,
    element: null,
  });

  const { userData, changeUserData } = useContext(UserContext);

  const openDialogChangeHandler = ({
    state,
    element,
  }: {
    state: boolean;
    element: NewDataNameTypes;
  }) => {
    if (state) {
      setOpenDialog({ state: true, element });
    } else {
      setOpenDialog({ state: false, element });
    }
    setTimeout(() => {
      dispatch({
        type: ActionKind.ClearData,
      });
    }, 100);
  };

  const closeDialogHandler = ({ element }: { element: NewDataNameTypes }) => {
    setOpenDialog({ state: false, element });
    setTimeout(() => {
      dispatch({
        type: ActionKind.ClearData,
      });
    }, 100);
  };

  const newUserDataChangeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    mainLabel?: string
  ) => {
    dispatch({
      type: ActionKind.ValueChange,
      payload: { label: e.target.name, value: e.target.value, mainLabel },
    });
  };

  const uploadNewUserDataHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = e.currentTarget.name as NewDataNameTypes;
    if (!userData) return;
    try {
      dispatch({
        type: ActionKind.ClearError,
        payload: { label: name, value: null },
      });
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_UPDATE,
        body: {
          userEmail: userData.email,
          fieldKey: name,
          fieldValue: newUserDatastate.data[name],
        },
      });
      if (error) {
        dispatch({
          type: ActionKind.ErrorChange,
          payload: {
            label: name,
            value: error,
          },
        });
      } else {
        const { data } = await useGetAccessDatabase({
          url: DATABASE_ENDPOINTS.USER_PROFILE,
        });
        changeUserData(data);
        closeDialogHandler({ element: name });
      }
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
    <div className="flex flex-col justify-around gap-8 sm:flex-row">
      <section className="w-full">
        <h5 className="mb-4">User information</h5>
        <div className="flex flex-col gap-4">
          <div>
            <fieldset className="flex flex-col">
              <label
                htmlFor="showcasedEmail"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input
                id="showcasedEmail"
                type="email"
                disabled
                value={userData.email}
              />
            </fieldset>
            <div className="flex justify-between gap-4">
              <Dialog
                open={
                  NEWDATA_NAMES.email === openDialog.element && openDialog.state
                }
                onOpenChange={(state) =>
                  openDialogChangeHandler({ state, element: 'email' })
                }
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="px-0"
                  >
                    Change email
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div>
                    <form
                      className="mb-4"
                      name="email"
                      onSubmit={(e) => uploadNewUserDataHandler(e)}
                    >
                      <CustomInput
                        autoComplete="email"
                        name="email"
                        type="email"
                        optional={false}
                        labelValue="Email"
                        placeholder="JohnDoe@gmail.com..."
                        hasError={!!newUserDatastate.errors.email}
                        errorValue={newUserDatastate.errors.email}
                        inputValue={newUserDatastate.data.email}
                        onChange={(e) => newUserDataChangeHandler(e)}
                      />
                      <div className="flex w-full justify-end">
                        <Button variant="default" size="default" type="submit">
                          Accept
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <fieldset className="flex flex-col">
                <label
                  htmlFor="showcasedFirstName"
                  className="text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <Input
                  id="showcasedFirstName"
                  type="text"
                  disabled
                  value={userData.user_info.credentials.first_name}
                />
              </fieldset>

              <div className="flex justify-between gap-4">
                <Dialog
                  open={
                    NEWDATA_NAMES.first_name === openDialog.element &&
                    openDialog.state
                  }
                  onOpenChange={(state) =>
                    openDialogChangeHandler({ state, element: 'first_name' })
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="px-0">
                      Change first name
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div>
                      <form
                        className="mb-4"
                        name="first_name"
                        onSubmit={(e) => uploadNewUserDataHandler(e)}
                      >
                        <CustomInput
                          name="first_name"
                          type="text"
                          optional={false}
                          labelValue="First Name"
                          placeholder="John..."
                          hasError={!!newUserDatastate.errors.first_name}
                          errorValue={newUserDatastate.errors.first_name}
                          inputValue={newUserDatastate.data.first_name}
                          onChange={(e) => newUserDataChangeHandler(e)}
                        />
                        <div className="flex w-full justify-end">
                          <Button
                            variant="default"
                            size="default"
                            type="submit"
                          >
                            Accept
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <fieldset className="flex flex-col">
                <label
                  htmlFor="showcasedLastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <Input
                  id="showcasedLastName"
                  type="text"
                  disabled
                  value={userData.user_info.credentials.last_name}
                />
              </fieldset>

              <div className="flex justify-between gap-4">
                <Dialog
                  open={
                    NEWDATA_NAMES.last_name === openDialog.element &&
                    openDialog.state
                  }
                  onOpenChange={(state) =>
                    openDialogChangeHandler({ state, element: 'last_name' })
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="px-0">
                      Change last name
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div>
                      <form
                        className="mb-4"
                        name="last_name"
                        onSubmit={(e) => uploadNewUserDataHandler(e)}
                      >
                        <fieldset>
                          <CustomInput
                            name="last_name"
                            type="text"
                            optional={false}
                            labelValue="Last Name"
                            placeholder="Doe..."
                            hasError={!!newUserDatastate.errors.last_name}
                            errorValue={newUserDatastate.errors.last_name}
                            inputValue={newUserDatastate.data.last_name}
                            onChange={(e) => newUserDataChangeHandler(e)}
                          />
                          <div className="flex w-full justify-end">
                            <Button
                              variant="default"
                              size="default"
                              type="submit"
                            >
                              Accept
                            </Button>
                          </div>
                        </fieldset>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div>
            <fieldset className="flex flex-col">
              <label
                htmlFor="showcasedPassword"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="showcasedPassword"
                type="text"
                disabled
                value="*****"
              />
            </fieldset>
            <div className="flex justify-between">
              <Dialog
                open={
                  NEWDATA_NAMES.password === openDialog.element &&
                  openDialog.state
                }
                onOpenChange={(state) =>
                  openDialogChangeHandler({ state, element: 'password' })
                }
              >
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="px-0">
                    Change password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div>
                    <form
                      className={`p-1`}
                      name="password"
                      onSubmit={(e) => uploadNewUserDataHandler(e)}
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
                      <div className="flex justify-between">
                        <Button variant="default" size="default" type="submit">
                          Accept
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div>
            <fieldset className="flex flex-col">
              <label
                htmlFor="showcasedPhone"
                className="text-sm font-medium text-gray-700"
              >
                Phone
              </label>
              <Input
                id="showcasedPhone"
                type="tel"
                disabled
                placeholder="000-000-000"
                value={userData.user_info.phone}
              />
            </fieldset>
            <div className="flex justify-between">
              <Dialog
                open={
                  NEWDATA_NAMES.phone === openDialog.element && openDialog.state
                }
                onOpenChange={(state) =>
                  openDialogChangeHandler({ state, element: 'phone' })
                }
              >
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="px-0">
                    Change phone
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <div>
                    <form
                      className="mb-4"
                      name="phone"
                      onSubmit={(e) => uploadNewUserDataHandler(e)}
                    >
                      <CustomInput
                        name="phone"
                        type="text"
                        optional={false}
                        labelValue="Phone"
                        placeholder="000-000-000"
                        hasError={!!newUserDatastate.errors.phone}
                        errorValue={newUserDatastate.errors.phone}
                        inputValue={newUserDatastate.data.phone}
                        onChange={(e) => newUserDataChangeHandler(e)}
                      />
                      <div className="flex w-full justify-end">
                        <Button variant="default" size="default" type="submit">
                          Accept
                        </Button>
                      </div>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div>
            <fieldset className="flex flex-col">
              <label
                htmlFor="showcasedAddress"
                className="text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <Input
                id="showcasedAddress"
                type="text"
                disabled
                placeholder="Address"
                value={`${userData.user_info.address.line1 || 'Street'}, ${
                  userData.user_info.address.city || 'City'
                }, ${userData.user_info.address.state || 'State'}, ${
                  userData.user_info.address.country || 'Country'
                }`}
              />
            </fieldset>
            <div className="flex justify-between">
              <Dialog
                open={
                  NEWDATA_NAMES.address === openDialog.element &&
                  openDialog.state
                }
                onOpenChange={(state) =>
                  openDialogChangeHandler({ state, element: 'address' })
                }
              >
                <DialogTrigger asChild>
                  <Button variant="link" size="sm" className="px-0">
                    Change address
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <form
                    name="address"
                    onSubmit={(e) => uploadNewUserDataHandler(e)}
                  >
                    <CustomInput
                      name="line1"
                      type="text"
                      optional={false}
                      labelValue="Address 1"
                      placeholder={userData.user_info.address.line1 || 'Street'}
                      hasError={!!newUserDatastate.errors.address?.line1}
                      errorValue={newUserDatastate.errors.address?.line1}
                      inputValue={newUserDatastate.data.address?.line1}
                      onChange={(e) => newUserDataChangeHandler(e, 'address')}
                    />
                    <CustomInput
                      name="line2"
                      type="text"
                      optional={false}
                      labelValue="Address 2"
                      placeholder={
                        userData.user_info.address.line2 ||
                        'Apartament number etc.'
                      }
                      hasError={!!newUserDatastate.errors.address?.line2}
                      errorValue={newUserDatastate.errors.address?.line2}
                      inputValue={newUserDatastate.data.address?.line2}
                      onChange={(e) => newUserDataChangeHandler(e, 'address')}
                    />
                    <CustomInput
                      name="city"
                      type="text"
                      optional={false}
                      labelValue="City"
                      placeholder={userData.user_info.address.city || 'Warsaw'}
                      hasError={!!newUserDatastate.errors.address?.city}
                      errorValue={newUserDatastate.errors.address?.city}
                      inputValue={newUserDatastate.data.address?.city}
                      onChange={(e) => newUserDataChangeHandler(e, 'address')}
                    />
                    <CustomInput
                      name="state"
                      type="text"
                      optional={false}
                      labelValue="State"
                      placeholder={
                        userData.user_info.address.state || 'Mazovia'
                      }
                      hasError={!!newUserDatastate.errors.address?.state}
                      errorValue={newUserDatastate.errors.address?.state}
                      inputValue={newUserDatastate.data.address?.state}
                      onChange={(e) => newUserDataChangeHandler(e, 'address')}
                    />
                    <CustomInput
                      name="postal_code"
                      type="text"
                      optional={false}
                      labelValue="Postal Code"
                      placeholder={
                        userData.user_info.address.postal_code || '12-345'
                      }
                      hasError={!!newUserDatastate.errors.address?.postal_code}
                      errorValue={newUserDatastate.errors.address?.postal_code}
                      inputValue={newUserDatastate.data.address?.postal_code}
                      onChange={(e) => newUserDataChangeHandler(e, 'address')}
                    />
                    <CustomInput
                      name="country"
                      type="text"
                      optional={false}
                      labelValue="Country"
                      placeholder={
                        userData.user_info.address.country || 'Poland'
                      }
                      hasError={!!newUserDatastate.errors.address?.country}
                      errorValue={newUserDatastate.errors.address?.country}
                      inputValue={newUserDatastate.data.address?.country}
                      onChange={(e) => newUserDataChangeHandler(e, 'address')}
                    />
                    <div className="flex w-full justify-end">
                      <Button variant="default" size="default" type="submit">
                        Accept
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {userData.role !== 'User' && (
        <section className="w-full">
          <h5 className="mb-5">Author information</h5>
          <div className="flex flex-col gap-4">
            <div>
              <fieldset className="flex flex-col">
                <label
                  htmlFor="showcasedQuote"
                  className="text-sm font-medium text-gray-700"
                >
                  Quote
                </label>
                <Input
                  id="showcasedQuote"
                  type="text"
                  disabled
                  placeholder={userData.author_info.quote || 'No quote ...'}
                  value={userData.author_info.quote}
                />
              </fieldset>
              <div className="flex justify-between">
                <Dialog
                  open={
                    NEWDATA_NAMES.quote === openDialog.element &&
                    openDialog.state
                  }
                  onOpenChange={(state) =>
                    openDialogChangeHandler({ state, element: 'quote' })
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="px-0">
                      Change quote
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <div>
                      <form
                        name="quote"
                        onSubmit={(e) => uploadNewUserDataHandler(e)}
                      >
                        <CustomInput
                          name="quote"
                          type="text"
                          optional={false}
                          labelValue="Quote"
                          placeholder="Doe..."
                          hasError={!!newUserDatastate.errors.quote}
                          errorValue={newUserDatastate.errors.quote}
                          inputValue={newUserDatastate.data.quote}
                          onChange={(e) => newUserDataChangeHandler(e)}
                        />
                        <div className="flex w-full justify-end">
                          <Button
                            variant="default"
                            size="default"
                            type="submit"
                          >
                            Accept
                          </Button>
                        </div>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <fieldset className="flex flex-col">
                <label
                  htmlFor="showcasedPseudonim"
                  className="text-sm font-medium text-gray-700"
                >
                  Pseudonim
                </label>
                <Input
                  id="showcasedPseudonim"
                  type="text"
                  disabled
                  placeholder={userData.author_info.pseudonim}
                  value={userData.author_info.pseudonim}
                />
              </fieldset>
              <div className="flex justify-between">
                <Dialog
                  open={
                    NEWDATA_NAMES.pseudonim === openDialog.element &&
                    openDialog.state
                  }
                  onOpenChange={(state) =>
                    openDialogChangeHandler({ state, element: 'pseudonim' })
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="px-0">
                      Change pseudonim
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form
                      name="pseudonim"
                      onSubmit={(e) => uploadNewUserDataHandler(e)}
                    >
                      <fieldset>
                        <CustomInput
                          name="pseudonim"
                          type="text"
                          optional={false}
                          labelValue="Pseudonim"
                          placeholder="Doe..."
                          hasError={!!newUserDatastate.errors.pseudonim}
                          errorValue={newUserDatastate.errors.pseudonim}
                          inputValue={newUserDatastate.data.pseudonim}
                          onChange={(e) => newUserDataChangeHandler(e)}
                        />
                        <div className="flex w-full justify-end">
                          <Button
                            variant="default"
                            size="default"
                            type="submit"
                          >
                            Accept
                          </Button>
                        </div>
                      </fieldset>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <fieldset className="flex flex-col">
                <label
                  htmlFor="showcasedShortDescription"
                  className="text-sm font-medium text-gray-700"
                >
                  Short Description
                </label>
                <Input
                  id="showcasedShortDescription"
                  type="text"
                  disabled
                  placeholder={userData.author_info.short_description}
                  value={userData.author_info.short_description}
                />
              </fieldset>
              <div className="flex justify-between">
                <Dialog
                  open={
                    NEWDATA_NAMES.short_description === openDialog.element &&
                    openDialog.state
                  }
                  onOpenChange={(state) =>
                    openDialogChangeHandler({
                      state,
                      element: 'short_description',
                    })
                  }
                >
                  <DialogTrigger asChild>
                    <Button variant="link" size="sm" className="px-0">
                      Change short description
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form
                      name="short_description"
                      onSubmit={(e) => uploadNewUserDataHandler(e)}
                    >
                      <fieldset>
                        <label htmlFor="shortDescription">
                          Short description
                        </label>
                        <textarea
                          name="short_description"
                          id="shortDescription"
                          rows={6}
                          onChange={(e) => newUserDataChangeHandler(e)}
                          value={newUserDatastate.data.short_description}
                          className="w-full resize-none rounded-md border-2 border-gray-200"
                        />

                        <div className="flex w-full justify-end">
                          <Button
                            variant="default"
                            size="default"
                            type="submit"
                          >
                            Accept
                          </Button>
                        </div>
                      </fieldset>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
