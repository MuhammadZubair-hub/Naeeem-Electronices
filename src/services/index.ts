import axios, { Method, AxiosResponse } from 'axios';

export interface ApiCallOptions {
  endpoint: string;
  method: Method;
  params?: Record<string, any>;
  data?: Record<string, any>;
}

export interface ApiCallResponse<T = any> {
  success: boolean;
  status: number;
  data: T;
  message?: string;
}

// API call function
export const apicall_new = async <T = any>({
  endpoint,
  method,
  params = {},
  data = {},
}: ApiCallOptions): Promise<ApiCallResponse<T>> => {
  const option = {
    method,
    url: endpoint,
    params,
    data,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response: AxiosResponse<T> = await axios.request(option);

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    const statusCode = error?.response?.status || 500;
    const message =
      error?.response?.data?.message || error.message || 'Something went wrong';
    console.log('The error calling API is:', error?.response?.data || message);

    return {
      success: false,
      status: statusCode,
      data: error?.response?.data || {},
      message,
    };
  }
};
