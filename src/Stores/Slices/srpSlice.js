import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading:false,
    error:'',
    toast:null,
}


const srpSlice = createSlice({
  name: 'searchApi',
  initialState,
  reducers: {
    showToastMessage(state,action){
        state.toast=action.payload
    }
  },
});

export const {showToastMessage} = srpSlice.actions;
export default srpSlice.reducer;
