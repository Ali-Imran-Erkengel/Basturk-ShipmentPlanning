const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
export const filtersConfig = [
  // { field: 'U_TransactionDate', operator: '=', type: 'string' },
  { field: 'U_TransactionDate', operator: '>=', type: 'date', key: 'startDate' }, // Başlangıç tarihi
  { field: 'U_TransactionDate', operator: '<=', type: 'date', key: 'endDate' }, 
  { field: 'U_Description', operator: 'contains', type: 'string' },
  { field: 'U_WghType', operator: '=', type: 'string' },
  { field: 'U_IsDeleted', operator: '=', type: 'string' },
  { field: 'U_LogisticsNo', operator: '=', type: 'string' },
  { field: 'DocEntry', operator: 'contains', type: 'string' }
  
];
export const formData = {
  "U_TransactionDate": localDate,
  "U_FirstWghDate": localDate,
  "U_SecondWghDate": "",
  "U_FirstWgh": 0,
  "U_SecondWgh": 0,
  "U_WghType": 1,
  "U_LogisticsNo": "",
  "U_Description": "",
  "U_VehicleNo": "",
  "U_VehicleDesc": "",
  "U_PlateCode": "",
  "U_DriverNo": "",
  "U_DriverName": "",
  "U_WhgPerson": "",
  "U_WghPersonName": "",
  "U_NetWeight": 0,
  "U_DocTotal": 0,
  "U_LoadingRamp": "",
  "U_IsCreatePO": "N",
  "U_PODocNo": "",
  "U_Difference": 0,
  "U_SecondWghDone":"N",
  "U_TrailerPlateCode":"",
  "U_DeliveryNoteNo":""
};


export const statuses = [
  { Key: 1, "Value": "Satış" },
  { Key: 2, "Value": "Alış" },
  { Key: 3, "Value": "Diğer" }
]
export const yesno = [
  { Key: "N", "Value": "Hayır" },
  { Key: "Y", "Value": "Evet" },
]
export const datetimeFormat = {
  displayFormat: "shortdate",
  format: "yyyy-MM-dd"
}
export const types = [
  { "Key": 1, "Value": "Satış" },
  { "Key": 2, "Value": "Satınalma" }
]