import axios, { AxiosError } from 'axios';

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
  try {
    const { data } = await axios.get(url, { params });
    return { data, error: null };
  } catch (err) {
    const error = err as AxiosError;
    return { data: null, error };
  }
};
const usePostAccessDatabase = async ({ url, body }: PostTypes) => {
  try {
    const { data } = await axios.post(url, body);
    return { data, error: null };
  } catch (err) {
    const error = err as AxiosError;
    return { data: null, error };
  }
};
export { useGetAccessDatabase, usePostAccessDatabase };
