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
  const limit = 3;

  const fetchData = useCallback(async () => {
    setAllUsers((prevState) => {
      return { ...prevState, isLoading: true };
    });

    const { data, error } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.ADMIN_SEARCH_USERS,
      params: {
        page,
        pageSize: limit,
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
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [page]);

  if (!userData.data) return <div>Please log in</div>;

  return (
    <div className="sm:px-3">
      <h4 className="mb-4">Users</h4>
      <div className="sm:px-2">
        <Accordion type="multiple">
          {allUsers.isLoading && <LoadingCircle />}
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
        </Accordion>
        {allUsers.rawData && (
          <Pagination
            totalCount={allUsers.rawData.quantity}
            currentPage={page}
            onPageChange={(newPageNumber: number) => setPage(newPageNumber)}
            pageSize={limit}
            siblingCount={1}
          />
        )}
      </div>
    </div>
  );
}
