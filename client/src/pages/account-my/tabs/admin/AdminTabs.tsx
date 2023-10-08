import { Controller, useFieldArray, useForm } from 'react-hook-form';
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
import { AuthorTypes } from '../../../../types/interfaces';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components/UI/button';
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
import { USER_ROLES } from '@customTypes/types';
import { Textarea } from '@components/UI/textarea';
import { ChangeEvent, useEffect, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import useUploadImg from '@hooks/useUploadImg';
import { usePostAccessDatabase } from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { useToast } from '@components/UI/use-toast';

export default function AdminTabs({
  user,
  userData,
  fetchData,
}: {
  user: AuthorTypes;
  userData: AuthorTypes;
  fetchData: () => void;
}) {
  const { toast } = useToast();
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
          firstName: user.user_info.credentials.first_name,
          lastName: user.user_info.credentials.last_name,
          phone: user.user_info.phone,
          pseudonim: user.author_info.pseudonim,
          quote: user.author_info.quote,
          shortDescription: user.author_info.short_description,
          role: user.role,
          profileImg: user.user_info.profile_img,
        },
      ],
    },
  });
  type SelectedImgsTypes = {
    id: string | null;
    data: File | null;
    url: string | null;
  };
  const resetFields = () => {
    form.reset();
    setCurrentRole(user.role);
    setSelectedImgs({ data: null, id: null, url: null });
  };
  const { fields } = useFieldArray({ name: 'admin', control: form.control });
  const [selectedImgs, setSelectedImgs] = useState<SelectedImgsTypes>({
    data: null,
    id: null,
    url: null,
  });

  const editedCheck = () => {
    const {
      email,
      firstName,
      lastName,
      password,
      phone,
      pseudonim,
      quote,
      role,
      shortDescription,
      username,
    } = form.getValues('admin')[0];
    if (
      email !== user.email ||
      firstName !== user.user_info.credentials.first_name ||
      lastName !== user.user_info.credentials.last_name ||
      password ||
      phone !== user.user_info.phone ||
      selectedImgs.data ||
      pseudonim !== user.author_info.pseudonim ||
      quote !== user.author_info.quote ||
      role !== user.role ||
      shortDescription !== user.author_info.short_description ||
      username !== user.username
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const eventFiles = e.target.files;
      setSelectedImgs({
        id: eventFiles[0].name,
        data: eventFiles[0],
        url: URL.createObjectURL(eventFiles[0]),
      });
    }
  };
  const updateDataHandler = async (
    formResponse: z.infer<typeof adminSchema>
  ) => {
    const response = formResponse.admin[0];
    if (selectedImgs.data) {
      const url = await useUploadImg({
        ownerId: user._id,
        selectedFile: selectedImgs.data,
        targetLocation: 'Profile_img',
      });
      response.profileImg = url;
    }
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_UPDATE,
      body: { userEmail: user.email, fieldKey: null, fieldValue: response },
    });
    if (error) {
      return toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Failed adding profile img',
      });
    }
    setSelectedImgs({ data: null, id: null, url: null });
    fetchData();
  };
  return (
    <AccordionItem value={`${user._id}`}>
      <AccordionTrigger className="mt-3 flex w-full justify-between px-3 py-4 first:mt-0 hover:bg-transparent hover:no-underline">
        {user.username}
      </AccordionTrigger>
      <AccordionContent className="bg-slate-100/50">
        <div className="relative px-6 py-3">
          <Link
            to={`/account/${userData?._id === user._id ? 'my' : user._id}`}
            className="mb-4 inline-block h-full space-x-2"
          >
            <Button className="px-0" variant={'link'}>
              <h5 className="inline-block">{user.username}</h5>
            </Button>
          </Link>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(updateDataHandler)}>
              {editedCheck() && (
                <div className={`absolute right-6 top-3`}>
                  <Button variant={'ghost'} onClick={resetFields} type="button">
                    Reset
                  </Button>
                  <Button variant={'default'} type="submit">
                    Submit
                  </Button>
                </div>
              )}
              {fields.map((field, index) => {
                return (
                  <section key={field.id} className="space-y-2">
                    <FormField
                      control={form.control}
                      name={`admin.${index}.username`}
                      render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={user.email}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Controller
                      name={`admin.${index}.role`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={(e) => {
                              setCurrentRole(e);
                              field.onChange(e);
                            }}
                            value={currentRole}
                            defaultValue={currentRole}
                          >
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
                    {/* <FormField
                      name={`admin.${index}.role`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={user.role}
                            {...field}
                          >
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
                    /> */}
                    <FormField
                      name={`admin.${index}.firstName`}
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
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={user.user_info.credentials.last_name}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`admin.${index}.password`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="***" {...field} />
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
                                user.user_info.phone || 'No phone number'
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`admin.${index}.pseudonim`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pseudonim</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              placeholder={
                                user.author_info.pseudonim || 'No pseudonim'
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`admin.${index}.quote`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quote</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              {...field}
                              placeholder={user.author_info.quote || 'No quote'}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`admin.${index}.shortDescription`}
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
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <button type="button" className="group relative ">
                        <label
                          className={`absolute flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-200/60 opacity-0 transition duration-150 ease-in-out group-hover:opacity-100`}
                        >
                          <div className="block">
                            <Input
                              accept=".jpg, .jpeg, .png"
                              type="file"
                              className="hidden"
                              onChange={(e) => onImageChange(e)}
                            />
                          </div>
                          <PlusCircleIcon className="h-10 w-10 text-slate-800" />
                        </label>
                        {selectedImgs.url && (
                          <span
                            className="absolute"
                            onClick={() =>
                              setSelectedImgs({
                                data: null,
                                id: null,
                                url: null,
                              })
                            }
                          >
                            X
                          </span>
                        )}
                        <img
                          className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white"
                          src={
                            !selectedImgs.url
                              ? user.user_info.profile_img
                              : selectedImgs?.url
                          }
                          alt="avatar_img"
                        />
                      </button>
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
