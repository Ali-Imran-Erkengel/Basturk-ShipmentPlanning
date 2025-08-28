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

export const getStatuses = async () => {

    const request = await axios.get(`${hostName}/SML_LGT_HDR?$apply=groupby((U_Status), aggregate($count as Count))`);
    const response = await request.data;
    return response.value;
}
export const getLogistics = async () => {
    let query = `/SML_LGT_HDR?$select=U_PalletCost,U_Date`;
    return await fetchAllData( query);
}
export const getLoadTomorrow=async()=>{
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const isoDate = tomorrow.toISOString(); 
    const localDate = new Date(isoDate);
    const offset = 3; // Example: GMT+3
    localDate.setHours(localDate.getHours() + offset);
    let day= localDate.toISOString().replace('Z', '+03:00');
    let query=`/SML_LGT_HDR?$filter=U_Date eq '${day}'`
    return await fetchAllData( query);
}
export const getLoadToday=async()=>{
    const today = new Date();
    const tomorrow = new Date(today);
    const isoDate = tomorrow.toISOString(); 
    const localDate = new Date(isoDate);
    const offset = 3; // Example: GMT+3
    localDate.setHours(localDate.getHours() + offset);
    let day= localDate.toISOString().replace('Z', '+03:00');
    let query=`/SML_LGT_HDR?$filter=U_Date eq '${day}'`
    return await fetchAllData( query);
}
const fetchAllData = async ( query = '') => {
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
const dashboardSlice = createSlice({
    name: 'logistics',
    initialState,
    extraReducers: (builder) => {

    }
});





export default dashboardSlice.reducer;
