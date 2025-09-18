import React, { useState } from "react";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { Form, SimpleItem } from 'devextreme-react/form'
import DataGrid, { Column, Paging, Pager } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { getTermDeliveryDoc, getTermDeliveryDocs, terminalStatusControl, terminalWarehouseControl } from "../../store/terminalSlice";
import { terminalDeliveryData } from "./data/data";
import { Popup } from "devextreme-react/popup";
import ZoomLayout from "../../components/myComponents/ZoomLayout";
import { employeeColumns } from "../../data/zoomLayoutData";
import notify from 'devextreme/ui/notify';
const handleNotify = ({ message, type }) => {
  notify(
    {
      message: message,
      width: 720,
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
    terminalDeliveryData.LoaderCode = selectedRowData.EmployeeID;
    terminalDeliveryData.LoaderName = `${selectedRowData.FirstName ?? ""} ${selectedRowData.MiddleName ?? ""} ${selectedRowData.LastName ?? ""}`.trim();
    setPopupVisibilityLoader(false);
  };
  const handlePreparerSelection = (selectedRowData) => {
    terminalDeliveryData.PreparerCode = selectedRowData.EmployeeID;
    terminalDeliveryData.PreparerName = `${selectedRowData.FirstName ?? ""} ${selectedRowData.MiddleName ?? ""} ${selectedRowData.LastName ?? ""}`.trim();
    setPopupVisibilityPreparer(false);
  };

  // #region requests
  const fetchWaitForLoadDocs = async () => {
    let docs = await getTermDeliveryDocs();
    console.log(docs);
    setDeliveryGrid(docs);
  };
  const goForReadBarcodes = async ({ docEntry }) => {
    let items = await getTermDeliveryDoc({ logisticId: docEntry });
    setItemGrid(items)
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
    let getBack = terminalDeliveryData.GetBack;
    let oldBarcode = terminalDeliveryData.OldBarcode;
    // console.log("selecteddata", selectedItem)

    if (!selectedItem) {
      handleNotify({ message: "Lütfen Satır Seçiniz", type: "error" })
      return;
    }
    console.log("oldbarcode",oldBarcode)
    if (!oldBarcode) {
      terminalDeliveryData.Barcode = barcode.substring(3)
    }
    const barcodeValue = terminalDeliveryData.Barcode;
    let itemCode = selectedItem.U_ItemCode;
    const warehouseMsg = await warehouseControl({ itemCode, barcode: barcodeValue });
    if (warehouseMsg) return handleNotify({ message: warehouseMsg, type: "error" });
    const statusMsg = await statusControl({ itemCode, barcode: barcodeValue });
    if (statusMsg) return handleNotify({ message: statusMsg, type: "error" });
    console.log("aisdfj")
  };

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
            <Column
              width="auto"
              dataField="Lojistik No"
              caption="Lojistik No"
              alignment='left'
            />
            <Column
              width="auto"
              dataField="Belge No"
              caption="Belge No"
              alignment='left'
            />
            <Column
              width="auto"
              dataField="Açıklama"
              caption="Açıklama"
              alignment='left'
            />
            <Column
              width="auto"
              dataField="Toplam Palet Miktarı"
              caption="Top. Palet"
              alignment='right'
            />
            <Column
              width="auto"
              dataField="Plaka Kodu"
              caption="Plaka Kodu"
              alignment='left'
            />
            <Column
              width="auto"
              dataField="Şöför"
              caption="Şöför"
              alignment='left'
            />
            <Paging defaultPageSize={10} />
            <Pager showPageSizeSelector={true} />
          </DataGrid>
        </Item>

        {/* TAB 2 - Teslimat */}
        <Item title="Teslimat">
          <div className="page-container">
            <Form
              formData={terminalDeliveryData}
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
                  }
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

              {/* 5. Satır - Kaydet butonu */}
              <SimpleItem
                editorType="dxButton"
                editorOptions={{
                  text: "Kaydet",
                  type: "success",
                  stylingMode: "contained",
                  width: "100%"
                }}
                colSpan={6}
              />
            </Form>
          </div>
          <h6 className="mt-2 font-bold">Kalemler</h6>
          <DataGrid
            dataSource={itemGrid}
            columnAutoWidth={true}
            columnMinWidth={100}
            allowColumnResizing={true}
            width="100%"
            howBorders={true}
            onSelectionChanged={(e) => setSelectedItem(e.selectedRowsData[0])}
            selection={{ mode: "single" }}
            className="datagridTerminalDelivery mb-2"
          >
            <Column
              dataField="U_ItemCode"
              caption="Kalem Kodu"
              alignment='left'
            />
            <Column
              dataField="U_ItemName"
              caption="Kalem Adı"
              alignment='left'
            />
            <Column
              dataField="U_Quantity"
              caption="Miktar"
              alignment='right'
            />
            <Column
              dataField="ReadedQty"
              caption="Okutulan Miktar"
              alignment='right'
            />
            <Column
              dataField="U_OrderNo"
              caption="Sipariş No"
              alignment='left'
            />
            <Column
              dataField="U_OrderLine"
              caption="Sipariş Satır"
              alignment='left'
            />
            <Column
              dataField="U_WhsCode"
              caption="Depo Kodu"
              alignment='left'
            />
            <Column
              dataField="DocEntry"
              caption="Belge No"
              alignment='left'
            />
            <Column
              dataField="LineId"
              caption="Belge Sira"
              alignment='left'
            />
            <Column
              dataField="U_YurtdisiNakliye"
              caption="Yurtdışı Kalem"
              alignment='left'
            />
            <Column
              dataField="U_YurticiNakliye"
              caption="Yurtiçi Kalem"
              alignment='left'
            />
            <Column
              dataField="U_ShipmentType"
              caption="Sevkiyat Türü"
              alignment='left'
            />
            <Column
              dataField="U_Type"
              caption="Tip"
              alignment='left'
            />
            <Column
              dataField="U_CardCode"
              caption="Müşteri Kodu"
              alignment='left'
            />
            <Column
              dataField="U_OcrdNo"
              caption="Tedarikçi"
              alignment='left'
            />
            <Column
              dataField="U_Date"
              caption="Teslimat Tarihi"
              alignment='left'
            />
            <Column
              dataField="U_PalletGrossWgh"
              caption="Brüt Ağırlık"
              alignment='right'
            />
            <Column
              dataField="U_PalletNetWgh"
              caption="Net Ağırlık"
              alignment='right'
            />
            <Column
              dataField="U_PalletType"
              caption="Palet Şekli"
              alignment='left'
            />
            <Column
              dataField="U_Price"
              caption="Fiyat"
              alignment='right'
            />
            <Column
              dataField="U_InnerQtyOfPallet"
              caption="Palet İçi Adet"
              alignment='right'
            />
            <Column
              dataField="StockQuantity"
              caption="Stok Miktarı"
              alignment='right'
            />
            <Column
              dataField="U_PlateCode"
              caption="Plaka Kodu"
              alignment='left'
            />
            <Column
              dataField="U_TrailerPlateCode"
              caption="Dorse Plaka"
              alignment='left'
            />
            <Column
              dataField="U_DriverName"
              caption="Şöför"
              alignment='left'
            />
            <Column
              dataField="U_TradeFileNo"
              caption="Ticaret Dosya No"
              alignment='left'
            />
            <Column
              dataField="U_TransportType"
              caption="Sevkiyat Şekli"
              alignment='left'
            />
            <Column
              dataField="U_Address"
              caption="Adres"
              alignment='left'
            />
            <Column
              dataField="U_County"
              caption="İlçe"
              alignment='left'
            />
            <Column
              dataField="U_City"
              caption="İl"
              alignment='left'
            />
            <Column
              dataField="U_Country"
              caption="Ülke"
              alignment='left'
            />
            <Column
              dataField="U_ZipCode"
              caption="Posta Kodu"
              alignment='left'
            />
            <Column
              dataField="U_BinEntry"
              caption="Depo Yeri Entry"
              alignment='left'
            />
            <Column
              dataField="U_BinCode"
              caption="Depo Yeri"
              alignment='left'
            />
          </DataGrid>

          <h6 className="mt-2 font-bold">Okutulan Partiler</h6>
          <DataGrid
            showBorders={true}
            className="datagridTerminalDelivery">


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
