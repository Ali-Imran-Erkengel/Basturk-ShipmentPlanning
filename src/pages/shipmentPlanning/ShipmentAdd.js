import { Form,  SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import Header from '../../components/myComponents/Header'
import { formDataAdd as initialFormData, shipmentType,  types } from './data/data';
import OrderList from './components/OrderList';
import { Button } from 'devextreme-react/button';
import { Column, DataGrid } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import PurchaseOrderList from './components/PurchaseOrderList';
import ZoomLayout from '../../components/myComponents/ZoomLayout';
import { declarationColumns, declarationFilters } from '../../data/zoomLayoutData';
import { getCountries, getTransportTypes } from '../../store/shipmentSlice';
const tableName = "SML_SHP_HDR";

const shipmentTypeOptions = {
    dataSource: shipmentType,
    displayExpr: 'Value',
    valueExpr: 'Key'
};


function ShipmentAdd({ onBack }) {
    const [gridData, setGridData] = useState({ ...initialFormData });
    const [isPopupVisibleOrdr, setPopupVisibilityOrdr] = useState(false);
    const [isPopupVisibleOpor, setPopupVisibilityOpor] = useState(false);
    const [transportTypeData, setTransportTypeData] = useState(null);
    const [countryData, setCountryData] = useState(null);
    const [isPopupVisibleTradeFileSales, setPopupVisibilityTradeFileSales] = useState(false);
    const [isPopupVisibleTradeFilePurchase, setPopupVisibilityTradeFilePurchase] = useState(false);
    useEffect(() => {
     getTransportTypeData();
     getCountryData();
        //setTransportTypeData(trnType);
        
    }, [])

    const getTransportTypeData = async () => {
        const trnType = await getTransportTypes();
        setTransportTypeData(trnType);
    }
    const transportTypeOptions = {
        dataSource: transportTypeData,
        displayExpr: 'Name',
        valueExpr: 'Code',
    };
    const getCountryData = async () => {
        const countries = await getCountries();
        setCountryData(countries);
    }
    const countryOptions = {
        dataSource: countryData,
        displayExpr: 'Name',
        valueExpr: 'Code',
    };
    const togglePopup = () => {

        if (gridData.U_Type === 1) {
            setPopupVisibilityOrdr(!isPopupVisibleOrdr);


        }
        if (gridData.U_Type === 2) {
            setPopupVisibilityOpor(!isPopupVisibleOpor);

        }
    }

    const handleRowSelectionOrdr = (selectedRowData) => {

        setGridData(selectedRowData);
        setPopupVisibilityOrdr(false);
    };
    const handleRowSelectionOpor = (selectedRowData) => {

        setGridData(selectedRowData);
        setPopupVisibilityOpor(false);
    };
    const togglePopupTradeFileSales = () => {

        setPopupVisibilityTradeFileSales(!isPopupVisibleTradeFileSales);
    };
    const togglePopupTradeFilePurchase = () => {

        setPopupVisibilityTradeFilePurchase(!isPopupVisibleTradeFilePurchase);
    };
    const [selectedTradeFileSysNo, setSelectedTradeFileSysNo] = useState(initialFormData.U_TradeFileSysNo || '');
    const textBoxWithButtonOptionsTradeFileNo = {
        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    if (gridData.U_Type === 1) {
                        togglePopupTradeFileSales();
                    }
                    if (gridData.U_Type === 2) {
                        togglePopupTradeFilePurchase();
                    }

                }
            }
        }]
    };
    const handleDeclarationSelection = (selectedRowData) => {
        // setSelectedTradeFileNo(selectedRowData.U_DeclarationNo);
        setSelectedTradeFileSysNo(selectedRowData.DocEntry);
        if (gridData.U_Type === 1) {

            setPopupVisibilityTradeFileSales(false);
        }
        if (gridData.U_Type === 2) {
            setPopupVisibilityTradeFilePurchase(false);
        }
    };
    const extraFunctions = ({ result }) => {
        // addRemainingTable({ result });
    }
   
    const typeOptions = {
        dataSource: types,
        displayExpr: 'Value',
        valueExpr: 'Key',
        // onValueChanged: () => {
        //     gridData.SML_SHP_ITEMCollection = null;
        //     setGridData(gridData);
        //     console.log("gridData",gridData)
        // },
    };
    return (
        <div >
            <div className="page-container">
                <form >
                    <Header save={true} trash={false} title={"Sevkiyat Planı Oluştur"} nav={'/shipmentHome'} tableName={tableName} formData={gridData} onBack={onBack} formMode={'Add'} extraFunctions={extraFunctions}></Header>
                    <div className="form-container">
                        <Form formData={gridData} colCount={10} labelLocation="top" >
                            <SimpleItem colSpan={2} dataField="U_Date" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Teslim Tarihi' }} />
                           
                            {/* <SimpleItem colSpan={2} dataField="U_DeliveryStatus" editorType="dxSelectBox" editorOptions={statusOptions} cssClass="transparent-bg" label={{ text: 'Statü' }} /> */}
                            <SimpleItem colSpan={2} dataField="U_ShipmentType" editorType="dxSelectBox" editorOptions={shipmentTypeOptions} cssClass="transparent-bg" label={{ text: 'Sevkiyat Türü' }} />
                            <SimpleItem colSpan={2} dataField="U_TransportType" editorType="dxSelectBox" editorOptions={transportTypeOptions} cssClass="transparent-bg" label={{ text: 'Sevkiyat Şekli' }} />

                            <SimpleItem colSpan={2} dataField="U_Type" editorType="dxSelectBox" editorOptions={typeOptions} cssClass="transparent-bg" label={{ text: 'Tip' }} />
                            <SimpleItem colSpan={2} dataField="U_TradeFileNo" editorType="dxTextBox" editorOptions={{ ...textBoxWithButtonOptionsTradeFileNo, value: selectedTradeFileSysNo }}cssClass="transparent-bg" label={{ text: 'Ticaret Dosya Numarası' }} />
                            {/* <SimpleItem colSpan={2} dataField="U_TradeFileNo" editorType="dxTextBox" editorOptions={{ value: selectedTradeFileNo }}cssClass="transparent-bg" label={{ text: 'Ticaret Dosya Numarası' }} /> */}
                            <SimpleItem colSpan={2} dataField="U_Address" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Adres' }} />
                            <SimpleItem colSpan={2} dataField="U_County" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İlçe' }} />
                            <SimpleItem colSpan={2} dataField="U_City" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İl' }} />
                            <SimpleItem colSpan={2} dataField="U_Country" editorType="dxSelectBox" editorOptions={countryOptions} cssClass="transparent-bg" label={{ text: 'Ülke' }} />
                            <SimpleItem colSpan={2} dataField="U_ZipCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Posta Kodu' }} />
                            <SimpleItem colSpan={2} dataField="U_Description" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Açıklama' }} />
                            <SimpleItem colSpan={2} dataField="U_PalletQuantity" editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Toplam Palet Miktarı' }} />
                            <SimpleItem dataField="U_TruckQuantity" colSpan={2} editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Gereken Tır Miktarı' }} />
                            <SimpleItem dataField="U_ContainerQuantity" colSpan={2} editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Gereken Konteyner Miktarı' }} />
                        </Form>
                        <br></br>
                        <Button onClick={() => togglePopup()} text='Sipariş Ekle' style={{ marginRight: 30 }} ></Button>

                    </div>
                </form>
                <DataGrid
                    dataSource={gridData.SML_SHP_ITEMCollection}
                    columnAutoWidth={true} 
                    allowColumnResizing={true} 
                >
                    <Column dataField="U_ItemCode" caption="Kalem Kodu" allowEditing={false} />
                    <Column dataField="U_ItemName" caption="Kalem Açıklama" allowEditing={false} />
                    <Column dataField="U_CardCode" caption="Müşteri Kodu" allowEditing={false} />
                    <Column dataField="U_CardName" caption="Müşteri" allowEditing={false} />
                    <Column dataField="U_OrderNo" caption="Sipariş Entry" allowEditing={false} />
                    <Column dataField="U_OrderNum" caption="Sipariş No" allowEditing={false} />
                    <Column dataField="U_OrderLine" caption="Sipariş Sıra" allowEditing={false} />
                    <Column dataField="U_WhsCode" caption="Depo Kodu" allowEditing={false} />
                    <Column dataField="U_Quantity" caption="Sevk Miktarı" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletQuantity" caption="Palet Miktarı" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletGrossWgh" caption="Palet Brüt Ağırlık" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletNetWgh" caption="Palet Net Ağırlık" allowEditing={false} alignment='right' />
                    <Column dataField="U_InnerQtyOfPallet" caption="Palet İçi Adet" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletType" caption="Palet Şekli" allowEditing={false} />

                </DataGrid>
                <Popup
                    showCloseButton={true}
                    visible={isPopupVisibleOrdr}
                    hideOnOutsideClick={true}
                    onHiding={togglePopup}
                    // height="auto"
                    fullScreen={true}
                    title='Açık Satış Siparişi Kalemleri'

                >
                    <OrderList onRowSelected={handleRowSelectionOrdr} gridData={gridData} formMode={"a"} />
                </Popup>
                <Popup
                    showCloseButton={true}
                    visible={isPopupVisibleOpor}
                    hideOnOutsideClick={true}
                    onHiding={togglePopup}
                    fullScreen={true}
                    title='Açık Satınalma Siparişi Kalemleri'
                >
                    <PurchaseOrderList onRowSelected={handleRowSelectionOpor} gridData={gridData} formMode={"a"} />
                </Popup>
                <Popup
                    visible={isPopupVisibleTradeFileSales}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupTradeFileSales}
                    showCloseButton={true}
                    title='İhracat Belgeleri'
                >
                    <ZoomLayout onRowSelected={handleDeclarationSelection} tableName={"SML_EXP_HDR"} tableKey={"DocEntry"} customFilter={""} filters={declarationFilters} columns={declarationColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisibleTradeFilePurchase}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupTradeFilePurchase}
                    showCloseButton={true}
                    title='İthalat Belgeleri'
                >
                    <ZoomLayout onRowSelected={handleDeclarationSelection} tableName={"SML_DCR_HDR"} tableKey={"DocEntry"} customFilter={""} filters={declarationFilters} columns={declarationColumns}></ZoomLayout>
                </Popup>
            </div>
        </div>
    )
}

export default ShipmentAdd