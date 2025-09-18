import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { querymanager } from "../config/config";
axios.defaults.withCredentials = true;
export let initialState = {
    data: [],
    loading: false,
    error: null,
    tableName: '',
    tableKey: ''

}

const terminalSlice = createSlice({
    name: 'terminal',
    initialState,
    extraReducers: (builder) => {
        // builder
        //     .addCase(odataQuery.fulfilled, (state, action) => {
        //         state.loading = false;
        //         state.data = action.payload;
        //         state.error = null;
        //     })
        //     .addCase(odataQuery.rejected, (state, action) => {
        //         state.loading = false;
        //         state.data = [];
        //         console.log(action.error.message);
        //         state.error = action.error.message;
        //     })
    }
});
export const getTermDeliveryDocs = async () => {
    let params = {};
   return  sendRequest({endpoint:"gettermdeliverydocs",params:params})
}
export const getTermDeliveryDoc = async ({logisticId}) => {
    let params = {
        logisticId:logisticId
    };
   return  sendRequest({endpoint:"gettermdeliverydoc",params:params})
}
export const terminalWarehouseControl = async ({itemCode,barcode}) => {
    let params = {
        itemCode:itemCode,
        barcode:barcode
    };
   return  sendRequest({endpoint:"terminalwarehousecontrol",params:params})
}
export const terminalStatusControl = async ({itemCode,barcode}) => {
    let params = {
        itemCode:itemCode,
        barcode:barcode
    };
   return  sendRequest({endpoint:"terminalstatuscontrol",params:params})
}
const sendRequest = async ({ endpoint, params }) => {
    try {
        const response = await axios.get(`${querymanager}/${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: params
        });
        const jsonArray = JSON.parse(response.data);
        if(jsonArray.error){
            console.error('Durum kodu:', jsonArray.error);
            throw new Error(jsonArray.error);
        }
        return jsonArray;
    } catch (error) {
        console.error('API isteğinde hata:', error.response || error.message);
        if (error.response) {
            console.error('Durum kodu:', error.response.status);
            console.error('Yanıt içeriği:', error.response.data);
        }
        throw error;
    }
}
export default terminalSlice.reducer;
