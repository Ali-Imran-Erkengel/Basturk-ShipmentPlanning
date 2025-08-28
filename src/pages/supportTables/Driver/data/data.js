export const filtersConfig = [
  { field: 'U_Name', operator: 'contains', type: 'string' },
  { field: 'U_MiddleName', operator: 'contains', type: 'string' },
  { field: 'U_Surname', operator: 'contains', type: 'string' },
  { field: 'U_IdentityNo', operator: 'contains', type: 'string' },
  { field: 'U_Phone1', operator: 'contains', type: 'string' },
  { field: 'U_Phone2', operator: 'contains', type: 'string' },
  { field: 'U_CardCode', operator: 'contains', type: 'string' },
  { field: 'U_PlateCode', operator: 'contains', type: 'string' },
  { field: 'U_TrailerPlateCode', operator: 'contains', type: 'string' },
];
export const formData = {
  "U_Name": "",
  "U_MiddleName": "",
  "U_Surname": "",
  "U_IdentityNo": "",
  "U_Phone1": "",
  "U_Phone2": "",
  "U_CardCode": "",
  "U_CardName": "",
  "U_Attachments": "",
  "U_PlateCode": "",
  "U_TrailerPlateCode": ""
};
export const phoneOptions = { mask: '+90 (000) 000-0000' }