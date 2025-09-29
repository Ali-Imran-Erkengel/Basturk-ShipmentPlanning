import React, { useEffect, useRef, useState } from "react";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { Form, SimpleItem } from 'devextreme-react/form'
import DataGrid, { Column, Paging, Pager } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { createTempData, deleteAllTempData, deleteTempData, getTermDeliveryDoc, getTermDeliveryDocs, saveDelivery, terminalBinControl, terminalControlTempItems, terminalGetTempItems, terminalStatusControl, terminalWarehouseControl } from "../../store/terminalSlice";
import { deliveryColumns, terminalBatchColumns, terminalDeliveryData, terminalItemColumns } from "./data/data";
import { Popup } from "devextreme-react/popup";
import ZoomLayout from "../../components/myComponents/ZoomLayout";
import { employeeColumns } from "../../data/zoomLayoutData";
import notify from 'devextreme/ui/notify';
import { confirm } from "devextreme/ui/dialog";

const handleNotify = ({ message, type }) => {
  notify(
    {
      message: message,
      width: 300,
      position: {
        at: "bottom",
        my: "bottom",
        of: "#container"
      }
    },
    type,
    1500
  );
}

const Transfer = () => {
  const [deliveryGrid, setDeliveryGrid] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [itemGrid, setItemGrid] = useState();
  const [batchGrid, setBatchGrid] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedLogisticNo, setSelectedLogisticNo] = useState(0);
  const [isPopupVisibleLoader, setPopupVisibilityLoader] = useState(false);
  const [isPopupVisiblePreparer, setPopupVisibilityPreparer] = useState(false);
  const [formData, setFormData] = useState({ ...terminalDeliveryData });
  const employeeFilter = ["Department", "=", 10];
  const barcodeRef = useRef(null);

  useEffect(() => {
    fetchWaitForLoadDocs();
  }, [])
  useEffect(() => {
  }, [selectedLogisticNo]);
  const createTextBoxWithButtonOptions = (type) => {
    return {
      buttons: [
        {
          name: "customButton",
          location: "after",
          options: {
            icon: "search",
            onClick: () => {
              togglePopupZoomLayout({ variable: type });
            },
          },
        },
      ],
    };
  };
  const togglePopupZoomLayout = ({ variable }) => {
    switch (variable) {
      case "loader":
        setPopupVisibilityLoader(!isPopupVisibleLoader);
        break;
      case "preparer":
        setPopupVisibilityPreparer(!isPopupVisiblePreparer);
        break;
      default:
        break;
    }
  };

  const handleLoaderSelection = (selectedRowData) => {
    formData.LoaderCode = selectedRowData.EmployeeID;
    formData.LoaderName = `${selectedRowData.FirstName ?? ""} ${selectedRowData.MiddleName ?? ""} ${selectedRowData.LastName ?? ""}`.trim();
    setPopupVisibilityLoader(false);
  };
  const handlePreparerSelection = (selectedRowData) => {
    formData.PreparerCode = selectedRowData.EmployeeID;
    formData.PreparerName = `${selectedRowData.FirstName ?? ""} ${selectedRowData.MiddleName ?? ""} ${selectedRowData.LastName ?? ""}`.trim();
    setPopupVisibilityPreparer(false);
  };

  // #region requests
  const fetchWaitForLoadDocs = async () => {
    let docs = await getTermDeliveryDocs();
    setDeliveryGrid(docs);
  };
  const goForReadBarcodes = async ({ docEntry }) => {

    let items = await getTermDeliveryDoc({ logisticId: docEntry });
    const itemsWithIndex = items.map((item, idx) => ({
      ...item,
      Index: idx + 1
    }));
    setSelectedLogisticNo(docEntry);
    setSelectedItem(null)
    setItemGrid(itemsWithIndex)
    setFormData({ ...terminalDeliveryData })
    setBatchGrid([]);
    setTabIndex(1);
    await controlTempItems({ docEntry: docEntry, itemsWithIndex: itemsWithIndex })
  };
  const controlTempItems = async ({ docEntry, itemsWithIndex }) => {
    let control = await terminalControlTempItems({ documentNo: docEntry, module: 'DLV' })
    if (control.length > 0) {
      const result = await confirm({
        title: "ONAY",
        messageHtml: "<b>Daha önce okutulan veriler tekrar yüklenecek.</b><br/>Devam etmek istiyor musunuz?",
        buttons: [
          { text: "Evet", onClick: () => true },
          { text: "Hayır", onClick: () => false, type: "normal" }
        ]
      });
      if (!result) {
        handleNotify({ message: "İşlem iptal edildi", type: "info" });
        return;
      }
      let temp = await terminalGetTempItems({ documentNo: docEntry, module: 'DLV' })
      const updatedItemGrid = itemsWithIndex.map((item) => {
        const found = temp.items?.find((x) => x.Index === item.Index);
        return {
          ...item,
          ReadedQty: found ? found.Count : 0
        };
      });

      setItemGrid(updatedItemGrid);
      setBatchGrid(temp.batches || []);
    }
  }
  const warehouseControl = async ({ itemCode, barcode }) => {
    try {
      let result = await terminalWarehouseControl({ itemCode, barcode });
      return result[0]?.DepoAdi;
    } catch (err) {
      console.error("err:", err.message);
      throw err
    }
  };
  const statusControl = async ({ itemCode, barcode }) => {
    try {
      let result = await terminalStatusControl({ itemCode, barcode });
      return result[0]?.Warning;
    } catch (err) {
      console.error("err:", err.message);
      throw err
    }
  };
  const batchBinControl = async ({ itemCode, barcode, whsCode, stockQuantity }) => {
    try {
      let result = await terminalBinControl({ itemCode: itemCode, barcode: barcode, whsCode: whsCode, stockQuantity: stockQuantity });
      return result;
    } catch (err) {
      console.error("err:", err.message);
      throw err
    }
  };
  const validateBeforeSave = ({ formData, itemGrid }) => {
    if (!formData.PreparerCode || !formData.LoaderCode) {
      handleNotify({ message: "Lütfen Hazırlayan ve Yükleyen seçiniz", type: "error" });
      return false;
    }

    const notCompleted = itemGrid?.some(item => (item.ReadedQty ?? 0) !== item.U_Quantity);
    if (notCompleted) {
      handleNotify({ message: "Tüm kalemlerin okutulan miktarı, teslimat miktarına eşit olmalı!", type: "error" });
      return false;
    }

    return true;
  };
  const insertToTempTable = async (rowData) => {
    try {
      const payload = {
        ItemCode: rowData.ItemCode,
        ItemName: rowData.ItemName,
        Batch: rowData.Batch,
        Index: rowData.Index,
        BinEntry: rowData.BinEntry,
        DocumentNo: selectedItem?.DocEntry || 0,
        UserCode: sessionStorage.getItem('userName') || "Unknown",
        Module: "DLV"
      };
      let result = await createTempData({ tempData: payload })
    } catch (err) {
      console.error("Temp tabloya ekleme hatası:", err);
    }
  };
  const deleteToTempTable = async () => {
    try {
      const payload = {
        DocumentNo: selectedLogisticNo,
        Module: "DLV"
      };
      let result = await deleteAllTempData({ tempData: payload })
    } catch (err) {
      console.error("Temp tablodan silme hatası:", err);
    }
  };
  const handleSave = async () => {
    try {

      if (!validateBeforeSave({ formData, itemGrid })) return;
      const preparer = formData.PreparerCode;
      const loadedBy = formData.LoaderCode;
      const headerList = itemGrid?.map(item => ({
        itemCode: item.U_ItemCode,
        quantity: item.U_Quantity,
        orderNo: item.U_OrderNo,
        orderLine: item.U_OrderLine,
        isBatch: item.U_IsBatch,
        tWhsCode: item.U_WhsCode,
        indexH: item.Index,
        docNum: item.DocEntry,
        docLine: item.LineId,
        plateCode: item.U_PlateCode,
        trailerPlateCode: item.U_TrailerPlateCode,
        abroad: item.U_YurtdisiNakliye,
        domestic: item.U_YurticiNakliye,
        shipmentType: item.U_ShipmentType,
        type: item.U_Type,
        cardCode: item.U_CardCode,
        supplierCode: item.U_OcrdNo,
        dlvDate: item.U_Date,
        palletGrossWeight: item.U_PalletGrossWgh,
        palletNetWeight: item.U_PalletNetWgh,
        innerQtyOfPallet: item.U_InnerQtyOfPallet,
        palletType: item.U_PalletType,
        supplierName: item.U_CardName,
        driverName: item.U_DriverName,
        tradeFileNo: item.U_TradeFileNo,
        transportType: item.U_TransportType,
        city: item.U_City,
        country: item.U_Country,
        county: item.U_County,
        address: item.U_Address,
        zipCode: item.U_ZipCode,
        binEntry: item.U_BinEntry,
        price: item.U_Price,
        stockQty: item.StockQuantity,
        LoadedBy: loadedBy,
        Preparer: preparer
      }));

      const itemList = batchGrid?.map(batch => ({
        batchNumber: batch.Batch,
        quantity: batch.Quantity,
        itemCode: batch.ItemCode,
        indexL: batch.Index,
        binEntry: batch.BinEntry
      }));
      const payload = { headerList, itemList };
      let result = await saveDelivery({ payload: payload })
      setItemGrid([])
      setFormData({ ...terminalDeliveryData })
      setBatchGrid([]);
      setTabIndex(0);
      setSelectedLogisticNo(0)
      await deleteToTempTable()
      handleNotify({ message: "Kayıt başarılı", type: "success" });
    } catch (err) {
      console.error("Kaydetme hatası:", err);
      const parsed = extractJson({ str: err.response.data });
      handleNotify({ message: parsed["message"], type: "error" });
    }
  };
  // #endregion


  const handleBarcodeEnter = async (barcode) => {
    try {
      if (!selectedItem) {
        handleNotify({ message: "Lütfen Satır Seçiniz", type: "error" })
        return;
      }
      let isGetBack = formData.GetBack;
      let oldBarcode = formData.OldBarcode;
      let itemCode = selectedItem.U_ItemCode;
      let quantity = selectedItem.U_Quantity;
      let readedQuantity = selectedItem.ReadedQty ?? 0;
      let whsCode = selectedItem.U_WhsCode;
      let innerQtyOfPallet = selectedItem.U_InnerQtyOfPallet;
      let index = selectedItem.Index;
      let barcodeValue = formData.Barcode;
      if (!oldBarcode) {
        barcodeValue = barcode.substring(3)
      }
      if (isGetBack) {
        const batchExists = batchGrid.some(b => b.Batch === barcodeValue);
        if (!batchExists) {
          handleNotify({ message: "Bu barkod listede yok!", type: "error" });
          return;
        }
        if (readedQuantity <= 0) return handleNotify({ message: "Miktar 0' ın Altına Düşemez", type: "error" });
        setBatchGrid(prev => prev.filter(b => b.Batch !== barcodeValue));
        setItemGrid(prevItems => {
          const newData = [...prevItems];
          const idx = newData.findIndex(item => item.Index === index);
          if (idx !== -1) {
            newData[idx] = {
              ...newData[idx],
              ReadedQty: Math.max((newData[idx].ReadedQty ?? 0) - 1, 0)
            };
          }
          return newData;
        });

        try {
          await deleteTempData({ tempData: { DocumentNo: selectedLogisticNo, Batch: barcodeValue, Module: "DLV" } });
        } catch (err) {
          console.error("Temp tablodan silme hatası:", err);
        }
        formData.Barcode = "";
        setSelectedItem(prev => ({
          ...prev,
          ReadedQty: (prev.ReadedQty ?? 0) - 1
        }));
        handleNotify({ message: "Okutma geri alındı.", type: "success" });
        return;
      }
      const warehouseMsg = await warehouseControl({ itemCode, barcode: barcodeValue });
      if (warehouseMsg) return handleNotify({ message: warehouseMsg, type: "error" });
      const statusMsg = await statusControl({ itemCode, barcode: barcodeValue });
      if (statusMsg) return handleNotify({ message: statusMsg, type: "error" });
      debugger
      if (readedQuantity >= quantity) return handleNotify({ message: "Miktar Teslimat Miktarını Geçemez", type: "error" });
      let apiResponse = await batchBinControl({ itemCode: itemCode, barcode: barcodeValue, whsCode: whsCode, stockQuantity: innerQtyOfPallet })
      switch (apiResponse[0].Result) {
        case "NONE":
          return handleNotify({ message: "Girlen Parametrelere Ait Depo Yerinde Veri Bulunamadı", type: "error" });
        case "OWF":
          return handleNotify({ message: "Yetersiz Miktar", type: "error" });
        default:
          break;
      }
      const newRow = {
        ItemCode: apiResponse[0].ItemCode,
        ItemName: apiResponse[0].ItemName,
        Quantity: 1,
        StockQuantity: apiResponse[0].StockQuantity,
        Batch: barcodeValue,
        Index: index,
        BinEntry: apiResponse[0].BinEntry,
        BinCode: apiResponse[0].BinCode,
        Result: apiResponse[0].Result
      };

      setBatchGrid(prev => {
        const exists = prev?.some(item => item.Batch === newRow.Batch);
        if (exists) {
          handleNotify({ message: "Bu parti zaten okutuldu!", type: "error" });
          return prev;
        } else {

          setItemGrid(prevItems => {
            const newData = [...prevItems];
            const idx = newData.findIndex(item => item.U_ItemCode === selectedItem.U_ItemCode);
            if (idx !== -1) {
              newData[idx] = {
                ...newData[idx],
                ReadedQty: (newData[idx].ReadedQty ?? 0) + 1
              };
              setSelectedItem(prev => ({
                ...prev,
                ReadedQty: (prev.ReadedQty ?? 0) + 1
              }));
            }
            return newData;
          });

          handleNotify({ message: "Okutma Başarılı.", type: "success" });
          insertToTempTable(newRow);
          return [...prev, newRow];
        }
      });
      if (barcodeRef.current) {
        console.log(barcodeRef.current)
        const input = barcodeRef.current.element().querySelector("input");
        if (input) input.focus();
      }
    } catch (error) {
      console.error("Okutma hatası:", error);
      handleNotify({ message: "Bilinmeyen bir hata oluştu.", type: "error" });
    }
    finally {
      setFormData(prev => ({ ...prev, Barcode: "" }));
      setTimeout(focusBarcodeInput, 50);
    }
  };
  
  const focusBarcodeInput = () => {
    const inst = barcodeRef.current;
    if (!inst) return;

    try {
      if (typeof inst.focus === "function") {
        inst.focus();
      }
    } catch (err) {
      console.log("error", err)
    }
  };
  function extractJson({ str }) {
    const match = str.match(/{.*}/s);
    return match ? JSON.parse(match[0]) : null;
  }

  return (
    <div className="p-4">

       
          <div className="page-container">
            <Form
              formData={formData}
              labelLocation="left"
              colCount={6}
              colCountByScreen={{ lg: 6, md: 6, sm: 6, xs: 6 }}
              className="terminal-form"
            >
              <SimpleItem
                dataField="Barcode"
                editorType="dxTextBox"
                editorOptions={{
                  showClearButton: true,
                  onEnterKey: (e) => {
                    const value = e.component.option("value");
                    handleBarcodeEnter(value);
                    const input = e.component.element().querySelector("input");
                    if (input) input.focus();
                  },
                  onInitialized: (e) => {
                    barcodeRef.current = e.component;
                  },
                }}
                cssClass="transparent-bg"
                label={{ text: 'Barkod', location: 'top' }}
                colSpan={6}
              />


              <SimpleItem
                dataField="LoaderName"
                editorOptions={createTextBoxWithButtonOptions("loader")}
                editorType="dxTextBox"
                cssClass="transparent-bg"
                label={{ text: 'Yükleyen' }}
                colSpan={6}
              />

              <SimpleItem
                dataField="PreparerName"
                editorOptions={createTextBoxWithButtonOptions("preparer")}
                editorType="dxTextBox"
                cssClass="transparent-bg"
                label={{ text: 'Hazırlayan' }}
                colSpan={6}
              />
              <SimpleItem
                dataField="GetBack"
                editorType="dxCheckBox"
                cssClass="transparent-bg"
                label={{ text: 'Geri Al' }}
                colSpan={3}
              />
              <SimpleItem
                dataField="OldBarcode"
                editorType="dxCheckBox"
                cssClass="transparent-bg"
                label={{ text: 'Eski Barkod' }}
                colSpan={3}
              />
              <SimpleItem
                editorType="dxButton"
                editorOptions={{
                  text: "Kaydet",
                  type: "success",
                  stylingMode: "contained",
                  width: "100%",
                  onClick: handleSave
                }}
                colSpan={6}
              />
            </Form>
            <b className="mt-2 font-bold">Kalemler</b>
            <DataGrid
              dataSource={itemGrid}
              columnAutoWidth={true}
              width="100%"
              showBorders={true}
              keyExpr="Index"
              rowAlternationEnabled={true}
              columnMinWidth={100}
              onSelectionChanged={(e) => setSelectedItem(e.selectedRowsData[0])}
              selectedRowKeys={[selectedItem?.Index]}
              selection={{ mode: "single" }}
              className="datagridTerminalDelivery mb-2"
            >
              {terminalItemColumns.map(col => (
                <Column key={col.dataField} {...col} />
              ))}

            </DataGrid>
            <br></br>
            <hr></hr>
            <b className="mt-6 font-bold">Okutulan Partiler</b>
            <DataGrid
              dataSource={batchGrid}
              showBorders={true}
              columnAutoWidth={true}
              width="100%"
              rowAlternationEnabled={true}
              columnMinWidth={100}
              className="datagridTerminalDelivery">
              {terminalBatchColumns.map(col => (
                <Column key={col.dataField} {...col} />
              ))}
            </DataGrid>
          </div>
      <Popup
        visible={isPopupVisibleLoader}
        hideOnOutsideClick={true}
        onHiding={() => togglePopupZoomLayout({ variable: "loader" })}
        showCloseButton={true}
        title='Tedarikçi Listesi'
      >
        <ZoomLayout onRowSelected={handleLoaderSelection} tableName={"EmployeesInfo"} tableKey={"EmployeeID"} notDeleted={employeeFilter} filters={employeeFilter} columns={employeeColumns}></ZoomLayout>
      </Popup>
      <Popup
        visible={isPopupVisiblePreparer}
        hideOnOutsideClick={true}
        onHiding={() => togglePopupZoomLayout({ variable: "preparer" })}
        showCloseButton={true}
        title='Tedarikçi Listesi'
      >
        <ZoomLayout onRowSelected={handlePreparerSelection} tableName={"EmployeesInfo"} tableKey={"EmployeeID"} notDeleted={employeeFilter} filters={employeeFilter} columns={employeeColumns}></ZoomLayout>
      </Popup>
    </div>
  );
};
export default Transfer;
