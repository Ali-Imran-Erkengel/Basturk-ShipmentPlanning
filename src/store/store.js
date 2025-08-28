import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import appReducer from './appSlice'
import udoReducer from './udoSlice'
import shipmentReducer from './shipmentSlice'
import logisticsReducer from './logisticsSlice'
import weighbridgeReducer from './weighbridgeSlice'
import detailReportReducer from './detailRepotSlice'
export const store = configureStore({
    reducer: {
        user: userReducer,
        app: appReducer,
        udo: udoReducer,
        shipment:shipmentReducer,
        logistics:logisticsReducer,
        weighbridge:weighbridgeReducer,
        detailReport:detailReportReducer
    }
});
export default store;