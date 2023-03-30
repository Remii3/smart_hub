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
  userData: null | object;
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

  useEffect(() => {
    const token = document.cookie.match('token');

    if (!userData && token) {
      axios.get('/account/profile').then((res) => {
        setUserData(res.data);
      });
    }
  });
  const userValues = useMemo(() => ({ userData, setUserData }), [userData]);
  return (
    <UserContext.Provider value={userValues}>{children}</UserContext.Provider>
  );
}

export default UserProvider;
