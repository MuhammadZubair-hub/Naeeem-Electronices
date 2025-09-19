import { createSlice } from "@reduxjs/toolkit"

const intialstate = {
    userToken : ''
}

const UserSlice = createSlice({
    name :'user',
    initialState : intialstate,
    reducers :{
        setUserToken : (state ,action)=>{
            state.userToken =action.payload
        }
}
})

export const getUserToken = (state: any)=>state.user?.userToken


export const {
setUserToken
} = UserSlice.actions;

export default UserSlice.reducer