import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';


export const getSearchFiltersApi = createAsyncThunk(
    'searchApi/getSearchFiltersApi',
    async (searchData,{rejectWithValue})=>{
        let body = {};
        try{
            const response =await axios.post( "URL" + "get/search/data",body,{headers:header});
            return (response.data)?response.data:[]
        }
        catch(error){
            return rejectWithValue(error.response.data)
        }
    }
);


