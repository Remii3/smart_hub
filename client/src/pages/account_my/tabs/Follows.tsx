import { Badge } from '@components/UI/badge';
import MarketplaceBadge from '@components/UI/badges/MarketplaceBadge';
import { Button } from '@components/UI/button';
import { Card } from '@components/UI/card';
import DeleteDialog from '@components/UI/dialogs/DeleteDialog';
import errorToast from '@components/UI/error/errorToast';
import { Input } from '@components/UI/input';
import Pagination from '@components/paginations/Pagination';
import { UserContext } from '@context/UserProvider';
import { AuthorTypes, FetchDataTypes } from '@customTypes/interfaces';
import { UserRoleTypes } from '@customTypes/types';
import { DATABASE_ENDPOINTS } from '@data/endpoints';
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  useGetAccessDatabase,
  usePostAccessDatabase,
} from '@hooks/useAaccessDatabase';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface FollowsTypes extends FetchDataTypes {
  data: null | AuthorTypes[];
  rawData: null | { [index: string]: unknown; totalCount: number };
}

export default function Follows() {
  const [followedUsers, setFolloweedUsers] = useState<FollowsTypes>({
    data: null,
    rawData: null,
    hasError: null,
    isLoading: false,
  });
  const pageLimit = 9;
  const [deleteDialog, setDeleteDialog] = useState<null | string>(null);
  const [searchbarValue, setSearchbarValue] = useState('');
  const [page, setPage] = useState(1);
  const { userData } = useContext(UserContext);

  const fetchData = async ({ newPage }: { newPage?: number }) => {
    if (!userData.data) return;
    setFolloweedUsers((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const filtersData = {
      page: newPage || page,
    } as { [index: string]: unknown };

    filtersData.searchedPhrase = searchbarValue;

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_FOLLOWS,
      params: {
        userId: userData.data._id,
        filtersData,
        withPagination: true,
        pageSize: pageLimit,
      },
    });
    if (error) {
      errorToast(error);
      return setFolloweedUsers((prevState) => {
        return { ...prevState, hasError: error, isLoading: false };
      });
    }
    setFolloweedUsers({
      data: data.data,
      rawData: data.rawData,
      hasError: null,
      isLoading: false,
    });
  };

  useEffect(() => {
    fetchData({});
  }, []);

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
    fetchData({});
  };
  const searchHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchData({ newPage: 1 });
    setPage(1);
  };
  const changePageHandler = (newPage: number) => {
    fetchData({ newPage });
    setPage(newPage);
  };

  return (
    <>
      <h4 className="mb-4">Following</h4>
      <div className="order-3 sm:order-2 w-full sm:w-auto">
        <form
          onSubmit={(e) => searchHandler(e)}
          className="relative mx-auto me-4 w-full basis-full items-center justify-end text-muted-foreground flex"
        >
          <Input
            className="h-full rounded-lg bg-background py-2 pl-3 pr-12 text-sm transition-[width] duration-200 ease-in-out focus-visible:w-full"
            type="text"
            name="search"
            placeholder="Search"
            value={searchbarValue}
            onChange={(e) => setSearchbarValue(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-0 top-1/2 h-full w-auto min-w-[40px] -translate-y-1/2 transform rounded-e-xl border-0 bg-transparent px-2 text-gray-600 transition"
          >
            <span className="sr-only">Search</span>
            <MagnifyingGlassIcon className="h-6 w-6 font-bold text-muted-foreground" />
          </button>
        </form>
      </div>
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
      {followedUsers.rawData && (
        <Pagination
          currentPage={page}
          onPageChange={(newPage: number) => changePageHandler(newPage)}
          pageSize={pageLimit}
          siblingCount={1}
          totalCount={followedUsers.rawData.totalCount}
        />
      )}
    </>
  );
}
