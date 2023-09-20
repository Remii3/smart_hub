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
    return { data: data.data, error: null };
  } catch (err) {
    const error = err as Error | AxiosError;
    if (!axios.isAxiosError(error)) {
      return { data: null, error: error || 'An unknown error has occured' };
    } else {
      return { data: null, error: error.response?.data.message };
    }
  }
};

const usePostAccessDatabase = async ({ url, body }: PostTypes) => {
  try {
    const { data } = await axios.post(url, body);
    return { data, error: null };
  } catch (err) {
    const error = err as Error | AxiosError;
    if (!axios.isAxiosError(error)) {
      return { data: null, error: error || 'An unknown error has occured' };
    } else {
      return { data: null, error: error.response?.data.message };
    }
  }
};
export { useGetAccessDatabase, usePostAccessDatabase };
