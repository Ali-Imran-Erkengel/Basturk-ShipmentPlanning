import React, { useEffect, useState } from 'react'
import { filter, createODataSource, filterWgh } from '../../store/appSlice';
import { Button } from 'devextreme-react/button';
import DataGrid, { Column, Selection, Lookup } from 'devextreme-react/cjs/data-grid';
import { Grid } from '@mui/material';
import { Form, SimpleItem } from 'devextreme-react/form';
import { filtersConfig, statuses, types, yesno } from './data/data';
import Header from '../../components/myComponents/Header';
import WeighbridgeAdd from './WeighbridgeAdd';
import WeighbridgeUpdate from './WeighbridgeUpdate';
import WeighbridgeView from './WeighbridgeView';
import { logisticsColumns, logisticsFilters } from '../../data/zoomLayoutData';
import { Popup } from 'devextreme-react/popup';
import ZoomLayout from '../../components/myComponents/ZoomLayout';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { exportExcelWhgData } from '../../store/weighbridgeSlice';

function WeighbridgeHome() {
  const tableKey = "DocEntry";
  const tableName = "SML_WGHB_HDR";
  const [dataSource, setDataSource] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const customFilter = "";// ["U_IsDeleted", "=", "N"];
  const navigate = useNavigate();
  const [filterValues, setFilterValues] = useState({
    U_Description: '',
    // U_TransactionDate: '',
    startDate:'',
    endDate:'',
    U_LogisticsNo: '',
    U_WghType: '',
     U_IsDeleted:'N'
  });
  const statusOptions = {
    dataSource: statuses,
    displayExpr: 'Value',
    valueExpr: 'Key'
  };
  const yesNoOptions = {
    dataSource: yesno,
    displayExpr: 'Value',
    valueExpr: 'Key'

};
  const [isPopupVisibleLgt, setPopupVisibilityLgt] = useState(false);
  const togglePopupLgt = () => {
    setPopupVisibilityLgt(!isPopupVisibleLgt);
  };
  useEffect(() => {
    // console.log(selectedItem);
  }, [selectedItem])
  useEffect(() => {
    const myDataSource = createODataSource(tableName, tableKey, customFilter);
    setActiveComponent('');
    sessionStorage.setItem('activeComponent', null)
    //açınca bi dert kapatınca bi dert
    setDataSource(myDataSource);
    // console.log(activeComponent)
  }, []);
  const handleBack = () => {
    sessionStorage.setItem('activeComponent', null)
    setActiveComponent(null);
    setSelectedItem('');
  };

  const returnHome = () => {
    navigate("/mainPage")
  }
  const applyFilter = () => {
    const newDataSource = filterWgh({ tableName: tableName, tableKey: tableKey, filtersConfig, filterValues });
    setDataSource(newDataSource);
    // console.log(dataSource)
  };
  const [activeComponent, setActiveComponent] = useState(sessionStorage.getItem('activeComponent') || null);

  const handleRoute = (route) => {
    setActiveComponent(route);
  }
  useEffect(() => {
    if (activeComponent) {

      sessionStorage.setItem('activeComponent', activeComponent);
    }
  }, [activeComponent]);
  const [selectedLgt, setSelectedLgt] = useState(false);
  const textBoxWithButtonOptionsLgt = {

    buttons: [{
      name: "customButton",
      location: "after",
      options: {
        icon: "search",
        onClick: () => {
          togglePopupLgt();
        }
      }
    }]
  };
  const handleLgtSelection = (selectedRowData) => {
    setSelectedLgt(selectedRowData.DocEntry);
    setPopupVisibilityLgt(false);
  };
  const exportToExcel = async () => {
    const items = await exportExcelWhgData({ filterValues: filterValues })
    const preparedData = items.map((item) => ({
      "Belge No": item.DocEntry,
      "İşlem Tarihi ": item.U_TransactionDate,
      "Açıklama": item.U_Description,
      "Tartım Tipi": item.U_WghType === 1 ? "Satış" : item.U_WghType === 2 ? "Alış" : item.U_WghType === 3 ? "Diğer" : "-",
      "Tartım Yapan": item.U_WghPersonName,
      "Plaka": item.U_PlateCode,
      "Şöför Adı": item.U_DriverName,
      "İlk Tartım": item.U_FirstWgh,
      "İlk Tartım Tarihi": item.U_FirstWghDate,
      "İkinci Tartım": item.U_SecondWgh,
      "İkinci Tartım Tarihi": item.U_SecondWghDate,
      "Net": item.U_NetWeight,
      "Fark": item.U_Difference,
      "Lojistik No": item.U_LogisticsNo,
      "Satınalma Siparişli Mal Girişi No": item.U_PODocNo,
      "Belge Toplamı": item.U_DocTotal,

    }));
    const ws = XLSX.utils.json_to_sheet(preparedData);
    const wb = XLSX.utils.book_new();
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year} ${hours}_${minutes}_${seconds}`;
    XLSX.utils.book_append_sheet(wb, ws, "Kantar");

    XLSX.writeFile(wb, `${formattedDate}Kantar.xlsx`);
  };
  const renderComponent = () => {
    switch (activeComponent) {
      case 'add':
        return <WeighbridgeAdd onBack={handleBack} />;
      case 'update':
        if (selectedItem !== '') {
          return <WeighbridgeUpdate id={selectedItem} onBack={handleBack} />;
        } else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      case 'view':
        if (selectedItem !== '') {
          return <WeighbridgeView id={selectedItem} onBack={handleBack} />;
        }
        else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      default:
        return (
          <div className='page-container'>
            <Header title={"Kantar"} nav='home' onBack={returnHome}></Header>

            <div className="form-container">
              <Form formData={filterValues} colCount={6} labelLocation="top" >
                <SimpleItem dataField="U_Description" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Açıklama' }} />
                {/* <SimpleItem dataField="U_TransactionDate" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'İşlem Tarihi' }} /> */}
                <SimpleItem 
  dataField="startDate" 
  editorOptions={{ displayFormat: "dd/MM/yyyy" }} 
  editorType="dxDateBox" 
  cssClass="transparent-bg" 
  label={{ text: 'Başlangıç Tarihi' }} 
/>

<SimpleItem 
  dataField="endDate" 
  editorOptions={{ displayFormat: "dd/MM/yyyy" }} 
  editorType="dxDateBox" 
  cssClass="transparent-bg" 
  label={{ text: 'Bitiş Tarihi' }} 
/>
                <SimpleItem dataField="U_WghType" editorType="dxSelectBox" editorOptions={statusOptions} cssClass="transparent-bg" label={{ text: 'Tartım Tipi' }} />
                <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsLgt, value: selectedLgt }} dataField="U_LogisticsNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Lojistik Belge' }} />
                <SimpleItem dataField="U_IsDeleted" editorType="dxSelectBox" editorOptions={yesNoOptions} cssClass="transparent-bg" label={{ text: 'Silindi' }} /> 
              </Form>
            </div>
            <Grid container spacing={1} paddingBottom={2}>
              <Grid item>
                <Button icon='search' variant="contained" type="success" onClick={applyFilter} />
              </Grid>
              <Grid item>
                <Button icon='eyeopen' variant="contained" type="success" onClick={() => handleRoute('view')} />
              </Grid>
              <Grid item>
                <Button icon='rename' variant="contained" type="success" onClick={() => handleRoute('update')} />
              </Grid>
              <Grid item>
                <Button icon='add' variant="contained" type="success" onClick={() => handleRoute('add')} />
              </Grid>
              <Grid item>
                <Button icon='exportxlsx' variant="contained" type="success" onClick={() => exportToExcel()} />
              </Grid>
            </Grid>
            <DataGrid

              selection={true}
              onSelectionChanged={(e) => setSelectedItem(e.selectedRowsData[0]?.DocEntry)}
              dataSource={dataSource}
              keyExpr="DocEntry"
              showBorders={true}
              columnAutoWidth={true}
              allowColumnResizing={true}
              onRowPrepared={(e) => {
                if (e.rowType === "data") {
                  if (e.data.U_SecondWghDone === "N") {
                    e.rowElement.style.backgroundColor = "rgba(235, 232, 66, 0.774)"; // N için sarı
                  } else if (e.data.U_SecondWghDone === "Y") {
                    e.rowElement.style.backgroundColor =  "rgba(90, 240, 103, 0.774)"; // Y için yeşil
                  }
                }
                if (e.rowElement.classList.contains("dx-selection")) {
                  e.rowElement.style.backgroundColor = "rgba(30, 155, 204, 0.836)"; // Seçili satır için mavi ton
                  e.rowElement.style.color = "white"; // Yazıyı beyaz yaparak kontrastı artır
                  e.rowElement.style.fontWeight = "bold"; // Yazıyı kalın yap
                }
              }}
            >
              <Selection
                mode="single"
                selectAllMode="page"
              />
              <Column dataField="DocEntry"  caption="Kantar No" sortOrder='desc' alignment='left'/>
              <Column dataField="U_TransactionDate" format="dd/MM/yyyy" caption="Belge Taihi" />
              <Column dataField="U_SecondWghDone" caption="İkinci Tartım Yapıldı Mı?"  >
                <Lookup dataSource={yesno} displayExpr="Value" valueExpr="Key" />
              </Column>
              <Column dataField="U_Description" caption="Açıklama" />
              <Column dataField="U_WghType" caption="Tip" >
                <Lookup dataSource={types} displayExpr="Value" valueExpr="Key" />
              </Column>
              <Column dataField="U_LogisticsNo" caption="Lojistik Belge No" alignment='left' />
              <Column dataField="U_PODocNo" caption="Satınalma Siparişi No" alignment='left' />
              <Column dataField="U_DriverName" caption="Şöför" />
              <Column dataField="U_PlateCode" caption="Plaka" />
              {/* <Column dataField="U_Status" caption="Durum" >
                <Lookup dataSource={statuses} displayExpr="Value" valueExpr="Key" />
              </Column> */}
            </DataGrid>
            <Popup
              visible={isPopupVisibleLgt}
              hideOnOutsideClick={true}
              onHiding={togglePopupLgt}
            >
              <ZoomLayout onRowSelected={handleLgtSelection} tableName={"SML_LGT_HDR"} tableKey={"DocEntry"} customFilter={""} filters={logisticsFilters} columns={logisticsColumns}></ZoomLayout>
            </Popup>
          </div>
        )
    }
  };
  return (
    <div>
      {renderComponent()}
    </div>
  );
}

export default WeighbridgeHome