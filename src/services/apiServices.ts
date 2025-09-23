import { apicall_new } from '.';
import { baseUrl, endPoints } from '../utils/Constants/endPoints';

export const API_Config = {
  loginUser: async (empId: string, password: string) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.login}`,
      method: 'POST',
      data: { empId, password },
    });
  },
};
