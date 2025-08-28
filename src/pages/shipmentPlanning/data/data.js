const today = new Date();
const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];

export const filtersConfig = [
  { field: 'DocEntry', operator: 'contains', type: 'string' },
  { field: 'U_Date', operator: '=', type: 'string' },
  { field: 'U_Description', operator: 'contains', type: 'string' },
  { field: 'U_County', operator: 'contains', type: 'string' },
  { field: 'U_City', operator: 'contains', type: 'string' },
  { field: 'U_DeliveryStatus', operator: '=', type: 'string' },
  { field: 'U_IsDeleted', operator: '=', type: 'string' }

];

export const formDataUpdate = {
  "U_Date": "",
  "U_Description": "",
  "U_DeliveryStatus": 1,
  "U_ShipmentType": "",
  "U_PaymentStatus": "",
  "U_IsDeleted": "",
  "U_Type": "",
  "U_PalletQuantity": 0,
  "U_ContainerQuantity": 0,
  "U_TruckQuantity": 0,
  "U_TradeFileNo":"",
  "U_TradeFileSysNo":"",
  "U_TransportType":"",
  "U_Address":"",
  "U_City":"",
  "U_County":"",
  "U_Country":"",
  "U_ZipCode":"",
  "SML_SHP_ITEMCollection": [
    {
      "LineId": "",
      "U_ItemCode": "",
      "U_CardName": "",
      "U_Quantity": "",
      "U_DeliverySatatus": 1,
      "U_Weight": "",
      "U_Price": "",
      "U_ItemName": "",
      "U_OrderNo": "",
      "U_OrderNum": "",
      "U_OrderLine": "",
      "U_CardCode": "",
      "U_WhsCode":"",
      "U_PalletGrossWgh":"",
      "U_PalletNetWgh":"",
      "U_PalletType":"",
      "U_InnerQtyOfPallet":""

    }
  ]
};
export const formDataAdd = {
  "U_Date": localDate,
  "U_Description": "",
  "U_DeliveryStatus": 1,
  "U_PaymentStatus": 1,
  "U_ShipmentType": 1,
  "U_IsDeleted": "N",
  "U_Type": 1,
  "U_PalletQuantity": 0,
  "U_ContainerQuantity": 0,
  "U_TruckQuantity": 0,
  "U_TradeFileNo":"",
  "U_TradeFileSysNo":"",
  "U_TransportType":0,
  "U_Address":"",
  "U_City":"",
  "U_County":"",
  "U_Country":"",
  "U_ZipCode":"",
  "SML_SHP_ITEMCollection": [
    {
      "U_ItemCode": "",
      "U_CardName": "",
      "U_Quantity": "",
      "U_DeliverySatatus": 1,
      "U_Weight": "",
      "U_Price": "",
      "U_ItemName": "",
      "U_OrderNo": "",
      "U_OrderNum": "",
      "U_OrderLine": "",
      "U_CardCode": "",
      "U_PalletQuantity": "",
      "U_WhsCode":"",
      "U_PalletGrossWgh":"",
      "U_PalletNetWgh":"",
      "U_PalletType":"",
      "U_InnerQtyOfPallet":""
    }
  ]
};
export const businessPartnersColumns = [
  {
    "DataField": "CardCode",
    "Caption": "Müşteri Kodu"
  },
  {
    "DataField": "CardName",
    "Caption": "Müşteri"
  }
]
export const businessPartnersFilters = ["CardCode", "CardName"];
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
export const statuses = [
  { "Key": '', "Value": "Hepsi" },
  { "Key": 1, "Value": "Beklemede" },
  { "Key": 2, "Value": "Planlandı" },
  { "Key": 3, "Value": "Araç Geldi" },
  { "Key": 4, "Value": "Araç Yüklemede" },
  { "Key": 5, "Value": "Yüklendi" },
  { "Key": 6, "Value": "Teslim Edildi" },
  // { "Key": 7, "Value": "Ödemesi Yapıldı" }
]

export const types = [
  { "Key": 1, "Value": "Satış" },
  { "Key": 2, "Value": "Satınalma" }
]
export const typesFilter = [
  { "Key": '', "Value": "Hepsi" },
  { "Key": 1, "Value": "Satış" },
  { "Key": 2, "Value": "Satınalma" }
]
export const shipmentType = [
  { "Key": 1, "Value": "Araç Planlanacak" },
  { "Key": 2, "Value": "Müşteri Aracı" },
  { "Key": 3, "Value": "Tedarikçi Aracı" },
  { "Key": 4, "Value": "Bizim Araç" },
  { "Key": 5, "Value": "TCDD" }
]

export const yesno = [
  { Key: "N", "Value": "Hayır" },
  { Key: "Y", "Value": "Evet" }
]
export const datetimeFormat = {
  displayFormat: "shortdate",
  format: "yyyy-MM-dd"
}