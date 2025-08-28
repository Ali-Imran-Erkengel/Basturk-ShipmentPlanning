import { Form, GroupItem, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../store/appSlice';
import { useDispatch } from 'react-redux';
import { deliveryStatus, formDataUpdate, paymentStatus, statuses, types } from './data/data';
import Header from '../../components/myComponents/Header';
import DataGrid, { Column } from 'devextreme-react/cjs/data-grid';
import { getDetail } from '../../store/logisticsSlice';
import { getLoadingRamps } from '../../store/weighbridgeSlice';
import { getCountries } from '../../store/shipmentSlice';
const tableName = "SML_LGT_HDR";
const statusOptions = {
    dataSource: statuses,
    displayExpr: 'Value',
    valueExpr: 'Key'
};
function LogisticsView({ id, onBack }) {
    const [gridData, setGridData] = useState(formDataUpdate);
    const [detailData, setDetailData] = useState();
    const [palletCost, setPalletCost] = useState();
    const [driverName, setDriverName] = useState(false);
    const [plateCode, setPlateCode] = useState(false);
    const [vehicleDesc, setVehicleDesc] = useState(false);
    const [countryData, setCountryData] = useState(null);
    const [trailerPlateCode, setTrailerPlateCode] = useState('');
    const [cardName, setCardName] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(formDataUpdate.U_VehicleNo || '');
    const [selectedCardCode, setSelectedCardCode] = useState(formDataUpdate.U_CardCode || '');
    const [selectedDriver, setSelectedDriver] = useState(formDataUpdate.U_DriverNo || '');
    const dispatch = useDispatch();
    const [amount, setAmount] = useState();
    const [palletFieldVisibility, setPalletFieldVisibility] = useState(false);
    const [loadingRampData, setloadingRampData] = useState(null);
    const loadingRampOptions = {
        dataSource: loadingRampData,
        displayExpr: 'U_RampName',
        valueExpr: 'DocEntry',
    };
    const getRampData = async () => {
        const ramps = await getLoadingRamps();
        setloadingRampData(ramps);
    }
    const getCountryData = async () => {
        const countries = await getCountries();
        setCountryData(countries);
    }
    const countryOptions = {
        dataSource: countryData,
        displayExpr: 'Name',
        valueExpr: 'Code',
    };
    useEffect(() => {
        getCountryData();
        const ramps = getRampData();
        setloadingRampData(ramps);
        firstLoad();
    }, [])
    useEffect(() => {
        if (gridData) {
        }
    }, [gridData]);
    const typeOptions = {
        dataSource: types,
        displayExpr: 'Value',
        valueExpr: 'Key',
    };
    const paymentStatusOptions = {
        dataSource: paymentStatus,
        displayExpr: 'Value',
        valueExpr: 'Key'
    };
    const deliveryStatusOptions = {
        dataSource: deliveryStatus,
        displayExpr: 'Value',
        valueExpr: 'Key'
    };
    const firstLoad = async () => {
        await dispatch(getItemById({ tableName: tableName, id: id })).then((result) => {
            if (result.payload) {
                setGridData(result.payload);
                setSelectedCardCode(result.payload.U_OcrdNo)
                setCardName(result.payload.U_CardName)
                setSelectedVehicle(result.payload.U_VehicleNo)
                setPlateCode(result.payload.U_PlateCode)
                setDriverName(result.payload.U_DriverName)
                setTrailerPlateCode(result.payload.U_TrailerPlateCode)
                setAmount(result.payload.U_Amount)

                if (result.payload.U_Type === 2) {
                    setPalletFieldVisibility(false)
                } else {
                    setPalletFieldVisibility(true)
                }
            }
        })
        //  fillDetailTable()
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
        <div>
            <div className="page-container">
                <form >
                    <Header save={false} trash={false} isDelete={gridData} title={"Lojistik Planı Görüntüle"} nav={'/logisticsHome'} tableName={tableName} formData={gridData} onBack={onBack} formMode={'View'} id={id}></Header>
                    <div className="form-container">
                        <Form formData={gridData} colCount={5} labelLocation="top" >
                            <GroupItem colSpan={5}>
                                <SimpleItem
                                    colSpan={2}
                                    dataField="U_CustomDocNum"
                                    editorOptions={{ disabled: true }}
                                    cssClass="transparent-bg"
                                    label={{ text: 'Belge No' }}
                                />
                            </GroupItem>
                            <SimpleItem dataField="U_Date" editorOptions={{ displayFormat: "dd/MM/yyyy", disabled: true }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Tarih' }} />
                            <SimpleItem editorOptions={{ disabled: true, value: selectedCardCode }} dataField="U_OcrdNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap' }} />
                            <SimpleItem editorOptions={{ disabled: true, value: cardName }} dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap Adı' }} />
                            <SimpleItem dataField="U_Status" editorType="dxSelectBox" editorOptions={{ ...statusOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Statü' }} />
                            <SimpleItem dataField="U_Type" editorType="dxSelectBox" editorOptions={{ ...typeOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Tip' }} />


                            {/* <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsDrv, value: selectedDriver }} dataField="U_DriverNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Sürücü' }} /> */}
                            <SimpleItem editorOptions={{ disabled: true, value: selectedVehicle }} dataField="U_VehicleNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Araç No' }} />
                            <SimpleItem dataField="U_PlateCode" editorOptions={{ value: plateCode, disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                            <SimpleItem dataField="U_TrailerPlateCode" editorOptions={{ value: trailerPlateCode, disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />
                            <SimpleItem dataField="U_DriverName" editorOptions={{ value: driverName, disabled: true }} editorType="dxTextBox" label={{ text: 'Şöför Adı' }} />
                            <SimpleItem dataField="U_LoadingRamp" editorType="dxSelectBox" editorOptions={{ ...loadingRampOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Yükleme Rampası' }} />
                            <SimpleItem dataField="U_Address" editorType="dxTextBox" editorOptions={{ disabled: true }} cssClass="transparent-bg" label={{ text: 'Adres' }} />
                            <SimpleItem dataField="U_County" editorType="dxTextBox" editorOptions={{ disabled: true }} cssClass="transparent-bg" label={{ text: 'İlçe' }} />
                            <SimpleItem dataField="U_City" editorType="dxTextBox" editorOptions={{ disabled: true }} cssClass="transparent-bg" label={{ text: 'İl' }} />
                            <SimpleItem dataField="U_Country" editorType="dxSelectBox" editorOptions={{ ...countryOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Ülke' }} />
                            <SimpleItem dataField="U_ZipCode" editorType="dxTextBox" editorOptions={{ disabled: true }} cssClass="transparent-bg" label={{ text: 'Posta Kodu' }} />
                            <SimpleItem dataField="U_PaymentStatus" editorType="dxSelectBox" editorOptions={{ ...paymentStatusOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Ödeme Durumu' }} />
                            <SimpleItem dataField="U_DeliveryStatus" editorType="dxSelectBox" editorOptions={{ ...deliveryStatusOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Teslim Durumu' }} />
                            <SimpleItem editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} dataField="U_Price" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Fiyat' }} />
                            <SimpleItem dataField="U_PalletQuantity" editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" visible={palletFieldVisibility} cssClass="transparent-bg" label={{ text: 'Palet Miktarı' }} />
                            <SimpleItem dataField="U_PalletCost" editorOptions={{ value: palletCost, disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" visible={palletFieldVisibility} cssClass="transparent-bg" label={{ text: 'Palet Mailyeti' }} />
                            <SimpleItem dataField="U_TotalWeight" editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Toplam Ağırlık' }} visible={!palletFieldVisibility} />
                            <SimpleItem dataField="U_Amount" editorOptions={{ value: amount, disabled: true, inputAttr: { class: 'right-align-text' } }} visible={!palletFieldVisibility} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Tutar' }} />
                            <SimpleItem dataField="U_DeliveryNoteNo" editorType="dxTextBox" cssClass="transparent-bg" visible={!palletFieldVisibility} label={{ text: 'İrsaliye No' }} />
                            <SimpleItem dataField="U_Description" editorType="dxTextBox" editorOptions={{ disabled: true }} cssClass="transparent-bg" label={{ text: 'Açıklama' }} />
                        </Form>

                    </div>
                </form>
                <DataGrid
                    dataSource={gridData.SML_LGT_ITEMCollection}
                    columnAutoWidth={true}
                    allowColumnResizing={true}
                >
                    <Column visible={palletFieldVisibility} dataField="U_BinEntry" caption="Bin Entry" width={0} allowEditing={false} />
                    <Column visible={palletFieldVisibility} dataField="U_BinCode" caption="Depo Yeri" allowEditing={false} />
                    <Column dataField="U_ItemCode" caption="Kalem Kodu" allowEditing={false} />
                    <Column dataField="U_ItemName" caption="Kalem Açıklama" allowEditing={false} />
                    <Column dataField="U_CardCode" caption="Muhatap Kodu" allowEditing={false} />
                    <Column dataField="U_CardName" caption="Muhatap" allowEditing={false} />
                    <Column dataField="U_TradeFileNo" caption="Ticaret Dosya No" allowEditing={false} />
                    <Column dataField="U_TransportType" caption="Sevkiyat Şekli" allowEditing={false} width={0} />
                    <Column dataField="U_ShipmentNo" caption="Sevkiyat No" allowEditing={false} alignment='left' />
                    <Column dataField="U_ShipmentLine" caption="Sevkiyat Sıra" allowEditing={false} alignment='left' />
                    <Column dataField="U_OrderNo" caption="Sipariş Enntry" allowEditing={false} alignment='left' />
                    <Column dataField="U_OrderNum" caption="Sipariş No" allowEditing={false} alignment='left' />
                    <Column dataField="U_OrderLine" caption="Sipariş Sıra" allowEditing={false} alignment='left' />
                    <Column dataField="U_WhsCode" caption="Depo Kodu" allowEditing={false} />
                    <Column dataField="U_Quantity" caption="Miktar" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletCost" caption={palletFieldVisibility ? "Palet Maliyeti" : "Tutar"} allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletGrossWgh" visible={palletFieldVisibility} caption="Palet Brüt Ağırlık" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletNetWgh" visible={palletFieldVisibility} caption="Palet Net Ağırlık" allowEditing={false} alignment='right' />
                    <Column dataField="U_InnerQtyOfPallet" visible={palletFieldVisibility} caption="Palet İçi Adet" allowEditing={false} alignment='right' />
                    <Column dataField="U_PalletType" visible={palletFieldVisibility} caption="Palet Şekli" allowEditing={false} />
                </DataGrid>

            </div>

        </div>
    )
}

export default LogisticsView