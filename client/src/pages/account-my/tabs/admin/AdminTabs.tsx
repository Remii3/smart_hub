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
import { AuthorTypes, UserTypes } from '../../../../types/interfaces';
import { Link } from 'react-router-dom';
import { Button } from '../../../../components/UI/button';
import { Input } from '../../../../components/UI/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export default function AdminTabs({
  user,
  userData,
}: {
  user: UserTypes;
  userData: AuthorTypes;
}) {
  const adminSchema = z.object({
    admin: z.array(
      z.object({
        username: z.string(),
        email: z.string(),
        password: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        phone: z.string(),
        pseudonim: z.string(),
        quote: z.string(),
        shortDescription: z.string(),
      })
    ),
  });
  const form = useForm({
    resolver: zodResolver<typeof adminSchema>(adminSchema),
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
  const { fields } = useFieldArray({ name: 'admin', control: form.control });
  const uploadDataHandler = (formResponse) => {
    console.log(formResponse.admin[0]);
  };
  return (
    <AccordionItem value={`${user._id}`}>
      <AccordionTrigger className="mt-3 flex w-full justify-between px-3 py-4 first:mt-0 hover:bg-transparent hover:no-underline">
        {user.username}
      </AccordionTrigger>
      <AccordionContent className="bg-slate-100/50">
        <div className=" px-6 py-3">
          <Link
            to={`/account/${userData?._id === user._id ? 'my' : user._id}`}
            className="mb-4 inline-block h-full space-x-2"
          >
            <Button className="px-0" variant={'link'}>
              <h5 className="inline-block">{user.username}</h5>
            </Button>
          </Link>
          <section className="space-y-2">
            <form onSubmit={handleSubmit(uploadDataHandler)}>
              {fields.map((field, index) => {
                return (
                  <section key={field.id}>
                    <Input
                      type="text"
                      placeholder={user.username}
                      {...register(`admin.${index}.username`)}
                    />
                    {/* <FormField
                      name="admin.${index}.username"
                      control={control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder={user.username} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </section>
                );
              })}
              <button type="submit">Submit</button>
            </form>
          </section>
        </div>
      </AccordionContent>
    </AccordionItem>

    // <AccordionItem key={user._id} value={`${user._id}`}>
    //   <AccordionTrigger
    //     onClick={() =>
    //       setTimeout(() => {
    //         form.reset();
    //       }, 100)
    //     }
    //     className="mt-3 flex w-full justify-between px-3 py-4 first:mt-0 hover:bg-transparent hover:no-underline"
    //   >
    //     {user.username}
    //   </AccordionTrigger>
    //   <AccordionContent className="bg-slate-100/50">
    //     <div className=" px-6 py-3">
    //       <Link
    //         to={`/account/${userData?._id === user._id ? 'my' : user._id}`}
    //         className="mb-4 inline-block h-full space-x-2"
    //       >
    //         <Button className="px-0" variant={'link'}>
    //           <h5 className="inline-block">{user.username}</h5>
    //         </Button>
    //       </Link>
    //       <section className="space-y-2">
    //         <div className="flex flex-wrap justify-between sm:justify-start">
    //           <Form {...form}>
    //             <form onSubmit={form.handleSubmit(uploadUserDataHandler)}>
    //               {fields.map((field, index) => {
    //                 return (
    //                   <FormField
    //                     key={field.id}
    //                     {...register(`test.${index}.value`)}
    //                     render={({ field }) => <FormItem></FormItem>}
    //                   />
    //                 );
    //               })}
    //               <FormField
    //                 name="username"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Username</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="text"
    //                         placeholder={user.username}
    //                         {...field}
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="email"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Email</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="text"
    //                         placeholder={user.email}
    //                         {...field}
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="role"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Role</FormLabel>
    //                     <Select
    //                       onValueChange={field.onChange}
    //                       defaultValue={user.role}
    //                     >
    //                       <FormControl>
    //                         <SelectTrigger className="w-[180px]">
    //                           <SelectValue placeholder={user.role} />
    //                         </SelectTrigger>
    //                       </FormControl>
    //                       <SelectContent>
    //                         {USER_ROLES.map((role) => (
    //                           <SelectItem key={role} value={role}>
    //                             {role}
    //                           </SelectItem>
    //                         ))}
    //                       </SelectContent>
    //                     </Select>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="firstName"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>First name</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="text"
    //                         placeholder={user.user_info.credentials.first_name}
    //                         {...field}
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="lastName"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Last name</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="text"
    //                         placeholder={user.user_info.credentials.last_name}
    //                         {...field}
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="password"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Password</FormLabel>
    //                     <FormControl>
    //                       <Input type="text" placeholder="***" {...field} />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="phone"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Phone</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="text"
    //                         {...field}
    //                         placeholder={
    //                           user.user_info.phone || 'No phone number'
    //                         }
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="pseudonim"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Pseudonim</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="text"
    //                         {...field}
    //                         placeholder={
    //                           user.author_info.pseudonim || 'No pseudonim'
    //                         }
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="quote"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Quote</FormLabel>
    //                     <FormControl>
    //                       <Input
    //                         type="text"
    //                         {...field}
    //                         placeholder={user.author_info.quote || 'No quote'}
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="shortDescription"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Short description</FormLabel>
    //                     <FormControl>
    //                       <Textarea
    //                         {...field}
    //                         placeholder={
    //                           user.author_info.short_description ||
    //                           'No description'
    //                         }
    //                       />
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //               <FormField
    //                 name="profileImg"
    //                 control={form.control}
    //                 render={({ field }) => (
    //                   <FormItem>
    //                     <FormLabel>Profile img</FormLabel>
    //                     <FormControl>
    //                       <>
    //                         <button type="button" className="group relative ">
    //                           <label
    //                             className={`absolute flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-200/60 opacity-0 transition duration-150 ease-in-out group-hover:opacity-100`}
    //                           >
    //                             <input
    //                               type="file"
    //                               name="profile_img"
    //                               onChange={(e) => uploadProfileImg(e, user)}
    //                               className="hidden"
    //                               accept="image/png, image/jpg"
    //                             />
    //                           </label>
    //                           <img
    //                             className="inline-block h-24 w-24 rounded-full object-cover ring-2 ring-white"
    //                             src={
    //                               user.user_info.profile_img
    //                                 ? user.user_info.profile_img
    //                                 : ''
    //                             }
    //                             alt="avatar_img"
    //                           />
    //                         </button>
    //                       </>
    //                     </FormControl>
    //                     <FormMessage />
    //                   </FormItem>
    //                 )}
    //               />
    //             </form>
    //           </Form>
    //           <fieldset className="flex flex-col pr-3">
    //             <label htmlFor="adminEmail">Email</label>
    //             <input
    //               id="adminEmail"
    //               type="text"
    //               value={user.email}
    //               onChange={(e) =>
    //                 newUserDataEditHandler({
    //                   e,
    //                   newValue: e.target.value,
    //                   user,
    //                   updatedField: UpdateNewDataType.Email,
    //                 })
    //               }
    //               className={`${
    //                 newDataAllUsers.error?.name === UpdateNewDataType.Email &&
    //                 'border-2 border-red-200'
    //               } rounded-md border-none bg-transparent px-1`}
    //             />
    //             {newDataAllUsers.error && newDataAllUsers.error.name && (
    //               <p className="text-sm">{newDataAllUsers.error.message}</p>
    //             )}
    //           </fieldset>
    //           <fieldset className="flex flex-col pr-3">
    //             <label htmlFor="adminEmail">Email</label>
    //             <input
    //               id="adminEmail"
    //               type="text"
    //               value={user.email}
    //               onChange={(e) =>
    //                 newUserDataEditHandler({
    //                   e,
    //                   newValue: e.target.value,
    //                   user,
    //                   updatedField: UpdateNewDataType.Email,
    //                 })
    //               }
    //               className={`${
    //                 newDataAllUsers.error?.name === UpdateNewDataType.Email &&
    //                 'border-2 border-red-200'
    //               } rounded-md border-none bg-transparent px-1`}
    //             />
    //             {newDataAllUsers.error && newDataAllUsers.error.name && (
    //               <p className="text-sm">{newDataAllUsers.error.message}</p>
    //             )}
    //           </fieldset>
    //           <fieldset className="flex flex-col pr-3">
    //             <label htmlFor="adminRole">Role</label>

    //             <select
    //               id="adminRole"
    //               value={user.role}
    //               onChange={(e) =>
    //                 newUserDataEditHandler({
    //                   e,
    //                   newValue: e.target.value,
    //                   updatedField: UpdateNewDataType.Role,
    //                   user,
    //                 })
    //               }
    //               className="cursor-pointer rounded-md border-none bg-transparent pl-0"
    //             >
    //               {USER_ROLES.map((role) => (
    //                 <option value={role} key={role}>
    //                   {role}
    //                 </option>
    //               ))}
    //             </select>
    //           </fieldset>
    //         </div>
    //       </section>
    //       <section className="space-y-2">
    //         <h5>Author info</h5>
    //         <div className="flex flex-wrap justify-between sm:justify-start">
    //           <fieldset className="flex flex-col pr-3">
    //             <label htmlFor="adminPseudonim">Pseudonim</label>
    //             <input
    //               id="adminPseudonim"
    //               type="text"
    //               value={user.author_info.pseudonim}
    //               placeholder="Pseudonim..."
    //               onChange={(e) =>
    //                 newUserDataEditHandler({
    //                   e,
    //                   newValue: e.target.value,
    //                   updatedField: UpdateNewDataType.Pseudonim,
    //                   user,
    //                 })
    //               }
    //               className="rounded-md border-none bg-transparent px-1"
    //             />
    //           </fieldset>
    //           <fieldset className="flex flex-col pr-3">
    //             <label htmlFor="adminShortDescription">Short description</label>
    //             <textarea
    //               id="adminShortDescription"
    //               name="shortDescription"
    //               value={user.author_info.short_description}
    //               placeholder="No description..."
    //               onChange={(e) =>
    //                 newUserDataEditHandler({
    //                   e,
    //                   newValue: e.target.value,
    //                   updatedField: UpdateNewDataType.ShortDescription,
    //                   user,
    //                 })
    //               }
    //               className="rounded-md border-none bg-transparent px-1"
    //             />
    //           </fieldset>
    //           <fieldset className="flex flex-col pr-3">
    //             <label htmlFor="adminQuote">Quote</label>
    //             <input
    //               id="adminPseudonim"
    //               type="text"
    //               value={user.author_info.quote}
    //               placeholder="No quote..."
    //               onChange={(e) =>
    //                 newUserDataEditHandler({
    //                   e,
    //                   newValue: e.target.value,
    //                   updatedField: UpdateNewDataType.Quote,
    //                   user,
    //                 })
    //               }
    //               className="rounded-md border-none bg-transparent px-1"
    //             />
    //           </fieldset>
    //         </div>
    //       </section>
    //     </div>
    //   </AccordionContent>
    // </AccordionItem>
  );
}
