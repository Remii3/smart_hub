import axios from 'axios';
import { createContext, ReactNode, useEffect, useMemo, useState } from 'react';

import { UserDataTypes } from '../types/interfaces';

type ContextTypes = {
  userData: null | UserDataTypes;
  changeUserData: (data: null | UserDataTypes) => void;
};

export const UserContext = createContext<ContextTypes>({
  userData: null,
  changeUserData() {},
});

function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<null | UserDataTypes>(null);

  const fetchData = async () => {
    const res = await axios.get('/account/profile');
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
      fetchData();
    }
  }, [userData]);

  const userValues = useMemo(() => ({ userData, changeUserData }), [userData]);
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
}

export default UserProvider;
