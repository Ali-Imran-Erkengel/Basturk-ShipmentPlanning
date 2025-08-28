const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
export const filtersConfig = [
  { field: 'U_Date', operator: '=', type: 'string' },
  { field: 'U_Description', operator: 'contains', type: 'string' },
  { field: 'U_CardName', operator: 'contains', type: 'string' },
  { field: 'U_DriverName', operator: 'contains', type: 'string' },
  { field: 'U_County', operator: 'contains', type: 'string' },
  { field: 'U_City', operator: 'contains', type: 'string' },
  { field: 'U_CustomDocNum', operator: 'contains', type: 'string' },
  { field: 'U_Status', operator: '=', type: 'string' },
  { field: 'U_IsDeleted', operator: '=', type: 'string' }

];
export const formDataAdd = {
  "U_Date":localDate,
  "U_OcrdNo": "",
  "U_Description": "",
  "U_Status": 2,
  "U_IsDeleted": "N",
  "U_DriverNo": "",
  "U_VehicleNo": "",
  "U_Price": 0,
  "U_PalletCost": 0,
  "U_PalletQuantity": 0,
  "U_VehicleDesc": "",
  "U_PlateCode": "",
  "U_DriverName": "",
  "U_Type": 1,
  "U_PaymentStatus": 1,
  "U_DeliveryStatus": 1,
  "U_CardName": "",
  "U_TrailerPlateCode": "",
  "U_DeliveryNoteNo": "",
  "U_TotalWeight": 0,
  "U_Amount": 0,
  "U_Address":"",
  "U_City":"",
  "U_County":"",
  "U_Country":"",
  "U_ZipCode":"",
  "SML_LGT_ITEMCollection": [
    {
      "U_ShipmentNo": "",
      "U_ShipmentLine": "",
      "U_Quantity": "",
      "U_ItemCode": "",
      "U_CardName": "",
      "U_ItemName": "",
      "U_CardCode": "",
      "U_OrderNo": "",
      "U_OrderNum": "",
      "U_OrderLine": "",
      "U_PalletCost": "",
      "U_WhsCode": "",
      "U_TradeFileNo":"",
      "U_PalletGrossWgh":"",
      "U_PalletNetWgh":"",
      "U_PalletType":"",
      "U_InnerQtyOfPallet":"",
      "U_Status": 2,
      "U_TransportType":"",
      "U_BinLocJson":"",
      "U_BinEntry":0,
      "U_BinCode":""
    }
  ]
};
export const formDataUpdate = {
  "U_Date": "",
  "U_OcrdNo": "",
  "U_Description": "",
  "U_Status": 2,
  "U_IsDeleted": "",
  "U_DriverNo": "",
  "U_VehicleNo": "",
  "U_Price": 0,
  "U_PalletCost": 0,
  "U_PalletQuantity": 0,
  "U_VehicleDesc": "",
  "U_PlateCode": "",
  "U_DriverName": "",
  "U_Type": "",
  "U_CustomDocNum": "",
  "U_PaymentStatus": "",
  "U_DeliveryStatus": "",
  "U_CardName": "",
  "U_TrailerPlateCode": "",
  "U_DeliveryNoteNo": "",
  "U_TotalWeight": 0,
  "U_Amount": 0,
  "U_Address":"",
  "U_City":"",
  "U_County":"",
  "U_Country":"",
  "U_ZipCode":"",
  "SML_LGT_ITEMCollection": [
    {
      "LineId": "",
      "U_ShipmentNo": "",
      "U_ShipmentLine": "",
      "U_Quantity": "",
      "U_ItemCode": "",
      "U_CardName": "",
      "U_ItemName": "",
      "U_CardCode": "",
      "U_OrderNo": "",
      "U_OrderNum": "",
      "U_OrderLine": "",
      "U_PalletCost": "",
      "U_WhsCode": "",
      "U_TradeFileNo":"",
      "U_PalletGrossWgh":"",
      "U_PalletNetWgh":"",
      "U_PalletType":"",
      "U_InnerQtyOfPallet":"",
      "U_TransportType":"",
      "U_BinLocJson":"",
       "U_BinEntry":0,
      "U_BinCode":""
    }
  ]
};
// export const itemData = {
//   "U_ItemCode": "",
//   "U_ItemName": "",
//   "U_CardCode": "",
//   "U_CardName": "",
//   "U_Quantity": "",
//   "U_DeliveryStatus": "",
//   "U_Weight": "",
//   "U_Price": "",
//   "U_OrderNo": "",
//   "U_OrderLine": ""

// }
export const paymentStatus =
  [
    { "Key": 1, "Value": "Ödenmedi" },
    { "Key": 2, "Value": "Ödemesi Yapıldı" },
    { "Key": 3, "Value": "Kısmi Ödendi" }
  ]
export const deliveryStatus =
  [
    { "Key": 1, "Value": "Teslim Edilmedi" },
    { "Key": 2, "Value": "Teslim Edildi" }
  ]
export const invoiceStatus =
  [
    { "Key": 1, "Value": "Faturalanması" },
    { "Key": 2, "Value": "Faturalandı" }
  ]
export const paymentStatusFilter =
  [
    { "Key": 0, "Value": "Hepsi" },
    { "Key": 1, "Value": "Ödenmedi" },
    { "Key": 2, "Value": "Ödemesi Yapıldı" },
    { "Key": 3, "Value": "Kısmi Ödendi" }
  ]
export const deliveryStatusFilter =
  [
    { "Key": 0, "Value": "Hepsi" },
    { "Key": 1, "Value": "Teslim Edilmedi" },
    { "Key": 2, "Value": "Teslim Edildi" }
  ]
export const invoiceStatusFilter =
  [
    { "Key": 0, "Value": "Hepsi" },
    { "Key": 1, "Value": "Faturalanmadı" },
    { "Key": 2, "Value": "Faturalandı" }
  ]
export const businessPartnersData = {
  "CardCode": "",
  "CardName": "",
  "FederalTaxID": "",
  "Phone1": "",
  "AdditionalID": "",
  "HouseBankIBAN": "",
  "HouseBank": "",
  "Industry": "",
  "CardType": ""
}
export const glAccountsData = {
  "BankCode": "",
  "BankKey": "",
  "AccNo": "",
  "AccountName": "",
  "GLAccount": "",
  "IBAN": ""
}
export const statuses = [
  { Key: '', "Value": "Hepsi" },
  { Key: 1, "Value": "Beklemede" },
  { Key: 2, "Value": "Planlandı" },
  { Key: 3, "Value": "Araç Beklemede" },
  { Key: 4, "Value": "Araç Geldi" },
  { Key: 5, "Value": "Araç Yüklemede" },
  { Key: 6, "Value": "Yüklendi" },
  { Key: 7, "Value": "Teslim Edildi" },
  { Key: 8, "Value": "Ödemesi Yapıldı" }
]
export const datetimeFormat = {
  displayFormat: "dd/MM/yyyy",
  format: "yyyy-MM-dd"
}
export const types = [
  { "Key": 1, "Value": "Satış" },
  { "Key": 2, "Value": "Satınalma" }
]
export const BPTypes = [
  { "Key": "cCustomer", "Value": "Müşteri" },
  { "Key": "cSupplier", "Value": "Tedarikçi" },
  { "Key": "cLid", "Value": "Aday" }
]
export const yesno = [
  { Key: "N", "Value": "Hayır" },
  { Key: "Y", "Value": "Evet" }
]