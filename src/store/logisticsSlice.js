import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { endpoint, hostName, querymanager } from "../config/config";
import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { useDispatch } from "react-redux";
const types = ['error', 'info', 'success', 'warning'];
axios.defaults.withCredentials = true;
export let initialState = {
    data: [],
    loading: false,
    error: null,
    tableName: '',
    tableKey: ''

}
const createODataSource2 = ({ queryOptions }) => {
    const oDataStore = new ODataStore({
        url: `${hostName}/QueryService_PostQuery`,
        version: 4,
        withCredentials: true,
        filterToLower: false,
        onLoading: (loadOptions) => {

        },
        onLoaded: () => { },
        beforeSend: (options) => {
            options.payload = queryOptions
            options.method = "POST";
            options.headers = {
                'Content-Type': 'application/json',
            };
        }
    })
    return new DataSource({
        store: oDataStore,
        paginate: true,
        pageSize: 20,
        requireTotalCount: false,
        customQueryParams: queryOptions
    });
}
export const odataQuery2 = ({ filterValues }) => {
    const queryOptions = {
        "QueryOption": `$expand=SML_SHP_HDR($select=U_PalletQuantity,U_ContainerQuantity),SML_SHP_HDR/SML_SHP_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_ItemName,U_CardCode,U_CardName,U_Quantity,U_OrderNo,U_OrderLine)&$filter= SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry `,
        "QueryPath": "$crossjoin(SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection)"
    }
    const oDataSource = createODataSource2({ queryOptions });
    // oDataSource.load();
    // return oDataSource;
    return new Promise((resolve, reject) => {
        oDataSource.load()
            .then((data) => {
                resolve(oDataSource);
            })
            .catch((error) => {
                console.error("Error:", error);
                reject(error);
            });
    });
};


export const odataQuery = createAsyncThunk(
    'odataQuery',
    async ({ filterValues }) => {

        const queryOptions = {
            "QueryOption": `$expand=SML_SHP_HDR($select=U_PalletQuantity,U_ContainerQuantity,U_Type),SML_SHP_HDR/SML_SHP_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_ItemName,U_CardCode,U_CardName,U_Quantity,U_OrderNo,U_OrderLine),SML_SHP_RMN($select=U_RemainingQty)&$filter= SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry and SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry eq SML_SHP_RMN/U_ShipmentNo and SML_SHP_HDR/SML_SHP_ITEMCollection/LineId eq SML_SHP_RMN/U_ShipmentLine and contains(SML_SHP_HDR/SML_SHP_ITEMCollection/U_ItemCode,'${filterValues.ItemCode}') and contains(SML_SHP_HDR/SML_SHP_ITEMCollection/U_CardCode,'${filterValues.CardCode}') `
            ,
            "QueryPath": "$crossjoin(SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection,SML_SHP_RMN)"
        }
        const headers = {
            'Content-Type': 'application/json',
            //  'Prefer': 'odata.maxpagesize=0'
        };
        try {
            const request = await axios.post(`${hostName}/QueryService_PostQuery?$inlinecount=allpages'`, queryOptions, { headers: headers });
            const response = await request.data;
            response.value = response.value.map(item => ({
                ...item,
                U_TypeDescription: item.SML_SHP_HDR.U_Type === 1 ? 'Satış' : item.SML_SHP_HDR.U_Type === 2 ? 'Satınalma' : '-',
            }));

            return response;
        } catch (error) {
            console.error('Error creating SQL query:', error);
        }
    }
)
export const getDetail = async ({ id }) => {
    let query = `/$crossjoin(SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection,SML_LGT_HDR,SML_LGT_HDR/SML_LGT_ITEMCollection)?$expand=SML_SHP_HDR($select=U_Date,U_Type,U_DeliveryStatus),SML_SHP_HDR/SML_SHP_ITEMCollection($select=U_Quantity,U_RemainingQty,U_ItemCode,U_ItemName,DocEntry,LineId,U_CardCode,U_CardName,U_OrderNo,U_OrderLine),SML_LGT_HDR($select=U_Status),SML_LGT_HDR/SML_LGT_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_CardCode,U_ShipmentNo,U_ShipmentLine,U_Status,U_Quantity)&$filter=SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry and SML_LGT_HDR/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry and SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/U_ShipmentNo and SML_SHP_HDR/SML_SHP_ITEMCollection/LineId eq SML_LGT_HDR/SML_LGT_ITEMCollection/U_ShipmentLine and SML_LGT_HDR/DocEntry eq ${id}`;
    return await fetchAllData(query);
}

export const getAllShipmentRdr = async ({ filterValues, formMode, type }) => {

    let dateFilter = "";
    let shipmentFilter = "";
    if (filterValues.Date) {
        const date = new Date(filterValues.Date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        dateFilter = `and SML_SHP_HDR/U_Date eq '${formattedDate}' `;
    }
    if (filterValues.ShipmentNo) {
        shipmentFilter = `and SML_SHP_HDR/DocEntry eq ${filterValues.ShipmentNo}`
    }

    let query = `/$crossjoin(SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection,Orders,Orders/DocumentLines)?$expand=SML_SHP_HDR($select=U_Date,U_Type,U_DeliveryStatus,U_TradeFileNo,U_TransportType),SML_SHP_HDR/SML_SHP_ITEMCollection($select=U_Quantity,U_RemainingQty,U_ItemCode,U_ItemName,DocEntry,LineId,U_CardCode,U_CardName,U_OrderNo,U_OrderLine,U_PalletQuantity,U_WhsCode,U_PalletGrossWgh,U_PalletNetWgh,U_PalletType,U_InnerQtyOfPallet)&$filter=Orders/DocEntry eq Orders/DocumentLines/DocEntry and Orders/DocumentLines/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/U_OrderNo and Orders/DocumentLines/LineNum eq SML_SHP_HDR/SML_SHP_ITEMCollection/U_OrderLine and  SML_SHP_HDR/U_IsDeleted eq  'N' and SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry and Orders/DocumentLines/LineStatus eq 'bost_Open' and contains(SML_SHP_HDR/SML_SHP_ITEMCollection/U_ItemCode , '${filterValues.ItemCode}' ) and contains(SML_SHP_HDR/SML_SHP_ITEMCollection/U_CardName,'${filterValues.CardName}')  and SML_SHP_HDR/U_Type eq ${type} ${dateFilter} ${shipmentFilter}`
    // and  SML_SHP_HDR/SML_SHP_ITEMCollection/U_DeliveryStatus eq 1 
    return await fetchAllData(query);
}
export const getAllShipmentPO = async ({ filterValues, formMode, type }) => {

    let dateFilter = "";
    let shipmentFilter = "";
    if (filterValues.Date) {
        const date = new Date(filterValues.Date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        dateFilter = `and SML_SHP_HDR/U_Date eq '${formattedDate}' `;
    }
    if (filterValues.ShipmentNo) {
        shipmentFilter = `and SML_SHP_HDR/DocEntry eq ${filterValues.ShipmentNo}`
    }

    let query = `/$crossjoin(SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection,PurchaseOrders,PurchaseOrders/DocumentLines)?$expand= SML_SHP_HDR($select=U_Date,U_Type,U_DeliveryStatus,U_TradeFileNo),SML_SHP_HDR/SML_SHP_ITEMCollection($select=U_Quantity,U_RemainingQty,U_ItemCode,U_ItemName,DocEntry,LineId,U_CardCode,U_CardName,U_OrderNo,U_OrderLine,U_PalletQuantity,U_WhsCode,U_PalletGrossWgh,U_PalletNetWgh,U_PalletType,U_InnerQtyOfPallet)&$filter=PurchaseOrders/DocEntry eq PurchaseOrders/DocumentLines/DocEntry and PurchaseOrders/DocumentLines/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/U_OrderNo and PurchaseOrders/DocumentLines/LineNum eq SML_SHP_HDR/SML_SHP_ITEMCollection/U_OrderLine and SML_SHP_HDR/U_IsDeleted eq  'N' and SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry and  PurchaseOrders/DocumentLines/LineStatus eq 'bost_Open' and contains(SML_SHP_HDR/SML_SHP_ITEMCollection/U_ItemCode , '${filterValues.ItemCode}' ) and contains(SML_SHP_HDR/SML_SHP_ITEMCollection/U_CardName,'${filterValues.CardName}')  and SML_SHP_HDR/U_Type eq ${type} ${dateFilter} ${shipmentFilter}`
    // and  SML_SHP_HDR/SML_SHP_ITEMCollection/U_DeliveryStatus eq 1 
    return await fetchAllData(query);
}


export const getBinLocations = async ({ itemCode,whsCode,quantity }) => {
    try {
        
        const response = await axios.get(`${querymanager}/getbinlocations`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                itemCode:itemCode,
                whsCode:whsCode,
                quantity:quantity
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

export const getSalesShipments = async ({ filterValues }) => {
    try {
        let formattedDate = "";
        if (filterValues.Date) {
            const date = new Date(filterValues.Date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }
        const response = await axios.get(`${querymanager}/getsalesshipments`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                cardName: filterValues.CardName,
                itemCode: filterValues.ItemCode,
                shipmentNo: filterValues.ShipmentNo,
                docDate: formattedDate
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
export const getPurchaseShipments = async ({ filterValues }) => {
    try {
        let formattedDate = "";
        if (filterValues.Date) {
            const date = new Date(filterValues.Date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }
        const response = await axios.get(`${querymanager}/getpurchaseshipments`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                cardName: filterValues.CardName,
                itemCode: filterValues.ItemCode,
                shipmentNo: filterValues.ShipmentNo,
                docDate: formattedDate
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



export const getAllLogistics = async ({ filterValues }) => {
    const query = `/SML_LGT_HDR?$filter=U_IsDeleted eq 'N'`
    return await fetchAllData(query);

}
export const getAllWgh = async ({ filterValues }) => {
    const query = `/SML_WGHB_HDR`
    return await fetchAllData(query);

}
export const update = () => {

}

export const viewCrystal = async ({ logisticId }) => {
    const url = "http://192.168.0.110:4909/api/Crystal/ViewCrystal"
    try {
        const response = await axios.get(url
            , {
                params: { logisticId: logisticId }
            }
        );
        console.log("Response from server:", response.data);
    } catch (error) {
        console.error("Error:", error);
    }
};
export const printShipmentReport = async ({ logisticId }) => {
    try {
        const response = await axios.get('http://10.10.1.2:4909/ViewCrystal', {
            params: { logisticId: logisticId },
            responseType: 'blob', // Yanıtı blob olarak alıyoruz
        });

        if (response.data instanceof Blob) {
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob); // Blob URL'sini oluştur
           window.open(url, '_blank');
           // const link = document.createElement('a'); // Link elementini oluştur
//             const today = new Date();
// const dateString = today.toLocaleString();
//             link.href = url;
//             link.download = `Yukleme Emri ${dateString}.pdf`;
//             document.body.appendChild(link);
//             link.click(); // İndirmeyi başlat
//             document.body.removeChild(link); // Link'i kaldır
        } else {
            console.error('Yanıt bir Blob nesnesi değil');
        }
    } catch (error) {
        console.error('API isteğinde hata:', error.response || error.message);
        if (error.response) {
            console.error('Durum kodu:', error.response.status);
            console.error('Yanıt içeriği:', error.response.data);
        }
    }
};
export const getSlpCodes = async () => {
    const query = `/SalesPersons`
    return await fetchAllData(query);
}
const fetchAllData = async (query = '') => {
    let allData = [];
    let nextLink = null;

    const fetchData = async (url) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                redirect: "follow",
                origin: "*"
            });
            const jsonResponse = await response.json();
            if (Array.isArray(jsonResponse.value)) {
                allData = allData.concat(jsonResponse.value);
            } else {
                allData.push(jsonResponse);
            }
            nextLink = jsonResponse["@odata.nextLink"];
        } catch (error) {
            console.error("Data fetch error:", error);
        }
    };
    await fetchData(`${hostName}${query}`);
    let counter = 0;
    while (nextLink && counter < 100) {
        counter++;
        await fetchData(`${hostName}/` + nextLink);
    }

    return allData;
};




// export const getRemainingQuantity =async({docEntry,lineId})=>{
//     const body={

//             "ParamList": `docEntry=${docEntry} & lineId=${lineId}`

//     }
//     const request = await axios.patch(`${hostName}/SQLQueries('LGTRemQty')/List` , body);
//     const response =  request.data;
//     return response;
// }
export const createPurchaseOrder = async ({ cardCode, itemCode, quantity }) => {
    const purchaseOrderData = {
        "CardCode": `${cardCode}`,
        "DocumentLines": [
            {
                "ItemCode": `${itemCode}`,
                "Quantity": `${quantity}`
            }
        ]
    };
    const request = await axios.post(`${hostName}/PurchaseOrders`, purchaseOrderData);
    const response = await request.data.value;
    sessionStorage.setItem('app', JSON.stringify(response));
    return request;
}


const logisticsSlice = createSlice({
    name: 'logistics',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(odataQuery.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(odataQuery.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.error.message;
            });
    }
});





export default logisticsSlice.reducer;
