import axios from 'axios';

interface AccessTypes {
  url: string;
}
interface GetTypes extends AccessTypes {
  params?: any;
}
interface PostTypes extends AccessTypes {
  body: any;
}

const useGetAccessDatabase = async ({ url, params }: GetTypes) => {
  const { data } = await axios.get(url, { params });
  return { data };
};
const usePostAccessDatabase = async ({ url, body }: PostTypes) => {
  const { data } = await axios.post(url, body);
  return { data };
};
export { useGetAccessDatabase, usePostAccessDatabase };
