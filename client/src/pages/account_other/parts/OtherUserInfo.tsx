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

interface FollowersTypes extends FetchDataTypes {
  followers: null | string[];
}

export default function OtherUserInfo({
  otherUserData,
}: {
  otherUserData: OtherUserTypes;
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
    <div className="flex flex-col items-center justify-center rounded-md ">
      <div className="mb-4">
        {otherUserData.user_info.profile_img &&
        otherUserData.user_info.profile_img.url ? (
          <img
            src={otherUserData.user_info.profile_img.url}
            className="aspect-auto h-36 w-36 rounded-full object-cover"
            alt="profile_img"
          />
        ) : (
          <img
            src="https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167"
            className="aspect-auto h-36 w-36 rounded-full object-cover"
            alt="profile_img"
          />
        )}
      </div>
      <MarketplaceBadge
        message={otherUserData.role}
        color={
          otherUserData.role === 'Author' ? 'text-purple-700' : 'text-cyan-700'
        }
        bgColor={
          otherUserData.role === 'Author' ? 'bg-purple-100' : 'bg-cyan-100'
        }
      />
      <h3 className="mb-4">
        {otherUserData.author_info
          ? otherUserData.author_info.pseudonim
          : otherUserData.username}
      </h3>
      {otherUserData.user_info && (
        <article>
          {otherUserData.user_info.credentials.first_name && (
            <div>
              First name:{' '}
              <span>{otherUserData.user_info.credentials.first_name}</span>
            </div>
          )}
          {otherUserData.user_info.credentials.last_name && (
            <div>
              Last name:{' '}
              <span>{otherUserData.user_info.credentials.last_name}</span>
            </div>
          )}
        </article>
      )}
      {otherUserData.user_info && otherUserData.role !== UserRoleTypes.USER && (
        <article>
          {otherUserData.author_info.quote && (
            <div>
              Favourite quote: <span>{otherUserData.author_info.quote}</span>
            </div>
          )}
          {otherUserData.author_info.short_description && (
            <div>
              Short description:{' '}
              <span>{otherUserData.author_info.short_description}</span>
            </div>
          )}
        </article>
      )}
      {otherUserData.role !== UserRoleTypes.USER && (
        <>
          <div className="mb-8 flex gap-8">
            <div className="flex flex-col items-center">
              <div>Products</div>
              <span>
                {
                  otherUserData.author_info.my_products.filter(
                    (item) => item.marketplace === 'shop'
                  ).length
                }
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div>Collections</div>
              <span>
                {
                  otherUserData.author_info.my_products.filter(
                    (item) => item.marketplace === 'collection'
                  ).length
                }
              </span>
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
            <div>
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
