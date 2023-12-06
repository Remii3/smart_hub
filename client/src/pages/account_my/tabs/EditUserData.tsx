import {
  useContext,
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
} from 'react';
import { UserContext } from '@context/UserProvider';
import { Button, buttonVariants } from '@components/UI/button';
import { Input } from '@components/UI/input';
import { Dialog, DialogContent } from '@components/UI/dialog';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
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
import errorToast from '@components/UI/error/errorToast';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Textarea } from '@components/UI/textarea';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import useUploadImg from '@hooks/useUploadImg';
import { PlusCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Label } from '@components/UI/label';
import { v4 } from 'uuid';
import useDeleteImg from '@hooks/useDeleteImg';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/UI/select';
import { availableCountries } from '@data/countries';

type SelectedProfileImgTypes = {
  isDirty: boolean;
  img: null | {
    id: string;
    data?: File;
    url: string;
  };
};
type NewDataNameTypes =
  | 'username'
  | 'credentials'
  | 'password'
  | 'phone'
  | 'address'
  | 'quote'
  | 'pseudonim'
  | 'shortDescription'
  | 'profileImg';

const usernameFormSchema = z.object({
  username: z.string().min(2),
});
const credentialsFormSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});
const passwordFormSchema = z
  .object({
    password: z.string().nonempty().min(2),
    passwordConfirmation: z.string().nonempty().min(2),
  })
  .superRefine(({ passwordConfirmation, password }, ctx) => {
    if (passwordConfirmation !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['passwordConfirmation'],
      });
    }
  });

const phoneFormSchema = z.object({
  phone: z.string().optional(),
});
const addressFormSchema = z.object({
  line1: z.string().optional(),
  line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
});

const quoteFormSchema = z.object({
  quote: z.string().optional(),
});

const pseudonimFormSchema = z.object({
  pseudonim: z.string().min(2),
});

const shortDescriptionFormSchema = z.object({
  shortDescription: z.string().optional(),
});

export default function EditUserData() {
  const [countries, setCountries] = useState<{ code: string; name?: string }[]>(
    []
  );

  const [openDialog, setOpenDialog] = useState<null | NewDataNameTypes>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedProfileImg, setSelectedProfileImg] =
    useState<SelectedProfileImgTypes>({
      img: null,
      isDirty: false,
    });

  const { userData, fetchUserData } = useContext(UserContext);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const eventFiles = e.target.files;
      setSelectedProfileImg({
        isDirty: true,
        img: {
          id: eventFiles[0].name + v4(),
          data: eventFiles[0],
          url: URL.createObjectURL(eventFiles[0]),
        },
      });
    }
  };

  if (!userData.data) return <p>Please log in</p>;
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmation: false,
  });

  const removeImg = () => {
    setSelectedProfileImg({ img: null, isDirty: true });
  };
  const usernameForm = useForm({
    resolver: zodResolver(usernameFormSchema),
  });
  const credentialsForm = useForm({
    resolver: zodResolver(credentialsFormSchema),
  });
  const passwrodForm = useForm({
    resolver: zodResolver(passwordFormSchema),
  });
  const phoneForm = useForm({
    resolver: zodResolver(phoneFormSchema),
  });
  const addressForm = useForm({
    resolver: zodResolver(addressFormSchema),
  });
  const quoteForm = useForm({
    resolver: zodResolver(quoteFormSchema),
  });
  const pseudonimForm = useForm({
    resolver: zodResolver(pseudonimFormSchema),
  });
  const shortDescriptionForm = useForm({
    resolver: zodResolver(shortDescriptionFormSchema),
  });

  const uploadNewUserDataHandler = async () => {
    if (!userData.data) return;
    let dirtyData = {};
    switch (openDialog) {
      case 'username': {
        dirtyData = Object.fromEntries(
          Object.keys(usernameForm.formState.dirtyFields).map((x: string) => [
            x,
            usernameForm.getValues(
              x as keyof z.infer<typeof usernameFormSchema>
            ),
          ])
        );
        break;
      }
      case 'credentials': {
        dirtyData = Object.fromEntries(
          Object.keys(credentialsForm.formState.dirtyFields).map(
            (x: string) => [
              x,
              credentialsForm.getValues(
                x as keyof z.infer<typeof credentialsFormSchema>
              ),
            ]
          )
        );
        break;
      }
      case 'password': {
        dirtyData = Object.fromEntries(
          Object.keys(passwrodForm.formState.dirtyFields).map((x: string) => [
            x,
            passwrodForm.getValues(
              x as keyof z.infer<typeof passwordFormSchema>
            ),
          ])
        );
        break;
      }
      case 'address': {
        dirtyData = Object.fromEntries(
          Object.keys(addressForm.formState.dirtyFields).map((x: string) => [
            x,
            addressForm.getValues(x as keyof z.infer<typeof addressFormSchema>),
          ])
        );
        break;
      }
      case 'phone': {
        dirtyData = Object.fromEntries(
          Object.keys(phoneForm.formState.dirtyFields).map((x: string) => [
            x,
            phoneForm.getValues(x as keyof z.infer<typeof phoneFormSchema>),
          ])
        );
        break;
      }
      case 'pseudonim': {
        dirtyData = Object.fromEntries(
          Object.keys(pseudonimForm.formState.dirtyFields).map((x: string) => [
            x,
            pseudonimForm.getValues(
              x as keyof z.infer<typeof pseudonimFormSchema>
            ),
          ])
        );
        break;
      }
      case 'quote': {
        dirtyData = Object.fromEntries(
          Object.keys(quoteForm.formState.dirtyFields).map((x: string) => [
            x,
            quoteForm.getValues(x as keyof z.infer<typeof quoteFormSchema>),
          ])
        );
        break;
      }
      case 'shortDescription': {
        dirtyData = Object.fromEntries(
          Object.keys(shortDescriptionForm.formState.dirtyFields).map(
            (x: string) => [
              x,
              shortDescriptionForm.getValues(
                x as keyof z.infer<typeof shortDescriptionFormSchema>
              ),
            ]
          )
        );
        break;
      }
    }
    setIsUpdating(true);

    if (selectedProfileImg.isDirty) {
      if (!selectedProfileImg.img) {
        await useDeleteImg({
          imgId: userData.data.userInfo.profileImg.id,
          ownerId: userData.data._id,
          targetLocation: 'ProfileImg',
        });

        dirtyData = { profileImg: {} };
      }
      if (selectedProfileImg.img) {
        const imgResData = await useUploadImg({
          ownerId: userData.data._id,
          selectedFile: selectedProfileImg.img
            ? selectedProfileImg.img.data!
            : null,
          targetLocation: 'ProfileImg',
          currentId: userData.data.userInfo.profileImg.id,
        });
        dirtyData = { profileImg: { ...imgResData } };
      }
    }

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_UPDATE,
      body: {
        _id: userData.data._id,
        dirtyData,
      },
    });
    if (error) {
      errorToast(error);
    }

    fetchUserData();
    setOpenDialog(null);
    setTimeout(() => {
      setIsUpdating(false);
    }, 200);
  };

  useEffect(() => {
    setSelectedProfileImg({ img: null, isDirty: false });
    usernameForm.reset({
      username: userData.data?.username,
    });
    credentialsForm.reset({
      firstName: userData.data?.userInfo.credentials.firstName,
      lastName: userData.data?.userInfo.credentials.lastName,
    });
    passwrodForm.reset({
      password: '',
      passwordConfirmation: '',
    });
    phoneForm.reset({
      phone: userData.data?.userInfo.phone,
    });
    addressForm.reset({
      line1: userData.data?.userInfo.address.line1,
      line2: userData.data?.userInfo.address.line2,
      city: userData.data?.userInfo.address.city,
      state: userData.data?.userInfo.address.state,
      postalCode: userData.data?.userInfo.address.postalCode,
      country: userData.data?.userInfo.address.country,
    });
    if (userData.data && userData.data.role !== 'User') {
      quoteForm.reset({
        quote: userData.data?.authorInfo.quote,
      });
      pseudonimForm.reset({
        pseudonim: userData.data?.authorInfo.pseudonim,
      });
      shortDescriptionForm.reset({
        shortDescription: userData.data?.authorInfo.shortDescription,
      });
    }
  }, [openDialog]);
  const prepareCountry = new Intl.DisplayNames(['en'], { type: 'region' });

  const fetchCountries = useCallback(async () => {
    const preparedCountries = availableCountries.map((country: string) => ({
      code: country,
      name: prepareCountry.of(country),
    }));
    setCountries(preparedCountries);
  }, []);
  useEffect(() => {
    fetchCountries();
  }, []);
  return (
    <>
      <h4 className="mb-4">My data</h4>
      <section className="px-1">
        <Dialog
          open={openDialog === 'profileImg'}
          onOpenChange={() => setOpenDialog(null)}
        >
          <div className="flex flex-col">
            <fieldset className="flex flex-col">
              <div id="showcasedProfileImg">
                {userData.data.userInfo.profileImg.url && (
                  <img
                    className="inline-block h-24 w-24 rounded-md object-cover ring-2 ring-white"
                    src={userData.data.userInfo.profileImg.url}
                    alt="avatar_img"
                  />
                )}
                {!userData.data.userInfo.profileImg.url &&
                  !selectedProfileImg.img && (
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                      className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white"
                      alt="profileImg"
                    />
                  )}
              </div>
            </fieldset>
            <div>
              <Button
                variant="link"
                size="sm"
                className="px-0"
                onClick={() => setOpenDialog('profileImg')}
              >
                Change profile img
              </Button>
              <DialogContent className="w-screen max-w-md">
                {!isUpdating ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">
                      Profile img
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex flex-col">
                        {selectedProfileImg.img && (
                          <img
                            className="inline-block w-40 aspect-square rounded-full object-center object-cover ring-2 ring-white"
                            src={selectedProfileImg.img.url}
                            alt="avatar_img"
                          />
                        )}
                        {userData.data.userInfo.profileImg.url &&
                          !selectedProfileImg.isDirty && (
                            <img
                              className="inline-block w-40 aspect-square rounded-full object-center object-cover ring-2 ring-white"
                              src={userData.data.userInfo.profileImg.url}
                              alt="avatar_img"
                            />
                          )}
                        {((!userData.data.userInfo.profileImg.url &&
                          !selectedProfileImg.img) ||
                          (!selectedProfileImg.img &&
                            selectedProfileImg.isDirty)) && (
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                            className="inline-block w-40 rounded-full object-center aspect-square object-cover ring-2 ring-white"
                            alt="profileImg"
                          />
                        )}
                      </div>
                      <div className="space-x-2">
                        <Button variant={'ghost'} onClick={removeImg}>
                          <XCircleIcon className="w-14" />
                        </Button>
                        <Label className="inline-block">
                          <Input
                            name="file"
                            accept=".jpg, .jpeg, .png"
                            type="file"
                            value={''}
                            onChange={(e) => onImageChange(e)}
                            className="hidden"
                          />
                          <div
                            className={`${buttonVariants({
                              variant: 'ghost',
                            })} cursor-pointer`}
                          >
                            <PlusCircleIcon className="w-14" />
                          </div>
                        </Label>
                      </div>
                    </div>

                    <div className="text-[0.8rem] text-muted-foreground">
                      Change your profile img.
                    </div>
                  </div>
                ) : (
                  <div className="relative min-h-[72px]">
                    <LoadingCircle />
                  </div>
                )}
                <div className="flex w-full justify-end">
                  <Button
                    variant="default"
                    size="default"
                    type="button"
                    onClick={uploadNewUserDataHandler}
                    disabled={isUpdating}
                  >
                    Change
                  </Button>
                </div>
              </DialogContent>
            </div>
          </div>
        </Dialog>

        <div className="flex flex-col justify-start gap-8 px-2 sm:flex-row">
          <section className="basis-full sm:basis-3/6 lg:basis-2/6">
            <div className="flex flex-col gap-4">
              <Dialog
                open={openDialog === 'username'}
                onOpenChange={() => setOpenDialog(null)}
              >
                <div>
                  <fieldset className="flex flex-col">
                    <label
                      htmlFor="showcasedUsername"
                      className="text-sm font-medium text-slate-700"
                    >
                      Username
                    </label>
                    <Input
                      id="showcasedUsername"
                      type="text"
                      disabled
                      value={userData.data.username}
                    />
                  </fieldset>
                  <div className="flex justify-between gap-4">
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="px-0"
                      onClick={() => setOpenDialog('username')}
                    >
                      Change username
                    </Button>
                    <DialogContent className="w-screen max-w-md">
                      <Form {...usernameForm}>
                        <form
                          name="username"
                          onSubmit={usernameForm.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          {!isUpdating ? (
                            <FormField
                              control={usernameForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input type="text" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Change your username.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ) : (
                            <div className="relative min-h-[72px]">
                              <LoadingCircle />
                            </div>
                          )}
                          <div className="flex w-full justify-end">
                            <Button
                              variant="default"
                              size="default"
                              disabled={isUpdating}
                              type="submit"
                            >
                              Change
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </div>
                </div>
              </Dialog>
              <Dialog
                open={openDialog === 'credentials'}
                onOpenChange={() => setOpenDialog(null)}
              >
                <div className="flex flex-col ">
                  <div className="flex gap-4">
                    <fieldset className="flex flex-col">
                      <label
                        htmlFor="showcasedFirstName"
                        className="text-sm font-medium text-slate-700"
                      >
                        First name
                      </label>
                      <Input
                        id="showcasedFirstName"
                        type="text"
                        disabled
                        value={userData.data.userInfo.credentials.firstName}
                      />
                    </fieldset>
                    <fieldset className="flex flex-col">
                      <label
                        htmlFor="showcasedLastName"
                        className="text-sm font-medium text-slate-700"
                      >
                        Last name
                      </label>
                      <Input
                        id="showcasedLastName"
                        type="text"
                        disabled
                        value={userData.data.userInfo.credentials.lastName}
                      />
                    </fieldset>
                  </div>
                  <div className="flex justify-between gap-4">
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0"
                      onClick={() => setOpenDialog('credentials')}
                    >
                      Change credentials
                    </Button>

                    <DialogContent className="w-screen max-w-md">
                      <Form {...credentialsForm}>
                        <form
                          name="credentials"
                          onSubmit={credentialsForm.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          {!isUpdating ? (
                            <div className="flex flex-wrap gap-4">
                              <FormField
                                control={credentialsForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem className="basis-full">
                                    <FormLabel>First name</FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change your first name.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={credentialsForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem className="basis-full">
                                    <FormLabel>Last name</FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change your last name.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ) : (
                            <div className="relative min-h-[72px]">
                              <LoadingCircle />
                            </div>
                          )}
                          <div className="flex w-full justify-end">
                            <Button
                              variant="default"
                              size="default"
                              type="submit"
                              disabled={isUpdating}
                            >
                              Change
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </div>
                </div>
              </Dialog>
              <Dialog
                open={openDialog === 'password'}
                onOpenChange={() => setOpenDialog(null)}
              >
                <div className="flex flex-col">
                  <fieldset className="flex flex-col">
                    <label
                      htmlFor="showcasedPassword"
                      className="text-sm font-medium text-slate-700"
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
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0"
                      onClick={() => setOpenDialog('password')}
                    >
                      Change password
                    </Button>
                    <DialogContent className="w-screen max-w-md">
                      <Form {...passwrodForm}>
                        <form
                          name="password"
                          onSubmit={passwrodForm.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          {!isUpdating ? (
                            <div className="flex flex-wrap gap-4">
                              <FormField
                                name="password"
                                control={passwrodForm.control}
                                render={({ field }) => (
                                  <FormItem className="basis-full">
                                    <FormLabel>
                                      Password{' '}
                                      <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          autoComplete="new-password"
                                          type={
                                            showPasswords.password
                                              ? 'text'
                                              : 'password'
                                          }
                                          placeholder="Password..."
                                          {...field}
                                        />
                                        <button
                                          type="button"
                                          className="absolute right-0 top-1/2 h-full -translate-y-1/2 cursor-pointer rounded-r-md px-3"
                                          onClick={() =>
                                            setShowPasswords((prevState) => {
                                              return {
                                                ...prevState,
                                                password: !prevState.password,
                                              };
                                            })
                                          }
                                        >
                                          {showPasswords.password ? (
                                            <EyeIcon className="h-5 w-5 text-gray-500" />
                                          ) : (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                          )}
                                        </button>
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Change your password.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                name="passwordConfirmation"
                                control={passwrodForm.control}
                                render={({ field }) => (
                                  <FormItem className="basis-full">
                                    <FormLabel>
                                      Password Confirmation{' '}
                                      <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Input
                                          autoComplete="new-password"
                                          type={
                                            showPasswords.confirmation
                                              ? 'text'
                                              : 'password'
                                          }
                                          placeholder="Password confirmation..."
                                          {...field}
                                        />
                                        <button
                                          type="button"
                                          className="absolute right-0 top-1/2 h-full -translate-y-1/2 cursor-pointer rounded-r-md px-3"
                                          onClick={() =>
                                            setShowPasswords((prevState) => {
                                              return {
                                                ...prevState,
                                                confirmation:
                                                  !prevState.confirmation,
                                              };
                                            })
                                          }
                                        >
                                          {showPasswords.confirmation ? (
                                            <EyeIcon className="h-5 w-5 text-gray-500" />
                                          ) : (
                                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                          )}
                                        </button>
                                      </div>
                                    </FormControl>
                                    <FormDescription>
                                      Confirm your new password.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ) : (
                            <div className="relative min-h-[72px]">
                              <LoadingCircle />
                            </div>
                          )}

                          <div className="flex w-full justify-end">
                            <Button
                              variant="default"
                              size="default"
                              type="submit"
                              disabled={isUpdating}
                            >
                              Change
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </div>
                </div>
              </Dialog>
              <Dialog
                open={openDialog === 'phone'}
                onOpenChange={() => setOpenDialog(null)}
              >
                <div className="flex flex-col">
                  <fieldset className="flex flex-col">
                    <label
                      htmlFor="showcasedPhone"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phone
                    </label>
                    <Input
                      id="showcasedPhone"
                      type="tel"
                      disabled
                      placeholder="000-000-000"
                      value={userData.data.userInfo.phone}
                    />
                  </fieldset>
                  <div className="flex justify-between">
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0"
                      onClick={() => setOpenDialog('phone')}
                    >
                      Change phone
                    </Button>

                    <DialogContent className="w-screen max-w-md">
                      <Form {...phoneForm}>
                        <form
                          name="phone"
                          onSubmit={phoneForm.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          {!isUpdating ? (
                            <FormField
                              control={phoneForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="text"
                                      placeholder="000-000-000"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    This is your phone number.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ) : (
                            <div className="relative min-h-[72px]">
                              <LoadingCircle />
                            </div>
                          )}
                          <div className="flex w-full justify-end">
                            <Button
                              variant="default"
                              size="default"
                              type="submit"
                              disabled={isUpdating}
                            >
                              Change
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </div>
                </div>
              </Dialog>
              <Dialog
                open={openDialog === 'address'}
                onOpenChange={() => setOpenDialog(null)}
              >
                <div className="flex flex-col">
                  <fieldset className="flex flex-col">
                    <label
                      htmlFor="showcasedAddress"
                      className="text-sm font-medium text-slate-700"
                    >
                      Address
                    </label>
                    <Input
                      id="showcasedAddress"
                      type="text"
                      disabled
                      placeholder="Address"
                      value={`${
                        userData.data.userInfo.address.line1 &&
                        userData.data.userInfo.address.line1 + ' / '
                      }${
                        userData.data.userInfo.address.city &&
                        userData.data.userInfo.address.city + ' / '
                      }${
                        userData.data.userInfo.address.state &&
                        userData.data.userInfo.address.state + ' / '
                      }${
                        userData.data.userInfo.address.postalCode &&
                        userData.data.userInfo.address.postalCode + ' / '
                      }${
                        userData.data.userInfo.address.country &&
                        prepareCountry.of(
                          userData.data.userInfo.address.country
                        )
                      }`}
                    />
                  </fieldset>
                  <div className="flex justify-between">
                    <Button
                      variant="link"
                      size="sm"
                      className="px-0"
                      onClick={() => setOpenDialog('address')}
                    >
                      Change address
                    </Button>

                    <DialogContent className="w-screen max-w-md">
                      <Form {...addressForm}>
                        <form
                          name="address"
                          onSubmit={addressForm.handleSubmit(
                            uploadNewUserDataHandler
                          )}
                        >
                          {!isUpdating ? (
                            <div className="flex flex-wrap gap-4">
                              <FormField
                                control={addressForm.control}
                                name="line1"
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change your address.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="line2"
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormLabel>Address details</FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change apartment number, storey etc.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change your city.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change your state.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="postalCode"
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change your postal code.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={addressForm.control}
                                name="country"
                                render={({ field }) => (
                                  <FormItem className="flex-grow w-full">
                                    <FormLabel>Country</FormLabel>
                                    <Select
                                      onValueChange={(newValue) =>
                                        field.onChange(newValue)
                                      }
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue
                                            placeholder={
                                              userData.data?.userInfo.address
                                                .country
                                                ? prepareCountry.of(
                                                    userData.data?.userInfo
                                                      .address.country
                                                  )
                                                : 'Select a country'
                                            }
                                          />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="max-h-[25vh]">
                                        <SelectGroup>
                                          {countries.map((country) => (
                                            <SelectItem
                                              key={country.code}
                                              value={country.code}
                                            >
                                              {country.name}
                                            </SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                    <FormDescription>
                                      Change your country.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ) : (
                            <div className="relative min-h-[72px]">
                              <LoadingCircle />
                            </div>
                          )}
                          <div className="flex w-full justify-end">
                            <Button
                              variant="default"
                              size="default"
                              type="submit"
                              disabled={isUpdating}
                            >
                              Change
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </div>
                </div>
              </Dialog>
            </div>
          </section>

          {userData.data.role !== 'User' && (
            <section className="basis-full sm:basis-3/6 lg:basis-2/6">
              <div className="flex flex-col gap-4">
                <Dialog
                  open={openDialog === 'quote'}
                  onOpenChange={() => setOpenDialog(null)}
                >
                  <div className="flex flex-col">
                    <fieldset className="flex flex-col">
                      <label
                        htmlFor="showcasedQuote"
                        className="text-sm font-medium text-slate-700"
                      >
                        Quote
                      </label>
                      <Input
                        id="showcasedQuote"
                        type="text"
                        disabled
                        placeholder={
                          userData.data.authorInfo.quote || 'No quote ...'
                        }
                        value={userData.data.authorInfo.quote}
                      />
                    </fieldset>
                    <div>
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0"
                        onClick={() => setOpenDialog('quote')}
                      >
                        Change quote
                      </Button>
                      <DialogContent className="w-screen max-w-md">
                        <Form {...quoteForm}>
                          <form
                            name="quote"
                            onSubmit={quoteForm.handleSubmit(
                              uploadNewUserDataHandler
                            )}
                          >
                            {!isUpdating ? (
                              <FormField
                                control={quoteForm.control}
                                name="quote"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Quote</FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change your quote.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ) : (
                              <div className="relative min-h-[72px]">
                                <LoadingCircle />
                              </div>
                            )}
                            <div className="flex w-full justify-end">
                              <Button
                                variant="default"
                                size="default"
                                type="submit"
                                disabled={isUpdating}
                              >
                                Change
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </div>
                  </div>
                </Dialog>
                <Dialog
                  open={openDialog === 'pseudonim'}
                  onOpenChange={() => setOpenDialog(null)}
                >
                  <div className="flex flex-col">
                    <fieldset className="flex flex-col">
                      <label
                        htmlFor="showcasedPseudonim"
                        className="text-sm font-medium text-slate-700"
                      >
                        Pseudonim
                      </label>
                      <Input
                        id="showcasedPseudonim"
                        type="text"
                        disabled
                        placeholder={userData.data.authorInfo.pseudonim}
                        value={userData.data.authorInfo.pseudonim}
                      />
                    </fieldset>
                    <div className="flex justify-between">
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0"
                        onClick={() => setOpenDialog('pseudonim')}
                      >
                        Change pseudonim
                      </Button>
                      <DialogContent className="w-screen max-w-md">
                        <Form {...pseudonimForm}>
                          <form
                            name="pseudonim"
                            onSubmit={pseudonimForm.handleSubmit(
                              uploadNewUserDataHandler
                            )}
                          >
                            {!isUpdating ? (
                              <FormField
                                control={pseudonimForm.control}
                                name="pseudonim"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Pseudonim{' '}
                                      <span className="text-red-600">*</span>
                                    </FormLabel>
                                    <FormControl>
                                      <Input type="text" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change your pseudonim.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ) : (
                              <div className="relative min-h-[72px]">
                                <LoadingCircle />
                              </div>
                            )}
                            <div className="flex w-full justify-end">
                              <Button
                                variant="default"
                                size="default"
                                type="submit"
                                disabled={isUpdating}
                              >
                                Change
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </div>
                  </div>
                </Dialog>
                <Dialog
                  open={openDialog === 'shortDescription'}
                  onOpenChange={() => setOpenDialog(null)}
                >
                  <div>
                    <fieldset className="flex flex-col">
                      <label
                        htmlFor="showcasedShortDescription"
                        className="text-sm font-medium text-slate-700"
                      >
                        Short Description
                      </label>
                      <Input
                        id="showcasedShortDescription"
                        type="text"
                        disabled
                        placeholder={userData.data.authorInfo.shortDescription}
                        value={userData.data.authorInfo.shortDescription}
                      />
                    </fieldset>
                    <div className="flex justify-between">
                      <Button
                        variant="link"
                        size="sm"
                        className="px-0"
                        onClick={() => setOpenDialog('shortDescription')}
                      >
                        Change short description
                      </Button>

                      <DialogContent className="w-screen max-w-md">
                        <Form {...shortDescriptionForm}>
                          <form
                            name="shortDescription"
                            onSubmit={shortDescriptionForm.handleSubmit(
                              uploadNewUserDataHandler
                            )}
                          >
                            {!isUpdating ? (
                              <FormField
                                control={shortDescriptionForm.control}
                                name="shortDescription"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Short description</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription>
                                      Change your short description.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            ) : (
                              <div className="relative min-h-[72px]">
                                <LoadingCircle />
                              </div>
                            )}
                            <div className="flex w-full justify-end">
                              <Button
                                variant="default"
                                size="default"
                                type="submit"
                                disabled={isUpdating}
                              >
                                Change
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </div>
                  </div>
                </Dialog>
              </div>
            </section>
          )}
        </div>
      </section>
    </>
  );
}
