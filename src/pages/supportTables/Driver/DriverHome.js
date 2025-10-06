import React, { useEffect, useState } from 'react'
import { filter, createODataSource } from '../../../store/appSlice';
import { Button } from 'devextreme-react/button';
import DataGrid, { Column, Selection } from 'devextreme-react/cjs/data-grid';
import { Grid } from '@mui/material';
import Header from '../../../components/myComponents/Header';
import DriverAdd from './DriverAdd';
import DriverUpdate from './DiverUpdate';
import DriverView from './DriverView';
import { Form, SimpleItem } from 'devextreme-react/form';
import { filtersConfig, formData, phoneOptions } from './data/data';
import { Popup } from 'devextreme-react/popup';
import { businessPartnersColumns, businessPartnersFilters } from '../../../data/zoomLayoutData';
import ZoomLayout from '../../../components/myComponents/ZoomLayout';
import { useNavigate } from 'react-router-dom';

function DriverHome() {
  const navigate=useNavigate();
  const tableKey = "DocEntry";
  const tableName = "SML_BAS_DRV";
  const [dataSource, setDataSource] = useState(null);
  const [selectedItem, setSelectedItem] = useState('');
  const customFilter = ["U_IsDeleted", "=", "N"];
  const cardSector = [["Industry", "=", 8],["CardType","=","cSupplier"]]

  const [filterValues, setFilterValues] = useState({
    U_Vehicle: '',
    U_PlateCode: '',
    U_VehicleCode: '',
    U_VehicleType: ''
  });
  useEffect(() => {
  }, [selectedItem])
  useEffect(() => {
    const myDataSource = createODataSource(tableName, tableKey, customFilter);
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
  const returnHome=()=>{
   navigate("/supportTables") 
  }
  const handleRowSelection = (selectedRowData) => {
    setSelectedCardCode(selectedRowData.CardCode);
    setPopupVisibility(false);
  };
  const [selectedCardCode, setSelectedCardCode] = useState(formData.U_CardCode || '');
  const textBoxWithButtonOptions = {

    buttons: [{
      name: "customButton",
      location: "after",
      options: {
        icon: "search",
        onClick: () => {
          togglePopup();
        }
      }
    }]
  };
  const [isPopupVisible, setPopupVisibility] = useState(false);
  const togglePopup = () => {
    setPopupVisibility(!isPopupVisible);
  };
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
        return <DriverAdd onBack={handleBack} />;
      case 'update':
        if (selectedItem !== '') {
          return <DriverUpdate id={selectedItem} onBack={handleBack} />;
        } else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      case 'view':
        if (selectedItem !== '') {
          return <DriverView id={selectedItem} onBack={handleBack} />;
        }
        else {
          alert('Lütfen Satır Seçiniz');
          setActiveComponent(null);
          return null;
        }
      default:
        return (
          <div className='page-container'>
            <Header title={"Şöför Destek Tablosu"} nav='home' onBack={returnHome}></Header>

            <div className="form-container">
              <Form formData={filterValues} colCount={6} labelLocation="top" >
                <SimpleItem dataField="U_Name" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ad' }} />
                <SimpleItem dataField="U_MiddleName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İkinci Ad' }} />
                <SimpleItem dataField="U_Surname" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Soyad' }} />
                <SimpleItem dataField="U_IdentityNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'TC Kimlik No' }} />
                <SimpleItem dataField="U_Phone1" editorOptions={phoneOptions} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 1' }} />
                <SimpleItem dataField="U_Phone2" editorOptions={phoneOptions} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 2' }} />
                <SimpleItem editorOptions={{ ...textBoxWithButtonOptions, value: selectedCardCode }} dataField="U_CardCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Nakliyeci' }} />
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
              <Column dataField="U_Name" caption="Ad" />
              <Column dataField="U_MiddleName" caption="İkinci Ad" />
              <Column dataField="U_Surname" caption="Soyad" />
              <Column dataField="U_IdentityNo" caption="TC Kimlik No" />
              <Column dataField="U_Phone1" editorOptions={phoneOptions} caption="Telefon 1" />
              <Column dataField="U_Phone2" editorOptions={phoneOptions} caption="Telefon 2" />
              <Column dataField="U_CardName" caption="Nakliyeci" />
            </DataGrid>
            <Popup
             title='Nakliyeciler'
              visible={isPopupVisible}
              hideOnOutsideClick={true}
              onHiding={togglePopup}
              showCloseButton={true}
               height="auto"
            >
              <ZoomLayout onRowSelected={handleRowSelection} tableName={"BusinessPartners"} tableKey={"CardCode"} customFilter={cardSector} filters={businessPartnersFilters} columns={businessPartnersColumns}></ZoomLayout>
              {/* <ZoomLayout onRowSelected={handleRowSelection} tableName={"Items"} tableKey={"ItemCode"} customFilter={""} filters={itemsFilters} columns={itemsColumns}></ZoomLayout> */}
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

export default DriverHome