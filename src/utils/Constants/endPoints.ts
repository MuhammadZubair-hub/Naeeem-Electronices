const Production = 'https://c21209app02p01.cloudiax.com:13000/api/';
const Test = 'https://c21209app02p01.cloudiax.com:15000/api/';
export const baseUrl = Test;
// export const baseUrl = 'https://c21209app02p01.cloudiax.com:13000/api/';

export const endPoints = {
  EmployeeInfo: 'Auth/EmployeeInfo',
  login: 'Auth/login',
  updatePassword: 'Auth/updatepassword',
  region: 'Common/GetRegion',
  zone: 'Common/GetZone',
  zonebranches: 'Common/GetZonewithBranches',
  branchAvos: 'Common/GetAVOWithBranchCode',
  getallcustomers: 'Common/GetCustWithAVOCode',
  getcustomerdetails: 'Common/GetCustomerDetail',
  regioncount: 'Dashboard/GetTotalofRegions',
  avocountdetial: 'Common/GetAVODetail',

  GetEmployeeLogs: 'Common/GetEmployeeLogs',

  sendOtp: 'Auth/sendOtp',
  verifyOtp: 'Auth/verifyOtp',
  Appversion : 'Common/Appversion'
};
