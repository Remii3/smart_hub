import MarketplaceBadge from '@components/UI/badges/MarketplaceBadge';
import { Button } from '@components/UI/button';
import errorToast from '@components/UI/error/errorToast';
import { UserContext } from '@context/UserProvider';
import { AuthorTypes, FetchDataTypes } from '@customTypes/interfaces';
import { UserRoleTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { useCallback, useContext, useEffect, useState } from 'react';

interface FollowsTypes extends FetchDataTypes {
  data: null | AuthorTypes[];
}

export default function Follows() {
  const [followedUsers, setFolloweedUsers] = useState<FollowsTypes>({
    data: null,
    hasError: null,
    isLoading: false,
  });
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
    fetchData();
  };
  return (
    <div>
      {!followedUsers.isLoading &&
        followedUsers.data &&
        followedUsers.data.length <= 0 && (
          <div>You're not following anybody yet!</div>
        )}
      {followedUsers.data &&
        followedUsers.data.map((followedUser) => (
          <div key={followedUser._id} className="mb-4 rounded bg-slate-200">
            <a href={`/account/${followedUser._id}`} className="block">
              <img
                src={followedUser.user_info.profile_img.url}
                alt="profile_img"
                className="aspect-square h-full w-16"
              />
            </a>
            <div className="inline-block">
              <a href={`/account/${followedUser._id}`} className="block">
                {followedUser.role !== UserRoleTypes.USER
                  ? followedUser.author_info.pseudonim
                  : followedUser.username}
              </a>
              {followedUser.role !== 'User' && (
                <MarketplaceBadge
                  message={followedUser.role}
                  color={
                    followedUser.role === 'Author'
                      ? 'text-purple-700'
                      : 'text-cyan-700'
                  }
                  bgColor={
                    followedUser.role === 'Author'
                      ? 'bg-purple-100'
                      : 'bg-cyan-100'
                  }
                />
              )}
            </div>
            <div>
              <Button
                variant={'destructive'}
                onClick={() => removeFollowHandler(followedUser._id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
    </div>
  );
}
