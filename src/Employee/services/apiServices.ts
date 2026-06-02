import { apicall_new } from '../../services';
import { baseUrl, endPoints } from '../../utils/Constants/endPoints';

export const API_Config = {
  // loginUser: async (empId: string, password: string) => {
  //   return apicall_new({
  //     endpoint: `${baseUrl}${endPoints.login}`,
  //     method: 'POST',
  //     data: { empId, password },
  //   });
  // },

  loginUser: async (
    empId: string,
    password: string,
    macAddress: string,
    ipAddress: string,
    longitude: string,
    latitude: string,
    verified: string,
  ) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.login}`,
      method: 'POST',
      data: {
        empId,
        password,
        macAddress,
        ipAddress,
        longitude,
        latitude,
        verified,
      },
    });
  },



  updateUserPassword: async (empId: string, newPassword: string) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.updatePassword}`,
      method: 'POST',
      data: { empId, newPassword },
    });
  },

  EmployeeInfo: async (param: any) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.EmployeeInfo}`,
      method: 'GET',
      params: param,
    });
  },
  getRegionCount: async (param: any) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.regioncount}`,
      method: 'GET',
      params: param,
    });
  },

  getRegions: async (param: any) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.region}`,
      method: 'GET',
      params: param,
    });
  },

  getZones: async (param: any) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.zone}`,
      method: 'GET',
      params: param,
    });
  },

  getZoneBranches: async (param: any) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.zonebranches}`,
      method: 'GET',
      params: param,
    });
  },

  getBranchesAVOs: async (param: any) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.branchAvos}`,
      method: 'GET',
      params: param,
    });
  },
  getEmployeeLogs: async () => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.GetEmployeeLogs}`,
      method: 'GET',
    });
  },
  getAllCustomers: async (param: any) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.getallcustomers}`,
      method: 'GET',
      params: param,
    });
  },

  getCustomerDetails: async (param: any) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.getcustomerdetails}`,
      method: 'GET',
      params: param,
    });
  },
  getAvoCountDetails: async (param: any) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.avocountdetial}`,
      method: 'GET',
      params: param,
    });
  },

  sendSmsOtp: async (phoneNumber: string, otpCode: string) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.sendOtp}`,
      method: 'POST',
      data: { phoneNumber, otpCode },
    });
  },

  verifySmsOtp: async (phoneNumber: string, otpCode: string) => {
    return apicall_new({
      endpoint: `${baseUrl}${endPoints.verifyOtp}`,
      method: 'POST',
      data: { phoneNumber, otpCode },
    });
  },
};
