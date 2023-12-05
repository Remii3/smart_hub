import { Badge } from '@components/UI/badge';
import MarketplaceBadge from '@components/UI/badges/MarketplaceBadge';
import { Button } from '@components/UI/button';
import { Card } from '@components/UI/card';
import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import errorToast from '@components/UI/error/errorToast';
import { UserContext } from '@context/UserProvider';
import { AuthorTypes, FetchDataTypes } from '@customTypes/interfaces';
import { UserRoleTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { TrashIcon } from '@heroicons/react/24/outline';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface FollowsTypes extends FetchDataTypes {
  data: null | AuthorTypes[];
}

export default function Follows() {
  const [followedUsers, setFolloweedUsers] = useState<FollowsTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });
  const [deleteDialog, setDeleteDialog] = useState<null | string>(null);

  const { userData } = useContext(UserContext);
  const fetchData = useCallback(async () => {
    setFolloweedUsers((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_FOLLOWS,
      params: { userId: userData.data && userData.data._id },
    });
    if (error) {
      errorToast(error);
      return setFolloweedUsers({ data, hasError: null, isLoading: false });
    }
    setFolloweedUsers({ data, hasError: null, isLoading: false });
  }, []);

  useEffect(() => {
    fetchData();
  }, [userData]);

  const removeFollowHandler = async (followedUserId: string) => {
    if (!userData.data) return;
    const { error } = await usePostAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_FOLLOW_REMOVE,
      body: {
        followGiverId: userData.data._id,
        followReceiverId: followedUserId,
      },
    });
    if (error) {
      return errorToast(error);
    }
    fetchData();
  };
  return (
    <>
      <h4 className="mb-4">Following</h4>
      <div className="px-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {!followedUsers.isLoading &&
          followedUsers.data &&
          followedUsers.data.length <= 0 && (
            <div>You're not following anybody yet!</div>
          )}
        {followedUsers.data &&
          followedUsers.data.map((followedUser) => (
            <Card
              key={followedUser._id}
              className="w-auto flex justify-between hover:shadow transition ease-in-out"
            >
              <div className="flex gap-2">
                <Link to={`/account/${followedUser._id}`} className="block">
                  <img
                    src={followedUser.userInfo.profileImg.url}
                    alt="profile_img"
                    height={100}
                    width={100}
                    className="object-cover h-full aspect-[4/3] rounded-l-md"
                  />
                </Link>
                <div className="my-1 flex-grow">
                  <Link
                    to={`/account/${followedUser._id}`}
                    className="block line-clamp-1"
                  >
                    {followedUser.role !== UserRoleTypes.USER
                      ? followedUser.authorInfo.pseudonim
                      : followedUser.username}
                  </Link>
                  <div className="text-muted-foreground line-clamp-1 text-sm">
                    {followedUser.authorInfo.quote}
                  </div>
                </div>
              </div>

              <div className="my-1 mr-1">
                <DeleteDialog
                  deleteHandler={() => removeFollowHandler(followedUser._id)}
                  openState={deleteDialog === followedUser._id}
                  openStateHandler={() => setDeleteDialog(null)}
                >
                  <Button
                    variant={'ghost'}
                    size={'sm'}
                    onClick={() => setDeleteDialog(followedUser._id)}
                    className="text-red-400 hover:text-red-400 rounded-xl"
                  >
                    <TrashIcon className="h-6 w-6" />
                  </Button>
                </DeleteDialog>
              </div>
            </Card>
          ))}
      </div>
    </>
  );
}
