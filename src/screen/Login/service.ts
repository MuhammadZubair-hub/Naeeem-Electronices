import { Api_Config, NewBaseURL } from "../../constant/endpoints";
import { apicall } from "../../utils/Api_service";

export const Login_Service = {
  Login: async (data : any) => {
    
    const url = `${NewBaseURL}${Api_Config.Login}`;

    //const url = 'https://hcc.vdc.services:4400/api/Auth/LoginMV'

    return await apicall({
      endpoint: url,
      method :'POST',
      data: data
    });

    
  },
};
