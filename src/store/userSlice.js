import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { hostName } from "../config/config";
export const loginUser = createAsyncThunk(
    'user/login',
    async (credentials, { rejectWithValue }) => {
      try {
        const response = await axios.post(`${hostName}/Login`, credentials);
        
        if (response.status === 200 && response.data?.SessionId) {
          const sessionData = {
            sessionId: response.data.SessionId,
            sessionTimeout: response.data.SessionTimeout,
            version: response.data.Version,
          };
          sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
          sessionStorage.setItem('userName',credentials.UserName);
          sessionStorage.setItem('password',credentials.Password);
          sessionStorage.setItem('company',credentials.CompanyDB);
          return sessionData; 
        } else {
          sessionStorage.clear();
          return rejectWithValue('Oturum açma başarısız.');
        }
      } catch (error) {
        sessionStorage.clear();
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
const initialState = {
    user: null,
    token: sessionStorage.getItem('sessionToken') || null,
    loading: false,
    error: null,
}
const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.user = null;
            state.error = null;
        })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
                state.token = action.payload.sessionId;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.error.message;
            })
    }
});
export default userSlice.reducer;