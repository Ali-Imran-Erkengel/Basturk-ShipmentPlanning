import React, { useEffect, useState } from 'react'
import { filter, createODataSource } from '../../../store/appSlice';
import { Button } from 'devextreme-react/button';
import DataGrid, { Column, Selection } from 'devextreme-react/cjs/data-grid';
import { Grid } from '@mui/material';
import Header from '../../../components/myComponents/Header';
import VehicleAdd from './VehicleAdd';
import VehicleUpdate from './VehicleUpdate';
import VehicleView from './VehicleView';
import { Form, SimpleItem } from 'devextreme-react/form';
import { filtersConfig, yesno } from './data/data';
import { useNavigate } from 'react-router-dom';

function VehicleHome() {
  const tableKey = "DocEntry";
  const tableName = "SML_BAS_VHL";
  const [dataSource, setDataSource] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const navigate = useNavigate();
  

  const [filterValues, setFilterValues] = useState({
    U_TrailerPlateCode: '',
    U_PlateCode: '',
    U_Name: '',
    U_Surname: '',
    U_CardName: '',
    U_IsDeleted: 'N'
  });
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
    navigate("/supportTables")
  }

  const applyFilter = () => {
    const newDataSource = filter({ tableName: tableName, tableKey: tableKey, filtersConfig, filterValues });
    setDataSource(newDataSource);
  };
  const [activeComponent, setActiveComponent] = useState(sessionStorage.getItem('activeComponent') || null);
  const handleRoute = (route) => {
    setActiveComponent(route);
  }
  const yesNoOptions = {
    dataSource: yesno,
    displayExpr: 'Value',
    valueExpr: 'Key'
  
  };
  useEffect(() => {
    if (activeComponent) {
      sessionStorage.setItem('activeComponent', activeComponent);
    }
  }, [activeComponent]);
  const renderComponent = () => {
    switch (activeComponent) {
      case 'add':
        return <VehicleAdd onBack={handleBack} />;
      case 'update':
        if (selectedItem !== '') {
          return <VehicleUpdate id={selectedItem} onBack={handleBack} />;
        } else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      case 'view':
        if (selectedItem !== '') {
          return <VehicleView id={selectedItem} onBack={handleBack} />;
        }
        else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      default:
        return (
          <div className='page-container'>
            <Header title={"Araç Destek Tablosu"} nav='home' onBack={returnHome}></Header>

            <div className="form-container">
              <Form formData={filterValues} colCount={6} labelLocation="top" >
                <SimpleItem dataField="U_PlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                <SimpleItem dataField="U_TrailerPlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />
                <SimpleItem dataField="U_Name" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Şöför Adı' }} />
                <SimpleItem dataField="U_Surname" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Şöför Soyadı' }} />
                <SimpleItem dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muahtap' }} />
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
            >
              <Selection
                mode="single"
                selectAllMode="page"
              />
              <Column dataField="U_PlateCode" caption="Çekici Plaka" />
              <Column dataField="U_TrailerPlateCode" caption="Dorse Plaka" />
              <Column dataField="U_Name" caption="Şöför Adı" />
              <Column dataField="U_Surname" caption="Şöför Soyadı" />
              <Column dataField="U_CardName" caption="Muhatap" />
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

export default VehicleHome