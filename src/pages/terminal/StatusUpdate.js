import React, { useCallback, useEffect, useState } from "react";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import DataGrid, { Column, Paging, Pager } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { getConsumptions, getCostCenter, getCostingCodes, getDimensions, getEndOfProcessList } from "../../store/terminalSlice";
import { endOfProcessColumns, terminalDeliveryData } from "./data/data";
import { Popup } from "devextreme-react/popup";
import { Grid } from "@mui/material";
import { Layers, PackageOpen, WineOff, } from "lucide-react";
import { useScreenSize } from '../../utils/media-query';
import EopDescPopup from "./components/EopDescPopup";
import { confirm } from "devextreme/ui/dialog";


const StatusUpdate = () => {
  const [endOfProcessGrid, setEndOfProcessGrid] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState('0');
  const [selectedOperationName, setSelectedOperationName] = useState('');
  const [statusCode1, setStatusCode1] = useState('0');
  const [statusCode2, setStatusCode2] = useState('0');
  const [selectedItemCode, setSelectedItemCode] = useState();
  const [selectedBatchNumber, setSelectedBatchNumber] = useState();
  const [formData, setFormData] = useState({ ...terminalDeliveryData });
  const [consumptionGrid, setConsumptionGrid] = useState();
  const [labelGiven, setLabelGiven] = useState(false);
  const [costingCodeList, setCostingCodeList] = useState([]);

  useEffect(() => {
  }, [selectedOperation]);



  useEffect(() => {
    console.log("formData:", formData);

  }, [formData]);

  useEffect(() => {
    console.log("labelGiven:", labelGiven);
  }, [labelGiven]);

  // #region requests


  const endOfProcessList = async ({ status, status2 }) => {
    let list = await getEndOfProcessList({ status: status, status2: status2 });
    setEndOfProcessGrid(list);
    setTabIndex(1);

  };


  // #endregion

  const openDescPopup = (cellData) => {

    const itemCode = cellData.data["MainItemCode"];
    const batchNum = cellData.data["BatchNum"];


    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button
          className="nav-btn"
          icon='send'
          onClick={async () => {

            setSelectedItemCode(itemCode);
            setSelectedBatchNumber(batchNum);
          
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
          
            if (resultConfirm) {
              const costCode = await getCostingCodes();
              setCostingCodeList(costCode);
            }
          
            // consumption list yüklenmeden popup açılmasın
            const list = await getConsumptions({ itemCode, batchNumber: batchNum });
            setConsumptionGrid(list);
          
            setPopupVisibility(true);
          }}
          type="default"
        />
      </div>
    );
  };
  const togglePopup = () => {
    setPopupVisibility(false);    
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
                    onClick={() => {
                      setTabIndex(1);
                      const newStatus = page.newStatusCode;
                      const newStatusName = page.name;
                      const stt1 = page.statusCode;
                      const stt2 = page.statusCode2;
                      setSelectedOperation(newStatus);
                      setSelectedOperationName(newStatusName);
                      setStatusCode1(stt1);
                      setStatusCode2(stt2);
                      endOfProcessList({ status: stt1, status2: stt2 })
                      console.log("status", newStatus);
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
        <Item title="Liste">
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
        </Item>
      </TabPanel>
      <Popup
        visible={isPopupVisible}
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
          gridData={formData}
          consumptions={consumptionGrid}
          itemCode={selectedItemCode}
          batchNum={selectedBatchNumber}
          newStatus={selectedOperation}
          newStatusName={selectedOperationName}
          onClose={togglePopup}
          refresh={() => endOfProcessList({ status: statusCode1, status2: statusCode2 })}
          labelGiven={labelGiven}
          costingCodeList={costingCodeList}
        />
      </Popup>
    </div>
  );
};
export default StatusUpdate;