import { Form, GroupItem, Item, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { createODataSource, getItemById } from '../../../store/appSlice';
import { useDispatch } from 'react-redux';
import Header from '../../../components/myComponents/Header';
import { DataGrid, Editing, Column, Lookup } from 'devextreme-react/data-grid';
import {  formData, phoneOptions } from './data/data';
import { Popup } from 'devextreme-react/popup';
import ZoomLayout from '../../../components/myComponents/ZoomLayout';
import { businessPartnersColumns, businessPartnersFilters, trailerTypeColumns, trailerTypeFilters } from '../../../data/zoomLayoutData';
import { TabPanel } from 'devextreme-react/tab-panel';
const tableName = "SML_BAS_VHL";

function VehicleUpdate({ id, onBack }) {
    const [data, setData] = useState(formData);
    const [dataSource, setDataSource] = useState(null);
    const [isPopupVisibleTrailer, setPopupVisibilityTrailer] = useState(false);
    const [selectedTrailer, setSelectedTrailer] = useState(formData.U_TrailerType || '');
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
    const dispatch = useDispatch();
    useEffect(() => {
        firstLoad();
        const myDataSource = createODataSource("SML_BAS_DRV", "DocEntry");
        setDataSource(myDataSource);
    }, [])
    const firstLoad = async () => {
        await dispatch(getItemById({ tableName: tableName, id: id })).then((result) => {
            if (result.payload) {
                setData(result.payload);
                setSelectedTrailer(result.payload.U_TrailerType)
                setSelectedCardCode(result.payload.U_CardCode)
            }
        })
        sessionStorage.setItem('activeComponent', null)
    }
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
    const driverOptions = {
        dataSource: dataSource,
        displayExpr: (item) => {
            if (item) {
                return `${item.U_Name} ${item.U_MiddleName} ${item.U_Surname}`;
            }
            return '-';
        },
        valueExpr: 'DocEntry',


    };
    return (
        <div>
            <div className="page-container">
                <form>
                    <Header save={true} trash={true} isDelete={data} title={"Araç Güncelle"} nav={'/vehicleHome'} tableName={tableName} formData={data} onBack={onBack} formMode={'Update'} id={id}></Header>
                    <div className="form-container">
                        {/* <Form formData={data} colCount={6} labelLocation="top" >
                            <SimpleItem dataField="U_Vehicle" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Araç' }} />
                            <SimpleItem dataField="U_PlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                            <SimpleItem dataField="U_VehicleCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />
                            <SimpleItem dataField="U_VehicleType" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Araç Tipi' }} />
                            <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsTrailer, value: selectedTrailer }} dataField="U_TrailerType" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Tipi' }} />
                        </Form> */}
                        <TabPanel deferRendering={false}>
                            <Item title="Araç Bilgileri">
                                <Form formData={data}  labelLocation="top">
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
                                <Form formData={data} labelLocation="top">
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
                            </Item>
                        </TabPanel>
                    </div>
                    {/* <div className="grid-container">
                        <DataGrid dataSource={data.SML_VHL_DRVCollection} showBorders={true} >
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
                    visible={isPopupVisibleTrailer}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupTrailer}
                >
                    <ZoomLayout onRowSelected={handleTrailerSelection} tableName={"SML_TRL_TYPE"} tableKey={"DocEntry"} notDeleted={""} filters={trailerTypeFilters} columns={trailerTypeColumns}></ZoomLayout>
                </Popup>
            </div>
        </div>
    )
}

export default VehicleUpdate