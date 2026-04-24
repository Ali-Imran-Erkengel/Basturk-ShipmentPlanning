import React, { useCallback, useEffect, useState } from "react";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import DataGrid, { Column, Paging, Pager, LoadPanel } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { eopStatusControl, getConsumptions, getCostCenter, getCostingCodes, getDimensions, getEndOfProcessList } from "../../store/terminalSlice";
import { endOfProcessColumns, terminalDeliveryData } from "./data/data";
import { Popup } from "devextreme-react/popup";
import { Grid } from "@mui/material";
import { Layers, PackageOpen, WineOff, } from "lucide-react";
import { useScreenSize } from '../../utils/media-query';
import EopDescPopup from "./components/EopDescPopup";
import { confirm } from "devextreme/ui/dialog";
import { DateBox } from "devextreme-react/date-box";
import notify from "devextreme/ui/notify";
import { alert } from "devextreme/ui/dialog";


const StatusUpdate = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [endOfProcessGrid, setEndOfProcessGrid] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState('0');
  const [selectedOperationName, setSelectedOperationName] = useState('');
  const [statusCode1, setStatusCode1] = useState('0');
  const [statusCode2, setStatusCode2] = useState('0');
  // const [selectedItemCode, setSelectedItemCode] = useState();
  const [selectedBatchNumber, setSelectedBatchNumber] = useState();
  const [formData, setFormData] = useState({ ...terminalDeliveryData });
  const [consumptionGrid, setConsumptionGrid] = useState();
  const [labelGiven, setLabelGiven] = useState(false);
  const [endDate, setEndDate] = useState(today);
  const [startDate, setStartDate] = useState(today);
  const [isLoading, setIsLoading] = useState(false);
  const [isBarcodePopupVisible, setBarcodePopupVisible] = useState(false);
  const [isDetailPopupVisible, setDetailPopupVisible] = useState(false);
  const inputRef = React.useRef(null);
  const [barcode, setBarcode] = useState("");
  const [useOldBarcode, setUseOldBarcode] = useState(false);

  const handleMessageBox = ({ message, type }) => {
    let title = "Bilgi";
    if (type === "error")
      title = "Uyarı";
    if (type === "success")
      title = "Başarılı";
    if (type === "warning")
      title = "Uyarı";
    alert(message, title);
  };
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
      5000
    );
  }

  useEffect(() => {
  }, [selectedOperation]);



  useEffect(() => {
    console.log("formData:", formData);

  }, [formData]);

  useEffect(() => {
    console.log("labelGiven:", labelGiven);
  }, [labelGiven]);

  const endOfProcessList = async ({ status, status2 }) => {

    if (!startDate || !endDate) {
      handleMessageBox({ message: "Başlangıç ve bitiş tarihi boş olamaz.", type: "warning" });
      return;
    }

    if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
      handleMessageBox({ message: "Geçersiz tarih formatı.", type: "warning" });
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      handleMessageBox({ message: "Bitiş tarihi başlangıç tarihinden küçük olamaz.", type: "warning" });
      return;
    }
    try {
      setIsLoading(true);
      setEndOfProcessGrid([]);
      let list = await getEndOfProcessList({ status: status, status2: status2, startDate: startDate, endDate: endDate });
      setEndOfProcessGrid(list);
      setTabIndex(1)
    } catch (error) {
      handleMessageBox({ message: "Liste yüklenirken bir hata oluştu. " + error, type: "error" });
    }
    finally {
      setIsLoading(false);
    }
    ;

  };


  // #endregion

  const openDescPopup = async (barcodeValue) => {

    // const itemCode = cellData.data["MainItemCode"];
    //const batchNum = cellData.data["BatchNum"];


    // setSelectedItemCode(itemCode);
    setSelectedBatchNumber(barcodeValue);
    //-8 emrayr
    //-10 kırık
    //-9 repack
    const statusControl = await eopStatusControl({ batchNumber: barcodeValue, operationCode: selectedOperation });
    debugger
    if (statusControl) {
      if(statusControl.length===0)
        return handleMessageBox({ message: "Kayıt Bulunamadı", type: "error" });
      let validationRes = statusControl[0].ValidationResult;
      if (validationRes === "FAIL") {
        let validationMessage = statusControl[0].ValidationMessage;
        return handleMessageBox({ message: validationMessage, type: "error" });
      }
    }
    else {
      return handleMessageBox({ message: "Kayıt Bulunamadı", type: "error" });

    }
    let resultConfirm = true;

    if (selectedOperation === '-9') {
      resultConfirm = await confirm({
        title: "Onay",
        messageHtml: "<b>Etiket verildi mi?</b>",
        buttons: [
          { text: "Evet", type: "default", onClick: () => true },
          { text: "Hayır", onClick: () => false }
        ]
      });
    }

    setLabelGiven(resultConfirm);


    const list = await getConsumptions({ batchNumber: barcodeValue, labelGiven: resultConfirm });
    let len = list.length;
    if (len === 0) {
      return handleMessageBox({ message: "Kayıt Bulunamadı", type: "error" })
    }
    setConsumptionGrid(list);
    setBarcodePopupVisible(false);
    setDetailPopupVisible(true);

  };
  const togglePopup = () => {
    setDetailPopupVisible(false);
  };
  const handleBarcodeSearch = async () => {
    if (!barcode) return;
    let oldBarcode = useOldBarcode;
    let barcodeValue = barcode;
    if (!oldBarcode) {
      barcodeValue = barcode.substring(3)
    }

    try {
      setIsLoading(true);
      await openDescPopup(barcodeValue);

    } catch (err) {
      handleMessageBox({ message: "Barkod arama hatası", type: "error" });
    } finally {
      setIsLoading(false);


    }
  };
  const { isXSmall } = useScreenSize();
  const pages = [
    { name: "Emr Ayr", icon: Layers, newStatusCode: "-8", statusCode: "-2", statusCode2: "-4", color: "#20c997", code: "EMR" },
    { name: "Kırık", icon: WineOff, newStatusCode: "-10", statusCode: "-2", statusCode2: "-4", color: "#6f42c1", code: "BRK" },
    { name: "Repack", icon: PackageOpen, newStatusCode: "-9", statusCode: "-3", statusCode2: "-5", color: "#fd7e14", code: "REP" }
  ];
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
    flexDirection: isXSmall ? "column" : "row"
  };
  const cardStyle = {
    flex: isXSmall ? "1 1 100%" : "1 1 200px",
    minHeight: "120px",
    cursor: "pointer",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };
  const iconStyle = { marginBottom: "8px" };
  const titleStyle = { fontWeight: 600, textAlign: "center", fontSize: "24px" };
  return (
    <div className="p-4">
      <TabPanel
        selectedIndex={tabIndex}
        onSelectionChanged={(e) => setTabIndex(e.component.option("selectedIndex"))}
        swipeEnabled={false}
      >
        <Item title="Operasyon">
          <div className="page-container">

            <div style={containerStyle}>
              {pages.map(page => {
                const Icon = page.icon;
                return (
                  <div
                    key={page.name}
                    style={{
                      ...cardStyle,
                      backgroundColor: page.color + "33"
                    }}
                    // onClick={() => {
                    //   setTabIndex(1);
                    //   const newStatus = page.newStatusCode;
                    //   const newStatusName = page.name;
                    //   const stt1 = page.statusCode;
                    //   const stt2 = page.statusCode2;
                    //   setSelectedOperation(newStatus);
                    //   setSelectedOperationName(newStatusName);
                    //   setStatusCode1(stt1);
                    //   setStatusCode2(stt2);
                    //   endOfProcessList({ status: stt1, status2: stt2 })
                    //   console.log("status", newStatus);
                    // }}
                    onClick={() => {
                      const newStatus = page.newStatusCode;
                      const newStatusName = page.name;
                      const stt1 = page.statusCode;
                      const stt2 = page.statusCode2;

                      setSelectedOperation(newStatus);
                      setSelectedOperationName(newStatusName);
                      setStatusCode1(stt1);
                      setStatusCode2(stt2);

                      setBarcodePopupVisible(true);


                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = `0 4px 16px ${page.color}66`;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                    }}
                  >
                    <Icon size={32} style={{ ...iconStyle, color: page.color }} />
                    <div style={titleStyle}>{page.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </Item>
        {/* <Item title="Liste">
          <div className="page-container">
            <div style={{ marginBottom: "20px" }}>
              <Grid
                container
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
                paddingBottom={1}
              >
                <Grid item>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        className="nav-btn"
                        icon="arrowleft"
                        type="default"
                        stylingMode="contained"
                        onClick={() => setTabIndex(0)}
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        className="nav-btn"
                        icon="refresh"
                        type="default"
                        stylingMode="contained"
                        onClick={() => endOfProcessList({ status: statusCode1, status2: statusCode2 })} />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <DateBox
                    type="date"
                    value={startDate}
                    displayFormat="dd.MM.yyyy"
                    width={150}
                    showClearButton={false}
                    useMaskBehavior={true}
                    onValueChanged={(e) => {
                      if (!e.value) {
                        handleMessageBox({ message: "Geçersiz tarih girdiniz.", type: "error" });
                        return;
                      }
                      setStartDate(e.value);
                    }}
                  />
                </Grid>

                <Grid item>
                  <DateBox
                    type="date"
                    value={endDate}
                    displayFormat="dd.MM.yyyy"
                    width={150}
                    showClearButton={false}
                    min={startDate}
                    useMaskBehavior={true}
                    onValueChanged={(e) => {
                      if (!e.value) {
                        handleMessageBox({ message: "Geçersiz tarih girdiniz.", type: "error" });
                        return;
                      }
                      setEndDate(e.value);
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.53rem" }}>
                    {selectedOperationName}
                  </div>
                </Grid>
                <Grid item style={{ width: 100 }}></Grid>
              </Grid>
            </div>
            <DataGrid
              dataSource={endOfProcessGrid}
              className='datagridTerminalDelivery'
              columnAutoWidth={true}
              columnMinWidth={120}
              allowColumnResizing={true}
              width="auto"

              rowAlternationEnabled={true}
              showBorders={true}
            >
              <LoadPanel enabled={isLoading} />
              <Column
                width="auto"
                alignment='left'
                caption="İşlem"
                cellRender={openDescPopup}
              />
              {endOfProcessColumns.map((col) => (
                <Column key={col.dataField} {...col} />
              ))}
              <Paging defaultPageSize={10} />
              <Pager showPageSizeSelector={true} />
            </DataGrid>
          </div>
        </Item> */}
      </TabPanel>
      <Popup
        visible={isDetailPopupVisible}
        onHiding={togglePopup}
        hideOnOutsideClick={true}
        fullScreen={true}
        showCloseButton={true}
        title='Açıklama'
        wrapperAttr={{
          class: 'terminal-popup'
        }}
      >
        <EopDescPopup
          // gridData={formData}
          consumptions={consumptionGrid}
          // itemCode={selectedItemCode}
          batchNum={selectedBatchNumber}
          newStatus={selectedOperation}
          newStatusName={selectedOperationName}
          onClose={togglePopup}
          // refresh={() => endOfProcessList({ status: statusCode1, status2: statusCode2 })}
          labelGiven={labelGiven}
        />
      </Popup>
      <Popup
        visible={isBarcodePopupVisible}
        onHiding={() => setBarcodePopupVisible(false)}
        hideOnOutsideClick={true}
        showCloseButton={true}
        title="Barkod Okut"
        dragEnabled={false}
        onShown={() => {
          setBarcode("");
          inputRef.current?.focus();
        }}
        width={isXSmall ? "90%" : 450}
        height={isXSmall ? "auto" : 320}
        wrapperAttr={{ class: 'barcode-popup-wrapper' }}
      >
        <div style={{ padding: 25, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 600, textAlign: "center", color: "#555" }}>
            Lütfen barkodu okutun veya girin
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Barkod okut..."
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBarcodeSearch();
            }}
            style={{
              width: "100%",
              padding: 20,
              fontSize: 22,
              borderRadius: 10,
              border: "1px solid #ccc",
              textAlign: "center",
              outline: "none",
              boxShadow: "0 3px 8px rgba(0,0,0,0.15)"
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={useOldBarcode}
              onChange={(e) => setUseOldBarcode(e.target.checked)}
              id="oldBarcodeCheckbox"
            />
            <label htmlFor="oldBarcodeCheckbox" style={{ fontSize: 14 }}>
              Eski barkodu kullan
            </label>
          </div>
          <Button
            text="Ara"
            type="default"
            stylingMode="contained"
            onClick={handleBarcodeSearch}
            style={{
              fontSize: 18,
              padding: "12px 0",
            }}
          />
        </div>
      </Popup>
    </div>
  );
};
export default StatusUpdate;