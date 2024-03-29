import { useState, useEffect } from 'react';
import MarketplaceBadge from '@components/UI/badges/MarketplaceBadge';
import { OtherUserTypes } from '../OtherUserPage';
import { UserRoleTypes } from '@customTypes/types';
import { Button } from '@components/UI/button';
import { UserContext } from '@context/UserProvider';
import { useContext } from 'react';
import { FetchDataTypes } from '@customTypes/interfaces';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import errorToast from '@components/UI/error/errorToast';
import { Badge } from '@components/UI/badge';

interface FollowersTypes extends FetchDataTypes {
  followers: null | string[];
}

export default function OtherUserInfo({
  otherUserData,
  productsCount,
  collectionsCount,
}: {
  otherUserData: OtherUserTypes;
  productsCount: number;
  collectionsCount: number;
}) {
  const [otherUserFollowers, setOtherUserFollowers] = useState<FollowersTypes>({
    followers: null,
    hasError: null,
    isLoading: false,
  });

  const { userData } = useContext(UserContext);

  const getFollowersHandler = async () => {
    setOtherUserFollowers((prevState) => {
      return { ...prevState, isLoading: true };
    });
    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_FOLLOWERS,
      params: { _id: otherUserData._id },
    });
    if (error) {
      errorToast(error);
      return setOtherUserFollowers({
        followers: null,
        hasError: error,
        isLoading: false,
      });
    }
    setOtherUserFollowers({
      followers: data,
      hasError: null,
      isLoading: false,
    });
  };

  const followHandler = async () => {
    if (!userData.data || !otherUserFollowers.followers) return;
    if (
      otherUserFollowers.followers.find(
        (followerId) => followerId === userData.data!._id
      )
    ) {
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_FOLLOW_REMOVE,
        body: {
          followReceiverId: otherUserData._id,
          followGiverId: userData.data._id,
        },
      });
      if (error) {
        errorToast(error);
      }
      getFollowersHandler();
    } else {
      const { error } = await usePostAccessDatabase({
        url: DATABASE_ENDPOINTS.USER_FOLLOW_ADD,
        body: {
          followReceiverId: otherUserData._id,
          followGiverId: userData.data._id,
        },
      });
      if (error) {
        errorToast(error);
      }
      getFollowersHandler();
    }
  };

  useEffect(() => {
    getFollowersHandler();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mb-4">
      <div className="flex flex-col items-center justify-center space-y-2">
        <div>
          {otherUserData.userInfo.profileImg &&
          otherUserData.userInfo.profileImg.url ? (
            <img
              src={otherUserData.userInfo.profileImg.url}
              className="aspect-auto h-36 w-36 rounded-full object-cover"
              alt="profileImg"
            />
          ) : (
            <img
              src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
              className="aspect-auto h-36 w-36 rounded-full object-cover"
              alt="profileImg"
            />
          )}
        </div>

        <h3>
          {otherUserData.authorInfo
            ? otherUserData.authorInfo.pseudonim
            : otherUserData.username}
        </h3>
        <Badge
          variant={'outline'}
          className={`${
            otherUserData.role === UserRoleTypes.AUTHOR &&
            'bg-purple-100 text-purple-700'
          } ${
            otherUserData.role === UserRoleTypes.ADMIN &&
            'bg-cyan-100 text-cyan-700'
          }`}
        >
          {otherUserData.role}
        </Badge>
        {!otherUserData.securitySettings.hidePrivateInformation && (
          <article className="flex gap-3">
            <span>Credentials:</span>
            <div className="space-x-2">
              {otherUserData.userInfo.credentials.firstName && (
                <span>{otherUserData.userInfo.credentials.firstName}</span>
              )}
              {otherUserData.userInfo.credentials.lastName && (
                <span>{otherUserData.userInfo.credentials.lastName}</span>
              )}
            </div>
          </article>
        )}
        {otherUserData.authorInfo.quote && (
          <blockquote className="text-muted-foreground">
            {otherUserData.authorInfo.quote}
          </blockquote>
        )}
      </div>

      {otherUserData.authorInfo.shortDescription && (
        <article className="max-w-lg text-justify">
          <span>{otherUserData.authorInfo.shortDescription}</span>
        </article>
      )}

      {otherUserData.role !== UserRoleTypes.USER && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <div>Products</div>
              <span>{productsCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <div>Collections</div>
              <span>{collectionsCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <div>Followers</div>
              <span>
                {otherUserFollowers.followers &&
                  otherUserFollowers.followers.length}
              </span>
            </div>
          </div>

          {otherUserFollowers.followers && (
            <Button
              type="button"
              variant={
                otherUserFollowers.followers.find(
                  (followerId) => followerId === userData.data?._id
                )
                  ? 'outline'
                  : 'default'
              }
              disabled={!userData.data}
              onClick={followHandler}
              className="relative"
            >
              <div
                className={`${
                  otherUserFollowers.followers.find(
                    (followerId) => followerId === userData.data?._id
                  )
                    ? 'hover:opacity-100'
                    : 'opacity-0'
                } absolute flex h-full w-full items-center justify-center bg-accent text-red-600 opacity-0 transition-opacity ease-out`}
              >
                Unfollow
              </div>
              {otherUserFollowers.followers.find(
                (followerId) => followerId === userData.data?._id
              )
                ? 'Following'
                : 'Follow'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
