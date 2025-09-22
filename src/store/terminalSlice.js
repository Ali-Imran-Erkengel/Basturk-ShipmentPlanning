import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { querymanager } from "../config/config";
import notify from "devextreme/ui/notify";
axios.defaults.withCredentials = true;
export let initialState = {
    data: [],
    loading: false,
    error: null,
    tableName: '',
    tableKey: ''

}
const handleNotify = ({ message, type }) => {
    notify(
      {
        message: message,
        width: 720,
        position: {
          at: "bottom",
          my: "bottom",
          of: "#container"
        }
      },
      type,
      1500
    );
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
   return  sendGetRequest({endpoint:"gettermdeliverydocs",params:params})
}
export const getTermDeliveryDoc = async ({logisticId}) => {
    let params = {
        logisticId:logisticId
    };
   return  sendGetRequest({endpoint:"gettermdeliverydoc",params:params})
}
export const terminalWarehouseControl = async ({itemCode,barcode}) => {
    let params = {
        itemCode:itemCode,
        barcode:barcode
    };
   return  sendGetRequest({endpoint:"terminalwarehousecontrol",params:params})
}
export const terminalStatusControl = async ({itemCode,barcode}) => {
    let params = {
        itemCode:itemCode,
        barcode:barcode
    };
   return  sendGetRequest({endpoint:"terminalstatuscontrol",params:params})
}
export const terminalBinControl = async ({itemCode,barcode,whsCode,stockQuantity}) => {
    let params = {
        itemCode:itemCode,
        barcode:barcode,
        whsCode:whsCode,
        quantity:stockQuantity
    };
   return  sendGetRequest({endpoint:"terminalbincontrol",params:params})
}
export const saveDelivery = async ({payload}) => {
    console.log("payload",payload)
    let params = payload;
   return  sendPostRequest({endpoint:"teslimat",params:params})
}




const sendGetRequest = async ({ endpoint, params }) => {
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
            handleNotify( jsonArray.error.response.data,"error")
            throw new Error(jsonArray.error);
        }
        return jsonArray;
    } catch (error) {
        console.error('API isteğinde hata:', error.response || error.message);
        if (error.response) {
            console.error('Durum kodu:', error.response.status);
            console.error('Yanıt içeriği:', error.response.data);
            handleNotify( error.response.data,"error")

        }
        throw error;
    }
}
const sendPostRequest = async ({ endpoint, params }) => {
    try {
      const response = await axios.post(`${querymanager}/${endpoint}`,   
        params,                         
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      const jsonArray = response.data;
      if (jsonArray.error) {
        console.error("Durum kodu:", jsonArray.error);
        handleNotify( jsonArray.error.response.data,"error")

        throw new Error(jsonArray.error);
      }
      return jsonArray;
    } catch (error) {
      console.error("API isteğinde hata:", error.response || error.message);
      if (error.response) {
        console.error("Durum kodu:", error.response.status);
        console.error("Yanıt içeriği:", error.response.data);
        handleNotify( error.response.data,"error")
      }
      throw error;
    }
  };
export default terminalSlice.reducer;
