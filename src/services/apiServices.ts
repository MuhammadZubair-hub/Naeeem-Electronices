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
};
