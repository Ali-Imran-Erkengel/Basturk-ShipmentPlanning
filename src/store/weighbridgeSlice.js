import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { endpoint, hostName } from "../config/config";
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


export const driverVehicleInformation = createAsyncThunk(
    'odataQuery',
    async ({ id }) => {
        const queryOptions = {
            "QueryOption": `$expand=SML_BAS_VHL($select=U_Vehicle,U_PlateCode),SML_BAS_VHL/SML_VHL_DRVCollection($select=DocEntry,U_DriverId),SML_BAS_DRV($select=DocEntry,U_Name,U_MiddleName,U_Surname,U_CardCode)&$filter= SML_BAS_VHL/DocEntry eq SML_BAS_VHL/SML_VHL_DRVCollection/DocEntry and SML_BAS_VHL/SML_VHL_DRVCollection/U_DriverId eq SML_BAS_DRV/DocEntry and  SML_BAS_VHL/SML_VHL_DRVCollection/DocEntry eq ${id.id} &$ orderby=SML_BAS_VHL/SML_VHL_DRVCollection/DocEntry desc &$top=1`,
            "QueryPath": "$crossjoin(SML_BAS_VHL,SML_BAS_VHL/SML_VHL_DRVCollection,SML_BAS_DRV)"
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
export const documentTotal = createAsyncThunk(
    'odataQuery',
    async ({ id }) => {
        const queryOptions = {
            "QueryOption": `$expand=SML_BAS_VHL($select=U_Vehicle,U_PlateCode),SML_BAS_VHL/SML_VHL_DRVCollection($select=DocEntry,U_DriverId),SML_BAS_DRV($select=DocEntry,U_Name,U_MiddleName,U_Surname)&$filter= SML_BAS_VHL/DocEntry eq SML_BAS_VHL/SML_VHL_DRVCollection/DocEntry and SML_BAS_VHL/SML_VHL_DRVCollection/U_DriverId eq SML_BAS_DRV/DocEntry and  SML_BAS_VHL/SML_VHL_DRVCollection/DocEntry eq ${id.id} &$ orderby=SML_BAS_VHL/SML_VHL_DRVCollection/DocEntry desc &$top=1`,
            "QueryPath": "$crossjoin(SML_BAS_VHL,SML_BAS_VHL/SML_VHL_DRVCollection,SML_BAS_DRV)"
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
export const getDocTotal = async ({ id }) => {

    const request = await axios.get(`${hostName}/$crossjoin(SML_LGT_HDR/SML_LGT_ITEMCollection,Items)?$apply=filter(SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode eq Items/ItemCode and SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry eq ${id})/groupby((SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry),aggregate(Items(InventoryWeight with sum as total)))`);
    return request;
};
export const getShipmentType = async ({ logisticNo }) => {

    const request = await axios.get(`${hostName}/$crossjoin(SML_SHP_HDR,SML_LGT_HDR,SML_LGT_HDR/SML_LGT_ITEMCollection,SML_WGHB_HDR,Items)?$expand=SML_SHP_HDR($select=DocEntry,U_ShipmentType),SML_LGT_HDR($select=U_OcrdNo,U_Amount),SML_LGT_HDR/SML_LGT_ITEMCollection($select=U_ItemCode,U_CardCode),Items($select=ItemCode,U_YurticiNakliye,U_YurtdisiNakliye)&$filter=SML_WGHB_HDR/U_LogisticsNo eq SML_LGT_HDR/DocEntry and SML_LGT_HDR/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry and SML_LGT_HDR/SML_LGT_ITEMCollection/U_ShipmentNo eq SML_SHP_HDR/DocEntry and SML_LGT_HDR/SML_LGT_ITEMCollection/U_ItemCode eq Items/ItemCode and SML_LGT_HDR/DocEntry eq ${logisticNo}`);
    debugger
    return request;
};
export const getTradeFileNo = async ({ logisticNo }) => {

    const request = await axios.get(`${hostName}/$crossjoin(SML_LGT_HDR,SML_LGT_HDR/SML_LGT_ITEMCollection)?$expand=SML_LGT_HDR/SML_LGT_ITEMCollection($select=U_TradeFileNo,U_ItemCode)&$filter= SML_LGT_HDR/DocEntry eq SML_LGT_HDR/SML_LGT_ITEMCollection/DocEntry and SML_LGT_HDR/DocEntry eq ${logisticNo}`);
    return request;
};
export const isClosedOrder = async ({ orderNo }) => {
    const request = await axios.get(`${hostName}/PurchaseOrders?$filter=  DocEntry eq ${orderNo} and DocumentStatus eq 'bost_Open'`);
    return request;
};
export const isExistsPO = async ({ logisticNo }) => {
    debugger
    const request = await axios.get(`${hostName}/PurchaseOrders?$filter=U_LogisticNo eq ${logisticNo}`);
    debugger
    return request;
};
export const getAllLogistics = async ({ filterValues }) => {
    const query = `/SML_LGT_HDR?$filter=U_Status eq 2 and U_Type eq ${filterValues.Type}`
    debugger
    return await fetchAllData(query);
}
export const getAllWgh = async () => {
    const query = `/SML_WGHB_HDR `
    return await fetchAllData(query);
}
export const exportExcelWhgData = async ({ filterValues }) => {
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
export const getLoadingRamps = async () => {
    const query = `/SML_LDN_RMP?$filter=(U_IsDeleted eq 'N')`
    return await fetchAllData(query);
}
export const printWghReport = async ({ wghId }) => {
    try {
        const response = await axios.get('http://10.10.1.2:4909/viewcrystalwgh', {
            params: { wghId: wghId },
            responseType: 'blob', // Yanıtı blob olarak alıyoruz
        });

        if (response.data instanceof Blob) {
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob); // Blob URL'sini oluştur
            window.open(url, '_blank');
            //             const link = document.createElement('a'); // Link elementini oluştur
            //             const today = new Date();
            // const dateString = today.toLocaleString();
            //             link.href = url;
            //             link.download = `Kantar Fisi ${dateString}.pdf`;
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
export const fetchWghData = async () => {

    try {
        const response = await axios.get('http://192.168.0.110:4909/getwgh'); // API URL'si
        return response.data; // Seri port verisini kaydet
    } catch (error) {
        console.error("Veri alınırken bir hata oluştu:", error);
        return 'Veri alınırken bir hata oluştu' // Hata mesajını set et
    }
};
let lastValue = "";
let isReading = true;
let currentPort = null;
let currentReader = null;
let currentReadableStreamClosed = null;

export const closeSerialPort = async () => {
    try {
        if (currentPort) {
            isReading = false; // Okuma döngüsünü durdur

            // Reader'ı temizle
            if (currentReader) {
                await currentReader.cancel();
                currentReader.releaseLock();
                currentReader = null;
            }

            // Stream'i temizle
            if (currentReadableStreamClosed) {
                await currentReadableStreamClosed.catch(() => { /* İptal hatalarını yok say */ });
            }

            // Portu kapat
            await currentPort.close();
            currentPort = null;
            console.log("Port başarıyla kapatıldı.");
        } else {
            console.log("Kapatılacak açık port bulunmuyor.");
        }
    } catch (error) {
        console.error("Port kapatılırken hata oluştu:", error);
    }
};
export const connectToSerialPort = async ({ setField }) => {
    try {
        console.log("Veri alınmaya çalışılıyor...");

        // Veri çekme işlemi
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:4909/serial-data");

                if (!response.ok) {
                    throw new Error("Sunucudan veri alınırken bir hata oluştu.");
                }

                const data = await response.json();
                if (data && data.data) {
                    console.log("Gelen Veri:", data.data);

                    // Veriyi işleyelim ve gerekli kısmı alalım
                    const rawData = data.data;

                    // Veriyi işleyerek sadece istediğimiz kısmı alıyoruz
                    // const startMarker = "☻!10 ";
                    // const endMarker = " 000000♥►";
                    // const startIndex = rawData.indexOf(startMarker);
                    // const endIndex = rawData.indexOf(endMarker);
                    setField.current.value = rawData;
                    lastValue = rawData;

                    // if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                    //     // Veri arası kısmı alıyoruz
                    //     const extractedData = rawData.substring(startIndex + startMarker.length, endIndex).trim();
                    //     console.log("Çıkarılan Veri:", extractedData);

                    //     // Veriyi al ve ilgili alana atad
                    // } else {
                    //     console.log("Beklenen veri formatı bulunamadı.");
                    // }
                } else {
                    console.log("Sunucudan herhangi bir veri gelmedi.");
                }
            } catch (error) {
                console.error("Veri alınırken bir hata oluştu:", error);
            }
        };

        // 1 saniyede bir veri çekmek için interval ayarlıyoruz
        const intervalId = setInterval(fetchData, 1000); // 1 saniye arayla fetchData çağrılır

        // Component unmount olduğunda interval'ı temizliyoruz
        return () => clearInterval(intervalId);

    } catch (error) {
        console.error("Seri port bağlantısında bir hata oluştu:", error);
    }

};

export const connectToSerialPort1 = async ({ setField }) => {
    try {
        if (currentPort) {
            console.log("Zaten açık bir port bağlantısı var.");
            return;
        }

        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        currentPort = port;
        isReading = true;

        console.log("Bağlantı başarılı! Veriler alınıyor...");

        const textDecoder = new TextDecoderStream();
        currentReadableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        currentReader = textDecoder.readable.getReader();

        let buffer = "";
        while (isReading) {
            try {
                const { value, done } = await currentReader.read();
                if (done || !isReading) {
                    console.log("Okuma işlemi tamamlandı.");
                    break;
                }

                if (value) {
                    buffer += value;
                    ////özel karakterli 
                    while (buffer.includes("☻!10 ") && buffer.includes(" 000000♥►")) {
                        const startIndex = buffer.indexOf("☻!10 ");
                        const endIndex = buffer.indexOf(" 000000♥►", startIndex);
                        ///güvenli yöntem
                        // while (buffer.includes("<STX>") && buffer.includes("<ETX>")) {
                        //     const startIndex = buffer.indexOf("<STX>");
                        //     const endIndex = buffer.indexOf("<ETX>", startIndex);



                        if (endIndex > startIndex) {
                            const packet = buffer.substring(startIndex + 5, endIndex);
                            lastValue = packet;
                            console.log("Gelen Paket:", packet);

                            buffer = buffer.slice(endIndex + 1);
                            setField.current.value = lastValue;
                        } else {
                            break;
                        }
                    }
                }
            } catch (error) {
                if (!isReading) {
                    console.log("Okuma işlemi kullanıcı tarafından durduruldu.");
                    break;
                }
                console.error("Veri okuma hatası:", error);
                break;
            }
        }

    } catch (error) {
        console.error("Seri porta bağlanırken bir hata oluştu:", error);
    }
};
export const showLastValue = () => {
    if (lastValue) {
        console.log("Son Değer:", Number(lastValue));
        return Number(lastValue);
    } else {
        console.log("Değer alınamadı");
    }
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
const weighbridgeSlice = createSlice({
    name: 'weighbridge',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(driverVehicleInformation.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(driverVehicleInformation.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.error.message;
            });
    }
});





export default weighbridgeSlice.reducer;
