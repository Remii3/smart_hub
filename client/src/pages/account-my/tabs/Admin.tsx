import { Link } from 'react-router-dom';
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { AuthorTypes } from '@customTypes/interfaces';
import { UserContext } from '@context/UserProvider';
import { USER_ROLES, UserRoleTypes } from '@customTypes/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@components/UI/accordion';
import { UpdateNewDataType, useEditUserData } from '@hooks/useUpdateUserData';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '../../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../../data/endpoints';
import { Button } from '@components/UI/button';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/UI/form';
import { Input } from '@components/UI/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/UI/select';
import { Textarea } from '@components/UI/textarea';
import useUploadImg from '@hooks/useUploadImg';
import { useToast } from '@components/UI/use-toast';

interface AdminUsersTypes {
  users: AuthorTypes[] | null;
  fetchingStatus: boolean;
  error: { name: string; message: string } | null;
}

const FormSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  pseudonim: z.string().optional(),
  quote: z.string().optional(),
  shortDescription: z.string().optional(),
});

export default function Admin() {
  const [originalData, setOriginalData] = useState<{
    users: AuthorTypes[] | null;
    fetchingStatus: boolean;
  }>({
    fetchingStatus: true,
    users: null,
  });

  const [newDataAllUsers, setNewDataAllUsers] = useState<AdminUsersTypes>({
    users: null,
    fetchingStatus: true,
    error: null,
  });

  const { userData } = useContext(UserContext);

  const fetchData = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.ADMIN_ALL_USERS,
    });
    setNewDataAllUsers({
      users: data,
      error: null,
      fetchingStatus: false,
    });
    setOriginalData({ users: data, fetchingStatus: false });
  }, []);
  const form = useForm<any>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const { toast } = useToast();
  const uploadUserDataHandler = async (
    formResponse: z.infer<typeof FormSchema>,
    user
  ) => {
    return console.log(formResponse);
    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_UPDATE,
      body: {
        userEmail: user.email,
        newValues: formResponse,
      },
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.ADMIN_ALL_USERS,
    });
    return { updatedUserData: data, error };
  };

  const newUserDataEditHandler = async ({
    e,
    newValue,
    user,
    updatedField,
  }: {
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>;
    newValue: string | UserRoleTypes;
    user: AuthorTypes;
    updatedField: UpdateNewDataType;
  }) => {
    const index = newDataAllUsers.users?.findIndex(
      (item) => item._id === user._id
    );
    if (index && originalData.users) {
      const updatedObject = useEditUserData({ newValue, user, updatedField });
      setNewDataAllUsers((prevState) => {
        return {
          ...prevState,
          error: null,
          users: [
            ...prevState.users!.slice(0, index),
            updatedObject,
            ...prevState.users!.slice(index + 1, prevState.users!.length),
          ],
        };
      });
      setOriginalData((prevState) => {
        return { ...prevState, fetchingStatus: true };
      });
      const { updatedUserData, error } = await uploadUserDataHandler({
        updatedField,
        e,
        userEmail: originalData.users[index].email,
      });
      setOriginalData((prevState) => {
        return { ...prevState, fetchingStatus: false };
      });
      if (error) {
        setNewDataAllUsers((prevState) => {
          return {
            ...prevState,
            error,
          };
        });
      }

      if (updatedUserData) {
        setOriginalData((prevState) => {
          return { ...prevState, users: updatedUserData };
        });
      }
    }
  };
  if (!newDataAllUsers.users && newDataAllUsers.fetchingStatus)
    return <div>Loading</div>;
  if (!newDataAllUsers.users) return <div>No data</div>;
  const uploadProfileImg = async (
    e: ChangeEvent<HTMLInputElement>,
    user: any
  ) => {
    if (!e.target.files) return;
    return console.log(e.target);
    const url = await useUploadImg({
      selectedFile: e.target.files[0],
      ownerId: user._id,
      targetLocation: 'Profile_img',
    });

    if (url) {
      await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_UPDATE,
        body: {
          userEmail: user.email,
          fieldValue: url,
          fieldKey: e.target.name,
        },
      });
      fetchData();
    } else {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Failed adding profile img',
      });
    }
  };
  return (
    <div className="w-full">
      <h4 className="mb-4">Users</h4>
      <div className="w-full">
        {newDataAllUsers.users.map((user) => (
          <Accordion type="single" collapsible key={user._id}>
            <AccordionItem value="test1">
              <AccordionTrigger className="mt-3 flex w-full justify-between px-3 py-4 first:mt-0 hover:bg-transparent hover:no-underline">
                {user.username}
              </AccordionTrigger>
              <AccordionContent className="bg-slate-100/50">
                <div className=" px-6 py-3">
                  <Link
                    to={`/account/${
                      userData?._id === user._id ? 'my' : user._id
                    }`}
                    className="mb-4 inline-block h-full space-x-2"
                  >
                    <Button className="px-0" variant={'link'}>
                      <h5 className="inline-block">{user.username}</h5>
                    </Button>
                  </Link>
                  <section className="space-y-2">
                    <div className="flex flex-wrap justify-between sm:justify-start">
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(uploadUserDataHandler)}
                        >
                          <Button variant={'default'} type="submit">
                            Update
                          </Button>
                          <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder={user.username}
                                    defaultValue={user.username}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder={user.email}
                                    defaultValue={user.email}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="role"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select defaultValue={user.role} {...field}>
                                  <FormControl>
                                    <SelectTrigger className="w-[180px]">
                                      <SelectValue placeholder={user.role} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {USER_ROLES.map((role) => (
                                      <SelectItem key={role} value={role}>
                                        {role}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="firstName"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First name</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder={
                                      user.user_info.credentials.first_name
                                    }
                                    defaultValue={
                                      user.user_info.credentials.first_name
                                    }
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="lastName"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last name</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder={
                                      user.user_info.credentials.last_name
                                    }
                                    defaultValue={
                                      user.user_info.credentials.last_name
                                    }
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    placeholder="***"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="phone"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    placeholder={
                                      user.user_info.phone || 'No phone number'
                                    }
                                    defaultValue={user.user_info.phone}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="pseudonim"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Pseudonim</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    placeholder={
                                      user.author_info.pseudonim ||
                                      'No pseudonim'
                                    }
                                    defaultValue={user.author_info.pseudonim}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="quote"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Quote</FormLabel>
                                <FormControl>
                                  <Input
                                    type="text"
                                    {...field}
                                    placeholder={
                                      user.author_info.quote || 'No quote'
                                    }
                                    defaultValue={user.author_info.quote}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="shortDescription"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Short description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder={
                                      user.author_info.short_description ||
                                      'No description'
                                    }
                                    defaultValue={
                                      user.author_info.short_description
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name="profileImg"
                            control={form.control}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Profile img</FormLabel>
                                <FormControl>
                                  <>
                                    <button
                                      type="button"
                                      className="group relative "
                                    >
                                      <label
                                        className={`absolute flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-200/60 opacity-0 transition duration-150 ease-in-out group-hover:opacity-100`}
                                      >
                                        <input
                                          type="file"
                                          name="profile_img"
                                          onChange={(e) =>
                                            uploadProfileImg(e, user)
                                          }
                                          className="hidden"
                                          accept="image/png, image/jpg"
                                        />
                                      </label>
                                      <img
                                        className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white"
                                        src={
                                          user.user_info.profile_img
                                            ? user.user_info.profile_img
                                            : ''
                                        }
                                        alt="avatar_img"
                                      />
                                    </button>
                                    {/* <div>
                                      <Input type="file" {...field} className='hidden' />
                                      <img
                                        src={user.user_info.profile_img}
                                        alt="profile_img"
                                        className="h-12 w-12 rounded-full"
                                      />
                                    </div> */}
                                  </>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </form>
                      </Form>
                      <fieldset className="flex flex-col pr-3">
                        <label htmlFor="adminEmail">Email</label>
                        <input
                          id="adminEmail"
                          type="text"
                          value={user.email}
                          onChange={(e) =>
                            newUserDataEditHandler({
                              e,
                              newValue: e.target.value,
                              user,
                              updatedField: UpdateNewDataType.Email,
                            })
                          }
                          className={`${
                            newDataAllUsers.error?.name ===
                              UpdateNewDataType.Email &&
                            'border-2 border-red-200'
                          } rounded-md border-none bg-transparent px-1`}
                        />
                        {newDataAllUsers.error &&
                          newDataAllUsers.error.name && (
                            <p className="text-sm">
                              {newDataAllUsers.error.message}
                            </p>
                          )}
                      </fieldset>
                      <fieldset className="flex flex-col pr-3">
                        <label htmlFor="adminEmail">Email</label>
                        <input
                          id="adminEmail"
                          type="text"
                          value={user.email}
                          onChange={(e) =>
                            newUserDataEditHandler({
                              e,
                              newValue: e.target.value,
                              user,
                              updatedField: UpdateNewDataType.Email,
                            })
                          }
                          className={`${
                            newDataAllUsers.error?.name ===
                              UpdateNewDataType.Email &&
                            'border-2 border-red-200'
                          } rounded-md border-none bg-transparent px-1`}
                        />
                        {newDataAllUsers.error &&
                          newDataAllUsers.error.name && (
                            <p className="text-sm">
                              {newDataAllUsers.error.message}
                            </p>
                          )}
                      </fieldset>
                      <fieldset className="flex flex-col pr-3">
                        <label htmlFor="adminRole">Role</label>

                        <select
                          id="adminRole"
                          value={user.role}
                          onChange={(e) =>
                            newUserDataEditHandler({
                              e,
                              newValue: e.target.value,
                              updatedField: UpdateNewDataType.Role,
                              user,
                            })
                          }
                          className="cursor-pointer rounded-md border-none bg-transparent pl-0"
                        >
                          {USER_ROLES.map((role) => (
                            <option value={role} key={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      </fieldset>
                    </div>
                  </section>
                  <section className="space-y-2">
                    <h5>Author info</h5>
                    <div className="flex flex-wrap justify-between sm:justify-start">
                      <fieldset className="flex flex-col pr-3">
                        <label htmlFor="adminPseudonim">Pseudonim</label>
                        <input
                          id="adminPseudonim"
                          type="text"
                          value={user.author_info.pseudonim}
                          placeholder="Pseudonim..."
                          onChange={(e) =>
                            newUserDataEditHandler({
                              e,
                              newValue: e.target.value,
                              updatedField: UpdateNewDataType.Pseudonim,
                              user,
                            })
                          }
                          className="rounded-md border-none bg-transparent px-1"
                        />
                      </fieldset>
                      <fieldset className="flex flex-col pr-3">
                        <label htmlFor="adminShortDescription">
                          Short description
                        </label>
                        <textarea
                          id="adminShortDescription"
                          name="shortDescription"
                          value={user.author_info.short_description}
                          placeholder="No description..."
                          onChange={(e) =>
                            newUserDataEditHandler({
                              e,
                              newValue: e.target.value,
                              updatedField: UpdateNewDataType.ShortDescription,
                              user,
                            })
                          }
                          className="rounded-md border-none bg-transparent px-1"
                        />
                      </fieldset>
                      <fieldset className="flex flex-col pr-3">
                        <label htmlFor="adminQuote">Quote</label>
                        <input
                          id="adminPseudonim"
                          type="text"
                          value={user.author_info.quote}
                          placeholder="No quote..."
                          onChange={(e) =>
                            newUserDataEditHandler({
                              e,
                              newValue: e.target.value,
                              updatedField: UpdateNewDataType.Quote,
                              user,
                            })
                          }
                          className="rounded-md border-none bg-transparent px-1"
                        />
                      </fieldset>
                    </div>
                  </section>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
