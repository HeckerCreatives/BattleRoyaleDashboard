import axios, { AxiosError, AxiosResponse } from "axios";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});


const Response = (response: AxiosResponse): AxiosResponse => {

  // if (response.config.method?.toLowerCase() !== 'get') {

  //   const data = response?.data as { msg?: string; message?: string, data?: string } | undefined;
  //   const successMsg = ` ${data?.message || 'Success'}, ${data?.data}`;
  //   const toastId = response.config.url || 'default';

  //   toast.success(successMsg, { id: toastId }); 
  // }

  return response;
};

const ResponseError = async (error: AxiosError): Promise<never> => {
  const data = error.response?.data as { msg?: string } | undefined;
  const errMsg = data?.msg || 'An error occurred';

  
  if (error.response?.status === 401) {
    localStorage.removeItem('auth');
    toast.error(errMsg)
    
  } else {
    toast.error(errMsg)
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(Response, ResponseError);

export default axiosInstance;
