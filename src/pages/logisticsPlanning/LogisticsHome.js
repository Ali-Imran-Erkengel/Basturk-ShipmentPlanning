import React, { useEffect, useState } from 'react'
import { filter } from '../../store/appSlice';
import { Button } from 'devextreme-react/button';
import DataGrid, { Column, Selection, Lookup } from 'devextreme-react/cjs/data-grid';
import { Grid } from '@mui/material';
import { Form, SimpleItem } from 'devextreme-react/form';
import { filtersConfig, statuses, types, yesno } from './data/data';
import Header from '../../components/myComponents/Header';
import LogisticsAdd from './LogisticsAdd';
import LogisticsUpdate from './LogisticsUpdate';
import LogisticsView from './LogisticsView';
import { useNavigate } from 'react-router-dom';

function LogisticsHome() {
  const tableKey = "DocEntry";
  const tableName = "SML_LGT_HDR";
  const [dataSource, setDataSource] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const notDeleted = ["U_IsDeleted", "=", "N"];
  const navigate = useNavigate();
  const [filterValues, setFilterValues] = useState({
    U_Description: '',
    U_CardName: '',
    U_DriverName: '',
    U_CustomDocNum: '',
    U_Date: '',
    U_Status: '',
    U_County: '',
    U_City: '',
    U_IsDeleted: 'N'
  });
  const yesNoOptions = {
    dataSource: yesno,
    displayExpr: 'Value',
    valueExpr: 'Key'

  };
  const deliveryStatusOptions = {
    dataSource: statuses,
    displayExpr: 'Value',
    valueExpr: 'Key'
  };
  
  const handleBack = () => {
    sessionStorage.setItem('activeComponent', null)
    setActiveComponent(null);
    setSelectedItem('');
  };
  const returnHome = () => {
    navigate("/mainPage")
  }

  const applyFilter = () => {
    const newDataSource = filter({ tableName: tableName, tableKey: tableKey, filtersConfig, filterValues });
    setDataSource(newDataSource);
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
  const renderComponent = () => {
    switch (activeComponent) {
      case 'add':
        return <LogisticsAdd onBack={handleBack} />;
      case 'update':
        if (selectedItem !== '') {
          return <LogisticsUpdate id={selectedItem} onBack={handleBack} />;
        } else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      case 'view':
        if (selectedItem !== '') {
          return <LogisticsView id={selectedItem} onBack={handleBack} />;
        }
        else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      default:
        return (
          <div className='page-container'>
            <Header title={"Lojistik Planlama"} nav='home' onBack={returnHome}></Header>

            <div className="form-container">
              <Form formData={filterValues} colCount={6} labelLocation="top" >
                <SimpleItem dataField="U_Date" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Sevk Tarihi' }} />
                <SimpleItem dataField="U_CustomDocNum" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Belge No' }} />
                <SimpleItem dataField="U_Description" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Açıklama' }} />
                <SimpleItem dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Nakliyeci' }} />
                <SimpleItem dataField="U_DriverName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Şöför' }} />
                <SimpleItem dataField="U_Status" editorType="dxSelectBox" editorOptions={deliveryStatusOptions} cssClass="transparent-bg" label={{ text: 'Durum' }} />
                <SimpleItem dataField="U_County" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Teslim İlçesi' }} />
                <SimpleItem dataField="U_City" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Teslim İli' }} />
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
            </Grid>
            <DataGrid
              selection={true}
              onSelectionChanged={(e) => setSelectedItem(e.selectedRowsData[0]?.DocEntry)}
              dataSource={dataSource}
              keyExpr="DocEntry"
              showBorders={true}
              columnAutoWidth={true}
              allowColumnResizing={true}
            >
              <Selection
                mode="single"
                selectAllMode="page"
              />
              <Column dataField="U_CustomDocNum" sortOrder='desc' caption="Belge No" />
              <Column dataField="U_Date" format="dd/MM/yyyy" caption="Belge Taihi" />
              <Column dataField="U_Description" caption="Açıklama" />
              <Column dataField="U_CardName" caption="Nakliyeci" />
              <Column dataField="U_DriverName" caption="Şöför" />
              <Column dataField="U_Status" caption="Durum" >
                <Lookup dataSource={statuses} displayExpr="Value" valueExpr="Key" />
              </Column>
              <Column dataField="U_Type" caption="Tip" >
                <Lookup dataSource={types} displayExpr="Value" valueExpr="Key" />
              </Column>
              <Column dataField="U_Address" caption="Adres" />
              <Column dataField="U_County" caption="Teslim İlçesi" />
              <Column dataField="U_City" caption="Teslim İli" />
              <Column dataField="U_PalletQuantity" caption="Toplam Miktar" alignment='right' />

            </DataGrid>
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

export default LogisticsHome