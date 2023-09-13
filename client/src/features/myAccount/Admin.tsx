import { Link } from 'react-router-dom';
import axios from 'axios';
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
} from '../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../data/endpoints';

interface AdminUsersTypes {
  users: AuthorTypes[] | null;
  fetchingStatus: boolean;
  error: { name: string; message: string } | null;
}

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uploadUserDataHandler = async ({
    e,
    userEmail,
    updatedField,
  }: {
    e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>;
    userEmail: string;
    updatedField: UpdateNewDataType;
  }) => {
    await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_UPDATE,
      body: {
        userEmail,
        fieldKey: updatedField,
        newValue: e.target.value,
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

  return (
    <div className="w-full">
      <h5>Users</h5>
      <div className="w-full">
        {newDataAllUsers.users.map((user) => (
          <Accordion type="single" collapsible key={user._id}>
            <AccordionItem value="test1">
              <AccordionTrigger className="mt-3 flex w-full justify-between rounded-t-md bg-gray-200 px-3 py-2 first:mt-0">
                {user.username}
              </AccordionTrigger>
              <AccordionContent>
                <section className="space-y-2">
                  <h5>User info</h5>
                  <div className="flex flex-wrap justify-between sm:justify-start">
                    <fieldset className="pr-3">
                      <Link
                        to={`/account/${
                          userData?._id === user._id ? 'my' : user._id
                        }`}
                        className="flex h-full flex-col justify-between"
                      >
                        <p>Username</p>
                        <p className="py-2">{user.username}</p>
                      </Link>
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
                            UpdateNewDataType.Email && 'border-2 border-red-200'
                        } rounded-md border-none bg-transparent px-1`}
                      />
                      {newDataAllUsers.error && newDataAllUsers.error.name && (
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
