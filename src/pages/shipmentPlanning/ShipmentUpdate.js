import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../store/appSlice';
import { useDispatch } from 'react-redux';
import {  formDataUpdate, shipmentType, statuses, types } from './data/data';
import Header from '../../components/myComponents/Header';
import DataGrid, { Column } from 'devextreme-react/cjs/data-grid';
import OrderList from './components/OrderList';
import { Button } from 'devextreme-react/button';
import { Popup } from 'devextreme-react/popup';
import PurchaseOrderList from './components/PurchaseOrderList';
import { getCountries, getTransportTypes, updateTradeFileNo } from '../../store/shipmentSlice';
const tableName = "SML_SHP_HDR";
const statusOptions = {
    dataSource: statuses,
    displayExpr: 'Value',
    valueExpr: 'Key'
};

const typeOptions = {
    dataSource: types,
    displayExpr: 'Value',
    valueExpr: 'Key'
}
const shipmentTypeOptions = {
    dataSource: shipmentType,
    displayExpr: 'Value',
    valueExpr: 'Key'
};

function ShipmentUpdate({ id, onBack }) {
    //    const [formData, setFormData] = useState(null);
    const [gridData, setGridData] = useState(formDataUpdate);
    // const [popupVisible, setPopupVisible] = useState(false);
    const [isPopupVisibleOrdr, setPopupVisibilityOrdr] = useState(false);
    const [isPopupVisibleOpor, setPopupVisibilityOpor] = useState(false);
    const [transportTypeData, setTransportTypeData] = useState(null);
    const [countryData, setCountryData] = useState(null);


    const togglePopup = () => {
        if (gridData.U_Type === 1) {
            setPopupVisibilityOrdr(!isPopupVisibleOrdr);
            const togglePopupOrdr = () => {
            };

        }
        if (gridData.U_Type === 2) {
            setPopupVisibilityOpor(!isPopupVisibleOpor);
            const togglePopupOpor = () => {
            };

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
    
    const dispatch = useDispatch();
    useEffect(() => {
        getTransportTypeData();
        getCountryData();
        firstLoad();
    }, [])
    useEffect(() => {
        if (gridData) {
        }
    }, [gridData]);
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
    const firstLoad = async () => {
        await dispatch(getItemById({ tableName: tableName, id: id })).then((result) => {
            if (result.payload) {
                setGridData(result.payload);
            }
        })
        sessionStorage.setItem('activeComponent', null)
    }
    const extraFunctions = ({ result }) => {
        const shipmentNo=result.meta.arg.updatedData.DocEntry;
        const tradeFileNo=result.meta.arg.updatedData.U_TradeFileNo;
        if ( result.meta.requestStatus==='fulfilled'& tradeFileNo) {
            updateTradeFileNo({shipmentNo:shipmentNo,tradeFileNo:tradeFileNo});
        }
    }
    return (
        <div>
            <div className="page-container">
                <form >
                    <Header save={true} trash={true} isDelete={gridData} title={"Sevkiyat Planı Güncelle"} nav={'/shipmentHome'} tableName={tableName} formData={gridData} onBack={onBack} formMode={'Update'} id={id} extraFunctions={extraFunctions}></Header>
                    <div className="form-container">
                        <Form formData={gridData} colCount={10} labelLocation="top" >
                            <SimpleItem colSpan={2} dataField="U_Date" editorOptions={{displayFormat:"dd/MM/yyyy"}} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Teslim Tarihi' }} />
                            {/* <SimpleItem colSpan={2} dataField="U_DeliveryStatus" editorType="dxSelectBox" editorOptions={statusOptions} cssClass="transparent-bg" label={{ text: 'Statü' }} /> */}
                            <SimpleItem colSpan={2} dataField="U_ShipmentType" editorType="dxSelectBox" editorOptions={shipmentTypeOptions} cssClass="transparent-bg" label={{ text: 'Sevkiyat Türü' }} />
                            <SimpleItem colSpan={2} dataField="U_TransportType" editorType="dxSelectBox" editorOptions={transportTypeOptions} cssClass="transparent-bg" label={{ text: 'Sevkiyat Şekli' }} />
                            <SimpleItem colSpan={2} dataField="U_Type" editorType="dxSelectBox" editorOptions={{ ...typeOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Tip' }} />
                            <SimpleItem colSpan={2} dataField="U_TradeFileNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ticaret Dosya Numarası' }} />
                            {/* <SimpleItem colSpan={2} dataField="U_TradeFileNo" editorType="dxTextBox" cssClass="transparent-bg"  label={{ text: 'Ticaret Dosya Numarası' }} /> */}
                            <SimpleItem colSpan={2} dataField="U_Address" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Adres' }} />
                            <SimpleItem colSpan={2} dataField="U_County" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İlçe' }} />
                            <SimpleItem colSpan={2} dataField="U_City" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İl' }} />
                            <SimpleItem colSpan={2} dataField="U_Country" editorType="dxSelectBox" editorOptions={countryOptions} cssClass="transparent-bg" label={{ text: 'Ülke' }} />
                            <SimpleItem colSpan={2} dataField="U_ZipCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Posta Kodu' }} />
                            <SimpleItem colSpan={2} dataField="U_Description" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Açıklama' }} />
                            <SimpleItem colSpan={2} dataField="U_PalletQuantity" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Toplam Palet Miktarı' }} />
                            <SimpleItem colSpan={2} dataField="U_TruckQuantity" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Gereken Tır Miktarı' }} />
                            <SimpleItem colSpan={2} dataField="U_ContainerQuantity" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Gereken Konteyner Miktarı' }} />
                        </Form>
                        <Button onClick={() => togglePopup()} text='Sipariş Ekle' ></Button>
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
                    fullScreen={true}
                    title='Açık Satış Siparişi Kalemleri'

                >
                    <OrderList onRowSelected={handleRowSelectionOrdr} gridData={gridData} formMode={"u"} />
                </Popup>
                <Popup
                    showCloseButton={true}
                    visible={isPopupVisibleOpor}
                    hideOnOutsideClick={true}
                    onHiding={togglePopup}
                    fullScreen={true}
                    title='Açık Satınalma Siparişi Kalemleri'

                >
                    <PurchaseOrderList onRowSelected={handleRowSelectionOpor} gridData={gridData} formMode={"u"} />
                </Popup>
            </div>

        </div>
    )
}

export default ShipmentUpdate