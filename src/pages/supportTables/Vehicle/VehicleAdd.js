import { Form, GroupItem, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/myComponents/Header';
import { formData as initialFormData, phoneOptions, vehicle_driver } from './data/data';
import { Column, DataGrid, Editing, Lookup } from 'devextreme-react/data-grid';
import { createODataSource, createODataSourceChild } from '../../../store/appSlice';
import ZoomLayout from '../../../components/myComponents/ZoomLayout';
import { Popup } from 'devextreme-react/popup';
import { businessPartnersColumns, businessPartnersFilters, trailerTypeColumns, trailerTypeFilters } from '../../../data/zoomLayoutData';
import { Item, TabPanel } from 'devextreme-react/tab-panel';
import { Button } from 'devextreme-react/button';
import OpenBusinessPartners from './components/OpenBusinessPartners';

const tableName = "SML_BAS_VHL";



function VehicleAdd({ onBack }) {
    const [driverDataSource, setDriverDataSource] = useState(null);
    const [formData, setFormData] = useState({ ...initialFormData });
    const [isPopupVisibleTrailer, setPopupVisibilityTrailer] = useState(false);
    const [selectedTrailer, setSelectedTrailer] = useState(initialFormData.U_TrailerType || '');
    const [isPopupVisibleCard, setPopupVisibilityCard] = useState(false);
    useEffect(() => {
        setFormData({ ...initialFormData });
        const drivers = createODataSource("SML_BAS_DRV", "DocEntry");
        setDriverDataSource(drivers);

    }, [])
    const togglePopupCard = () => {
        setPopupVisibilityCard(!isPopupVisibleCard);
    }
    const handleRowSelectionCard = (selectedRowData) => {
        //setGridData(selectedRowData);
        setPopupVisibilityCard(false);
    };
    const bpDataAddAfter = () => {
        setPopupVisibilityCard(false);
    };
    const driverOptions = {
        dataSource: driverDataSource,
        displayExpr: (item) => {
            if (item) {
                return `${item.U_Name} ${item.U_MiddleName} ${item.U_Surname}`;
            }
            return '-';
        },
        valueExpr: 'DocEntry',


    };
    const togglePopupTrailer = () => {
        setPopupVisibilityTrailer(!isPopupVisibleTrailer);
    };
    const textBoxWithButtonOptionsTrailer = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    togglePopupTrailer();
                }
            }
        }]
    };
    const handleTrailerSelection = async (selectedRowData) => {
        setSelectedTrailer(selectedRowData.DocEntry);
        setPopupVisibilityTrailer(false);
    };

    const cardSector = [["Industry", "=", 8], ["CardType", "=", "cSupplier"]]
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
    const handleRowSelection = (selectedRowData) => {
        setSelectedCardCode(selectedRowData.CardCode);
        formData.U_CardName = selectedRowData.CardName;
        setPopupVisibility(false);
    };
    return (
        <div>
            <div className="page-container">
                <form >
                    <Header save={true} trash={false} title={"Araç-Şöför Ekle"} nav={'/vehicleHome'} tableName={tableName} formData={formData} onBack={onBack} formMode={'Add'}></Header>
                    <div className="form-container">
                        <TabPanel deferRendering={false}>
                            <Item title="Araç Bilgileri">
                                <Form formData={formData}  labelLocation="top">
                                    <GroupItem colCount={3}>
                                        <GroupItem colCount={1}>
                                            <SimpleItem dataField="U_PlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                                            <SimpleItem dataField="U_TrailerPlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />
                                            <SimpleItem dataField="U_VehicleType" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Araç Tipi' }} />
                                            <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsTrailer, value: selectedTrailer }} dataField="U_TrailerType" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Tipi' }} />
                                        </GroupItem>
                                    </GroupItem>
                                </Form>
                            </Item>
                            <Item title="Şoför Bilgileri">
                                <Form formData={formData} labelLocation="top">
                                    <GroupItem colCount={3} >
                                        <GroupItem colCount={1}>
                                            <SimpleItem dataField="U_Name" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ad' }} />
                                            <SimpleItem dataField="U_Surname" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Soyad' }} />
                                            <SimpleItem dataField="U_IdentityNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'TC Kimlik No' }} />
                                            <SimpleItem editorOptions={{ ...textBoxWithButtonOptions, value: selectedCardCode }} dataField="U_CardCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Nakliyeci Kodu' }} />
                                            <SimpleItem dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Nakliyeci Adı' }} />
                                            <SimpleItem dataField="U_Phone1" editorOptions={phoneOptions} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 1' }} />
                                            <SimpleItem dataField="U_Phone2" editorOptions={phoneOptions} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 2' }} />
                                        </GroupItem>
                                    </GroupItem>
                                </Form>
                                <Button
                                    text='Muhatap Kartı Aç'
                                    onClick={() => togglePopupCard()}
                                    style={{
                                        backgroundColor: '#36a3de',
                                        color: '#fff',
                                        marginTop: 10,
                                    }}
                                />
                            </Item>
                        </TabPanel>
                    </div>
                    {/* <div className="grid-container">
                        <DataGrid dataSource={formData.SML_VHL_DRVCollection} showBorders={true} >
                            <Editing
                                mode="form"
                                allowUpdating={true}
                                allowDeleting={true}
                                allowAdding={true} />
                            <Column dataField="U_DriverId" editorOptions={driverOptions} caption='Şöför'>
                                <Lookup displayExpr="U_Name" />
                            </Column>
                            <Column dataField="U_BeginDate" format="dd/MM/yyyy" dataType='date' caption="BaşlangıçTarihi" />
                            <Column dataField="U_EndDate" format="dd/MM/yyyy" dataType='date' caption="Bitiş Tarihi" />
                        </DataGrid>
                    </div> */}
                </form>
                <Popup
                    visible={isPopupVisibleTrailer}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupTrailer}
                >
                    <ZoomLayout onRowSelected={handleTrailerSelection} tableName={"SML_TRL_TYPE"} tableKey={"DocEntry"} notDeleted={""} filters={trailerTypeFilters} columns={trailerTypeColumns}></ZoomLayout>
                </Popup>
                <Popup
                    title='Nakliyeciler'
                    visible={isPopupVisible}
                    hideOnOutsideClick={true}
                    onHiding={togglePopup}
                    showCloseButton={true}
                    height="auto"
                >
                    <ZoomLayout onRowSelected={handleRowSelection} tableName={"BusinessPartners"} tableKey={"CardCode"} notDeleted={cardSector} filters={businessPartnersFilters} columns={businessPartnersColumns}></ZoomLayout>
                    {/* <ZoomLayout onRowSelected={handleRowSelection} tableName={"Items"} tableKey={"ItemCode"} notDeleted={""} filters={itemsFilters} columns={itemsColumns}></ZoomLayout> */}
                </Popup>
                <Popup
                    showCloseButton={false}
                    visible={isPopupVisibleCard}
                    hideOnOutsideClick={false}
                    onHiding={togglePopupCard}
                    title='Yeni Muhatap Kartı'
                    fullScreen={false}
                    height="auto" >
                    <OpenBusinessPartners dataAddAfter={bpDataAddAfter} />
                </Popup>
            </div>
        </div>
    )
}

export default VehicleAdd