import React, { useRef, useState } from "react";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { Form, SimpleItem } from 'devextreme-react/form'
import DataGrid, { Column, Paging, Pager } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { getTermDeliveryDoc, getTermDeliveryDocs, saveDelivery, terminalBinControl, terminalStatusControl, terminalWarehouseControl } from "../../store/terminalSlice";
import { deliveryColumns, terminalBatchColumns, terminalDeliveryData, terminalItemColumns } from "./data/data";
import { Popup } from "devextreme-react/popup";
import ZoomLayout from "../../components/myComponents/ZoomLayout";
import { employeeColumns } from "../../data/zoomLayoutData";
import notify from 'devextreme/ui/notify';
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

const Delivery = () => {
  const [deliveryGrid, setDeliveryGrid] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [itemGrid, setItemGrid] = useState();
  const [batchGrid, setBatchGrid] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [isPopupVisibleLoader, setPopupVisibilityLoader] = useState(false);
  const [isPopupVisiblePreparer, setPopupVisibilityPreparer] = useState(false);
  const [formData, setFormData] = useState({ ...terminalDeliveryData });
  const employeeFilter = ["Department", "=", 10];


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
    setItemGrid(itemsWithIndex)
    setFormData({ ...terminalDeliveryData })
    setBatchGrid([]);
    setTabIndex(1);
  };
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
  const handleSave = async () => {
    try {
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
      handleNotify({ message: "Kayıt başarılı", type: "success" });
    } catch (err) {
      console.error("Kaydetme hatası:", err);
      const parsed = extractJson({ str: err.response.data });
      handleNotify({ message: parsed["message"], type: "error" });
    }
  };
  // #endregion
  const goToDelivery = (cellData) => {
    let docEntry = cellData.data["Lojistik No"];
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          icon='send'
          onClick={() => goForReadBarcodes({ docEntry: docEntry })}
          type="default"
        />

      </div>
    );
  };
  const handleBarcodeEnter = async (barcode) => {
    console.log("selected", selectedItem)
    if (!selectedItem) {
      handleNotify({ message: "Lütfen Satır Seçiniz", type: "error" })
      return;
    }
    let getBack = formData.GetBack;
    let oldBarcode = formData.OldBarcode;
    let itemCode = selectedItem.U_ItemCode;
    let quantity = selectedItem.U_Quantity;
    let readedQuantity = selectedItem.ReadedQuantity ?? 0;
    let whsCode = selectedItem.U_WhsCode;
    let innerQtyOfPallet = selectedItem.U_InnerQtyOfPallet;
    let index = selectedItem.Index;
    // console.log("selecteddata", selectedItem)
    let barcodeValue = formData.Barcode;
    console.log("oldbarcode", oldBarcode)
    if (!oldBarcode) {
      barcodeValue = barcode.substring(3)
    }
    const warehouseMsg = await warehouseControl({ itemCode, barcode: barcodeValue });
    if (warehouseMsg) return handleNotify({ message: warehouseMsg, type: "error" });
    const statusMsg = await statusControl({ itemCode, barcode: barcodeValue });
    if (statusMsg) return handleNotify({ message: statusMsg, type: "error" });
    if (readedQuantity < 0) return handleNotify({ message: "Miktar 0' ın Altına Düşemez", type: "error" });
    if (readedQuantity > quantity) return handleNotify({ message: "Miktar Teslimat Miktarını Geçemez", type: "error" });
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
          }
          return newData;
        });

        handleNotify({ message: "Okutma Başarılı.", type: "success" });
        return [...prev, newRow];
      }
    });
    formData.Barcode = "";
    setSelectedItem(prev => ({ ...prev }));

  };

  function extractJson({ str }) {
    const match = str.match(/{.*}/s);
    return match ? JSON.parse(match[0]) : null;
  }
  const barcodeRef = useRef(null);

  return (
    <div className="p-4">
      <TabPanel
        selectedIndex={tabIndex}
        onSelectionChanged={(e) => setTabIndex(e.component.option("selectedIndex"))}
        swipeEnabled={false}
      >
        {/* TAB 1 - Belge Seç */}
        <Item title="Belge Seç">
          <div className="mb-2">
            <Button text="Yenile" type="default" stylingMode="contained"
              onClick={fetchWaitForLoadDocs} />
          </div>
          <DataGrid
            dataSource={deliveryGrid}
            className='datagridTerminalDelivery'
            columnAutoWidth={true}
            columnMinWidth={120}
            allowColumnResizing={true}
            width="auto"
            rowAlternationEnabled={true}
            showBorders={true}
          >
            <Column
              width="auto"
              alignment='left'
              caption="İşlem"
              cellRender={goToDelivery}
            />
            {deliveryColumns.map((col) => (
              <Column key={col.dataField} {...col} />
            ))}
            <Paging defaultPageSize={10} />
            <Pager showPageSizeSelector={true} />
          </DataGrid>
        </Item>

        {/* TAB 2 - Teslimat */}
        <Item title="Teslimat">
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
                    e.component.focus();
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
          </div>
          <b className="mt-2 font-bold">Kalemler</b>
          <DataGrid
            dataSource={itemGrid}
            columnAutoWidth={true}
            width="100%"
            showBorders={true}
            keyExpr="Index"

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
            className="datagridTerminalDelivery">
            {terminalBatchColumns.map(col => (
              <Column key={col.dataField} {...col} />
            ))}
          </DataGrid>
        </Item>
      </TabPanel>
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
export default Delivery;
