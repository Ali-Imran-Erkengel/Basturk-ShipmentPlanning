import React, { useEffect, useState } from 'react'
import { filter, createODataSource } from '../../store/appSlice';
import { Button } from 'devextreme-react/button';
import DataGrid, { Column, Selection, Lookup } from 'devextreme-react/cjs/data-grid';
import { Grid } from '@mui/material';
import { Form, SimpleItem } from 'devextreme-react/form';
import { filtersConfig, statuses, yesno } from './data/data';
import Header from '../../components/myComponents/Header';
import ShipmentAdd from './ShipmentAdd';
import ShipmentUpdate from './ShipmentUpdate';
import ShipmentView from './ShipmentView';
import { useNavigate } from 'react-router-dom';

function ShipmentHome() {
  const tableKey = "DocEntry";
  const tableName = "SML_SHP_HDR";
  const [dataSource, setDataSource] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const navigate = useNavigate();
  const [filterValues, setFilterValues] = useState({
    DocEntry: '',
    U_Description: '',
    U_Date: '',
    U_County: '',
    U_City: '',
    U_DeliveryStatus: '',
    U_IsDeleted: 'N'

  });
  const yesNoOptions = {
    dataSource: yesno,
    displayExpr: 'Value',
    valueExpr: 'Key'

  };

  useEffect(() => {
  }, [selectedItem])
  useEffect(() => {
    const myDataSource = createODataSource(tableName, tableKey);
    setActiveComponent('');
    sessionStorage.setItem('activeComponent', null)
    //açınca bi dert kapatınca bi dert
    setDataSource(myDataSource);

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
        return <ShipmentAdd onBack={handleBack} />;
      case 'update':
        if (selectedItem !== '') {
          return <ShipmentUpdate id={selectedItem} onBack={handleBack} />;
        } else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      case 'view':
        if (selectedItem !== '') {
          return <ShipmentView id={selectedItem} onBack={handleBack} />;
        }
        else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      default:
        return (
          <div className='page-container'>
            <Header title={"Sevkiyat Planlama"} nav='home' onBack={returnHome}></Header>

            <div className="form-container">
              <Form formData={filterValues} colCount={6} labelLocation="top" >
                <SimpleItem dataField="DocEntry" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Sevkiyat No' }} />
                <SimpleItem dataField="U_Description" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Açıklama' }} />
                <SimpleItem dataField="U_Date" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Belge Tarihi' }} />
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
              <Column dataField="DocEntry" caption="Sevkiyat No" sortOrder='desc' alignment='left' />
              <Column dataField="U_Date" format="dd/MM/yyyy" caption="Teslim Tarihi" />
              <Column dataField="U_Description" caption="Açıklama" />
              <Column dataField="U_Address" caption="Adres" />
              <Column dataField="U_County" caption="Teslim İlçesi" />
              <Column dataField="U_City" caption="Teslim İli" />
              {/* <Column dataField="U_DeliveryStatus" caption="Durum" >
                <Lookup dataSource={statuses} displayExpr="Value" valueExpr="Key" />
              </Column> */}
              <Column dataField="U_PalletQuantity" caption="Palet Miktarı" />
              <Column dataField="U_ContainerQuantity" caption="Gereken Konteyner Miktarı" />
              <Column dataField="U_TruckQuantity" caption="Gereken Tır Miktarı" />
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

export default ShipmentHome