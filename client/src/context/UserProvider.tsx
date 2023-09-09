import axios from 'axios';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';

import { AuthorTypes } from '@customTypes/interfaces';

type ContextTypes = {
  userData: null | AuthorTypes;
  changeUserData: (data: null | AuthorTypes) => void;
  fetchUserData: () => void;
};

export const UserContext = createContext<ContextTypes>({
  userData: null,
  changeUserData() {},
  fetchUserData() {},
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<null | AuthorTypes>(null);
  const fetchUserData = async () => {
    const res = await axios.get('/user/myProfile');
    setUserData(res.data);
  };

  const changeUserData = (data: AuthorTypes | null) => {
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
