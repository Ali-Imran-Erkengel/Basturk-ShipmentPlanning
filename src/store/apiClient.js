
import axios from 'axios';
import { hostName } from '../config/config';
import { loginUser } from './userSlice';
import { useDispatch } from 'react-redux';



const apiClient = axios.create({
  baseURL: hostName, // API'nizin ana URL'sini buraya yazın
});
apiClient.interceptors.request.use(
    async (config) => {
        const dispatch = useDispatch();
        const sessionData = JSON.parse(localStorage.getItem('sessionData'));
    const currentTime = new Date().getTime();

    if (sessionData) {
      const sessionExpirationTime = sessionData.timestamp + sessionData.sessionTimeout * 1000;

      if (currentTime > sessionExpirationTime) {
        // Oturum süresi dolmuşsa yeniden giriş yap
        try {
          const credentials = {
            CompanyDB: "SBODemoTR",
            UserName: sessionData.username,
            Password: sessionData.password,
          };
          const result = await dispatch(loginUser(credentials));

          if (result.payload?.sessionId) {
            localStorage.setItem('sessionData', JSON.stringify({
              ...result.payload,
              username: credentials.UserName,
              password: credentials.Password,
              timestamp: new Date().getTime(),
            }));
            config.headers['Authorization'] = `Bearer ${result.payload.sessionId}`;
          }
        } catch (error) {
          console.error('Yeniden giriş yapılamadı:', error);
          localStorage.removeItem('sessionData'); // Oturumu sıfırla
          window.location.href = '/home'; // Giriş ekranına yönlendir
        }
      } else {
        config.headers['Authorization'] = `Bearer ${sessionData.sessionId}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
