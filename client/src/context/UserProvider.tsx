import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AuthorTypes } from '@customTypes/interfaces';
import { useGetAccessDatabase } from '../hooks/useAaccessDatabase';
import { DATABASE_ENDPOINTS } from '../data/endpoints';

type ContextTypes = {
  userData: { data: null | AuthorTypes; isLoading: boolean };
  changeUserData: (data: null | AuthorTypes) => void;
  fetchUserData: () => void;
};

export const UserContext = createContext<ContextTypes>({
  userData: { data: null, isLoading: true },
  changeUserData() {},
  fetchUserData() {},
});

export default function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<{
    data: null | AuthorTypes;
    isLoading: boolean;
  }>({ data: null, isLoading: true });

  const fetchUserData = useCallback(async () => {
    const { data } = await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_PROFILE,
    });
    setUserData({ data, isLoading: false });
  }, [userData.data]);

  const changeUserData = (data: AuthorTypes | null) => {
    setUserData((prevState) => {
      return { ...prevState, data };
    });
  };

  useEffect(() => {
    const token = document.cookie.match('token');

    if (document.cookie.match('token') && document.cookie.match('guestToken')) {
      document.cookie =
        'guestToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    if (!userData.data && token) {
      fetchUserData();
    } else {
      setUserData((prevState) => {
        return { ...prevState, isLoading: false };
      });
    }
  }, []);
  const userValues = useMemo(
    () => ({ userData, changeUserData, fetchUserData }),
    [userData]
  );
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
}
