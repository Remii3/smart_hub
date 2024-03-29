import { useFieldArray, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../components/UI/form';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../../components/UI/accordion';
import { AuthorTypes, PostDataTypes } from '../../../../types/interfaces';
import { Link } from 'react-router-dom';
import { Button, buttonVariants } from '../../../../components/UI/button';
import { Input } from '../../../../components/UI/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/UI/select';
import { USER_ROLES, UserRoleTypes } from '@customTypes/types';
import { Textarea } from '@components/UI/textarea';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import useUploadImg from '@hooks/useUploadImg';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useToast } from '@components/UI/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/UI/dialog';
import { DialogClose } from '@radix-ui/react-dialog';
import useDeleteImg from '@hooks/useDeleteImg';
import LoadingCircle from '@components/Loaders/LoadingCircle';

export default function AdminTabs({
  user,
  userData,
  fetchData,
}: {
  user: AuthorTypes;
  userData: AuthorTypes | null;
  fetchData: ({}) => void;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();
  const [updateUserStatus, setUpdateUserStatus] = useState<PostDataTypes>({
    hasError: null,
    isLoading: false,
    isSuccess: false,
  });
  const [currentRole, setCurrentRole] = useState(user.role);
  const adminSchema = z.object({
    admin: z.array(
      z.object({
        username: z.string().optional(),
        email: z.string().optional(),
        password: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        role: z.string().optional(),
        pseudonim: z.string().optional(),
        quote: z.string().optional(),
        shortDescription: z.string().optional(),
        profileImg: z.any().optional(),
      })
    ),
  });
  const form = useForm({
    resolver: zodResolver<typeof adminSchema>(adminSchema),
    defaultValues: {
      admin: [
        {
          username: user.username,
          email: user.email,
          password: '',
          firstName: user.userInfo.credentials.firstName,
          lastName: user.userInfo.credentials.lastName,
          phone: user.userInfo.phone,
          pseudonim: user.authorInfo.pseudonim,
          quote: user.authorInfo.quote,
          shortDescription: user.authorInfo.shortDescription,
          role: user.role,
          profileImg: user.userInfo.profileImg,
        },
      ],
    },
  });
  const resetUserData = useCallback(() => {
    form.reset({
      admin: [
        {
          username: user.username,
          email: user.email,
          password: '',
          firstName: user.userInfo.credentials.firstName,
          lastName: user.userInfo.credentials.lastName,
          phone: user.userInfo.phone,
          pseudonim: user.authorInfo.pseudonim,
          quote: user.authorInfo.quote,
          shortDescription: user.authorInfo.shortDescription,
          role: user.role,
          profileImg: user.userInfo.profileImg,
        },
      ],
    });
  }, [user]);

  useEffect(() => {
    resetUserData();
  }, [user]);

  type SelectedImgsTypes = {
    id: string | null;
    data: File | null;
    url: string | null;
    isDeleted: boolean;
  };
  const resetFields = () => {
    form.reset();
    setCurrentRole(user.role);
    setSelectedImgs({
      data: null,
      id: user.userInfo.profileImg.id || null,
      url: user.userInfo.profileImg.url || null,
      isDeleted: false,
    });
  };

  const { fields } = useFieldArray({ name: 'admin', control: form.control });

  const [selectedImgs, setSelectedImgs] = useState<SelectedImgsTypes>({
    data: null,
    id: user.userInfo.profileImg.id || null,
    url: user.userInfo.profileImg.url || null,
    isDeleted: false,
  });

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const eventFiles = e.target.files;
      setSelectedImgs({
        id: eventFiles[0].name,
        data: eventFiles[0],
        url: URL.createObjectURL(eventFiles[0]),
        isDeleted: false,
      });
    }
  };

  const updateDataHandler = async () => {
    let dirtyData = {} as { [index: string]: unknown };
    if (form.formState.dirtyFields.admin) {
      dirtyData = Object.fromEntries(
        Object.keys(form.formState.dirtyFields.admin[0]).map((x: string) => {
          return [
            x,
            // @ts-ignore
            form.getValues(`admin[0].${x}` as keyof z.infer<typeof formSchema>),
          ];
        })
      );
    }
    setUpdateUserStatus((prevState) => {
      return { ...prevState, isLoading: true };
    });
    if (selectedImgs.data) {
      const uploadData = await useUploadImg({
        ownerId: user._id,
        selectedFile: selectedImgs.data,
        targetLocation: 'ProfileImg',
        currentId: user.userInfo.profileImg.id,
      });
      if (uploadData) {
        dirtyData.profileImg = uploadData;
      }
    } else if (selectedImgs.isDeleted) {
      await useDeleteImg({
        imgId: user.userInfo.profileImg.id,
        ownerId: user._id,
        targetLocation: 'ProfileImg',
      });
      dirtyData.profileImg = { _id: user.userInfo.profileImg.id };
    }

    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_UPDATE,
      body: { _id: user._id, dirtyData },
    });
    if (error) {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Failed adding profile img',
      });
    }
    setUpdateUserStatus((prevState) => {
      return { ...prevState, isLoading: false };
    });
    fetchData({});
    setSelectedImgs((prevState) => {
      return {
        data: null,
        id: prevState.id,
        url: prevState.url,
        isDeleted: false,
      };
    });
  };

  const deleteUserHandler = async () => {
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_DELETE_ONE,
      body: { userId: user._id },
    });
    if (error) {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Failed deleting user',
      });
    }
    fetchData({});
  };

  return (
    <AccordionItem value={`${user._id}`}>
      <AccordionTrigger className="mt-3 flex w-full justify-between px-3 py-4 first:mt-0 hover:bg-transparent hover:no-underline">
        {user.username}
      </AccordionTrigger>
      <AccordionContent className="bg-slate-100/50">
        <div className="relative px-6 py-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateDataHandler)}>
              <header className="relative mb-4 flex flex-wrap justify-between">
                <Link
                  to={`/account/${
                    userData?._id === user._id ? 'my' : user._id
                  }`}
                  className={`inline-block h-full space-x-2 ${buttonVariants({
                    variant: 'link',
                    size: 'clear',
                  })}`}
                >
                  <h5 className="inline-block">{user.username}</h5>
                </Link>
                <div
                  className={`absolute right-0 top-0 flex flex-col-reverse gap-3 py-2 sm:flex-row`}
                >
                  {(form.formState.isDirty ||
                    selectedImgs.data ||
                    selectedImgs.isDeleted) && (
                    <>
                      <Button
                        variant={'default'}
                        type="submit"
                        className="relative"
                      >
                        {updateUserStatus.isLoading && <LoadingCircle />}
                        <span
                          className={`${
                            updateUserStatus.isLoading && 'invisible'
                          }`}
                        >
                          Update
                        </span>
                      </Button>
                      <Button
                        variant={'ghost'}
                        onClick={resetFields}
                        type="button"
                      >
                        Reset
                      </Button>
                    </>
                  )}
                  <Dialog
                    open={showDeleteDialog}
                    onOpenChange={() => setShowDeleteDialog(false)}
                  >
                    <Button
                      variant={'destructive'}
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      Delete
                    </Button>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          Deleting this will permamently remove the item from
                          the database.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant={'destructive'}
                          onClick={deleteUserHandler}
                        >
                          Delete
                        </Button>
                        <DialogClose asChild>
                          <Button variant={'outline'}>Cancel</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </header>

              {fields.map((field, index) => {
                return (
                  <section key={field.id}>
                    <div className="mb-4 h-24">
                      <button type="button" className="group relative">
                        <label
                          className={`absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center rounded-full object-cover opacity-0 ring-2 ring-white transition-opacity duration-150 ease-in-out group-hover:opacity-100`}
                        >
                          <Input
                            accept=".jpg, .jpeg, .png"
                            type="file"
                            className="hidden"
                            onChange={(e) => onImageChange(e)}
                          />
                          {!selectedImgs.url && (
                            <PlusCircleIcon className="h-10 w-10 text-slate-800" />
                          )}
                        </label>

                        {selectedImgs.url && (
                          <span
                            className="absolute block"
                            onClick={() =>
                              setSelectedImgs({
                                data: null,
                                id: null,
                                url: null,
                                isDeleted: true,
                              })
                            }
                          >
                            X
                          </span>
                        )}
                        {!user.userInfo.profileImg && !selectedImgs?.url && (
                          <div className="inline-block h-24 w-24 rounded-full bg-slate-200 object-cover ring-2 ring-white"></div>
                        )}
                        {selectedImgs.url ? (
                          <img
                            className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white"
                            src={selectedImgs.url}
                            alt="avatar_img"
                          />
                        ) : (
                          <img
                            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
                            alt="no_photo"
                            className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white"
                          />
                        )}
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        <FormField
                          control={form.control}
                          name={`admin.${index}.username`}
                          render={({ field }) => (
                            <FormItem className="col-span-1">
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={user.username}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`admin.${index}.email`}
                          render={({ field }) => (
                            <FormItem className="col-span-1">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="text" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`admin.${index}.role`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="col-span-1">
                              <FormLabel>Role</FormLabel>
                              <Select
                                onValueChange={(e) => {
                                  setCurrentRole(e as UserRoleTypes);
                                  field.onChange(e);
                                }}
                                value={currentRole}
                                defaultValue={currentRole}
                              >
                                <FormControl className="w-full">
                                  <SelectTrigger className="col-span-1">
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
                          name={`admin.${index}.password`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="col-span-1">
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
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        <FormField
                          name={`admin.${index}.firstName`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="col-span-1">
                              <FormLabel>First name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={
                                    user.userInfo.credentials.firstName
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`admin.${index}.lastName`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="col-span-1">
                              <FormLabel>Last name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder={
                                    user.userInfo.credentials.lastName
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name={`admin.${index}.phone`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  {...field}
                                  placeholder={
                                    user.userInfo.phone || 'No phone number'
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {user.role !== UserRoleTypes.USER && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                          <FormField
                            name={`admin.${index}.pseudonim`}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem className="col-span-1">
                                <FormLabel>Pseudonim</FormLabel>
                                <FormControl>
                                  <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name={`admin.${index}.quote`}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem className="col-span-1">
                                <FormLabel>Quote</FormLabel>
                                <FormControl>
                                  <Input type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            name={`admin.${index}.shortDescription`}
                            control={form.control}
                            render={({ field }) => (
                              <FormItem className="col-span-1">
                                <FormLabel>Short description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    placeholder={
                                      user.authorInfo.shortDescription ||
                                      'No description'
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </form>
          </Form>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
