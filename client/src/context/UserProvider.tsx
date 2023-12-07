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
  const fetchGuestData = async () => {
    await useGetAccessDatabase({
      url: DATABASE_ENDPOINTS.USER_GUEST,
    });
  };
  useEffect(() => {
    fetchGuestData();
  }, []);
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
    fetchUserData();
  }, []);
  const userValues = useMemo(
    () => ({ userData, changeUserData, fetchUserData }),
    [userData]
  );
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
}
