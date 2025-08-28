/*export const hostName1 = "http://10.44.10.4:3001/b1s/v2";
export const endpoint1= "http://10.44.10.4:3001";
export const querymanager1= "http://10.44.10.4:4919"
export const hostName = "http://localhost:3001/b1s/v2";
export const endpoint = "http://localhost:3001" 
export const querymanager= "http://192.168.1.108:4919"
*/
export const hostName = process.env.REACT_APP_HOSTNAME;
export const endpoint = process.env.REACT_APP_ENDPOINT;
export const querymanager = process.env.REACT_APP_QUERYMANAGER;