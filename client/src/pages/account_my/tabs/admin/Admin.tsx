import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthorTypes, FetchDataTypes } from '@customTypes/interfaces';
import { UserContext } from '@context/UserProvider';
import { Accordion } from '@components/UI/accordion';
import { useGetAccessDatabase } from '../../../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../../../data/endpoints';

import AdminTabs from './AdminTabs';
import Pagination from '@components/paginations/Pagination';
import errorToast from '@components/UI/error/errorToast';
import LoadingCircle from '@components/Loaders/LoadingCircle';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Input } from '@components/UI/input';

interface AdminUsersTypes extends FetchDataTypes {
  users: AuthorTypes[] | null;
  rawData: null | {
    [index: string]: unknown;
    quantity: number;
  };
}

export default function Admin() {
  const [allUsers, setAllUsers] = useState<AdminUsersTypes>({
    users: null,
    hasError: null,
    isLoading: false,
    rawData: null,
  });
  const [page, setPage] = useState(1);
  const { userData } = useContext(UserContext);
  const limit = 10;
  const [searchbarValue, setSearchbarValue] = useState('');

  const fetchData = async ({ newPage }: { newPage?: number }) => {
    setAllUsers((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const filtersData = {
      page: newPage || page,
    } as { [index: string]: unknown };

    filtersData.searchedPhrase = searchbarValue;

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.ADMIN_SEARCH_USERS,
      params: {
        pageSize: limit,
        withPagination: true,
        filtersData,
      },
    });
    if (error) {
      errorToast(error);
      return setAllUsers((prevState) => {
        return { ...prevState, hasError: error, isLoading: false };
      });
    }

    setAllUsers({
      users: data.data,
      rawData: data.rawData,
      hasError: null,
      isLoading: false,
    });
  };

  useEffect(() => {
    fetchData({ newPage: 1 });
  }, []);

  const searchHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchData({ newPage: 1 });
    setPage(1);
  };

  const pageChangeHandler = (newPage: number) => {
    fetchData({ newPage });
    setPage(newPage);
  };
  return (
    <div className="sm:px-3">
      <h4 className="mb-4">Users</h4>
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
      <div className="sm:px-2 mt-2">
        <Accordion type="multiple" className="relative">
          {allUsers.users && allUsers.users.length <= 0 && <div>No users</div>}

          {allUsers.users &&
            allUsers.users.map((user) => (
              <AdminTabs
                key={user._id}
                user={user}
                userData={userData.data}
                fetchData={fetchData}
              />
            ))}

          {allUsers.isLoading && !allUsers.users && <LoadingCircle />}
        </Accordion>
        {allUsers.rawData && (
          <div className="flex justify-center items-center mt-5">
            <Pagination
              totalCount={allUsers.rawData.quantity}
              currentPage={page}
              onPageChange={(newPageNumber: number) =>
                pageChangeHandler(newPageNumber)
              }
              pageSize={limit}
              siblingCount={1}
            />
          </div>
        )}
      </div>
    </div>
  );
}
