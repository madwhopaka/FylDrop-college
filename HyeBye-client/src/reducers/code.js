import { createSlice } from '@reduxjs/toolkit';



const CodeSlice = new createSlice({
    name : 'code' , 
    initialState  :  {value: {code: ''}}, 
    reducers  :  {
        
            setCode: (state,action)=> {
                    state.value = action.payload; 
            }
    }
}); 


export const {setCode} = CodeSlice.actions; 
export default CodeSlice.reducer ; 