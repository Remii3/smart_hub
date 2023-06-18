import axios from 'axios';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';

import { UserDataTypes } from '../types/interfaces';

type ContextTypes = {
  userData: null | UserDataTypes;
  changeUserData: (data: null | UserDataTypes) => void;
  fetchUserData: () => void;
};

export const UserContext = createContext<ContextTypes>({
  userData: null,
  changeUserData() {},
  fetchUserData() {},
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<null | UserDataTypes>(null);

  const fetchUserData = async () => {
    const res = await axios.get('/user/profile');
    setUserData(res.data);
  };

  const changeUserData = (data: UserDataTypes | null) => {
    setUserData(data);
  };

  useEffect(() => {
    const token = document.cookie.match('token');

    if (document.cookie.match('token') && document.cookie.match('guestToken')) {
      document.cookie =
        'guestToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    if (!userData && token) {
      fetchUserData();
    }
  }, [userData]);

  const userValues = useMemo(
    () => ({ userData, changeUserData, fetchUserData }),
    [userData]
  );
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
}
