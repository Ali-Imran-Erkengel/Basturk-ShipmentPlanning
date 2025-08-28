import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { hostName, querymanager } from "../config/config";
import notify from "devextreme/ui/notify";
const types = ['error', 'info', 'success', 'warning'];
axios.defaults.withCredentials = true;
export let initialState = {
    data: [],
    loading: false,
    error: null,
    tableName: '',
    tableKey: ''

}
export const printShipmentDetail = async ({ beginDate, endDate, cardName, customDocNum, plateCode, type }) => {
    try {
        debugger
        const response = await axios.get('http://10.44.10.4:4909/viewcrystalshipmentdetail', {
            params: {
                beginDate: beginDate,
                endDate: endDate,
                cardName: cardName,
                customDocNum: customDocNum,
                plateCode: plateCode,
                type: type
            },
            responseType: 'blob',
        });

        if (response.data instanceof Blob) {

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
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

export const printShippingArchive = async ({ beginDate, endDate, cardCode, cardName, customDocNum, deliveryStatus, invoiceStatus, paymentStatus, plateCode, driverName }) => {
    try {
        debugger
        const response = await axios.get('http://10.44.10.4:4909/ViewCrystalShipArchive', {
            params: {
                beginDate: beginDate,
                endDate: endDate,
                cardCode: cardCode,
                cardName: cardName,
                customDocNum: customDocNum,
                deliveryStatus: deliveryStatus,
                invoiceStatus: invoiceStatus,
                paymentStatus: paymentStatus,
                plateCode: plateCode,
                driverName: driverName
            },
            responseType: 'blob',
        });

        if (response.data instanceof Blob) {

            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
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
export const getVehicleWaiting = async ({ reportFilterValues, status, type }) => {
    return await sendRequest({ type: type, status: status, reportFilterValues: reportFilterValues, endpoint: 'getvehiclecoming' })

}
export const getLoadedVehicle = async ({ reportFilterValues, status, type }) => {
    return await sendRequest({ type: type, status: status, reportFilterValues: reportFilterValues, endpoint: 'getvehicleinside' })
}
export const getFirstWghVehicle = async ({ reportFilterValues, status, type }) => {
    return await sendRequest({ type: type, status: status, reportFilterValues: reportFilterValues, endpoint: 'getvehicleinside' })
    let beginDate = reportFilterValues.BeginDate ? reportFilterValues.BeginDate : new Date('01/01/1975');
    let endDate = reportFilterValues.EndDate ? reportFilterValues.EndDate : new Date();
    const bdate = new Date(beginDate);
    const byear = bdate.getFullYear();
    const bmonth = String(bdate.getMonth() + 1).padStart(2, '0');
    const bday = String(bdate.getDate()).padStart(2, '0');
    const formattedbDate = `${byear}-${bmonth}-${bday}`
    const edate = new Date(endDate);
    const eyear = edate.getFullYear();
    const emonth = String(edate.getMonth() + 1).padStart(2, '0');
    const eday = String(edate.getDate()).padStart(2, '0');
    const formattedeDate = `${eyear}-${emonth}-${eday}`
    let dateFilter = `and SML_LGT_HDR/U_Date ge '${formattedbDate}' and SML_LGT_HDR/U_Date le '${formattedeDate}'`
    let query = `/$crossjoin(SML_LGT_HDR,SML_WGHB_HDR,BusinessPartners,BusinessPartners/BPAddresses,SML_BAS_VHL,SML_BAS_DRV)?$expand=
    SML_LGT_HDR($select=DocEntry,U_CustomDocNum,U_Date, U_Status,U_PlateCode,U_DriverName,U_PalletCost,U_DriverNo,U_VehicleNo,U_PlateCode,U_PaymentStatus),
    SML_WGHB_HDR($select=DocEntry,U_SecondWghDone),
    SML_BAS_VHL($select=U_Vehicle),
    SML_BAS_DRV($select=U_CardName,U_Phone1),
    BusinessPartners($select=CardName),
    BusinessPartners/BPAddresses($select=Country,City,County),SML_BAS_VHL($select=U_PlateCode,U_VehicleCode)
    &$filter=  SML_LGT_HDR/U_Status eq ${status} and
    SML_LGT_HDR/U_Type eq ${type} and
    SML_WGHB_HDR/U_LogisticsNo eq SML_LGT_HDR/DocEntry and
    SML_LGT_HDR/U_VehicleNo eq SML_BAS_VHL/DocEntry and
    SML_LGT_HDR/U_DriverNo eq SML_BAS_DRV/DocEntry and
    SML_LGT_HDR/U_OcrdNo eq BusinessPartners/CardCode and
    BusinessPartners/CardCode eq BusinessPartners/BPAddresses/BPCode and
    BusinessPartners/BPAddresses/AddressType eq 'bo_ShipTo' ${dateFilter}`
    return await fetchAllData(query);
}
export const getShipmentHeader = async ({ reportFilterValues, type }) => {
    return await sendRequest({ type: type, reportFilterValues: reportFilterValues, endpoint: 'getshipmentheader' })
}

const sendRequest = async ({ type, status, reportFilterValues, endpoint }) => {

    let beginDate = reportFilterValues.BeginDate ? reportFilterValues.BeginDate : new Date('01/01/1975');
    let endDate = reportFilterValues.EndDate ? reportFilterValues.EndDate : new Date();
    let cardName = reportFilterValues.CardName ? reportFilterValues.CardName : '';
    let plateCode = reportFilterValues.PlateCode ? reportFilterValues.PlateCode : '';
    let customDocNum = reportFilterValues.CustomDocNum ? reportFilterValues.CustomDocNum : '';
    const bdate = new Date(beginDate);
    const byear = bdate.getFullYear();
    const bmonth = String(bdate.getMonth() + 1).padStart(2, '0');
    const bday = String(bdate.getDate()).padStart(2, '0');
    const formattedbDate = `${byear}${bmonth}${bday}`
    const edate = new Date(endDate);
    const eyear = edate.getFullYear();
    const emonth = String(edate.getMonth() + 1).padStart(2, '0');
    const eday = String(edate.getDate()).padStart(2, '0');
    const formattedeDate = `${eyear}${emonth}${eday}`
    try {
        const response = await axios.get(`${querymanager}/${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                type: type,
                status: status,
                beginDate: formattedbDate,
                endDate: formattedeDate,
                cardName: cardName,
                customDocNum: customDocNum,
                plateCode: plateCode
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
export const getShipmentWaiting = async ({ reportFilterValues, type }) => {
    return await sendRequest({ type: type, status: '0', reportFilterValues: reportFilterValues, endpoint: 'getshipmentitem' })
}
export const getLogisticHeader = async ({ reportFilterValues, type }) => {
    return await sendRequest({ type: type, status: '0', reportFilterValues: reportFilterValues, endpoint: 'getlogisticheader' })

    let beginDate = reportFilterValues.BeginDate ? reportFilterValues.BeginDate : new Date('01/01/1975');
    let endDate = reportFilterValues.EndDate ? reportFilterValues.EndDate : new Date();
    const bdate = new Date(beginDate);
    const byear = bdate.getFullYear();
    const bmonth = String(bdate.getMonth() + 1).padStart(2, '0');
    const bday = String(bdate.getDate()).padStart(2, '0');
    const formattedbDate = `${byear}-${bmonth}-${bday}`
    const edate = new Date(endDate);
    const eyear = edate.getFullYear();
    const emonth = String(edate.getMonth() + 1).padStart(2, '0');
    const eday = String(edate.getDate()).padStart(2, '0');
    const formattedeDate = `${eyear}-${emonth}-${eday}`
    let dateFilter = `and SML_LGT_HDR/U_Date ge '${formattedbDate}' and SML_LGT_HDR/U_Date le '${formattedeDate}'`
    let query = `/$crossjoin(SML_LGT_HDR,BusinessPartners,BusinessPartners/BPAddresses,SML_BAS_VHL,SML_BAS_DRV)?$expand=
    SML_LGT_HDR($select=DocEntry,U_CustomDocNum,U_Date, U_Status,U_VehicleDesc,U_PlateCode,U_DriverName,U_PalletQuantity,U_PalletCost,U_PaymentStatus,),
    SML_BAS_DRV($select=U_Phone1,U_CardName),
    SML_BAS_VHL($select=U_PlateCode,U_VehicleCode),
    BusinessPartners($select=CardName),
    BusinessPartners/BPAddresses($select=Country,City,County)
    &$filter=
    SML_LGT_HDR/U_Status eq 2 and
    SML_LGT_HDR/U_Type eq ${type} and
    SML_LGT_HDR/U_OcrdNo eq BusinessPartners/CardCode and
    SML_LGT_HDR/U_DriverNo eq SML_BAS_DRV/DocEntry and
    SML_LGT_HDR/U_VehicleNo eq SML_BAS_VHL/DocEntry and
    BusinessPartners/CardCode eq BusinessPartners/BPAddresses/BPCode and
    BusinessPartners/BPAddresses/AddressType eq 'bo_ShipTo' ${dateFilter}`
    return await fetchAllData(query);
}
export const getLogisticItems = async () => {
    let query = `/SML_LGT_HDR?$select=SML_LGT_ITEMCollection`
    return await fetchAllData(query);
}
export const getLogisticWaiting = async ({ reportFilterValues, type }) => {
    return await sendRequest({ type: type, status: '0', reportFilterValues: reportFilterValues, endpoint: 'getlogisticitem' })

    let query = `/$crossjoin(SML_LGT_HDR,SML_LGT_HDR/SML_LGT_ITEMCollection,BusinessPartners,BusinessPartners/BPAddresses)?$expand=
    SML_LGT_HDR($select=DocEntry,U_Date, U_Status,U_VehicleDesc,U_PlateCode,U_DriverName,U_PalletQuantity,U_PalletCost),
    SML_LGT_HDR/SML_LGT_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_ItemName,U_CardCode,U_CardName,U_ShipmentNo,U_ShipmentLine,U_Status,U_Quantity,U_TradeFileNo),
    BusinessPartners($select=CardName),
    BusinessPartners/BPAddresses($select=Country,City,County)
    &$filter=
    SML_LGT_HDR/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry and
    SML_LGT_HDR/U_Status eq 2 and
    SML_LGT_HDR/U_Type eq ${type} and
    SML_LGT_HDR/SML_LGT_ITEMCollection/U_Status eq 2 and
    SML_LGT_HDR/U_OcrdNo eq BusinessPartners/CardCode and
    BusinessPartners/CardCode eq BusinessPartners/BPAddresses/BPCode and
    BusinessPartners/BPAddresses/AddressType eq 'bo_ShipTo'
   `
    return await fetchAllData(query);
}
export const getComingVehicleDetail = async ({ reportFilterValues, type }) => {
    return await sendRequest({ type: type, status: '0', reportFilterValues: reportFilterValues, endpoint: 'getvehiclecomingitems' })

    let query = `/$crossjoin(SML_LGT_HDR,SML_LGT_HDR/SML_LGT_ITEMCollection,BusinessPartners,BusinessPartners/BPAddresses)?$expand=
    SML_LGT_HDR($select=DocEntry,U_Date, U_Status,U_VehicleDesc,U_PlateCode,U_DriverName,U_PalletQuantity,U_PalletCost),
    SML_LGT_HDR/SML_LGT_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_ItemName,U_CardCode,U_CardName,U_ShipmentNo,U_ShipmentLine,U_Status,U_Quantity,U_TradeFileNo),
    BusinessPartners($select=CardName),
    BusinessPartners/BPAddresses($select=Country,City,County)
    &$filter=
    SML_LGT_HDR/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry and
    SML_LGT_HDR/U_Status eq 2 and
    SML_LGT_HDR/U_Type eq ${type} and
    SML_LGT_HDR/SML_LGT_ITEMCollection/U_Status eq 2 and
    SML_LGT_HDR/U_OcrdNo eq BusinessPartners/CardCode and
    BusinessPartners/CardCode eq BusinessPartners/BPAddresses/BPCode and
    BusinessPartners/BPAddresses/AddressType eq 'bo_ShipTo'
   `
    return await fetchAllData(query);
}
export const getLoadedDetails = async ({ reportFilterValues, type, status }) => {
    return await sendRequest({ type: type, status: status, reportFilterValues: reportFilterValues, endpoint: 'getvehicleloaded' })
    let query = `/$crossjoin(SML_LGT_HDR,SML_LGT_HDR/SML_
    LGT_ITEMCollection)?$expand=
    SML_LGT_HDR($select=DocEntry,U_Date, U_Status,U_VehicleDesc,U_PlateCode,U_DriverName,U_PalletQuantity,U_PalletCost),
    SML_LGT_HDR/SML_LGT_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_ItemName,U_CardCode,U_CardName,U_ShipmentNo,U_ShipmentLine,U_Status,U_Quantity,U_TradeFileNo),
    &$filter=
    SML_LGT_HDR/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry and
    SML_LGT_HDR/U_Status eq 6 and
    SML_LGT_HDR/U_Type eq ${type} and
    SML_LGT_HDR/SML_LGT_ITEMCollection/U_Status eq 2
   `
    return await fetchAllData(query);
}
export const getShipmentItemNonPlanned = async ({ id, type }) => {
    try {
        const response = await axios.get(`${querymanager}/getshipmentnonplanneditem`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                shipmentId: id,
                type: type
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

    let query = `/$crossjoin(SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection)?$expand=
    SML_SHP_HDR/SML_SHP_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_ItemName,U_CardCode,U_CardName,U_OrderNo,U_OrderLine,U_DeliveryStatus,U_PalletQuantity,U_Quantity,U_Weight,U_Price,U_WhsCode),
    &$filter=
    SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry and
    SML_SHP_HDR/SML_SHP_ITEMCollection/U_DeliveryStatus eq 1 and
    SML_SHP_HDR/DocEntry eq ${id}
   `
    return await fetchAllData(query);
}
export const getShippincArchive = async ({ archiveFilterValues }) => {
    let beginDate = archiveFilterValues.BeginDate ? archiveFilterValues.BeginDate : new Date('01/01/1975');
    let endDate = archiveFilterValues.EndDate ? archiveFilterValues.EndDate : new Date();
    let ShippingCardName = archiveFilterValues.ShippingCardName;
    let ShippingCardCode = archiveFilterValues.ShippingCardCode;
    const bdate = new Date(beginDate);
    const byear = bdate.getFullYear();
    const bmonth = String(bdate.getMonth() + 1).padStart(2, '0');
    const bday = String(bdate.getDate()).padStart(2, '0');
    const formattedbDate = `${byear}-${bmonth}-${bday}`
    const edate = new Date(endDate);
    const eyear = edate.getFullYear();
    const emonth = String(edate.getMonth() + 1).padStart(2, '0');
    const eday = String(edate.getDate()).padStart(2, '0');
    const formattedeDate = `${eyear}-${emonth}-${eday}`


    try {


        const response = await axios.get(`${querymanager}/shippingarchive`, {
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            withCredentials: true,
            params: {
                customDocNum: archiveFilterValues.CustomDocNum,
                driverName: encodeURIComponent(archiveFilterValues.DriverName),
                plateCode: archiveFilterValues.PlateCode,
                deliveryStatus: archiveFilterValues.DeliveryStatus,
                paymentStatus: archiveFilterValues.PaymentStatus,
                invoiceStatus: archiveFilterValues.InvoiceStatus,
                beginDate: formattedbDate,
                endDate: formattedeDate,
                cardName: encodeURIComponent(ShippingCardName),
                cardCode: ShippingCardCode
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
export const exportExcelShippingArchiveData = async ({ filterValues }) => {
    let dateFilter = "";
    let logisticFilter = "";
    let wghTypeFilter = "";
    let startDate = "1975-01-01";
    let endDate = "2075-12-31";
    if (filterValues.startDate) {
        const date = new Date(filterValues.startDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        startDate = formattedDate;
        dateFilter = `and U_TransactionDate eq '${formattedDate}' `;
    }
    if (filterValues.endDate) {
        const date = new Date(filterValues.endDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        endDate = formattedDate;
        dateFilter = `and U_TransactionDate eq '${formattedDate}' `;
    }
    dateFilter = `and U_TransactionDate ge '${startDate}' and U_TransactionDate le '${endDate}'`;
    if (filterValues.U_LogisticsNo) {
        logisticFilter = `and U_LogisticsNo eq ${filterValues.U_LogisticsNo}`
    }
    if (filterValues.U_WghType) {
        wghTypeFilter = `and U_WghType eq ${filterValues.U_WghType}`
    }
    const query = `/SML_WGHB_HDR?$filter= contains(U_Description, '${filterValues.U_Description}') ${dateFilter} ${logisticFilter} ${wghTypeFilter}`
    debugger
    return await fetchAllData(query);
}
export const getShipmentDetails = async ({ filterValues }) => {
    let shipmentFilter = ""
    let logisticsFilter = ""
    let orderFilter = ""
    let statusFilter = ""
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
    if (filterValues.Type) {
        typeFilter = ` and SML_SHP_HDR/U_Type eq ${parseInt(filterValues.Type)}`
    }
    let query =
        `/$crossjoin(BusinessPartners,BusinessPartners/BPAddresses,SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection,SML_LGT_HDR,SML_LGT_HDR/SML_LGT_ITEMCollection)
     ?$expand=
     BusinessPartners($select=CardCode),
     BusinessPartners/BPAddresses($select=Country,City,County),
     SML_SHP_HDR($select=U_Date,U_Type,U_DeliveryStatus,U_PalletQuantity,U_ContainerQuantity),
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
     ${shipmentFilter}   ${logisticsFilter}   ${orderFilter}  ${statusFilter} ${typeFilter}`;
    const allData = await fetchAllData(query);

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
            TypeDesc: item["SML_SHP_HDR"].U_Type === 1 ? "Satış" : "Alış"
        }));
    return enrichedData;
}
export const getDetail = async ({ id }) => {
    const query = `/$crossjoin(SML_SHP_HDR,SML_SHP_HDR/SML_SHP_ITEMCollection,SML_LGT_HDR,SML_LGT_HDR/SML_LGT_ITEMCollection)?$expand=SML_SHP_HDR($select=U_Date,U_Type,U_DeliveryStatus),SML_SHP_HDR/SML_SHP_ITEMCollection($select=U_Quantity,U_RemainingQty,U_ItemCode,U_ItemName,DocEntry,LineId,U_CardCode,U_CardName,U_OrderNo,U_OrderLine),SML_LGT_HDR($select=U_Status),SML_LGT_HDR/SML_LGT_ITEMCollection($select=DocEntry,LineId,U_ItemCode,U_CardCode,U_ShipmentNo,U_ShipmentLine,U_Status,U_Quantity)&$filter=SML_SHP_HDR/DocEntry eq SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry and SML_LGT_HDR/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry and SML_SHP_HDR/SML_SHP_ITEMCollection/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/U_ShipmentNo and SML_SHP_HDR/SML_SHP_ITEMCollection/LineId eq SML_LGT_HDR/SML_LGT_ITEMCollection/U_ShipmentLine and SML_SHP_HDR/DocEntry eq ${id}`;
    return await fetchAllData(query);

}

export const getAllShipment = async () => {
    const query = `/SML_SHP_HDR`;
    return await fetchAllData(query);
};

export const getAllOpenItems = async ({ filterValues }) => {
    const query = `/$crossjoin(BusinessPartners,Orders,Orders/DocumentLines,Items)?$expand=BusinessPartners($select=CardCode,CardName),Orders/DocumentLines($select=ItemCode,ItemDescription,LineNum,DocEntry,Quantity)&$filter=BusinessPartners/CardCode eq Orders/CardCode and Orders/DocEntry eq Orders/DocumentLines/DocEntry and Items/ItemCode eq Orders/DocumentLines/ItemCode and Orders/DocumentLines/LineStatus eq 'bost_Open' and BusinessPartners/CardType eq 'cCustomer' and contains(BusinessPartners/CardCode, '${filterValues.CardCode}') and contains(Orders/DocumentLines/ItemCode, '${filterValues.ItemCode}') and contains(Orders/Reference1, '${filterValues.OrderNo}')`;
    return await fetchAllData(query);
};

export const getAllPurchaseOrders = async ({ filterValues }) => {
    const query = `/$crossjoin(BusinessPartners,PurchaseOrders,PurchaseOrders/DocumentLines,Items)?$expand=BusinessPartners($select=CardCode,CardName),PurchaseOrders/DocumentLines($select=ItemCode,ItemDescription,LineNum,DocEntry,Quantity)&$filter=BusinessPartners/CardCode eq PurchaseOrders/CardCode and PurchaseOrders/DocEntry eq PurchaseOrders/DocumentLines/DocEntry and Items/ItemCode eq PurchaseOrders/DocumentLines/ItemCode and PurchaseOrders/DocumentLines/LineStatus eq 'bost_Open' and BusinessPartners/CardType eq 'cSupplier' and contains(BusinessPartners/CardCode, '${filterValues.CardCode}') and contains(PurchaseOrders/DocumentLines/ItemCode, '${filterValues.ItemCode}') and contains(PurchaseOrders/Reference1, '${filterValues.OrderNo}') and PurchaseOrders/Confirmed eq 'tYES'`;
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

            // Append current page data
            if (Array.isArray(jsonResponse.value)) {
                allData = allData.concat(jsonResponse.value);
            } else {
                allData.push(jsonResponse);
            }

            // Store the next page link if available
            nextLink = jsonResponse["@odata.nextLink"];
        } catch (error) {
            console.error("Data fetch error:", error);
        }
    };

    // Start fetching from the base URL with any filters
    await fetchData(`${hostName}${query}`);

    // Loop to fetch all pages
    let counter = 0;
    while (nextLink && counter < 100) {
        counter++;
        await fetchData(`${hostName}/` + nextLink);
    }

    return allData;
};
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
export const updateStatusAndUploadFile = async ({ logisticsId }) => {
    try {
        const response = await axios.get(`${querymanager}/updatestatusanduploadfile`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                logisticId: logisticsId
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
export const downloadFile = async ({ fileId, fileName }) => {
    try {
        const response = await axios.get(`${querymanager}/downloadfile`, {
            responseType: 'blob',
            withCredentials: true,
            params: {
                logisticId: fileId,
            },
        });
        debugger
        if (response.status !== 200) {
            handleNotify({ message: "Doküman İndirme Başarısız Oldu", type: "error" })
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentDisposition = response.headers['content-disposition'];
        let finalFileName = fileName || 'downloaded_file';
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch && fileNameMatch.length === 2) finalFileName = fileNameMatch[1];
        }

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', finalFileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        handleNotify({ message: `Doküman İndirme Başarısız Oldu ${error}`, type: "error" })
        console.error('Download error:', error);
    }
};
export const uploadDocument = async (rowData, file) => {
    debugger
    const logisticsId = rowData.DocEntry;
    const formData = new FormData();
    formData.append('logisticId', logisticsId);
    formData.append('file', file);
    try {
        const response = await axios.post(`${querymanager}/uploaddocument`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });
        if (response.status === 200) {
            handleNotify({ message: "Doküman Başarılı Bir Şekilde Yüklendi", type: "success" })
            return response;
        } else {
            handleNotify({ message: "Doküman Yükleme Başarısız Oldu", type: "error" })

        }
    } catch (error) {
        handleNotify({ message: `API Kaynaklı Hata ${error}`, type: "error" })
        console.error(error);
    }
};
export const openDocument = async ({ logisticId }) => {
    try {
        const response = await axios.get(`${querymanager}/getdocpath`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
            params: {
                logisticId: logisticId
            }
        });
        const jsonArray = JSON.parse(response.data);
        return jsonArray;
    } catch (error) {
        handleNotify({ message: `API İsteğinde Hata: ${error}`, type: "error" })
        if (error.response) {
            console.error('Durum kodu:', error.response.status);
            console.error('Yanıt içeriği:', error.response.data);
        }
    }
};
const detailReportSlice = createSlice({
    name: 'shipment',
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

export default detailReportSlice.reducer;
