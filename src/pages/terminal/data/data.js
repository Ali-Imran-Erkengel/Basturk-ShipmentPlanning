export const terminalDeliveryData = {
  "PreparerCode": "",
  "PreparerName": "",
  "LoaderCode": "",
  "LoaderName": "",
  "GetBack": false,
  "OldBarcode": false,
  "Barcode": "",
}
export const terminalTransferLastData = {
  "DistNumber": "",
  "ItemCode": "",
  "Dscription": "",
  "FromWhsCod": "",
  "WhsCode": "",
  "FromBinCode": "",
  "ToBinCode": "",
  "DocNum": ""
}
export const terminalReturnData = {
  "PreparerCode": "",
  "PreparerName": "",
  "LoaderCode": "",
  "LoaderName": "",
  "GetBack": false,
  "OldBarcode": false,
  "Barcode": "",
  "CardCode":"",
  "CardName":""
}
export const terminalBarcodedProcessData={
  "PreparerName": "",
  "LoaderCode": "",
  "LoaderName": "",
  "GetBack": false,
  "OldBarcode": false,
  "Barcode": ""
}

// export const terminalBatchData = {
//   "ItemCode": "",
//   "ItemName": "",
//   "Quantity":"",
//   "StockQuantity":"",
//   "Batch": "",
//   "Index": "",
//   "BinEntry": ""
// }
export const terminalItemColumns = [
  { dataField: "U_ItemCode", caption: "Kalem Kodu", alignment: "left" },
  { dataField: "U_ItemName", caption: "Kalem Adı", alignment: "left" },
  { dataField: "U_Quantity", caption: "Miktar", alignment: "right" },
  { dataField: "ReadedQty", caption: "Okutulan", alignment: "right" },
  { dataField: "U_OrderNo", caption: "Sipariş No", alignment: "left", width: "0" },
  { dataField: "U_OrderLine", caption: "Sipariş Satır", alignment: "left", width: "0" },
  { dataField: "U_WhsCode", caption: "Depo", alignment: "left" },
  { dataField: "DocEntry", caption: "Belge No", alignment: "left", width: "0" },
  { dataField: "LineId", caption: "Belge Sira", alignment: "left", width: "0" },
  { dataField: "U_YurtdisiNakliye", caption: "Yurtdışı Kalem", alignment: "left", width: "0" },
  { dataField: "U_YurticiNakliye", caption: "Yurtiçi Kalem", alignment: "left", width: "0" },
  { dataField: "U_ShipmentType", caption: "Sevkiyat Türü", alignment: "left", width: "0" },
  { dataField: "U_Type", caption: "Tip", alignment: "left", width: "0" },
  { dataField: "U_CardCode", caption: "Müşteri Kodu", alignment: "left", width: "0" },
  { dataField: "U_OcrdNo", caption: "Tedarikçi", alignment: "left", width: "0" },
  { dataField: "U_CardName", caption: "Tedarikçi Adı", alignment: "left", width: "0" },
  { dataField: "U_Date", caption: "Teslimat Tarihi", alignment: "left", width: "0" },
  { dataField: "U_PalletGrossWgh", caption: "Brüt Ağırlık", alignment: "right", width: "0" },
  { dataField: "U_PalletNetWgh", caption: "Net Ağırlık", alignment: "right", width: "0" },
  { dataField: "U_PalletType", caption: "Palet Şekli", alignment: "left", width: "0" },
  { dataField: "U_Price", caption: "Fiyat", alignment: "right", width: "0" },
  { dataField: "U_InnerQtyOfPallet", caption: "Palet İçi Adet", alignment: "right", width: "0" },
  { dataField: "StockQuantity", caption: "Stok Miktarı", alignment: "right", width: "0" },
  { dataField: "U_PlateCode", caption: "Plaka Kodu", alignment: "left", width: "0" },
  { dataField: "U_TrailerPlateCode", caption: "Dorse Plaka", alignment: "left", width: "0" },
  { dataField: "U_DriverName", caption: "Şöför", alignment: "left", width: "0" },
  { dataField: "U_TradeFileNo", caption: "Ticaret Dosya No", alignment: "left", width: "0" },
  { dataField: "U_TransportType", caption: "Sevkiyat Şekli", alignment: "left", width: "0" },
  { dataField: "U_Address", caption: "Adres", alignment: "left", width: "0" },
  { dataField: "U_County", caption: "İlçe", alignment: "left", width: "0" },
  { dataField: "U_City", caption: "İl", alignment: "left", width: "0" },
  { dataField: "U_Country", caption: "Ülke", alignment: "left", width: "0" },
  { dataField: "U_ZipCode", caption: "Posta Kodu", alignment: "left", width: "0" },
  { dataField: "U_BinEntry", caption: "Depo Yeri Entry", alignment: "left", width: "0" },
  { dataField: "U_BinCode", caption: "Depo Yeri", alignment: "left" },
  { dataField: "Index", caption: "Index", alignment: "left", width: "0" },
];
export const terminalBatchColumns = [
  { dataField: "ItemCode", caption: "Kalem Kodu", alignment: "left" },
  { dataField: "ItemName", caption: "Kalem Adı", alignment: "left" },
  { dataField: "Batch", caption: "Parti", alignment: "left" },
  { dataField: "Index", caption: "Index", alignment: "left", width: "0" },
  { dataField: "BinEntry", caption: "BinEntry", alignment: "left", width: "0" },
];

export const deliveryColumns = [
  { dataField: "Lojistik No", caption: "Lojistik No", alignment: "left" },
  { dataField: "Belge No", caption: "Belge No", alignment: "left" },
  { dataField: "Açıklama", caption: "Açıklama", alignment: "left" },
  { dataField: "Toplam Palet Miktarı", caption: "Top. Palet", alignment: "right" },
  { dataField: "Plaka Kodu", caption: "Plaka Kodu", alignment: "left" },
  { dataField: "Şöför", caption: "Şöför", alignment: "left" }];
export const returnColumns = [
  { dataField: "DocEntry", caption: "DocEntry", alignment: "left" },
  { dataField: "Belge No", caption: "Belge No", alignment: "left" },
  { dataField: "Kayıt Tarihi", caption: "Kayıt Tarihi", alignment: "left" ,dataType:"date",format:"dd/MM/yyyy"},
  { dataField: "Teslim Tarihi", caption: "Teslim Tarihi", alignment: "left" ,dataType:"date",format:"dd/MM/yyyy"},
  { dataField: "Müşteri", caption: "Müşteri", alignment: "left" },
  { dataField: "Açıklama", caption: "Açıklama", alignment: "left" }];
  export const terminalRetrunColumns = [
    { dataField: "Batch", caption: "Parti", alignment: "left" },
    { dataField: "CardCode", caption: "Muhatap Kodu", alignment: "left" },
    { dataField: "ItemCode", caption: "Kalem Kodu", alignment: "left" },
    { dataField: "ItemName", caption: "Kalem Adı", alignment: "left" },
    { dataField: "DocEntry", caption: "Belge No", alignment: "left" },
    { dataField: "LineNum", caption: "Belge Sıra", alignment: "left" },
    { dataField: "Quantity", caption: "Miktar", alignment: "right"  },
    { dataField: "PalletQuantity", caption: "Palet Miktarı", alignment: "right" },
  ];
  export const terminalBarcodedProcessColumns = [
    { dataField: "ApplyEntry", caption: "Belge No", alignment: "left" },
    { dataField: "ApplyLine", caption: "Belge Sıra", alignment: "left" },
    { dataField: "BinAbsEntry", caption: "Bin Entry", alignment: "left" },
    { dataField: "BinCode", caption: "Depo Yeri", alignment: "left" },
    { dataField: "DistNumber", caption: "Parti No", alignment: "right"  },
    { dataField: "FromWhsCod", caption: "Kaynak Depo", alignment: "right" },
    { dataField: "InnerQtyOfPallet", caption: "Miktar", alignment: "right" },
    { dataField: "ItemCode", caption: "Kalem Kodu", alignment: "right" },
    { dataField: "itemName", caption: "Kalem Adı", alignment: "right" },
    { dataField: "Readed", caption: "Okutuldu", alignment: "left"},
  ];