import {createSlice} from '@reduxjs/toolkit' ; 

const initialValues = {color:"#28282B", bgcolor:"white"};

const themeSlice = createSlice({
    name:"theme" , 
    initialState:  {value: {initialValues} } ,
    reducers : {
        themeChange: (state,action)=> {
                state.value = action.payload; 
        }
    }
})

export const {themeChange} = themeSlice.actions; 
export default themeSlice.reducer ;