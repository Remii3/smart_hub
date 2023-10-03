import { useContext, useState } from 'react';
import { UserContext } from '@context/UserProvider';
import { Button } from '@components/UI/button';
import { Input } from '@components/UI/input';
import { Dialog, DialogContent, DialogTrigger } from '@components/UI/dialog';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/UI/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@components/UI/use-toast';

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

export default function EditUserData() {
  const [openDialog, setOpenDialog] = useState<{
    state: boolean;
    element: null | string;
  }>({
    state: false,
    element: null,
  });

  const { userData, changeUserData, fetchUserData } = useContext(UserContext);

  if (!userData) return <p>Please log in</p>;

  const formSchema = {
    email: z.object({ email: z.string().nonempty().min(2) }),
    first_name: z.object({ first_name: z.string().nonempty().min(2) }),
    last_name: z.object({ last_name: z.string().nonempty().min(2) }),
    password: z.object({ password: z.string().nonempty().min(2) }),
    phone: z.object({ phone: z.string().nonempty() }),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postal_code: z.string().optional(),
      country: z.string().optional(),
    }),
    quote: z.object({ quote: z.string().nonempty() }),
    pseudonim: z.object({ pseudonim: z.string().nonempty() }),
    short_description: z.object({ short_description: z.string().nonempty() }),
  };
  const formEmail = useForm<any>({
    resolver: zodResolver(formSchema.email),
    defaultValues: {
      email: '',
    },
  });
  const formFirstname = useForm<any>({
    resolver: zodResolver(formSchema.first_name),
    defaultValues: {
      first_name: '',
    },
  });
  const formLastname = useForm<any>({
    resolver: zodResolver(formSchema.last_name),
    defaultValues: {
      last_name: '',
    },
  });
  const formPassword = useForm<any>({
    resolver: zodResolver(formSchema.password),
    defaultValues: {
      password: '',
    },
  });
  const formPhone = useForm<any>({
    resolver: zodResolver(formSchema.phone),
    defaultValues: {
      phone: '',
    },
  });
  const formAddress = useForm<any>({
    resolver: zodResolver(formSchema.address),
    defaultValues: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
    },
  });
  const formQuote = useForm<any>({
    resolver: zodResolver(formSchema.quote),
    defaultValues: {
      quote: '',
    },
  });
  const formPseudonim = useForm<any>({
    resolver: zodResolver(formSchema.pseudonim),
    defaultValues: {
      pseudonim: '',
    },
  });
  const formShortDescription = useForm<any>({
    resolver: zodResolver(formSchema.short_description),
    defaultValues: {
      short_description: '',
    },
  });
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
      formEmail.reset();
      formFirstname.reset();
      formLastname.reset();
      formPassword.reset();
      formPhone.reset();
      formAddress.reset();
      formQuote.reset();
      formPseudonim.reset();
      formShortDescription.reset();
    }, 100);
  };

  const closeDialogHandler = ({ element }: { element: NewDataNameTypes }) => {
    setOpenDialog({ state: false, element });

    setTimeout(() => {
      formEmail.reset();
      formFirstname.reset();
      formLastname.reset();
      formPassword.reset();
      formPhone.reset();
      formAddress.reset();
      formQuote.reset();
      formPseudonim.reset();
      formShortDescription.reset();
    }, 100);
  };

  const { toast } = useToast();
  const uploadNewUserDataHandler = async (formResponse: any) => {
    let selectedElementName = null;
    for (const key in formResponse) {
      if (
        key === 'line1' ||
        key === 'line2' ||
        key === 'city' ||
        key === 'state' ||
        key === 'postal_code' ||
        key === 'country'
      ) {
        selectedElementName = 'address';
      } else {
        selectedElementName = key;
      }
    }
    if (!selectedElementName) return;

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_UPDATE,
      body: {
        userEmail: userData.email,
        fieldKey: selectedElementName,
        fieldValue:
          selectedElementName === 'address'
            ? formResponse
            : formResponse[selectedElementName],
      },
    });
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.',
      });
      closeDialogHandler({
        element: selectedElementName as NewDataNameTypes,
      });
    } else if (!error) {
      const { data, error } = await useGetAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_PROFILE,
      });
      if (data) {
        changeUserData(data);
      }
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request.',
        });
        closeDialogHandler({
          element: selectedElementName as NewDataNameTypes,
        });
      } else {
        closeDialogHandler({
          element: selectedElementName as NewDataNameTypes,
        });
      }
    }
  };
  return (
    <div>
      <h4 className="mb-4">My data</h4>
      <div className="flex flex-col justify-around gap-8 sm:flex-row">
        <section className="w-full">
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
                    NEWDATA_NAMES.email === openDialog.element &&
                    openDialog.state
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
                    <Form {...formEmail}>
                      <form
                        className="mb-4"
                        name="email"
                        onSubmit={formEmail.handleSubmit(
                          uploadNewUserDataHandler
                        )}
                      >
                        <FormField
                          control={formEmail.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={userData.email}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your account email
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
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
                    </Form>
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
                      <Form {...formFirstname}>
                        <form
                          className="mb-4"
                          name="first_name"
                          onSubmit={formFirstname.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          <FormField
                            control={formFirstname.control}
                            name="first_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder={
                                      userData.user_info.credentials.first_name
                                    }
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This is your first name
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
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
                      </Form>
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
                      <Form {...formLastname}>
                        <form
                          className="mb-4"
                          name="last_name"
                          onSubmit={formLastname.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          <FormField
                            control={formLastname.control}
                            name="last_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder={
                                      userData.user_info.credentials.last_name
                                    }
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This is your last name
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
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
                      </Form>
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
                    <Form {...formPassword}>
                      <form
                        className={`p-1`}
                        name="password"
                        onSubmit={formPassword.handleSubmit(
                          uploadNewUserDataHandler
                        )}
                      >
                        <FormField
                          control={formPassword.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Last name"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your password
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* <CustomInput
                        name="password"
                        type="text"
                        optional={false}
                        labelValue="New Password"
                        placeholder="Password..."
                        hasError={!!newUserDatastate.errors.password}
                        errorValue={newUserDatastate.errors.password}
                        inputValue={newUserDatastate.data.password}
                        onChange={(e) => newUserDataChangeHandler(e)}
                      /> */}
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
                    </Form>
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
                    NEWDATA_NAMES.phone === openDialog.element &&
                    openDialog.state
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
                    <Form {...formPhone}>
                      <form
                        className="mb-4"
                        name="phone"
                        onSubmit={formPhone.handleSubmit(
                          uploadNewUserDataHandler
                        )}
                      >
                        <FormField
                          control={formPhone.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telephone</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="000-000-000"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your telephone
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* <CustomInput
                        name="phone"
                        type="text"
                        optional={false}
                        labelValue="Phone"
                        placeholder="000-000-000"
                        hasError={!!newUserDatastate.errors.phone}
                        errorValue={newUserDatastate.errors.phone}
                        inputValue={newUserDatastate.data.phone}
                        onChange={(e) => newUserDataChangeHandler(e)}
                      /> */}
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
                    </Form>
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
                    <Form {...formAddress}>
                      <form
                        name="address"
                        onSubmit={formAddress.handleSubmit(
                          uploadNewUserDataHandler
                        )}
                      >
                        <FormField
                          control={formAddress.control}
                          name="line1"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address 1</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={userData.user_info.address.line1}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your street
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formAddress.control}
                          name="line2"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address 2</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={userData.user_info.address.line2}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your apartament number etc.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formAddress.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={userData.user_info.address.city}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your city
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formAddress.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={userData.user_info.address.state}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your state
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formAddress.control}
                          name="postal_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={
                                    userData.user_info.address.postal_code
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your postal code
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={formAddress.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={
                                    userData.user_info.address.country
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is your country
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
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
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>

        {userData.role !== 'User' && (
          <section className="w-full">
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
                      <Form {...formQuote}>
                        <form
                          name="quote"
                          onSubmit={formQuote.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          <FormField
                            control={formQuote.control}
                            name="quote"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quote</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder={userData.author_info.quote}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This is your quote
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
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
                      </Form>
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
                      <Form {...formPseudonim}>
                        <form
                          name="pseudonim"
                          onSubmit={formPseudonim.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          <FormField
                            control={formPseudonim.control}
                            name="pseudonim"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pseudonim</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder={userData.author_info.pseudonim}
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This is your pseudonim.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
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
                      </Form>
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
                      <Form {...formShortDescription}>
                        <form
                          name="short_description"
                          onSubmit={formShortDescription.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          <FormField
                            control={formShortDescription.control}
                            name="short_description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Short description</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder={
                                      userData.author_info.short_description
                                    }
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This is your short description.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
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
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
