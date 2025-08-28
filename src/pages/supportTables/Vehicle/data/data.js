export const filtersConfig = [
  { field: 'U_TrailerPlateCode', operator: 'contains', type: 'string' },
  { field: 'U_PlateCode', operator: 'contains', type: 'string' },
  { field: 'U_CardName', operator: 'contains', type: 'string' },
  { field: 'U_Name', operator: 'contains', type: 'string' },
  { field: 'U_Surname', operator: 'contains', type: 'string' },
  { field: 'U_IsDeleted', operator: '=', type: 'string' },

];
const today = Date();
export const formData = {
  "U_Vehicle": "",
  "U_PlateCode": "",
  "U_TrailerPlateCode": "",
  "U_VehicleType": "",
  "U_TrailerType": "",
  "U_Name": "",
  "U_Surname": "",
  "U_IdentityNo": "",
  "U_Phone1": "",
  "U_Phone2": "",
  "U_CardCode": "",
  "U_CardName": "",
  "SML_VHL_DRVCollection": [
    {
      "U_DriverId": "",
      "U_BeginDate": "2024-08-12",
      "U_EndDate": "2024-09-19"
    }
  ]
};
export const vehicle_driver = {
  "U_DriverId": "",
  "U_BeginDate": "",
  "U_EndDate": ""
}
export const datetimeFormat = {
  displayFormat: "shortdate",
  format: "yyyy-MM-dd"
}
export const phoneOptions = { mask: '+90 (000) 000-0000' }
export const businessPartnersData = {
  "CardCode": "",
  "CardName": "",
  "FederalTaxID": "",
  "Phone1": "",
  "AdditionalID": "",
  "HouseBankIBAN": "",
  "HouseBank": "",
  "Industry": "8",
  "CardType": "cSupplier",
  "GroupCode":"107",//grup kodu nakliyeci olacak
  "SalesPersonCode":"10",
  "Series":"74"
}
export const glAccountsData = {
  "BankCode": "",
  "BankKey": "",
  "AccNo": "",
  "AccountName": "",
  "GLAccount": "",
  "IBAN": ""
}
export const BPTypes = [
  { "Key": "cCustomer", "Value": "Müşteri" },
  { "Key": "cSupplier", "Value": "Tedarikçi" },
  { "Key": "cLid", "Value": "Aday" }
]
export const yesno = [
  { Key: "N", "Value": "Hayır" },
  { Key: "Y", "Value": "Evet" },
]
