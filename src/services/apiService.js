import axios from "axios";
import { hostName } from "../config/config";

const api = axios.create({
    baseURL: hostName,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const sessionData = JSON.parse(localStorage.getItem('sessionData'));
      if (sessionData?.sessionId) {
        config.headers['Cookie'] = `B1SESSION=${sessionData.sessionId}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('sessionData');
        window.location.href = '/home'; // Login sayfasına yönlendir
      }
      return Promise.reject(error);
    }
  );
  
  export default api;