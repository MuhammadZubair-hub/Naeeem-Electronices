import { useState } from "react"
import { Login_Service } from "./service";
import { Alert } from "react-native";

interface logincerdentials {
    userName: string,
    userPassword: string,
}

export const useLoginDetials = () => {

    const [logincerdentials, setLoginCredentials] = useState<logincerdentials>({
        userName: '',
        userPassword: '',
    });
    const [loading,setLoading] = useState<boolean>(false);


    const handleFieldChange = (field: string, value: string) => {

        setLoginCredentials(prev => (
            {
                ...prev,
                [field]: value
            }
        ))

    };

    const handleLogin = async () => {

        if(logincerdentials.userName == '' || logincerdentials.userPassword == ''){
            Alert.alert('Field Required' , 'Username & Password is required');
            return

        }

        setLoading(true)
        const response = await Login_Service.Login({
            UserCode: logincerdentials.userName,
            Password: logincerdentials.userPassword
        });

        if (response.success) {
            setLoading(false);
            console.log('you have login succesfully', response);
            Alert.alert(`${JSON.stringify(response)}`)
            return response
        } else {
            setLoading(false);
            console.log('Sorry Can not login ', response);
            Alert.alert(`${response.message}`);
            return response
        }


    };

    return {
        logincerdentials,
        loading,

        handleFieldChange,
        handleLogin
    }

}


