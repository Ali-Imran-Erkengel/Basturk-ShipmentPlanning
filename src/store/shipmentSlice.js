import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { endpoint, hostName, querymanager } from "../config/config";
import ODataStore from 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
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
        version: 2,
        withCredentials: true,
        filterToLower: false,
        onLoading: (loadOptions) => {

        },
        onLoaded: () => { },
        beforeSend: (options) => {
            options.payload = queryOptions
            options.method = "POST"

        }
    })
    return new DataSource({
        store: oDataStore,
        paginate: true,
        pageSize: 20,
        requireTotalCount: true,
        customQueryParams: queryOptions
    });
}
export const odataQuery2 = ({ filterValues }) => {
    const queryOptions = {
        "QueryOption": `$expand=BusinessPartners($select=CardCode,CardName),Orders/DocumentLines($select=ItemCode,ItemDescription,LineNum,DocEntry,Quantity),Orders($select=Address2)&$filter= Orders/DocEntry eq Orders/DocumentLines/DocEntry and Items/ItemCode eq Orders/DocumentLines/ItemCode and Orders/DocumentLines/DocEntry eq Orders/DocEntry and Orders/CardCode eq BusinessPartners/CardCode and Orders/DocumentLines/LineStatus eq 'bost_Open' and BusinessPartners/CardType eq 'cCustomer' and contains(BusinessPartners/CardCode , '${filterValues.CardCode}' ) and contains(Orders/DocumentLines/ItemCode,'${filterValues.ItemCode}')`,
        "QueryPath": "$crossjoin(BusinessPartners,Orders,Orders/DocumentLines,Items)"
    }
    const oDataSource = createODataSource2({ queryOptions });

    oDataSource.load()
        .then(
            (data) => {
            },
            (error) => {
                console.error("Error:", error);
            });
    return oDataSource;
};


export const odataQuery = createAsyncThunk(
    'odataQuery',
    async ({ filterValues }) => {
        const queryOptions = {
            "QueryOption": `$expand=BusinessPartners($select=CardCode,CardName),Orders/DocumentLines($select=ItemCode,ItemDescription,LineNum,DocEntry,Quantity)&$filter= Orders/DocEntry eq Orders/DocumentLines/DocEntry and Items/ItemCode eq Orders/DocumentLines/ItemCode and Orders/DocumentLines/DocEntry eq Orders/DocEntry and Orders/CardCode eq BusinessPartners/CardCode and Orders/DocumentLines/LineStatus eq 'bost_Open' and BusinessPartners/CardType eq 'cCustomer' and contains(BusinessPartners/CardCode , '${filterValues.CardCode}' ) and contains(Orders/DocumentLines/ItemCode,'${filterValues.ItemCode}') and contains(Orders/Reference1,'${filterValues.OrderNo}')`,
            "QueryPath": "$crossjoin(BusinessPartners,Orders,Orders/DocumentLines,Items)"
        }
        const headers = {
            'Content-Type': 'application/json',
            //  'Prefer': 'odata.maxpagesize=0'
        };
        // const queryOptions={
        //     "QueryOption": `$expand=BusinessPartners($select=CardCode,CardName),SML_SHP_HDR($select=DocEntry,DocNum),SML_SHP_HDR/SML_SHP_ITEMCollection($select=U_OrderNo,U_OrderLine),Orders($select=DocEntry, DocNum),Orders/DocumentLines($select=ItemCode,LineNum)&$filter=SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry and Orders/DocEntry eq Orders/DocumentLines/DocEntry and SML_SHP_HDR/SML_SHP_ITEMCollection/U_OrderNo eq Orders/DocumentLines/DocEntry and SML_SHP_HDR/SML_SHP_ITEMCollection/U_OrderLine eq Orders/DocumentLines/LineNum and Items/ItemCode eq Orders/DocumentLines/ItemCode and Orders/DocumentLines/DocEntry eq Orders/DocEntry and Orders/CardCode eq BusinessPartners/CardCode and Orders/DocumentLines/LineStatus eq 'bost_Open' and BusinessPartners/CardType eq 'cCustomer' and contains(BusinessPartners/CardCode , '${filterValues.CardCode}' ) and contains(Orders/DocumentLines/ItemCode,'${filterValues.ItemCode}')`,
        //     "QueryPath":"$crossjoin(SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection,BusinessPartners,Orders,Orders/DocumentLines,Items)"
        // }
        try {
            const request = await axios.post(`${hostName}/QueryService_PostQuery?$inlinecount=allpages'`, queryOptions, { headers: headers });
            const response = await request.data;
            return response;
        } catch (error) {
            console.error('Error creating SQL query:', error);
        }
    }
)
export const getPurchaseOrders = createAsyncThunk(
    'odataQuery',
    async ({ filterValues }) => {
        const queryOptions = {
            "QueryOption": `$expand=BusinessPartners($select=CardCode,CardName),PurchaseOrders/DocumentLines($select=ItemCode,ItemDescription,LineNum,DocEntry,Quantity)&$filter= PurchaseOrders/DocEntry eq PurchaseOrders/DocumentLines/DocEntry and Items/ItemCode eq PurchaseOrders/DocumentLines/ItemCode and PurchaseOrders/DocumentLines/DocEntry eq PurchaseOrders/DocEntry and PurchaseOrders/CardCode eq BusinessPartners/CardCode and PurchaseOrders/DocumentLines/LineStatus eq 'bost_Open' and BusinessPartners/CardType eq 'cSupplier' and contains(BusinessPartners/CardCode , '${filterValues.CardCode}' ) and contains(PurchaseOrders/DocumentLines/ItemCode,'${filterValues.ItemCode}') and contains(PurchaseOrders/Reference1,'${filterValues.OrderNo}')`,
            "QueryPath": "$crossjoin(BusinessPartners,PurchaseOrders,PurchaseOrders/DocumentLines,Items)"
        }
        const headers = {
            'Content-Type': 'application/json',
            //  'Prefer': 'odata.maxpagesize=0'
        };
        try {
            const request = await axios.post(`${hostName}/QueryService_PostQuery?$inlinecount=allpages'`, queryOptions, { headers: headers });
            const response = await request.data;
            return response;
        } catch (error) {
            console.error('Error creating SQL query:', error);
        }
    }
)


export const denemeQ = createAsyncThunk(
    'odataQuery2',
    async () => {

        try {
            const request = await axios.get(`${hostName}/$crossjoin(SML_LGT_HDR/SML_LGT_ITEMCollection,Items)?$apply=filter(SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode eq Items/ItemCode)/groupby((SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry,SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode))&$orderby=SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry`);
            const response = await request.data;
            return response;
        } catch (error) {
            console.error('Error creating SQL query:', error);
        }
    }
)
export const denemeQ2 = () => {
    const oDataStore = new ODataStore({
        url: `${hostName}/$crossjoin(SML_LGT_HDR/SML_LGT_ITEMCollection,Items)?$apply=filter(SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode eq Items/ItemCode)/groupby((SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry,SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode))&$orderby=SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry`,
        version: 4,
        withCredentials: true,
        filterToLower: false,

        onLoaded: () => { }
    });

    return new DataSource({
        store: oDataStore,
        paginate: true,
        pageSize: 10,
        requireTotalCount: true,
    });
};
export const filter = () => {
    const oDataSource = createODataSource();
    oDataSource.load();
    return oDataSource;
};
export const updateTradeFileNo = async ({ shipmentNo,tradeFileNo }) => {
    try {
        
        const response = await axios.get(`${querymanager}/updatetradefile`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                shipmentNo:shipmentNo,
                tradeFileNo:tradeFileNo
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
export const fetchFunc = async () => {
    const data = await fetch(`${hostName}/$crossjoin(SML_LGT_HDR/SML_LGT_ITEMCollection,Items)?$apply=filter(SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode eq Items/ItemCode)/groupby((SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry,SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode))`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            redirect: "follow",
            origin: "*"
        }
    );
    const json = await data.json();

    return json;
}

export const getShipmentDetails = async ({ filterValues }) => {
    let shipmentFilter = ""
    let logisticsFilter = ""
    let orderFilter = ""
    let statusFilter = ""
    let paymentStatusFilter = ""
    let typeFilter = ""
    if (filterValues.ShipmentNo) {
        shipmentFilter = `and SML_SHP_HDR/DocEntry eq ${parseInt(filterValues.ShipmentNo)}`
    }
    if (filterValues.LogisticsNo) {
        logisticsFilter = `and SML_LGT_HDR/DocEntry eq ${parseInt(filterValues.LogisticsNo)}`
    }
    if (filterValues.OrderNo) {
        orderFilter = `and SML_SHP_HDR/SML_SHP_ITEMCollection/U_OrderNo eq ${parseInt(filterValues.OrderNo)}`
    }
    if (filterValues.Status) {
        statusFilter = ` and SML_LGT_HDR/U_Status eq ${parseInt(filterValues.Status)}`
    }
    if (filterValues.PaymentStatus) {
        paymentStatusFilter = ` and SML_SHP_HDR/U_PaymentStatus eq ${parseInt(filterValues.PaymentStatus)}`
    }
    if (filterValues.Type) {
        typeFilter = ` and SML_SHP_HDR/U_Type eq ${parseInt(filterValues.Type)}`
    }

    let query = `/$crossjoin(BusinessPartners,BusinessPartners/BPAddresses,SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection,SML_LGT_HDR,SML_LGT_HDR/SML_LGT_ITEMCollection)
     ?$expand=
     BusinessPartners($select=CardCode),
     BusinessPartners/BPAddresses($select=Country,City),
     SML_SHP_HDR($select=U_Date,U_Type,U_DeliveryStatus,U_PalletQuantity,U_ContainerQuantity,U_TruckQuantity,U_PaymentStatus),
     SML_SHP_HDR/SML_SHP_ITEMCollection($select=U_Quantity,U_RemainingQty,U_ItemCode,U_ItemName,DocEntry,LineId,U_CardCode,U_CardName,U_OrderNo,U_OrderLine),
     SML_LGT_HDR($select=U_Status,U_VehicleDesc,U_PlateCode,U_DriverName,U_PalletQuantity,U_PalletCost),
     SML_LGT_HDR/SML_LGT_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_CardCode,U_ShipmentNo,U_ShipmentLine,U_Status,U_Quantity)
     &$filter=
     SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry and 
     SML_LGT_HDR/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry and 
     SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/U_ShipmentNo and 
     SML_SHP_HDR/SML_SHP_ITEMCollection/LineId eq SML_LGT_HDR/SML_LGT_ITEMCollection/U_ShipmentLine and
     SML_SHP_HDR/SML_SHP_ITEMCollection/U_CardCode eq BusinessPartners/CardCode and 
     BusinessPartners/CardCode eq BusinessPartners/BPAddresses/BPCode and 
     BusinessPartners/BPAddresses/AddressType eq 'bo_ShipTo' and
    contains(SML_SHP_HDR/SML_SHP_ITEMCollection/U_ItemCode , '${filterValues.ItemCode}') and
    contains(BusinessPartners/CardCode,'${filterValues.CardCode}') and
    (contains(BusinessPartners/BPAddresses/City, '${filterValues.City}') or BusinessPartners/BPAddresses/City eq null or '${filterValues.City}' eq '') and
    (contains(BusinessPartners/BPAddresses/County, '${filterValues.County}') or BusinessPartners/BPAddresses/County eq null or '${filterValues.County}' eq '') and
    (contains(SML_LGT_HDR/U_DriverName, '${filterValues.Driver}') or SML_LGT_HDR/U_DriverName eq null or '${filterValues.Driver}' eq '') and
    (contains(SML_LGT_HDR/U_PlateCode, '${filterValues.PlateCode}') or SML_LGT_HDR/U_PlateCode eq null or '${filterValues.PlateCode}' eq '') 
     ${shipmentFilter}   ${logisticsFilter}   ${orderFilter}  ${statusFilter} ${paymentStatusFilter} ${typeFilter}`;
    let allData = await fetchAllData(query);
    // return allData;
    const enrichedData = allData.map(item => (
        {
            ...item,
            RemainingQuantity: item["SML_SHP_HDR/SML_SHP_ITEMCollection"].U_Quantity - item["SML_LGT_HDR/SML_LGT_ITEMCollection"].U_Quantity,
            StatusDesc:
                item["SML_LGT_HDR"].U_Status === 1 ? "Beklemede" :
                    item["SML_LGT_HDR"].U_Status === 2 ? "Planlandı" :
                        item["SML_LGT_HDR"].U_Status === 3 ? "Araç Geldi" :
                            item["SML_LGT_HDR"].U_Status === 4 ? "Araç Yükleme" :
                                item["SML_LGT_HDR"].U_Status === 5 ? "Yüklendi" :
                                    item["SML_LGT_HDR"].U_Status === 6 ? "Teslim Edildi" :
                                        item["SML_LGT_HDR"].U_Status === 7 ? "Ödemesi Yapıldı" : "-",
            TypeDesc: item["SML_SHP_HDR"].U_Type === 1 ? "Satış" : "Alış",
            PaymentStatus: item["SML_SHP_HDR"].U_PaymentStatus === 1 ? "Ödenmedi" :
                item["SML_SHP_HDR"].U_PaymentStatus === 2 ? "Ödemesi Yapıldı" :
                    item["SML_SHP_HDR"].U_PaymentStatus === 3 ? "Kısmi Ödendi" : "-"
        }));
    return enrichedData;
}
export const getDetail = async ({ id }) => {
    const query = `/$crossjoin(SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection,SML_LGT_HDR,SML_LGT_HDR/SML_LGT_ITEMCollection)?$expand=SML_SHP_HDR($select=U_Date,U_Type,U_DeliveryStatus),SML_SHP_HDR/SML_SHP_ITEMCollection($select=U_Quantity,U_RemainingQty,U_ItemCode,U_ItemName,DocEntry,LineId,U_CardCode,U_CardName,U_OrderNo,U_OrderLine),SML_LGT_HDR($select=U_Status),SML_LGT_HDR/SML_LGT_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_CardCode,U_ShipmentNo,U_ShipmentLine,U_Status,U_Quantity)&$filter=SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry and SML_LGT_HDR/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry and SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/U_ShipmentNo and SML_SHP_HDR/SML_SHP_ITEMCollection/LineId eq SML_LGT_HDR/SML_LGT_ITEMCollection/U_ShipmentLine and SML_SHP_HDR/DocEntry eq ${id}`;
    return await fetchAllData(query);

}

export const getAllShipment = async ({ type }) => {
    const query = `/SML_SHP_HDR?$filter=U_Type eq ${type} and U_IsDeleted eq'N'`;
    return await fetchAllData(query);
};

export const getAllOpenItems = async ({ filterValues }) => {
    let dateFilter = "";
    if (filterValues.Date) {
        const date = new Date(filterValues.Date);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        dateFilter = `and Orders/DocDate eq '${formattedDate}' `;
    }
    const query = `/$crossjoin(BusinessPartners,Orders,Orders/DocumentLines,Items)?$expand=BusinessPartners($select=CardCode,CardName),Orders($select=DocDate,TransportationCode),Orders/DocumentLines($select=ItemCode,ItemDescription,LineNum,DocEntry,Quantity,Weight1,U_StokMiktari,WarehouseCode,U_PaletBrut,U_PaletNet,U_PaletSekli,U_PaletIcAdeti),Items($select=QuantityOnStock)&$filter=BusinessPartners/CardCode eq Orders/CardCode and Orders/DocEntry eq Orders/DocumentLines/DocEntry and Items/ItemCode eq Orders/DocumentLines/ItemCode and Orders/DocumentLines/LineStatus eq 'bost_Open' and BusinessPartners/CardType eq 'cCustomer' and contains(BusinessPartners/CardName, '${filterValues.CardName}') and contains(Orders/DocumentLines/ItemCode, '${filterValues.ItemCode}') and contains(Orders/Reference1, '${filterValues.OrderNo}') ${dateFilter} &$orderby= Orders/DocDate desc`;
    return await fetchAllData(query);
};

export const getOpenOrders = async ({ filterValues }) => {
    try {
        let formattedDate = "";
        if (filterValues.Date) {
            const date = new Date(filterValues.Date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }
        const response = await axios.get(`${querymanager}/getopenorders`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                cardName: filterValues.CardName,
                itemCode: filterValues.ItemCode,
                orderNo: filterValues.OrderNo,
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
export const getOpenPurchaseOrders = async ({ filterValues }) => {
    try {
        let formattedDate = "";
        if (filterValues.Date) {
            const date = new Date(filterValues.Date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
        }
        const response = await axios.get(`${querymanager}/getopenpurchaseorders`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                cardName: filterValues.CardName,
                itemCode: filterValues.ItemCode,
                orderNo: filterValues.OrderNo,
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
export const getTransportTypes = async () => {
    const query = `/ShippingTypes `
    return await fetchAllData(query);
}
export const getCountries = async () => {
    const query = `/Countries `
    return await fetchAllData(query);
}
export const getAllPurchaseOrders = async ({ filterValues }) => {
    const query = `/$crossjoin(BusinessPartners,PurchaseOrders,PurchaseOrders/DocumentLines,Items)?$expand=BusinessPartners($select=CardCode,CardName),PurchaseOrders/DocumentLines($select=ItemCode,ItemDescription,LineNum,DocEntry,Quantity,WarehouseCode)&$filter=BusinessPartners/CardCode eq PurchaseOrders/CardCode and PurchaseOrders/DocEntry eq PurchaseOrders/DocumentLines/DocEntry and Items/ItemCode eq PurchaseOrders/DocumentLines/ItemCode and PurchaseOrders/DocumentLines/LineStatus eq 'bost_Open' and BusinessPartners/CardType eq 'cSupplier' and contains(BusinessPartners/CardName, '${filterValues.CardName}') and contains(PurchaseOrders/DocumentLines/ItemCode, '${filterValues.ItemCode}') and contains(PurchaseOrders/Reference1, '${filterValues.OrderNo}') and PurchaseOrders/Confirmed eq 'tYES' and PurchaseOrders/U_SevPlnDahil eq 'Y'`;
    return await fetchAllData(query);
};
export const getIBAN = async ({ bankCode }) => {
    const query = `/HouseBankAccounts?$select=IBAN,AccNo&$filter=BankCode eq '${bankCode}'`
    return await fetchAllData(query);
}
export const selectAfterIban = async ({ bankCode, iban }) => {
    const query = `/HouseBankAccounts?$select=AccNo&$filter=BankCode eq '${bankCode}' and IBAN eq '${iban}'`
    return await fetchAllData(query);
}
export const selectAfterAccount = async ({ bankCode, account }) => {
    const query = `/HouseBankAccounts?$select=IBAN&$filter=BankCode eq '${bankCode}' and AccNo eq '${account}'`
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


export const createODataSource = () => {
    const oDataStore = new ODataStore({
        url: `${hostName}/$crossjoin(SML_LGT_HDR/SML_LGT_ITEMCollection,Items)?$apply=filter(SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode eq Items/ItemCode)/groupby((SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry,SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode))`,
        version: 4,
        withCredentials: true,
        filterToLower: false,

        onLoaded: () => {
            // Veri yüklendiğinde çalışacak fonksiyon
        },

        // Hata durumunda çalışacak fonksiyon
        errorHandler: (error) => {
            console.error('An error occurred during OData operation:', error);
            // Hata durumunda burada ek işlem yapabilirsiniz
            alert('Data loading failed. Please try again later.');
        }

    });

    return new DataSource({
        store: oDataStore,
        paginate: false,
        pageSize: 20,
        requireTotalCount: true,
        onLoadError: (error) => {
            console.error('An error occurred during data loading:', error);
            alert('An error occurred while loading the data.');
        }
    });
};
const shipmentSlice = createSlice({
    name: 'shipment',
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
                console.log(action.error.message);
                state.error = action.error.message;
            })
            .addCase(denemeQ.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            });
    }
});

export default shipmentSlice.reducer;
