import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { hostName } from "../config/config";
axios.defaults.withCredentials = true;
export let initialState = {
    data: [],
    loading: false,
    error: null

}
export const createTable = createAsyncThunk(
    'create',
    async ({ udt, udo, udf }) => {
        try {

            createUDT({ udt });
            createUDO({ udo });
            const cleanedUdf = udf.map(item => {
                const { __KEY__, ...rest } = item;
                return rest;
            });
            for (let index = 0; index < cleanedUdf.length; index++) {
                const field = cleanedUdf[index];
                createUDF({ field })
            }
        } catch (error) {
            console.error('Error creating:', error);
        }
    }
)

const createUDT = async ({ udt }) => {
    try {
        const request = await axios.post(`${hostName}/UserTablesMD`, udt);
        const response = await request.data;
        console.log(response)
        return response;
    } catch (error) {
        console.error('Error creating UDT:', error);
    }
}

export const createUDF = async ({ field }) => {
    try {
        const request = await axios.post(`${hostName}/UserFieldsMD`, field);
        const response = await request.data;
        console.log(response)
    }
    catch (error) {
        console.error('Error creating UDF:', error);
    }
}

const createUDO = async ({ udo }) => {
    try {
        const request = await axios.post(`${hostName}/UserObjectsMD`, udo);
        const response = await request.data;
        console.log(response)
        return response;
    } catch (error) {
        console.error('Error creating UDO:', error);
    }
}

export const bindChildTable = createAsyncThunk(
    'childTable',
    async ({ mainTable, childTable }) => {
        console.log(childTable)
        try {
            const request = await axios.patch(`${hostName}/UserObjectsMD('${mainTable}')`,`{"UserObjectMD_ChildTables":[{"TableName":"${childTable}","ObjectName":"${childTable}"}]}`);
            const response = await request.data;
            return response;

        } catch (error) {
            console.error('Error binding Child Table:', error);
        }
    }
)

const udoSlice = createSlice({
    name: 'udo',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(createTable.pending, (state) => {
                state.loading = true;
                state.data = [];
                state.error = null;
            })
            .addCase(createTable.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(createTable.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                console.log(action.error.message);
                state.error = action.error.message;
            });
    }
});

export default udoSlice.reducer;
