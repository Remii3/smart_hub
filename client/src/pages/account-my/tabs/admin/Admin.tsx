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
} from '../../../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../../../data/endpoints';
import { Button } from '@components/UI/button';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
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
import AdminTabs from './AdminTabs';

interface AdminUsersTypes {
  users: AuthorTypes[] | null;
  fetchingStatus: boolean;
  error: { name: string; message: string } | null;
}

const FormSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  pseudonim: z.string().optional(),
  quote: z.string().optional(),
  shortDescription: z.string().optional(),
  role: z.string().optional(),
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
    defaultValues: {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      pseudonim: '',
      quote: '',
      shortDescription: '',
      role: '',
    },
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const { toast } = useToast();
  const uploadUserDataHandler = async (formResponse, user) => {
    const preparedObject = console.log(formResponse.entries());
    return console.log(preparedObject);
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

  // const newUserDataEditHandler = async ({
  //   e,
  //   newValue,
  //   user,
  //   updatedField,
  // }: {
  //   e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>;
  //   newValue: string | UserRoleTypes;
  //   user: AuthorTypes;
  //   updatedField: UpdateNewDataType;
  // }) => {
  //   const index = newDataAllUsers.users?.findIndex(
  //     (item) => item._id === user._id
  //   );
  //   if (index && originalData.users) {
  //     const updatedObject = useEditUserData({ newValue, user, updatedField });
  //     setNewDataAllUsers((prevState) => {
  //       return {
  //         ...prevState,
  //         error: null,
  //         users: [
  //           ...prevState.users!.slice(0, index),
  //           updatedObject,
  //           ...prevState.users!.slice(index + 1, prevState.users!.length),
  //         ],
  //       };
  //     });
  //     setOriginalData((prevState) => {
  //       return { ...prevState, fetchingStatus: true };
  //     });
  //     const { updatedUserData, error } = await uploadUserDataHandler({
  //       updatedField,
  //       e,
  //       userEmail: originalData.users[index].email,
  //     });
  //     setOriginalData((prevState) => {
  //       return { ...prevState, fetchingStatus: false };
  //     });
  //     if (error) {
  //       setNewDataAllUsers((prevState) => {
  //         return {
  //           ...prevState,
  //           error,
  //         };
  //       });
  //     }

  //     if (updatedUserData) {
  //       setOriginalData((prevState) => {
  //         return { ...prevState, users: updatedUserData };
  //       });
  //     }
  //   }
  // };
  if (!userData) return <div>Please log in</div>;
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
        <Accordion type="single" collapsible>
          {newDataAllUsers.users.map((user) => (
            <AdminTabs key={user._id} user={user} userData={userData} />
          ))}
        </Accordion>
      </div>
    </div>
  );
}
