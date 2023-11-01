import { useCallback, useContext, useEffect, useState } from 'react';
import { AuthorTypes } from '@customTypes/interfaces';
import { UserContext } from '@context/UserProvider';
import { Accordion } from '@components/UI/accordion';
import { useGetAccessDatabase } from '../../../../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../../../../data/endpoints';

import AdminTabs from './AdminTabs';

interface AdminUsersTypes {
  users: AuthorTypes[] | null;
  fetchingStatus: boolean;
  error: { name: string; message: string } | null;
}

export default function Admin() {
  const [newDataAllUsers, setNewDataAllUsers] = useState<AdminUsersTypes>({
    users: null,
    fetchingStatus: true,
    error: null,
  });

  const { userData } = useContext(UserContext);

  const fetchData = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.ADMIN_ALL_USERS,
    });
    setNewDataAllUsers({
      users: data,
      error: null,
      fetchingStatus: false,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!userData.data) return <div>Please log in</div>;

  return (
    <div className="sm:px-3">
      <h4 className="mb-4">Users</h4>
      <div className="sm:px-2">
        <Accordion type="multiple">
          {!newDataAllUsers.users && newDataAllUsers.fetchingStatus && (
            <div>Loading</div>
          )}
          {!newDataAllUsers.users && !newDataAllUsers.fetchingStatus && (
            <div>No data</div>
          )}
          {!newDataAllUsers.fetchingStatus &&
            newDataAllUsers.users &&
            newDataAllUsers.users.map((user) => (
              <AdminTabs
                key={user._id}
                user={user}
                userData={userData.data}
                fetchData={fetchData}
              />
            ))}
        </Accordion>
      </div>
    </div>
  );
}
