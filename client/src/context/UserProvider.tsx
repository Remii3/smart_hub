import axios from 'axios';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

type ContextTypes = {
  userData: null | { email: string; username: string };
  setUserData:
    | Dispatch<SetStateAction<object>>
    | Dispatch<SetStateAction<null>>;
};

export const UserContext = createContext<ContextTypes>({
  userData: null,
  setUserData: () => {},
});

function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState(null);

  const fetchData = async () => {
    const defaultUrl = `/account/profile`;
    const res = await axios.get(defaultUrl);
    setUserData(res.data);
  };

  useEffect(() => {
    const token = document.cookie.match('token');

    if (!userData && token) {
      fetchData();
    }
  }, [userData]);

  const userValues = useMemo(() => ({ userData, setUserData }), [userData]);
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
}

export default UserProvider;
