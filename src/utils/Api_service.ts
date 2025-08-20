import axios, { AxiosRequestConfig } from "axios";


export const apicall = async ({ endpoint  = '', method ='', params = {}, data = {} }) => {
  const option = {
    method: method,
    url: `${endpoint}`,
    params: params,
    data: data,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.request(option);

    return {
      success: true,
      status: response.status,
      data: response.data,
    };

  } catch (error : any) {
    const statusCode = error?.response?.status || 500;
    const message = error?.response?.data?.message || error.message || "Something went wrong";
    console.log('The error calling API is:', error?.response?.data || message);
    //console.log('Full Axios Error:', JSON.stringify(error, null, 2));

    return {
      success: false,
      status: statusCode,
      data: error?.response?.data || {},
      message,
    };
  }
};

