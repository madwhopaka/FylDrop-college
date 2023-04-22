import {createSlice} from '@reduxjs/toolkit' ; 



const loadingSlice = createSlice({
    name:"load" , 
    initialState: {value: {loadingvalue:false, loadingtext:""}}, 
    reducers : {
        setLoading: (state,action)=> {
                state.value = action.payload; 
        }
    }
})

export const {setLoading} = loadingSlice.actions; 
export default loadingSlice.reducer ;