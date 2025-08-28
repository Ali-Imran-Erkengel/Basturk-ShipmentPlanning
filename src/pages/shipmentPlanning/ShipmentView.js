import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../store/appSlice';
import { useDispatch } from 'react-redux';
// import Header from '../../../components/myComponents/Header';
import { formDataAdd, phoneOptions, shipmentType, statuses, types } from './data/data';
import { Column, DataGrid } from 'devextreme-react/data-grid';
import Header from '../../components/myComponents/Header';
import { Button } from 'devextreme-react/button';
import { getCountries, getDetail, getTransportTypes } from '../../store/shipmentSlice';

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
};
const shipmentTypeOptions = {
    dataSource: shipmentType,
    displayExpr: 'Value',
    valueExpr: 'Key'
};
function ShipmentView({ id, onBack }) {
    const [gridData, setGridData] = useState(formDataAdd);
    const [detailData, setDetailData] = useState();
    const [transportTypeData, setTransportTypeData] = useState(null);
    const [countryData, setCountryData] = useState(null);

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
    const dispatch = useDispatch();
    useEffect(() => {
        getTransportTypeData();
        getCountryData();
        firstLoad();
    }, [])
    const firstLoad = async () => {
        await dispatch(getItemById({ tableName: tableName, id: id })).then((result) => {
            if (result.payload) {
                setGridData(result.payload);

            }
        })
        fillDetailTable()
        sessionStorage.setItem('activeComponent', null)
    }
    const fillDetailTable = async () => {
        const flattenedData = [];
        const shipments = await getDetail({ id: id });
        shipments.forEach((shipment) => {
            const {
                "SML_SHP_HDR": shipHeader,
                "SML_LGT_HDR": logHeader,
                "SML_SHP_HDR/SML_SHP_ITEMCollection": shipItem,
                "SML_LGT_HDR/SML_LGT_ITEMCollection": logItem,
            } = shipment;

            // Aynı ShipmentNo ve ShipmentLine olanları birleştiriyoruz
            if (
                shipItem.DocEntry === logItem.U_ShipmentNo &&
                shipItem.LineId === logItem.U_ShipmentLine
            ) {
                // Daha önce eklenen bir kaydı kontrol et
                let existingRecord = flattenedData.find(
                    (item) =>
                        item.U_ShipmentNo === shipItem.DocEntry &&
                        item.U_ShipmentLine === shipItem.LineId
                );

                if (existingRecord) {
                    // Eğer varsa, U_LogQuantity'yi toplarız
                    existingRecord.U_LogQuantity += logItem.U_Quantity;
                } else {
                    // Eğer yoksa yeni bir kayıt ekleriz
                    flattenedData.push({
                        U_Date: shipHeader.U_Date,
                        U_Type: shipHeader.U_Type === 1 ? "Satış" : "Satınalma", // Koşullu U_Type
                        U_DeliveryStatus: null,
                        U_Status: logHeader.U_Status === 1 ? "Beklemede" :
                            logHeader.U_Status === 2 ? "Planlandı" :
                                logHeader.U_Status === 3 ? "Araç Geldi" :
                                    logHeader.U_Status === 4 ? "Araç Yükleme" :
                                        logHeader.U_Status === 5 ? "Yüklendi" :
                                            logHeader.U_Status === 6 ? "Teslim Edildi" :
                                                logHeader.U_Status === 7 ? "Ödemesi Yapıldı" : "-",
                        U_Quantity: shipItem.U_Quantity,
                        U_RemainingQty: shipItem.U_Quantity - logItem.U_Quantity, // ilk U_RemainingQty hesaplaması
                        U_ItemCode: shipItem.U_ItemCode,
                        U_ItemName: shipItem.U_ItemName,
                        U_OrderNo: shipItem.U_OrderNo,
                        U_OrderLine: shipItem.U_OrderLine,
                        U_CardCode: shipItem.U_CardCode,
                        U_CardName: shipItem.U_CardName,
                        U_ShipmentNo: logItem.U_ShipmentNo,
                        U_ShipmentLine: logItem.U_ShipmentLine,
                        U_LogQuantity: logItem.U_Quantity,
                    });
                }
            }
        });

        // U_RemainingQty ve U_DeliveryStatus değerlerini toplu olarak güncelle
        flattenedData.forEach((record) => {
            record.U_RemainingQty = record.U_Quantity - record.U_LogQuantity;
            record.U_DeliveryStatus =
                record.U_RemainingQty === 0 ? "Planlandı" : "Kısmi Planlandı"; // Koşullu U_DeliveryStatus
        });

        setDetailData(flattenedData)
    }
    return (
        <div >
            <div className="page-container">
                <form >
                    <Header save={false} trash={false} title={"Sevkiyat Planı Görüntüle"} nav={'/shipmentHome'} tableName={tableName} formData={gridData} onBack={onBack} formMode={'View'}></Header>
                    <div className="form-container">
                        <Form formData={gridData} colCount={5} labelLocation="top" >
                            <SimpleItem dataField="U_Date" editorOptions={{ displayFormat: "dd/MM/yyyy", disabled: true }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Teslim Tarihi' }} />
                            {/* <SimpleItem dataField="U_DeliveryStatus" editorType="dxSelectBox" editorOptions={{ ...statusOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Statü' }} /> */}

                            <SimpleItem dataField="U_ShipmentType" editorType="dxSelectBox" editorOptions={{ ...shipmentTypeOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Sevkiyat Türü' }} />
                            <SimpleItem dataField="U_TransportType" editorType="dxSelectBox" editorOptions={{ ...transportTypeOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Sevkiyat Şekli' }} />
                            <SimpleItem dataField="U_Type" editorType="dxSelectBox" editorOptions={{ ...typeOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Tip' }} />
                            <SimpleItem dataField="U_TradeFileNo" editorOptions={{ disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ticaret Dosya Numarası' }} />
                            <SimpleItem dataField="U_Address" editorOptions={{ disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Adres' }} />
                            <SimpleItem dataField="U_County" editorOptions={{ disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İlçe' }} />
                            <SimpleItem dataField="U_City" editorOptions={{ disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İl' }} />
                            <SimpleItem dataField="U_Country" editorOptions={{...countryOptions, disabled: true }} editorType="dxSelectBox" cssClass="transparent-bg" label={{ text: 'Ülke' }} />
                            <SimpleItem dataField="U_ZipCode" editorOptions={{ disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Posta Kodu' }} />
                            <SimpleItem dataField="U_Description" editorOptions={{ disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Açıklama' }} />
                            <SimpleItem dataField="U_PalletQuantity" editorOptions={{ disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Toplam Palet Miktarı' }} />
                            <SimpleItem dataField="U_TruckQuantity" editorOptions={{ disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Gereken Tır Miktarı' }} />
                            <SimpleItem dataField="U_ContainerQuantity" editorOptions={{ disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Gereken Konteyner Miktarı' }} />
                        </Form>
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
                    <Column dataField="U_OrderNo" caption="Sipariş Entry" allowEditing={false} alignment='left' />
                    <Column dataField="U_OrderNum" caption="Sipariş No" allowEditing={false} alignment='left' />
                    <Column dataField="U_OrderLine" caption="Sipariş Sıra" allowEditing={false} alignment='left' />
                    <Column dataField="U_WhsCode" caption="Depo Kodu" allowEditing={false} />
                    <Column dataField="U_Quantity" caption="Sevk Miktarı" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletQuantity" caption="Palet Miktarı" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletGrossWgh" caption="Palet Brüt Ağırlık" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletNetWgh" caption="Palet Net Ağırlık" allowEditing={false} alignment='right' />
                    <Column dataField="U_InnerQtyOfPallet" caption="Palet İçi Adet" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletType" caption="Palet Şekli" allowEditing={false} />

                </DataGrid>

                {/* <h5>Hareket Görmüş Kalemler</h5>
                <DataGrid
                    dataSource={detailData}
                >
                    <Column dataField="U_ItemCode" caption="Kalem Kodu" allowEditing={false} />
                    <Column dataField="U_ItemName" caption="Kalem Açıklama" allowEditing={false} />
                    <Column dataField="U_CardCode" caption="Müşteri Kodu" allowEditing={false} />
                    <Column dataField="U_CardName" caption="Müşteri" allowEditing={false} />
                    <Column dataField="U_OrderNo" caption="Sipariş No" allowEditing={false} />
                    <Column dataField="U_OrderLine" caption="Sipariş Sıra" allowEditing={false} />
                    <Column dataField="U_Type" caption="Tip" allowEditing={false} />
                    <Column dataField="U_Status" caption="Durum" allowEditing={false} />
                    <Column dataField="U_Quantity" caption="Sevk Miktarı" allowEditing={false} alignment='right' />
                    <Column dataField="U_LogQuantity" caption="Planlanan Miktar" allowEditing={false} />
                    <Column dataField="U_RemainingQty" caption="Kalan Miktar" allowEditing={false} />

                </DataGrid> */}
            </div>

        </div>
    )
}

export default ShipmentView