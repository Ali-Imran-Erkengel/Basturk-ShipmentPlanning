import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { hostName, querymanager } from "../config/config";
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
export const getEmployees = async ({ filterValues }) => {
  try {
    const response = await axios.get(`${querymanager}/getemployeestermlic`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      withCredentials: true,
      params: {
        name: encodeURIComponent(filterValues.firstName),
        surname: encodeURIComponent(filterValues.lastName),
      }
    });
    const jsonArray = JSON.parse(response.data);
    return jsonArray;
  } catch (error) {
    console.error('API isteğinde hata:', error.response || error.message);
    if (error.response) {
      console.error('Durum kodu:', error.response.status);
      console.error('Yanıt içeriği:', error.response.data);
    }
  }
}
export const getWarehouses = async ({ filterValues }) => {
  try {
    const response = await axios.get(`${querymanager}/getwarehousestermlic`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      withCredentials: true,
      params: {
        whsCode: filterValues.whsCode,
        whsName: encodeURIComponent(filterValues.whsName),
      }
    });
    const jsonArray = JSON.parse(response.data);
    return jsonArray;
  } catch (error) {
    console.error('API isteğinde hata:', error.response || error.message);
    if (error.response) {
      console.error('Durum kodu:', error.response.status);
      console.error('Yanıt içeriği:', error.response.data);
    }
  }
}
export const getBinLocations = async ({ filterValues }) => {
  try {
    const response = await axios.get(`${querymanager}/getbinlocationstermlic`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      params: {
        whsCode: filterValues.whsCode,
        binCode: filterValues.binCode,
      }
    });
    const jsonArray = JSON.parse(response.data);
    return jsonArray;
  } catch (error) {
    console.error('API isteğinde hata:', error.response || error.message);
    if (error.response) {
      console.error('Durum kodu:', error.response.status);
      console.error('Yanıt içeriği:', error.response.data);
    }
  }
}
export const getBusinessPartners = async ({ filterValues }) => {
  try {
    const response = await axios.get(`${querymanager}/getbusinesspartnerstermlic`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      withCredentials: true,
      params: {
        cardCode: filterValues.cardCode,
        cardName: encodeURIComponent(filterValues.cardName),
      }
    });
    const jsonArray = JSON.parse(response.data);
    return jsonArray;
  } catch (error) {
    console.error('API isteğinde hata:', error.response || error.message);
    if (error.response) {
      console.error('Durum kodu:', error.response.status);
      console.error('Yanıt içeriği:', error.response.data);
    }
  }
}
export const getAplatz = async () => {
  let params = {};
  return sendGetRequest({ endpoint: "getaplatz", params: params })
}
export const getAplatzBinData = async () => {
  let params = {};
  return sendGetRequest({ endpoint: "getaplatzbindata", params: params })
}
export const getTermDeliveryDocs = async () => {
  let params = {};
  return sendGetRequest({ endpoint: "gettermdeliverydocs", params: params })
}
export const getTermDeliveryDoc = async ({ logisticId }) => {
  let params = {
    logisticId: logisticId
  };
  return sendGetRequest({ endpoint: "gettermdeliverydoc", params: params })
}
export const terminalWarehouseControl = async ({ itemCode, barcode }) => {
  let params = {
    itemCode: itemCode,
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "terminalwarehousecontrol", params: params })
}
export const terminalStatusControl = async ({ itemCode, barcode }) => {
  let params = {
    itemCode: itemCode,
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "terminalstatuscontrol", params: params })
}
export const terminalBinControl = async ({ itemCode, barcode, whsCode, stockQuantity }) => {
  let params = {
    itemCode: itemCode,
    barcode: barcode,
    whsCode: whsCode,
    quantity: stockQuantity
  };
  return sendGetRequest({ endpoint: "terminalbincontrol", params: params })
}
export const terminalGetTempItems = async ({ documentNo, module }) => {
  let params = {
    module: module,
    documentNo: documentNo
  };
  return sendGetRequest({ endpoint: "deliverytempitems", params: params })
}
export const terminalControlTempItems = async ({ documentNo, module }) => {
  let params = {
    module: module,
    documentNo: documentNo
  };
  return sendGetRequest({ endpoint: "deliverytempcontrol", params: params })
}
export const getLastTransferRecord = async () => {
  let params = {};
  return sendGetRequest({ endpoint: "getlasttransferrecord", params: params })
}
export const getPreviousEndOfProcess = async ({barcode}) => {
  let params = {
    barcode:barcode
  };
  return sendGetRequest({ endpoint: "terminaleopprevrecord", params: params })
}
export const saveDelivery = async ({ payload }) => {
  console.log("payload", payload)
  let params = payload;
  return sendPostRequest({ endpoint: "teslimatweb", params: params })
}
export const saveTransfer = async ({ payload }) => {
  console.log("payload", payload)
  let params = payload;
  return sendPostRequest({ endpoint: "transferweb", params: params })
}

export const createTempData = async ({ tempData }) => {
  let params = {
    itemCode: tempData.ItemCode,
    itemName: tempData.ItemName,
    barcode: tempData.Batch,
    index: tempData.Index,
    binEntry: tempData.BinEntry,
    documentNo: tempData.DocumentNo,
    userCode: tempData.UserCode,
    module: tempData.Module,
    loadedBy: tempData.LoadedBy,
    preparer: tempData.Preparer

  };
  console.log("payload", params)
  return sendPostRequest({ endpoint: "deliverytempinsert", params: params })
}
export const deleteAllTempData = async ({ tempData }) => {
  let params = {
    documentNo: tempData.DocumentNo,
    module: tempData.Module
  };
  console.log("payload", params)
  return sendGetRequest({ endpoint: "deliverytempdeleteall", params: params })
}
export const deleteTempData = async ({ tempData }) => {
  let params = {
    documentNo: tempData.DocumentNo,
    module: tempData.Module,
    barcode: tempData.Batch
  };
  console.log("payload", params)
  return sendGetRequest({ endpoint: "deliverytempdelete", params: params })
}
export const getBinUsingBatch = async ({ barcode }) => {
  let params = {
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "terminalgetbin", params: params })
}
export const getCustomerInvoicesForReturns = async ({ cardCode }) => {
  let params = {
    cardCode: cardCode
  };
  return sendGetRequest({ endpoint: "getcustomerinvoices", params: params })
}
export const getTermReturnDoc = async ({ docEntry }) => {
  let params = {
    docEntry: docEntry
  };
  return sendGetRequest({ endpoint: "gettermdeliverydoc", params: params })
}
export const returnBatchControl = async ({ documentNo, barcode }) => {
  let params = {
    documentNo: documentNo,
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "returnbatchcontrol", params: params })
}
export const saveReturns = async ({ payload }) => {
  console.log("payload", payload)
  let params = payload;
  debugger
  return sendPostRequest({ endpoint: "returnsweb", params: params })
}
export const getTransferRequest = async ({ whsCode, status1, status2 }) => {
  let params = {
    whsCode: whsCode,
    status1: status1,
    status2: status2
  };
  return sendGetRequest({ endpoint: "barcodedprocgettransferreq", params: params })
}
export const requestIsBatch = async ({ docEntry }) => {
  let params = {
    documentNo: docEntry
  };
  return sendGetRequest({ endpoint: "requestisbatch", params: params })
}
export const getBarcodedProcessBatch = async ({ docEntry, whsCode, status1, status2 }) => {
  let params = {
    documentNo: docEntry,
    whsCode: whsCode,
    status1: status1,
    status2: status2
  };
  return sendGetRequest({ endpoint: "requestwithbatch", params: params })
}
export const requestWithoutBatchControl = async ({ documentNo, barcode }) => {
  let params = {
    documentNo: documentNo,
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "requestwithoutbatchcontrol", params: params })
}
export const saveBarcodedProcess = async ({ payload }) => {
  console.log("payload", payload)
  let params = payload;
  debugger
  return sendPostRequest({ endpoint: "barcodedprocessweb", params: params })
}
export const transferFromReqStatusControl = async ({ barcode }) => {
  let params = {
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "transferfromreqstatuscontrol", params: params })
}
export const isBinActiveTransferFromReq = async ({ docEntry, barcode }) => {
  let params = {
    documentNo: docEntry,
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "isbinactivetransferfromreq", params: params })
}
export const transferFromReqControlBinActive = async ({ docEntry, barcode }) => {
  let params = {
    documentNo: docEntry,
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "transferfromreqcontrolbinactive", params: params })
}
export const transferFromReqControlBinDective = async ({ docEntry, barcode }) => {
  let params = {
    documentNo: docEntry,
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "transferfromreqcontrolbindeactive", params: params })
}
export const saveTransferFromRequest = async ({ payload }) => {
  let params = payload;
  debugger
  return sendPostRequest({ endpoint: "transferfromreqweb", params: params })
}
export const getBatchDetails = async ({ barcode }) => {
  let params = {
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "getbatchdetails", params: params })
}
export const saveInventoryTransfer = async ({ payload }) => {
  console.log("payload", payload)
  let params = payload;
  return sendPostRequest({ endpoint: "inventorytransferweb", params: params })
}
export const getBinAndWhs = async ({ binCode }) => {
  let params = {
    binCode: binCode
  };
  return sendGetRequest({ endpoint: "getbinandwhs", params: params })
}
export const findBinAndWhs = async ({ barcode }) => {
  let params = {
    barcode: barcode
  };
  return sendGetRequest({ endpoint: "findbinandwhs", params: params })
}
export const batchControl = async ({ barcode, whsCode, binEntry }) => {
  let params = {
    barcode: barcode,
    whsCode: whsCode,
    binEntry: binEntry,
  };
  return sendGetRequest({ endpoint: "batchcontrol", params: params })
}
const sendGetRequest = async ({ endpoint, params }) => {
  try {
    const response = await axios.get(`${querymanager}/${endpoint}`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      withCredentials: true,
      params: params
    });
    const jsonArray = JSON.parse(response.data);
    if (jsonArray.error) {
      console.error('Durum kodu:', jsonArray.error);
      handleNotify(jsonArray.error.response.data, "error")
      throw new Error(jsonArray.error);
    }
    return jsonArray;
  } catch (error) {
    console.error('API isteğinde hata:', error.response || error.message);
    if (error.response) {
      console.error('Durum kodu:', error.response.status);
      console.error('Yanıt içeriği:', error.response.data);
      handleNotify(error.response.data, "error")

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
          "Content-Type": "application/json; charset=utf-8",
        },
        withCredentials: true,
      }
    );

    const jsonArray = response.data;
    if (jsonArray.error) {
      console.error("Durum kodu:", jsonArray.error);
      handleNotify(jsonArray.error.response.data, "error")

      throw new Error(jsonArray.error);
    }
    return jsonArray;
  } catch (error) {
    console.error("API isteğinde hata:", error.response || error.message);
    if (error.response) {
      console.error("Durum kodu:", error.response.status);
      console.error("Yanıt içeriği:", error.response.data);
      handleNotify(error.response.data, "error")
    }
    throw error;
  }
};
export default terminalSlice.reducer;
