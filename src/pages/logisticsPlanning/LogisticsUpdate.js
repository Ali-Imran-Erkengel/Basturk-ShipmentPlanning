import { Form, GroupItem, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../store/appSlice';
import { useDispatch } from 'react-redux';
import { deliveryStatus, formDataUpdate, paymentStatus, statuses, types } from './data/data';
import Header from '../../components/myComponents/Header';
import DataGrid, { Column } from 'devextreme-react/cjs/data-grid';
import { Button } from 'devextreme-react/button';
import { Popup } from 'devextreme-react/popup';
import ShipmentList from './components/ShipmentList';
import ZoomLayout from '../../components/myComponents/ZoomLayout';
import { businessPartnersColumns, businessPartnersFilters, vehicleColumns, vehicleFilters } from '../../data/zoomLayoutData';
import { getLoadingRamps } from '../../store/weighbridgeSlice';
import ShipmentListPO from './components/ShipmentListPO';
import { getBinLocations, printShipmentReport } from '../../store/logisticsSlice';
import { getCountries } from '../../store/shipmentSlice';
import BinLocations from './components/BinLocations';
const tableName = "SML_LGT_HDR";
const statusOptions = {
    dataSource: statuses,
    displayExpr: 'Value',
    valueExpr: 'Key'
};
function LogisticsUpdate({ id, onBack }) {
    const notDeletedFilter = ["U_IsDeleted", "=", "N"]
    const cardTypeFilter1 = ["CardType", "=", "cSupplier"]
    const cardTypeFilter2 = ["CardType", "=", "cCustomer"]
    const [gridData, setGridData] = useState(formDataUpdate);
    const [palletCost, setPalletCost] = useState();
    const [driverName, setDriverName] = useState(false);
    const [plateCode, setPlateCode] = useState(false);
    const [trailerPlateCode, setTrailerPlateCode] = useState('');
    const [cardName, setCardName] = useState('');
    const [selectedVehicle, setSelectedVehicle] = useState(formDataUpdate.U_VehicleNo || '');
    const [loadingRampData, setloadingRampData] = useState(null);
    const [countryData, setCountryData] = useState(null);
    const [amount, setAmount] = useState();
    const [palletFieldVisibility, setPalletFieldVisibility] = useState(false);
    const [isPopupVisibleVehicle, setPopupVisibilityVehicle] = useState(false);
    const [palletQuantity, setPalletQuantity] = useState("");
    const [binJsonData, setBinJsonData] = useState("");
    const [isPopupVisibleCardCode1, setPopupVisibilityCardCode1] = useState(false);
    const [isPopupVisibleCardCode2, setPopupVisibilityCardCode2] = useState(false);
    const togglePopupCardCode1 = () => {

        setPopupVisibilityCardCode1(!isPopupVisibleCardCode1);
    };
    const togglePopupCardCode2 = () => {

        setPopupVisibilityCardCode2(!isPopupVisibleCardCode2);
    };
    const [isPopupVisibleShp, setPopupVisibilityShp] = useState(false);
    const [isPopupVisibleShpPO, setPopupVisibilityShpPO] = useState(false);

    const togglePopupShp = () => {
        //  if (gridData.U_Price) {
        if (gridData.U_Type === 1) {
            setPopupVisibilityShp(!isPopupVisibleShp);
        }
        if (gridData.U_Type === 2) {
            setPopupVisibilityShpPO(!isPopupVisibleShpPO);
        }
        //}
        //else {
        //  handleNotify({ message: "Önce Fiyat Giriniz", type: "error" })
        //}
    };
    const printCrystal = () => {
        printShipmentReport({ logisticId: id });
        // viewCrystal({logisticId:id});
    }

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
    const togglePopupVehicle = () => {
        setPopupVisibilityVehicle(!isPopupVisibleVehicle);
    };
    const [selectedCardCode, setSelectedCardCode] = useState(formDataUpdate.U_OcrdNo || '');
    const textBoxWithButtonOptionsCardCode = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    if (gridData.U_Type === 1) {
                        togglePopupCardCode1();
                    }
                    if (gridData.U_Type === 2) {
                        togglePopupCardCode2();
                    }

                }
            }
        }]
    };
    const handleVehicleSelection = async (selectedRowData) => {
        setSelectedVehicle(selectedRowData.DocEntry);
        //  getDriverVehicle({ id: selectedRowData.DocEntry })
        setPlateCode(selectedRowData.U_PlateCode);
        setDriverName(selectedRowData.U_Name + ' ' + selectedRowData.U_Surname);
        setSelectedCardCode(selectedRowData.U_CardCode);

        setCardName(selectedRowData.U_CardName)

        setTrailerPlateCode(selectedRowData.U_TrailerPlateCode);
        setPopupVisibilityVehicle(false);
    };

    const handleRowSelection = (selectedRowData) => {
        setGridData(selectedRowData);
        const palletCost = gridData.U_Price / selectedRowData.U_PalletQuantity;
        setPalletCost(palletCost.toFixed(2))
        setPopupVisibilityShp(false);
    };
    const handleRowSelectionPO = (selectedRowData) => {
        setGridData(selectedRowData);
        setPopupVisibilityShpPO(false);
    };

    const handleCardSelection = (selectedRowData) => {
        setSelectedCardCode(selectedRowData.CardCode);
        setCardName(selectedRowData.CardName)
        if (gridData.U_Type === 1) {

            setPopupVisibilityCardCode1(false);
        }
        if (gridData.U_Type === 2) {
            setPopupVisibilityCardCode2(false);
        }
    };

    const dispatch = useDispatch();
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
        sessionStorage.setItem('activeComponent', null)
    }
    const enterPrice = {
        onValueChanged: ({ value }) => {
            if (value) {

                gridData.U_Price = value.toString().replace(",", ".");
                if (gridData.U_Type === 1) {
                    if (gridData.U_PalletQuantity !== 0) {
                        const price = value;
                        const palletCost = price / gridData.U_PalletQuantity;
                        setPalletCost(palletCost.toFixed(2));
                        const sum = gridData.SML_LGT_ITEMCollection.reduce((sum, item) => sum + parseFloat(item.U_Quantity || 0), 0);
                        const updatedGridData = {
                            ...gridData,
                            SML_LGT_ITEMCollection: gridData.SML_LGT_ITEMCollection.map(item => ({
                                ...item,
                                U_PalletCost: ((price / sum) * item.U_Quantity).toFixed(2)
                            }))
                        };
                        setGridData(updatedGridData);
                        // collectionDataSourceRef.current.instance.refresh();
                    }
                }
                else {
                    if (gridData.U_TotalWeight !== 0) {
                        const price = value;
                        const amount = price * gridData.U_TotalWeight;
                        setAmount(amount.toFixed(2));

                        const sum = gridData.SML_LGT_ITEMCollection.reduce((sum, item) => sum + parseFloat(item.U_Quantity || 0), 0);
                        // gridData'nın kopyasını oluştur
                        const updatedGridData = {
                            ...gridData,
                            SML_LGT_ITEMCollection: gridData.SML_LGT_ITEMCollection.map(item => ({
                                ...item,
                                U_PalletCost: ((price / sum) * item.U_Quantity).toFixed(2)
                            }))
                        };
                        setGridData(updatedGridData);
                        // collectionDataSourceRef.current.instance.refresh();
                    }
                }
            }
        },
        valueChangeEvent: "blur"
    };

    const textBoxWithButtonOptionsVehicle = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    togglePopupVehicle();
                }
            }
        }]
    };
    const [cellData, setCellData] = useState("");
    const [selectedColumnIndex, setSelectedColumnIndex] = useState("");
    const [binLocDataSource, setBinLocDataSource] = useState(null);
    const [isPopupVisibleBinLocations, setPopupVisibilityBinLocations] = useState(false);
    const handleRowSelectionBinLocations = (selectedRowData) => {
        setGridData(selectedRowData);
        setPopupVisibilityBinLocations(false);

        // Grid'i yenilemeye zorla (opsiyonel)
        // if (collectionDataSourceRef.current) {
        //     collectionDataSourceRef.current.instance.refresh();
        // }
    };
    const togglePopupBinLocations = async ({ itemCode, whsCode, quantity, palletQuantity, columnIndex, jsonData }) => {
        if (isPopupVisibleBinLocations) {
            setPopupVisibilityBinLocations(false);
            return;
        }

        await fetchDataSource({ itemCode: itemCode, whsCode: whsCode, quantity: quantity });
        setCellData(cellData);
        if (gridData.U_Type === 1) {
            setSelectedColumnIndex(columnIndex);
            setPalletQuantity(palletQuantity);
            setBinJsonData(jsonData)
            setPopupVisibilityBinLocations(true);
        }
    };

    const fetchDataSource = async ({ itemCode, whsCode, quantity }) => {
        try {
            console.log("Fetching data with:", { itemCode, whsCode, quantity });
            setBinLocDataSource([]);
            const binLocations = await getBinLocations({ itemCode, whsCode, quantity });
            if (binLocations && binLocations.length > 0) {
                setBinLocDataSource(binLocations);
            } else {
                setBinLocDataSource([]);
                console.warn("No bin locations found");
            }
        } catch (error) {
            console.error("Error fetching bin locations:", error);
            setBinLocDataSource([]);
        }
    };
    const renderButtonBinLocations = (cellData) => {
        let itemCode = cellData.data.U_ItemCode;
        let jsonData = cellData.data.U_BinLocJson;
        let whsCode = cellData.data.U_WhsCode;
        let quantity = cellData.data.U_Quantity;//* cellData.data.U_InnerQtyOfPallet;
        let palletQuantity = cellData.data.U_Quantity;
        let columnIndex = gridData.SML_LGT_ITEMCollection.findIndex(item =>
            item.U_OrderNo === cellData.data.U_OrderNo &&
            item.U_OrderLine === cellData.data.U_OrderLine &&
            item.U_ShipmentNo === cellData.data.U_ShipmentNo &&
            item.U_ShipmentLine === cellData.data.U_ShipmentLine &&
            item.U_ItemCode === cellData.data.U_ItemCode
        );
        return (
            <>
                <Button
                    icon='search'
                    onClick={() => togglePopupBinLocations({ itemCode: itemCode, whsCode: whsCode, quantity: quantity, palletQuantity: palletQuantity, columnIndex: columnIndex, jsonData: jsonData })}
                    type="default"
                />
            </>
        );
    };
    return (
        <div>
            <div className="page-container">
                <form >
                    <Header save={true} trash={true} isDelete={gridData} title={"Lojistik Planı Güncelle"} nav={'/logisticsHome'} tableName={tableName} formData={gridData} onBack={onBack} formMode={'Update'} id={id}></Header>
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
                            <SimpleItem dataField="U_Date" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Tarih' }} />
                            <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsCardCode, value: selectedCardCode }} dataField="U_OcrdNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap' }} />
                            <SimpleItem editorOptions={{ value: cardName, disabled: true }} dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap Adı' }} />
                            <SimpleItem dataField="U_Status" editorType="dxSelectBox" editorOptions={statusOptions} cssClass="transparent-bg" label={{ text: 'Statü' }} />
                            <SimpleItem dataField="U_Type" editorType="dxSelectBox" editorOptions={{ ...typeOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Tip' }} />
                            <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsVehicle, value: selectedVehicle }} dataField="U_VehicleNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Araç No' }} />
                            <SimpleItem dataField="U_PlateCode" editorOptions={{ value: plateCode, disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                            <SimpleItem dataField="U_TrailerPlateCode" editorOptions={{ value: trailerPlateCode, disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />
                            <SimpleItem dataField="U_DriverName" editorOptions={{ value: driverName, disabled: true }} editorType="dxTextBox" label={{ text: 'Şöför Adı' }} />
                            <SimpleItem dataField="U_LoadingRamp" editorType="dxSelectBox" editorOptions={loadingRampOptions} cssClass="transparent-bg" label={{ text: 'Yükleme Rampası' }} />
                            <SimpleItem dataField="U_Address" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Adres' }} />
                            <SimpleItem dataField="U_County" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İlçe' }} />
                            <SimpleItem dataField="U_City" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İl' }} />
                            <SimpleItem dataField="U_Country" editorType="dxSelectBox" editorOptions={countryOptions} cssClass="transparent-bg" label={{ text: 'Ülke' }} />
                            <SimpleItem dataField="U_ZipCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Posta Kodu' }} />
                            <SimpleItem dataField="U_PaymentStatus" editorType="dxSelectBox" editorOptions={paymentStatusOptions} cssClass="transparent-bg" label={{ text: 'Ödeme Durumu' }} />
                            <SimpleItem dataField="U_DeliveryStatus" editorType="dxSelectBox" editorOptions={deliveryStatusOptions} cssClass="transparent-bg" label={{ text: 'Teslim Durumu' }} />

                            <SimpleItem editorOptions={{ ...enterPrice, inputAttr: { class: 'right-align-text' } }} dataField="U_Price" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Fiyat' }} />
                            <SimpleItem dataField="U_PalletQuantity" editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" visible={palletFieldVisibility} cssClass="transparent-bg" label={{ text: 'Palet Miktarı' }} />
                            <SimpleItem dataField="U_PalletCost" editorOptions={{ value: palletCost, disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" visible={palletFieldVisibility} cssClass="transparent-bg" label={{ text: 'Palet Maliyeti' }} />
                            <SimpleItem dataField="U_TotalWeight" editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Toplam Ağırlık' }} visible={!palletFieldVisibility} />
                            <SimpleItem dataField="U_Amount" editorOptions={{ value: amount, disabled: true, inputAttr: { class: 'right-align-text' } }} visible={!palletFieldVisibility} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Tutar' }} />
                            <SimpleItem dataField="U_DeliveryNoteNo" editorType="dxTextBox" cssClass="transparent-bg" visible={!palletFieldVisibility} label={{ text: 'İrsaliye No' }} />
                            <SimpleItem dataField="U_Description" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Açıklama' }} />
                        </Form>
                        <Button onClick={() => togglePopupShp()} text='Sipariş Ekle' ></Button>
                        <Button onClick={() => printCrystal()} text='Yazdır' ></Button>
                    </div>
                </form>
                <DataGrid
                    dataSource={gridData.SML_LGT_ITEMCollection}
                    columnAutoWidth={true}
                    allowColumnResizing={true}
                >
                    <Column
                        visible={palletFieldVisibility}
                        alignment='right'
                        caption="Depo Yeri Seç"
                        cellRender={renderButtonBinLocations}
                    />
                    <Column visible={palletFieldVisibility} dataField="U_BinLocJson" caption="Depo Yeri" width={0} allowEditing={false}  />
                    <Column dataField="U_BinEntry"  visible={palletFieldVisibility} caption="Bin Entry" allowEditing={false} width={0}/>
                    <Column dataField="U_BinCode"  visible={palletFieldVisibility} caption="Depo Yeri" allowEditing={false} />
                    <Column dataField="U_ItemCode" caption="Kalem Kodu" allowEditing={false} />
                    <Column dataField="U_ItemName" caption="Kalem Açıklama" allowEditing={false} />
                    <Column dataField="U_CardCode" caption="Muhatap Kodu" allowEditing={false} />
                    <Column dataField="U_CardName" caption="Muhatap" allowEditing={false} />
                    <Column dataField="U_TradeFileNo" caption="Ticaret Dosya No" allowEditing={false} />
                    <Column dataField="U_TransportType" caption="Sevkiyat Şekli" allowEditing={false} width={0} />
                    <Column dataField="U_ShipmentNo" caption="Sevkiyat No" allowEditing={false} alignment='left' />
                    <Column dataField="U_ShipmentLine" caption="Sevkiyat Sıra" allowEditing={false} alignment='left' />
                    <Column dataField="U_OrderNo" caption="Sipariş Entry" allowEditing={false} alignment='left' />
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
                <Popup
                    showCloseButton={true}
                    visible={isPopupVisibleShp}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupShp}
                >
                    <ShipmentList onRowSelected={handleRowSelection} gridData={gridData} formMode={'u'} type={gridData.U_Type} />
                </Popup>
                <Popup
                    showCloseButton={true}
                    visible={isPopupVisibleShpPO}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupShp}
                    fullScreen={true}
                    title='Sevkiyat Planı Kalemleri (Satınalma)'
                >
                    <ShipmentListPO onRowSelected={handleRowSelectionPO} gridData={gridData} type={gridData.U_Type} formMode={'a'} />
                </Popup>
                <Popup
                    visible={isPopupVisibleCardCode1}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupCardCode1}
                >
                    <ZoomLayout onRowSelected={handleCardSelection} tableName={"BusinessPartners"} tableKey={"CardCode"} notDeleted={cardTypeFilter1} filters={businessPartnersFilters} columns={businessPartnersColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisibleCardCode2}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupCardCode2}
                >
                    <ZoomLayout onRowSelected={handleCardSelection} tableName={"BusinessPartners"} tableKey={"CardCode"} notDeleted={cardTypeFilter2} filters={businessPartnersFilters} columns={businessPartnersColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisibleVehicle}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupVehicle}
                >
                    <ZoomLayout onRowSelected={handleVehicleSelection} tableName={"SML_BAS_VHL"} tableKey={"DocEntry"} notDeleted={notDeletedFilter} filters={vehicleFilters} columns={vehicleColumns}></ZoomLayout>
                </Popup>
                <Popup
                    showCloseButton={true}
                    visible={isPopupVisibleBinLocations}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupBinLocations}
                    title='Depo Yeri Stok Durumu'
                    width="50%"
                    height="50%"
                >
                    <BinLocations onRowSelected={handleRowSelectionBinLocations} gridData={gridData} setGridData={setGridData} type={gridData.U_Type} formMode={'a'} binLocDataSource={binLocDataSource} columnIndex={selectedColumnIndex} palletQuantity={palletQuantity} binLocationJsonData={binJsonData} />
                </Popup>
            </div>

        </div>
    )
}

export default LogisticsUpdate