import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function OtherUserPage() {
  const [otherUserData, setOtherUserData] = useState();
  const path = useLocation();

  let userId: string | any[] | null = null;
  userId = path.pathname.split('/');
  userId = userId[userId.length - 1];
  console.log(userId);
  useEffect(() => {
    axios.get('/user/otherUser');
  }, []);
  return <div>OtheruserPage</div>;
}
