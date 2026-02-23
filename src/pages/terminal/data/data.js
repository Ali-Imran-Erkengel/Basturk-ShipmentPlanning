export const terminalDeliveryData = {
  "PreparerCode": "",
  "PreparerName": "",
  "LoaderCode": "",
  "LoaderName": "",
  "SourceWhsCode": "",
  "TargetWhsCode": "",
  "SourceBinEntry": 0,
  "TargetBinEntry": 0,
  "SourceBinCode": "",
  "TargetBinCode": "",
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
  "OnHandQty": "",
  "PalletQty": "",
  "FromBinCode": "",
  "ToBinCode": "",
  "DocNum": ""
}
export const terminalPrevEopData = {
  "Kayıt_Sırası": "",
  "Parti_No": "",
  "Stok_Kodu": "",
  "Kalem_Adı": "",
  "Depo_Kodu": "",
  "Depo_Yeri": "",
  "Üretim_Tarihi": "",
  "Parti_Tarih": "",
  "Hat_No": "",
  "Günlük_Lot_No": "",
  "Bekleme_Süresi(Saat)": "",
  "Statü": ""
}
export const terminalBatchDetailData = {
  "ItemCode": "",
  "ItemName": "",
  "WhsCode": "",
  "BinCode": "",
  "DistNumber": "",
  "OnHandQty": "",
  "PalletQty": "",
  "InnerQtyOfPallet": "",
  "MnfSerial": "",
  "MnfDate": "",
  "ExpDate": "",
  "Notes": "",
  "LotNumber": "",
  "InDate": "",
  "U_Status": "",
  "U_StatusUpdateDate": "",
  "U_BlockReason": "",
  "U_BlockReason2": "",
  "U_ErrorDesc": "",
  "U_TemplateNum": "",
  "U_ReShrinkCount": "",
  "U_ReShrinkDesc": ""
}
export const terminalReturnData = {
  "PreparerCode": "",
  "PreparerName": "",
  "LoaderCode": "",
  "LoaderName": "",
  "GetBack": false,
  "OldBarcode": false,
  "Barcode": "",
  "CardCode": "",
  "CardName": ""
}
export const terminalBarcodedProcessData = {
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
  { dataField: "U_OrderNo", caption: "Sipariş No", alignment: "left", visible: false },
  { dataField: "U_OrderLine", caption: "Sipariş Satır", alignment: "left", visible: false },
  { dataField: "U_WhsCode", caption: "Depo", alignment: "left" },
  { dataField: "DocEntry", caption: "Belge No", alignment: "left", visible: false },
  { dataField: "LineId", caption: "Belge Sira", alignment: "left", visible: false },
  { dataField: "U_YurtdisiNakliye", caption: "Yurtdışı Kalem", alignment: "left", visible: false },
  { dataField: "U_YurticiNakliye", caption: "Yurtiçi Kalem", alignment: "left", visible: false },
  { dataField: "U_ShipmentType", caption: "Sevkiyat Türü", alignment: "left", visible: false },
  { dataField: "U_Type", caption: "Tip", alignment: "left", visible: false },
  { dataField: "U_CardCode", caption: "Müşteri Kodu", alignment: "left", visible: false },
  { dataField: "U_OcrdNo", caption: "Tedarikçi", alignment: "left", visible: false },
  { dataField: "U_CardName", caption: "Tedarikçi Adı", alignment: "left", visible: false },
  { dataField: "U_Date", caption: "Teslimat Tarihi", alignment: "left", visible: false },
  { dataField: "U_PalletGrossWgh", caption: "Brüt Ağırlık", alignment: "right", visible: false },
  { dataField: "U_PalletNetWgh", caption: "Net Ağırlık", alignment: "right", visible: false },
  { dataField: "U_PalletType", caption: "Palet Şekli", alignment: "left", visible: false },
  { dataField: "U_Price", caption: "Fiyat", alignment: "right", visible: false },
  { dataField: "U_InnerQtyOfPallet", caption: "Palet İçi Adet", alignment: "right", visible: false },
  { dataField: "StockQuantity", caption: "Stok Miktarı", alignment: "right", visible: false },
  { dataField: "U_PlateCode", caption: "Plaka Kodu", alignment: "left", visible: false },
  { dataField: "U_TrailerPlateCode", caption: "Dorse Plaka", alignment: "left", visible: false },
  { dataField: "U_DriverName", caption: "Şöför", alignment: "left", visible: false },
  { dataField: "U_TradeFileNo", caption: "Ticaret Dosya No", alignment: "left", visible: false },
  { dataField: "U_TransportType", caption: "Sevkiyat Şekli", alignment: "left", visible: false },
  { dataField: "U_Address", caption: "Adres", alignment: "left", visible: false },
  { dataField: "U_County", caption: "İlçe", alignment: "left", visible: false },
  { dataField: "U_City", caption: "İl", alignment: "left", visible: false },
  { dataField: "U_Country", caption: "Ülke", alignment: "left", visible: false },
  { dataField: "U_ZipCode", caption: "Posta Kodu", alignment: "left", visible: false },
  { dataField: "U_BinEntry", caption: "Depo Yeri Entry", alignment: "left", visible: false },
  { dataField: "U_BinCode", caption: "Depo Yeri", alignment: "left" },
  { dataField: "Index", caption: "Index", alignment: "left", visible: false },
];
export const terminalBatchColumns = [
  { dataField: "ItemCode", caption: "Kalem Kodu", alignment: "left" },
  { dataField: "ItemName", caption: "Kalem Adı", alignment: "left" },
  { dataField: "Batch", caption: "Parti", alignment: "left" },
  { dataField: "Index", caption: "Index", alignment: "left", visible: false },
  { dataField: "BinEntry", caption: "BinEntry", alignment: "left", visible: false },
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
  { dataField: "Kayıt Tarihi", caption: "Kayıt Tarihi", alignment: "left", dataType: "date", format: "dd/MM/yyyy" },
  { dataField: "Teslim Tarihi", caption: "Teslim Tarihi", alignment: "left", dataType: "date", format: "dd/MM/yyyy" },
  { dataField: "Müşteri", caption: "Müşteri", alignment: "left" },
  { dataField: "Açıklama", caption: "Açıklama", alignment: "left" }];
export const terminalRetrunColumns = [
  { dataField: "Batch", caption: "Parti", alignment: "left" },
  { dataField: "CardCode", caption: "Muhatap Kodu", alignment: "left" },
  { dataField: "ItemCode", caption: "Kalem Kodu", alignment: "left" },
  { dataField: "ItemName", caption: "Kalem Adı", alignment: "left" },
  { dataField: "DocEntry", caption: "Belge No", alignment: "left" },
  { dataField: "LineNum", caption: "Belge Sıra", alignment: "left" },
  { dataField: "Quantity", caption: "Miktar", alignment: "right" },
  { dataField: "PalletQuantity", caption: "Palet Miktarı", alignment: "right" },
];
export const terminalBarcodedProcessColumns = [
  { dataField: "ApplyEntry", caption: "Belge No", alignment: "left" },
  { dataField: "ApplyLine", caption: "Belge Sıra", alignment: "left" },
  { dataField: "BinAbsEntry", caption: "Bin Entry", alignment: "left" },
  { dataField: "BinCode", caption: "Depo Yeri", alignment: "left" },
  { dataField: "DistNumber", caption: "Parti No", alignment: "left" },
  { dataField: "FromWhsCod", caption: "Kaynak Depo", alignment: "left" },
  { dataField: "InnerQtyOfPallet", caption: "Miktar", alignment: "right" },
  { dataField: "ItemCode", caption: "Kalem Kodu", alignment: "left" },
  { dataField: "itemName", caption: "Kalem Adı", alignment: "left" },
  { dataField: "Readed", caption: "Okutuldu", alignment: "left" },
];
export const terminalTransferFromRequestColumns = [
  { dataField: "ApplyEntry", caption: "Belge No", alignment: "left" },
  { dataField: "ApplyLine", caption: "Belge Sıra", alignment: "left" },
  { dataField: "DistNumber", caption: "Parti No", alignment: "left" },
  { dataField: "FromWhsCod", caption: "Kaynak Depo", alignment: "left" },
  { dataField: "WhsCode", caption: "Hedef Depo", alignment: "left" },
  { dataField: "InnerQtyOfPallet", caption: "Miktar", alignment: "right" },
  { dataField: "ItemCode", caption: "Kalem Kodu", alignment: "left" },
  { dataField: "itemName", caption: "Kalem Adı", alignment: "left" },
  { dataField: "U_SourceBinEntry", caption: "Kaynak Bin Entry", alignment: "left", visible: false },
  { dataField: "U_SourceBin", caption: "Kaynak Depo Yeri", alignment: "left" },
  { dataField: "U_TargetBinEntry", caption: "Hedef Bin Entry", alignment: "left", visible: false },
  { dataField: "U_TargetBin", caption: "Hedef Depo Yeri", alignment: "left" },
  { dataField: "Readed", caption: "Okutuldu", alignment: "left" },
];
export const transferRequestColumns = [
  { dataField: "DocEntry", caption: "DocEntry", alignment: "left" },
  { dataField: "Belge No", caption: "Belge No", alignment: "left" },
  { dataField: "Kayıt Tarihi", caption: "Kayıt Tarihi", alignment: "left", dataType: "date", format: "dd/MM/yyyy" },
  { dataField: "Açıklama", caption: "Açıklama", alignment: "left" },
  { dataField: "Kalem Kodu", caption: "Kalem Kodu", alignment: "left" },
  { dataField: "Kalem Adı", caption: "Kalem Adı", alignment: "left" }];


export const endOfProcessColumns = [
  { dataField: "DocEntry", caption: "DocEntry", alignment: "left" },
  { dataField: "MainItemCode", caption: "MainItemCode", alignment: "left" },
  { dataField: "MainItemName", caption: "MainItemName", alignment: "left" },
  { dataField: "BatchNum", caption: "BatchNum", alignment: "left" },
  { dataField: "StatusCode", caption: "StatusCode", alignment: "left" }
]
export const consumptionColumns = [
  { dataField: "DocEntry", caption: "DocEntry", alignment: "left" },
  { dataField: "ItemCode", caption: "Kalem Kodu", alignment: "left" },
  { dataField: "Dscription", caption: "Kalem Adı", alignment: "left" },
  { dataField: "Quantity", caption: "Miktar", alignment: "right" },
  { dataField: "WhsCode", caption: "Depo Kodu", alignment: "left" }
]
