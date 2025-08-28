import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { hostName, querymanager } from "../config/config";
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


export const addData = createAsyncThunk(
    'addData',
    async ({ tableName, formData }) => {
        const request = await axios.post(`${hostName}/${tableName}`, formData);


        const response = await request.data.value;
        sessionStorage.setItem('app', JSON.stringify(response));
        return request;
    }
);

export const getItemById = createAsyncThunk(
    'getDataById',
    async ({ tableName, id }) => {
        const request = await axios.get(`${hostName}/${tableName}(${id})`);
        const response = await request.data;
        return response;
    }
);

export const updateData = createAsyncThunk(
    'updateData',
    async ({ tableName, id, updatedData }) => {
        const request = await axios.patch(`${hostName}/${tableName}(${id})`, updatedData);

        const response = await request.data;
        return response;
    }
);
export const createODataSource = (tableName, tableKey, notDeleted) => {
    const oDataStore = new ODataStore({
        url: `${hostName}/${tableName}`,
        key: tableKey,
        version: 4,
        withCredentials: true,
        filterToLower: false,
        
        onLoaded: () => { },
        
    });
    
    return new DataSource({
        store: oDataStore,
        paginate: true,
        filter: notDeleted,
        sort: [{ selector: tableKey, desc: true }], 
        pageSize: 10,
        requireTotalCount: true,
    });
};
export const createODataSourceChild = (tableName, tableKey, childTable) => {
    const oDataStore = new ODataStore({
        url: `${hostName}/${tableName}`,
        // key: tableKey,
        version: 4,
        withCredentials: true,
        filterToLower: false,

        onLoaded: () => { }
    });

    return new DataSource({
        store: oDataStore,
        // sort: tableKey,
        select: childTable,
        paginate: true,
        pageSize: 10,
        requireTotalCount: true,
    });
};
const handleNotify = ({ message, type }) => {
    notify(
        {
            message: message,
            width: 230,
            position: {
                at: "bottom",
                my: "bottom",
                of: "#container"
            }
        },
        type,
        500
    );
}

export const filter = ({ tableName, tableKey, filtersConfig, filterValues, notDeleted }) => {
    const oDataSource = createODataSource(tableName, tableKey, notDeleted);
    const filters = [];
    filtersConfig.forEach(({ field, operator }) => {
        const value = filterValues[field];
        if (value !== null && value !== undefined && value !== '') {
            filters.push([field, operator, value]);
        }
    });

    oDataSource.filter(filters.length > 0 ? filters : null);
    oDataSource.load();
    return oDataSource;
};
export const filterWgh = ({ tableName, tableKey, filtersConfig, filterValues, notDeleted }) => {
    const oDataSource = createODataSource(tableName, tableKey, notDeleted);
    const filters = [];

    filtersConfig.forEach(({ field, operator, key }) => {
        // key varsa filterValues[key] kullan, yoksa field kullan
        const value = key ? filterValues[key] : filterValues[field];

        if (value !== null && value !== undefined && value !== '') {
            filters.push([field, operator, value]);
        }
    });

    oDataSource.filter(filters.length > 0 ? filters : null);
    oDataSource.load();
    return oDataSource;
};

export const getBpSeries = async () => {
    try {
        const response = await axios.get(`${querymanager}/bpseries`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
            
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


const appSlice = createSlice({
    name: 'app',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(addData.pending, (state) => {
            state.loading = true;
            state.data = [];
            state.error = null;

            handleNotify({ message: "Kaydediliyor...", type: "warning" })
        })
            .addCase(addData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
                handleNotify({ message: "Ekleme İşlemi Başarılı", type: "success" })

            })
            .addCase(addData.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.error.message;
                handleNotify({ message: "Ekleme İşlemi Başarısız Oldu", type: "error" })
            })
            .addCase(updateData.pending, (state) => {
                state.loading = true;
                state.data = [];
                state.error = null;
                handleNotify({ message: "Kaydediliyor...", type: "warning" })

            })
            .addCase(updateData.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
                handleNotify({ message: "Güncelleme İşlemi Başarılı", type: "success" })
            })
            .addCase(updateData.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.error = action.error.message;
                handleNotify({ message: "Güncelleme İşlemi Başarısız Oldu", type: "error" })

            })
    }
});

export default appSlice.reducer;
