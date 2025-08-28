import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useRef, useState } from 'react'
import Header from '../../components/myComponents/Header'
import { deliveryStatus, formDataAdd as initialFormData, paymentStatus, statuses, types } from './data/data';
import { Button } from 'devextreme-react/button';
import { Column, DataGrid } from 'devextreme-react/data-grid';
import { Popup } from 'devextreme-react/popup';
import ZoomLayout from '../../components/myComponents/ZoomLayout';
import { businessPartnersColumns, businessPartnersFilters, vehicleColumns, vehicleFilters } from '../../data/zoomLayoutData';
import ShipmentList from './components/ShipmentList';
import { getBinLocations } from '../../store/logisticsSlice';
import { useDispatch } from 'react-redux';
import { updateData } from '../../store/appSlice';
import { getLoadingRamps } from '../../store/weighbridgeSlice';
import ShipmentListPO from './components/ShipmentListPO';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCountries } from '../../store/shipmentSlice';
import BinLocations from './components/BinLocations';
const tableName = "SML_LGT_HDR";
const statusOptions = {
    dataSource: statuses,
    displayExpr: 'Value',
    valueExpr: 'Key'
};

function LogisticsAdd({ onBack }) {
    const [change, setChange] = useState(0);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [gridData, setGridData] = useState({ ...initialFormData });
    const [onBackReport, setOnBackReport] = useState(location.state?.onBackReport || null)
    const [palletCost, setPalletCost] = useState();
    const [amount, setAmount] = useState();
    const [isPopupVisibleVehicle, setPopupVisibilityVehicle] = useState(false);
    const [itemData, setItemData] = useState(location.state?.itemData || null)
    const [driverName, setDriverName] = useState(false);
    const [plateCode, setPlateCode] = useState(false);
    const [trailerPlateCode, setTrailerPlateCode] = useState(false);
    const [cardName, setCardName] = useState(false);
    const [countryData, setCountryData] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(initialFormData.U_VehicleNo || '');
    const [loadingRampData, setloadingRampData] = useState(null);
    const [palletFieldVisibility, setPalletFieldVisibility] = useState(location.state?.vis !== undefined ? location.state.vis : true);
    const collectionDataSourceRef = useRef();
    const notDeletedFilter = ["U_IsDeleted", "=", "N"]
    const cardTypeFilter1 = ["CardType", "=", "cSupplier"]
    const cardTypeFilter2 = ["CardType", "=", "cCustomer"]
    const [isPopupVisibleCardCode1, setPopupVisibilityCardCode1] = useState(false);
    const [isPopupVisibleCardCode2, setPopupVisibilityCardCode2] = useState(false);
    const togglePopupCardCode1 = () => {

        setPopupVisibilityCardCode1(!isPopupVisibleCardCode1);
    };
    const handleBack = () => {
        navigate(onBackReport);
    };

    const effectiveOnBack = onBack || handleBack;
    useEffect(() => {
        getCountryData();
        const ramps = getRampData();
        setloadingRampData(ramps);
    }, [])

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
    if (onBackReport && change === 0) {
        gridData.U_Type = location.state?.type || 1
        const previousBinData = gridData.SML_LGT_ITEMCollection?.map(item => ({
            U_ShipmentNo: item.U_ShipmentNo,
            U_ShipmentLine: item.U_ShipmentLine,
            U_BinLocJson: item.U_BinLocJson
        })) || [];
        gridData.SML_LGT_ITEMCollection = [];
        let totalQuantity = 0;
        itemData.forEach(item => {
            const collection = item//["SML_SHP_HDR/SML_SHP_ITEMCollection"];
            const matchedBinData = previousBinData.find(
                b => b.U_ShipmentNo === collection.DocEntry && b.U_ShipmentLine === collection.LineId
            );
            const newItem = {
                U_BinLocJson: matchedBinData?.U_BinLocJson || collection.U_BinLocJson,
                U_ShipmentNo: collection.DocEntry,
                U_ShipmentLine: collection.LineId,
                // U_Quantity: gridData.U_Type === 1 ? collection.U_PalletQuantity : collection.U_Quantity,
                U_Quantity: collection.RemainingQuantity,
                U_ItemCode: collection.U_ItemCode,
                U_CardName: collection.U_CardName,
                U_TransportType: collection.U_TransportType,
                U_ItemName: collection.U_ItemName,
                U_CardCode: collection.U_CardCode,
                U_OrderNo: collection.U_OrderNo,
                U_OrderLine: collection.U_OrderLine,
                U_PalletCost: "",
                U_TradeFileNo: collection.U_TradeFileNo,
                U_WhsCode: collection.U_WhsCode,
                U_PalletGrossWgh: collection.U_PalletGrossWgh,
                U_PalletNetWgh: collection.U_PalletNetWgh,
                U_PalletType: collection.U_PalletType,
                U_InnerQtyOfPallet: collection.U_InnerQtyOfPallet
            };

            let coefficient = 1;
            if (collection.U_PalletType === 'Tam Palet') {
                coefficient = 1;
            } else if (collection.U_PalletType === 'Yarım Palet') {
                coefficient = 0.5;
            }
            // totalQuantity += gridData.U_Type === 1 ? collection.U_PalletQuantity : collection.U_Quantity * coefficient || 0
            //BURAYI KONTROL ET
            totalQuantity += collection.RemainingQuantity * coefficient || 0; //gridData.U_Type === 1 ? collection.U_PalletQuantity : collection.U_Quantity * coefficient || 0
            gridData.SML_LGT_ITEMCollection.push(newItem);
            gridData.U_Address = collection.U_Address;
            gridData.U_City = collection.U_City;
            gridData.U_County = collection.U_County;
            gridData.U_Country = collection.U_Country;
            gridData.U_ZipCode = collection.U_ZipCode;
        });
        if (gridData.U_Type === 1) {
            gridData.U_PalletQuantity = totalQuantity;
        }
        else {
            gridData.U_TotalWeight = totalQuantity;

        }
    }
    const loadingRampOptions = {
        dataSource: loadingRampData,
        displayExpr: 'U_RampName',
        valueExpr: 'DocEntry',
    };
    const togglePopupCardCode2 = () => {

        setPopupVisibilityCardCode2(!isPopupVisibleCardCode2);
    };

    const [selectedColumnIndex, setSelectedColumnIndex] = useState("");
    const [binLocDataSource, setBinLocDataSource] = useState(null);
    const [isPopupVisibleShp, setPopupVisibilityShp] = useState(false);
    const [isPopupVisibleShpPO, setPopupVisibilityShpPO] = useState(false);
    const [isPopupVisibleBinLocations, setPopupVisibilityBinLocations] = useState(false);

    const togglePopupBinLocations = async ({ itemCode, whsCode, quantity, columnIndex }) => {
        if (isPopupVisibleBinLocations) {
            setPopupVisibilityBinLocations(false);
            return;
        }

        await fetchDataSource({ itemCode, whsCode, quantity });

        setSelectedColumnIndex(columnIndex);
        setPopupVisibilityBinLocations(true);
    };

    const fetchDataSource = async ({ itemCode, whsCode, quantity }) => {
        try {
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

    const togglePopupShp = () => {
        // if (gridData.U_Price) {
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


    const togglePopupVehicle = () => {
        setPopupVisibilityVehicle(!isPopupVisibleVehicle);
    };
    const [selectedCardCode, setSelectedCardCode] = useState(initialFormData.U_OcrdNo || '');
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
    useEffect(() => {
    }, [gridData]);
    const handleRowSelection = (selectedRowData) => {
        setGridData(selectedRowData);
        const palletCost = gridData.U_Price / selectedRowData.U_PalletQuantity;
        setPalletCost(palletCost.toFixed(2))
        setPopupVisibilityShp(false);
    };
    const handleRowSelectionPO = (selectedRowData) => {
        setGridData(selectedRowData);
        // const palletCost = gridData.U_Price / selectedRowData.U_PalletQuantity;
        // setPalletCost(palletCost.toFixed(2))
        setPopupVisibilityShpPO(false);
    };

    const handleRowSelectionBinLocations = (selectedRowData) => {
        setGridData(selectedRowData);
        setPopupVisibilityBinLocations(false);

        // Grid'i yenilemeye zorla (opsiyonel)
        // if (collectionDataSourceRef.current) {
        //     collectionDataSourceRef.current.instance.refresh();
        // }
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
    const extraFunctions = ({ result }) => {
        updateLogistics({ docEntry: result.payload.data.DocEntry ,type:result.payload.data.U_Type})


        updateShipment({ result })


    }

    const updateShipment = async ({ result }) => {
        const shipment = result.payload.data;
        await shipment.SML_LGT_ITEMCollection.forEach(async (item) => {
            const shipmentId = item.U_ShipmentNo;
            const shipmentLine = item.U_ShipmentLine;
            const shipmentData = {
                "SML_SHP_ITEMCollection": [
                    {
                        "LineId": shipmentLine,
                        "U_DeliveryStatus": 2,
                    }
                ]
            };
            await dispatch(updateData({ tableName: "SML_SHP_HDR", updatedData: shipmentData, id: shipmentId })).then((result) => {
                if (result.payload) {
                    console.log("success");
                }
            })
        });
    }
    const updateLogistics = async ({ docEntry ,type}) => {
        debugger
        const year = new Date().getFullYear();
        let sixDigitNumber = docEntry.toString().padStart(6, '0');
        let prefix = (type === 1) ? 'M' :'H';

        let customDocNum = `${prefix}${year}${sixDigitNumber}`;
        const logisticsData = {
            "U_CustomDocNum": customDocNum
        }
        await dispatch(updateData({ tableName: tableName, updatedData: logisticsData, id: docEntry })).then((result) => {
            if (result.payload) {
                console.log("success");
            }
        });
    }


    const handleVehicleSelection = async (selectedRowData) => {
        setSelectedVehicle(selectedRowData.DocEntry);
        // getDriverVehicle({ id: selectedRowData.DocEntry })
        setPlateCode(selectedRowData.U_PlateCode);
        setDriverName(selectedRowData.U_Name + ' ' + selectedRowData.U_Surname);
        setSelectedCardCode(selectedRowData.U_CardCode);
        setCardName(selectedRowData.U_CardName)
        setTrailerPlateCode(selectedRowData.U_TrailerPlateCode);
        setPopupVisibilityVehicle(false);
    };

    //const enterPrice = ({ e }) => {
    //     const price=e.event.currentTarget.value
    //     const palletCost =price / gridData.U_PalletQuantity
    //     setPalletCost(palletCost)


    // };
    const typeOptions = {
        dataSource: types,
        displayExpr: 'Value',
        valueExpr: 'Key',
        onValueChanged: ({ value }) => {
            if (value === 2) {
                setPalletFieldVisibility(false)
            }
            else {
                setPalletFieldVisibility(true)
            }
        }
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
    useEffect(() => {
    }, [gridData])

    const enterPrice = {
        onValueChanged: ({ value }) => {
            if (value) {
                gridData.U_Price = value.replace(",", ".");
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
                        setChange(1)
                        // collectionDataSourceRef.current.instance.refresh();
                    }
                }
                else {
                    if (gridData.U_TotalWeight !== 0) {
                        const price = value;
                        const amount = price * gridData.U_TotalWeight;
                        setAmount(amount.toFixed(2));

                        const sum = gridData.SML_LGT_ITEMCollection.reduce((sum, item) => sum + parseFloat(item.U_Quantity || 0), 0);
                        const updatedGridData = {
                            ...gridData,
                            SML_LGT_ITEMCollection: gridData.SML_LGT_ITEMCollection.map(item => ({
                                ...item,
                                U_PalletCost: ((price / sum) * item.U_Quantity).toFixed(2)
                            }))
                        };
                        setGridData(updatedGridData);
                        setChange(1)
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

    const renderButtonBinLocations = (cellData) => {
        let itemCode = cellData.data.U_ItemCode;
        let whsCode = cellData.data.U_WhsCode;
        let quantity = cellData.data.U_Quantity;//* cellData.data.U_InnerQtyOfPallet;
        let columnIndex = gridData.SML_LGT_ITEMCollection.findIndex(item =>
            item.U_OrderNo === cellData.data.U_OrderNo &&
            item.U_OrderLine === cellData.data.U_OrderLine &&
            item.U_ShipmentNo === cellData.data.U_ShipmentNo &&
            item.U_ShipmentLine === cellData.data.U_ShipmentLine &&
            item.U_ItemCode === cellData.data.U_ItemCode &&
            item.U_BinEntry === cellData.data.U_BinEntry &&
            item.U_BinCode === cellData.data.U_BinCode
        );
        return (
            <>
                <Button
                    icon='search'
                    onClick={() => togglePopupBinLocations({ itemCode: itemCode, whsCode: whsCode, quantity: quantity, columnIndex: columnIndex })}
                    type="default"
                />
            </>
        );
    };
    return (
        <div >
            <div className="page-container">
                <form >
                    <Header save={true} trash={false} title={"Lojistik Planı Oluştur"} nav={'/logisticsHome'} tableName={tableName} formData={gridData} onBack={effectiveOnBack} formMode={'Add'} extraFunctions={extraFunctions}></Header>
                    <div className="form-container">
                        <Form formData={gridData} colCount={5} labelLocation="top" >

                            <SimpleItem dataField="U_Date" editorOptions={{ displayFormat: "dd/MM/yyyy", dateSerializationFormat: "yyyy-MM-dd", type: "date" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Tarih' }} />
                            <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsCardCode, value: selectedCardCode }} dataField="U_OcrdNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap' }} />
                            <SimpleItem editorOptions={{ value: cardName, disabled: true }} dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap Adı' }} />
                            <SimpleItem dataField="U_Status" editorType="dxSelectBox" editorOptions={statusOptions} cssClass="transparent-bg" label={{ text: 'Statü' }} />
                            <SimpleItem dataField="U_Type" editorType="dxSelectBox" editorOptions={typeOptions} cssClass="transparent-bg" label={{ text: 'Tip' }} />

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
                            <SimpleItem dataField="U_PalletQuantity" editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Palet Miktarı' }} visible={palletFieldVisibility} />
                            <SimpleItem dataField="U_PalletCost" editorOptions={{ value: palletCost, disabled: true, inputAttr: { class: 'right-align-text' } }} visible={palletFieldVisibility} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Palet Mailyeti' }} />
                            <SimpleItem dataField="U_TotalWeight" editorOptions={{ disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Toplam Ağırlık' }} visible={!palletFieldVisibility} />
                            <SimpleItem dataField="U_Amount" editorOptions={{ value: amount, disabled: true, inputAttr: { class: 'right-align-text' } }} visible={!palletFieldVisibility} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Tutar' }} />
                            <SimpleItem dataField="U_DeliveryNoteNo" editorType="dxTextBox" cssClass="transparent-bg" visible={!palletFieldVisibility} label={{ text: 'İrsaliye No' }} />
                            <SimpleItem dataField="U_Description" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Açıklama' }} />
                        </Form>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '100%',
                            marginTop: 10,
                        }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <Button
                                    onClick={() => togglePopupShp()}
                                    style={{
                                        backgroundColor: '#28a745',
                                        color: '#fff',
                                        marginTop: 10,
                                    }}
                                    text='Sevkiyat Planı Ekle'></Button>

                            </div>
                        </div>

                    </div>
                </form>
                <DataGrid
                    dataSource={gridData.SML_LGT_ITEMCollection}
                    ref={collectionDataSourceRef}
                    columnAutoWidth={true}
                    allowColumnResizing={true}
                // key={Math.random()}
                >
                    <Column
                        visible={palletFieldVisibility}
                        alignment='right'
                        caption="Depo Yeri Seç"
                        cellRender={renderButtonBinLocations}
                    />
                    <Column dataField="U_BinEntry"  visible={palletFieldVisibility} caption="Bin Entry" allowEditing={false} width={0}/>
                    <Column dataField="U_BinCode"  visible={palletFieldVisibility} caption="Depo Yeri" allowEditing={false} />
                    <Column dataField="U_BinLocJson" caption="Depo Yeri json" allowEditing={false} width={0} />
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
                    fullScreen={true}
                    title='Sevkiyat Planı Kalemleri (Satış)'
                >
                    <ShipmentList onRowSelected={handleRowSelection} gridData={gridData} type={gridData.U_Type} formMode={'a'} />
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
                    showCloseButton={true}
                    title='Tedarikçi Listesi'
                >
                    <ZoomLayout onRowSelected={handleCardSelection} tableName={"BusinessPartners"} tableKey={"CardCode"} notDeleted={cardTypeFilter1} filters={businessPartnersFilters} columns={businessPartnersColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisibleCardCode2}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupCardCode2}
                    showCloseButton={true}
                    title='Müşteri Listesi'
                >
                    <ZoomLayout onRowSelected={handleCardSelection} tableName={"BusinessPartners"} tableKey={"CardCode"} notDeleted={cardTypeFilter2} filters={businessPartnersFilters} columns={businessPartnersColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisibleVehicle}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupVehicle}
                    showCloseButton={true}
                    title='Araç Listesi'
                >
                    <ZoomLayout onRowSelected={handleVehicleSelection} tableName={"SML_BAS_VHL"} tableKey={"DocEntry"} notDeleted={notDeletedFilter} filters={vehicleFilters} columns={vehicleColumns}></ZoomLayout>
                </Popup>
                <Popup
                    showCloseButton={true}
                    visible={isPopupVisibleBinLocations}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupBinLocations}
                    title='Depo Yeri Stok Durumu'
                    width="65%"
                    height="50%"
                >
                    <BinLocations onRowSelected={handleRowSelectionBinLocations} gridData={gridData} binLocDataSource={binLocDataSource} columnIndex={selectedColumnIndex} />
                </Popup>
            </div>
        </div>
    )
}

export default LogisticsAdd