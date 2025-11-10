import { Form, GroupItem, SimpleItem } from 'devextreme-react/form'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../../components/myComponents/Header'
import { formData, statuses, yesno } from './data/data';
import { Popup } from 'devextreme-react/popup';
import ZoomLayout from '../../components/myComponents/ZoomLayout';
import { driverColumns, driverFilters, employeeColumns, employeeFilters, logisticsColumns, logisticsFilters, poColumns, poFilters, vehicleColumns, vehicleFilters } from '../../data/zoomLayoutData';
import { useDispatch } from 'react-redux';
import { addData, createODataSource, getItemById, updateData } from '../../store/appSlice';
import { closeSerialPort, connectToSerialPort, documentTotal, driverVehicleInformation, getDocTotal, getLoadingRamps, getShipmentType, getTradeFileNo, isClosedOrder, isExistsPO, printWghReport, showLastValue } from '../../store/weighbridgeSlice';
import LogisticsList from './components/LogisticsList';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
const tableName = "SML_WGHB_HDR";
const statusOptions = {
    dataSource: statuses,
    displayExpr: 'Value',
    valueExpr: 'Key'
};
function WeighbridgeUpdate({ id, onBack }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [onBackReport, setOnBackReport] = useState(location.state?.onBackReport || null)
    const [id2, setId2] = useState(location.state?.id2 || null)
    const [gridData, setGridData] = useState(formData);
    const [isPopupVisibleDriver, setPopupVisibilityDriver] = useState(false);
    const [isPopupVisibleLgtS, setPopupVisibilityLgtS] = useState(false);
    const [isPopupVisibleLgtP, setPopupVisibilityLgtP] = useState(false);
    const [isPopupVisibleEmp, setPopupVisibilityEmp] = useState(false);
    const [isPopupVisibleVehicle, setPopupVisibilityVehicle] = useState(false);
    const [employeeName, setEmployeeName] = useState(false);
    const [driverName, setDriverName] = useState(false);
    const [plateCode, setPlateCode] = useState(false);
    const [vehicleDesc, setVehicleDesc] = useState(false);
    const [selectedPO, setSelectedPO] = useState();
    const [docTotal, setDocTotal] = useState(formData.U_DocTotal || '0');
    const [netWeight, setNetWeight] = useState(formData.U_NetWeihgt || '0');
    const [difference, setDifference] = useState(formData.U_NetWeihgt || '0');
    const [firstWeight, setFirstWeight] = useState(formData.U_FirstWgh || '0');
    const [secondWeight, setSecondWeight] = useState(formData.U_SecondWgh || '0');
    const [trailerPlateCode, setTrailerPlateCode] = useState(formData.U_DriverNo || '');
    const [selectedLgt, setSelectedLgt] = useState(formData.U_LogisticsNo || '');
    const [selectedEmp, setSelectedEmp] = useState(formData.U_WhgPerson || '');
    const [selectedVehicle, setSelectedVehicle] = useState(formData.U_VehicleNo || '');
    const [loadingRampData, setloadingRampData] = useState(null);
    const [isPopupVisiblePO, setPopupVisibilityPO] = useState(false);
    const poFilter = [
        ["DocumentStatus", "=", "bost_Open"],
        ["U_SevPlnDahil", "=", "N"]]
    const notDeletedFilter = ["U_IsDeleted", "=", "N"]

    const [wghData, setWghData] = useState(0);
    const handleBack = () => {
        navigate(onBackReport);
    };

    const effectiveOnBack = onBack || handleBack;
    const effectiveId = id || id2;
    const togglePopupDriver = () => {
        setPopupVisibilityDriver(!isPopupVisibleDriver);
    };
    const togglePopupLgtS = () => {
        setPopupVisibilityLgtS(!isPopupVisibleLgtS);
    };
    const togglePopupLgtP = () => {
        setPopupVisibilityLgtP(!isPopupVisibleLgtP);
    };
    const togglePopupEmp = () => {
        setPopupVisibilityEmp(!isPopupVisibleEmp);
    };
    const togglePopupVehicle = () => {
        setPopupVisibilityVehicle(!isPopupVisibleVehicle);
    };
    const togglePopupPO = () => {
        setPopupVisibilityPO(!isPopupVisiblePO);
    };
    const handleNotify = ({ message, type }) => {
        notify(
            {
                message: message,
                width: 720,
                position: {
                    at: "bottom",
                    my: "bottom",
                    of: "#container"
                }
            },
            type,
            1500
        );
    }
    const textBoxWithButtonOptionsDrv = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    togglePopupDriver();
                }
            }
        }]
    };
    const textBoxWithButtonOptionsLgt = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    if (gridData.U_WghType === 1) {
                        togglePopupLgtS();
                    }
                    if (gridData.U_WghType === 2) {
                        togglePopupLgtP();
                    }
                }
            }
        }]
    };
    const textBoxWithButtonOptionsEmp = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    togglePopupEmp();
                }
            }
        }]
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
    useEffect(() => {
        const ramps = getRampData();
        setloadingRampData(ramps);
        firstLoad();
    }, [])
    const loadingRampOptions = {
        dataSource: loadingRampData,
        displayExpr: 'U_RampName',
        valueExpr: 'DocEntry',
    };
    useEffect(() => {
        if (gridData) {
        }
    }, [gridData]);
    const getRampData = async () => {
        const ramps = await getLoadingRamps();
        setloadingRampData(ramps);
    }
    const poOptions = {
        dataSource: yesno,
        displayExpr: 'Value',
        valueExpr: 'Key'

    };
    const textBoxWithButtonOptionsPO = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    if (gridData.U_WghType === 2
                        //&& gridData.U_IsCreatePO === "Y"
                    ) {

                        togglePopupPO();
                    }
                    else {
                        handleNotify({ message: "Belge Eklemek İçim Tartım Tipini Alış  Olarak Seçin.", type: "error" })
                    }
                }
            }
        }]
    };
    const firstLoad = async () => {
        await dispatch(getItemById({ tableName: tableName, id: effectiveId })).then((result) => {
            if (result.payload) {
                setGridData(result.payload);
                setTrailerPlateCode(result.payload.U_TrailerPlateCode);
                setDriverName(result.payload.U_DriverName);
                setSelectedEmp(result.payload.U_WhgPerson);
                setEmployeeName(result.payload.U_WghPersonName);
                setSelectedVehicle(result.payload.U_VehicleNo);
                setSelectedLgt(result.payload.U_LogisticsNo);
                setDocTotal(result.payload.U_DocTotal)
                setPlateCode(result.payload.U_PlateCode)
                setSelectedPO(result.payload.U_PODocNo)
                // getDriverVehicle(result.payload.U_VehicleNo);
                // setSelectedDriver(result.payload.U_DriverNo)

                // getEmployeeFirstLoad({ id: result.payload.U_WhgPerson });
                // getDriverFirstLoad({ id: result.payload.U_DriverNo });
                // getVehicleFirstLoad({ id: result.payload.U_VehicleNo })
                // getDocTotalFirstLoad({ id: result.payload.U_LogisticsNo })

            }
        })

        sessionStorage.setItem('activeComponent', null)
    }
    // const getDriverFirstLoad = async ({ id }) => {
    //     const driver = await dispatch(getItemById({ tableName: "SML_BAS_DRV", id: id }))
    //     const fullName = driver.payload.U_Name + " " + (driver.payload.U_MiddleName || '') + " " + driver.payload.U_Surname;
    //     setSelectedDriver(id);
    //     setDriverName(fullName);
    // }

    // const getEmployeeFirstLoad = async ({ id }) => {
    //     const getEmployee = await dispatch(getItemById({ tableName: "EmployeesInfo", id: id }))
    //     const fullName = getEmployee.payload.FirstName + " " + (getEmployee.payload.MiddleName || '') + " " + getEmployee.payload.LastName;
    //     setSelectedEmp(id);
    //     setEmployeeName(fullName);
    // }
    // const getVehicleFirstLoad = async ({ id }) => {
    //     const vehicle = await dispatch(getItemById({ tableName: "SML_BAS_VHL", id: id }))
    //     setSelectedVehicle(id);
    //     setVehicleDesc(vehicle.payload.U_Vehicle || '')
    //     setPlateCode(vehicle.payload.U_PlateCode || '')
    // }
    // const getDocTotalFirstLoad = ({ id }) => {
    //     setSelectedLgt(id);
    //     getDocTotal1({ id: id });
    // };
    const handlePOSelection = (selectedRowData) => {
        setSelectedPO(selectedRowData.DocEntry);
        //setDocTotal(selectedRowData.U_GrossWeight);
        setPopupVisibilityPO(false);
    };
    // const handleKeyDown = (e) => {
    //     debugger
    //     console.log(e)
    //     const dataField = e.event.target.name;
    //     if (gridData[dataField] === 0 || gridData[dataField] === "0") {
    //         gridData[dataField] = "";
    //         if (dataField === "U_FirstWgh") {
    //             setFirstWeight("");
    //         }
    //         if (dataField === "U_SecondWgh") {

    //             setSecondWeight("");
    //         }
    //     }
    // };
    const firstWeightLostFocus = {
        // onKeyDown: ({ e }) => {

        //     console.log(e.event.target.name)
        // },
        onValueChanged: ({ value }) => {

            if (value === "0") {

            }

            setNetWeight(Math.abs(gridData.U_SecondWgh - gridData.U_FirstWgh))

            gridData.U_Difference = Math.abs((Math.abs(gridData.U_SecondWgh - gridData.U_FirstWgh) - gridData.U_DocTotal))
            setDifference(Math.abs((Math.abs(gridData.U_SecondWgh - gridData.U_FirstWgh) - gridData.U_DocTotal)));
        },
        valueChangeEvent: "blur"

    };
    const docTotalLostFocus = {
        // onKeyDown: ({ e }) => {

        //     console.log(e.event.target.name)
        // },
        onValueChanged: ({ value }) => {

            if (value === "0") {

            }

            setDocTotal(value)

            gridData.U_Difference = Math.abs((Math.abs(gridData.U_SecondWgh - gridData.U_FirstWgh) - gridData.U_DocTotal))
            setDifference(Math.abs((Math.abs(gridData.U_SecondWgh - gridData.U_FirstWgh) - gridData.U_DocTotal)));
        },
        valueChangeEvent: "blur"

    };
    const handleLgtSelection = async (selectedRowData) => {
        setSelectedLgt(selectedRowData.DocEntry);
        const logistic = await logisticDoc({ docEntry: selectedRowData.DocEntry });
        setSelectedVehicle(logistic.payload.U_VehicleNo)
        setVehicleDesc(logistic.payload.U_VehicleDesc);
        setPlateCode(logistic.payload.U_PlateCode)
        setDriverName(logistic.payload.U_DriverName);
        setTrailerPlateCode(logistic.payload.U_TrailerPlateCode);
        getDocTotal1({ id: selectedRowData.DocEntry });
        gridData.U_LoadingRamp = logistic.payload.U_LoadingRamp;
        if (gridData.U_WghType === 1) {

            setPopupVisibilityLgtS(false);
        }
        if (gridData.U_WghType === 2) {
            setPopupVisibilityLgtP(false);
        }
    };
    // const handleDriverSelection = (selectedRowData) => {
    //     setSelectedDriver(selectedRowData.DocEntry);
    //     setPopupVisibilityDriver(false);
    // };
    const handleEmpSelection = async (selectedRowData) => {
        setSelectedEmp(selectedRowData.EmployeeID);
        const getEmployee = await dispatch(getItemById({ tableName: "EmployeesInfo", id: selectedRowData.EmployeeID }))
        const fullName = getEmployee.payload.FirstName + " " + (getEmployee.payload.MiddleName || '') + " " + getEmployee.payload.LastName;
        setEmployeeName(fullName);
        setPopupVisibilityEmp(false);
    };
    const handleVehicleSelection = async (selectedRowData) => {
        // getDriverVehicle({ id: selectedRowData.DocEntry })
        setSelectedVehicle(selectedRowData.DocEntry);
        setDriverName(selectedRowData.U_Name + ' ' + selectedRowData.U_Surname);
        setPlateCode(selectedRowData.U_PlateCode)
        setTrailerPlateCode(selectedRowData.U_TrailerPlateCode)
        setPopupVisibilityVehicle(false);
    };
    // const getDriverVehicle = (async (id) => {
    //     const res = await dispatch(driverVehicleInformation({ id: id })).unwrap();
    //     const fullName = (res.value[0].SML_BAS_DRV.U_Name || '') + " " + (res.value[0].SML_BAS_DRV.U_MiddleName || '') + " " + (res.value[0].SML_BAS_DRV.U_Surname || '')
    //     const vehicleDsc = res.value[0].SML_BAS_VHL.U_Vehicle
    //     const pltCode = res.value[0].SML_BAS_VHL.U_PlateCode;
    //     const driverId = res.value[0].SML_BAS_DRV.DocEntry;
    //     setVehicleDesc(vehicleDsc);
    //     setPlateCode(pltCode)
    //     setDriverName(fullName);
    //     setTrailerPlateCode(driverId)
    // });
    const getDocTotal1 = (async ({ id }) => {
        const res = await getDocTotal({ id: id });
        setDocTotal(res.data.value[0].Items.total)
    });

    const printCrystal = () => {
        printWghReport({ wghId: id });
        // viewCrystal({logisticId:id});
    }
    const extraFunctions = async ({ result }) => {
        if (result.meta.arg.updatedData.U_WghType === 2 && result.meta.arg.updatedData.U_LogisticsNo) {

            const logisticsId = result.meta.arg.updatedData.U_LogisticsNo;
            const plateCode = result.meta.arg.updatedData.U_PlateCode;
            const docTotal = result.meta.arg.updatedData.U_DocTotal;
            const lgtData = {
                "U_Status": 6
            }
            dispatch(updateData({ tableName: "SML_LGT_HDR", updatedData: lgtData, id: logisticsId })).then((result) => {
                if (result.payload) {

                }
            })
            const res = await getShipmentType({ logisticNo: logisticsId });
            // debugger
            if (res) {
                const shipmentType = res.data.value[0]["SML_SHP_HDR"].U_ShipmentType
                if (shipmentType === 1) {
                    const amount = res.data.value[0]["SML_LGT_HDR"].U_Amount
                    const customerCode = res.data.value[0]["SML_LGT_HDR/SML_LGT_ITEMCollection"].U_CardCode
                    const abroad = res.data.value[0]["Items"].U_YurtdisiNakliye;
                    const domestic = res.data.value[0]["Items"].U_YurticiNakliye
                    const cardCode = res.data.value[0]["SML_LGT_HDR"].U_OcrdNo;
                    const shippingExpenseItem = customerCode.startsWith("MD") ? abroad : domestic;
                    await addPurchaseOrder({ amount: amount, cardCode: cardCode, shippingExpenseItem: shippingExpenseItem, logisticNo: logisticsId, plateCode: plateCode, docTotal: docTotal })
                }
            }

        }
        if ( //result.meta.arg.updatedData.U_IsCreatePO === "Y" && 
            result.meta.arg.updatedData.U_WghType === 2) {
            addPOGoodsReceipt({ result: result });
        }

    }

    const addPurchaseOrder = async ({ amount, cardCode, shippingExpenseItem, logisticNo, plateCode, docTotal }) => {
        debugger
        const isExists = await isExistsPO({ logisticNo: logisticNo });
        debugger
        if (isExists.data.value.length === 0) {
            //debugger
            let purchaseOrder = {
                "CardCode": cardCode,
                "U_LogisticNo": logisticNo,
                "PriceList": -1,
                "Comments": `Plaka Kodu:${plateCode} Belge Toplamı:${docTotal}`,
                "DocumentLines": [
                    {
                        "ItemCode": shippingExpenseItem,
                        "Quantity": 1,
                        "Price": amount,
                        "UnitPrice": amount
                    }
                ]
            }
            debugger
            dispatch(addData({ tableName: "PurchaseOrders", formData: purchaseOrder })).then((res) => {

                if (res.meta.requestStatus === "fulfilled") {
                    purchaseOrder = null;
                    //   extraFunctions({ res });
                }
            })
        }
    }
    const addPOGoodsReceipt = async ({ result }) => {
        debugger
        if (result.meta.arg.updatedData.U_PODocNo && result.meta.arg.updatedData.U_WghType === 2) {
            const logisticsId = result.meta.arg.updatedData.U_LogisticsNo;
            //  const isClosed = await isClosedOrder({ orderNo:result.meta.arg.updatedData.U_PODocNo});
            //if (isClosed.data.value.length === 0) {

            const tradeFileRes = await getTradeFileNo({ logisticNo: logisticsId });
            //debugger
            const tradeFileNo = tradeFileRes.data.value[0]["SML_LGT_HDR/SML_LGT_ITEMCollection"].U_TradeFileNo;
            const docEntry = result.meta.arg.updatedData.DocEntry;
            const documentTotal = result.meta.arg.updatedData.U_DocTotal;
            const deliveryNoteNo = result.meta.arg.updatedData.U_DeliveryNoteNo;
            const purchaseOrderNo = result.meta.arg.updatedData.U_PODocNo;
            let POGoodsReceipt = {
                "CardCode": "",
                "NumAtCard": deliveryNoteNo,
                "U_WghNo": docEntry,
                "U_DeclarationNo": tradeFileNo,
                "U_DeclarationType": 1,
                "DocumentLines": []
            }
            const res = await dispatch(getItemById({ tableName: "PurchaseOrders", id: purchaseOrderNo }))
            //debugger
            POGoodsReceipt.CardCode = res.payload.CardCode;
            res.payload.DocumentLines.forEach(item => {
                POGoodsReceipt.DocumentLines.push({
                    "ItemCode": item.U_ItemCode,
                    "Quantity": documentTotal,
                    "Price": item.Price,
                    "Currency": item.Currency,
                    "WarehouseCode": item.WarehouseCode,
                    "BaseType": 22,
                    "BaseEntry": item.DocEntry,
                    "BaseLine": item.LineNum
                });
            });
            dispatch(addData({ tableName: "PurchaseDeliveryNotes", formData: POGoodsReceipt })).then((res) => {

                if (res.meta.requestStatus === "fulfilled") {
                    POGoodsReceipt = null;
                    //   extraFunctions({ res });
                }
            })
            //}
        }
    }
    const logisticDoc = async ({ docEntry }) => {
        const logistic = await dispatch(getItemById({ tableName: "SML_LGT_HDR", id: docEntry }));
        return logistic;
    }
    const comPortRef = useRef(null);
    const getData = async () => {
        await connectToSerialPort({ setField: comPortRef }); // Seri porttan gelen veriyi setAllData ile güncelle
    };
    const stopData = async () => {
        await closeSerialPort();
    };
    const getLastData = () => {
        const lastData = showLastValue();
        setWghData(lastData);
        gridData.U_SecondWgh = lastData;
        setNetWeight(Math.abs(gridData.U_SecondWgh - gridData.U_FirstWgh))
        gridData.U_Difference = Math.abs((Math.abs(gridData.U_SecondWgh - gridData.U_FirstWgh) - gridData.U_DocTotal))
    };
    return (
        <div >
            <div className="page-container">
                <form >
                    <Header save={true} trash={true} isDelete={gridData} title={"Kantar Güncelle"} nav={'/weighbridgeHome'} tableName={tableName} formData={gridData} onBack={effectiveOnBack} formMode={'Update'} extraFunctions={extraFunctions} id={effectiveId}></Header>
                    <div className="form-container">
                        <Form
                            formData={gridData}
                            labelLocation="top"
                        >
                            <GroupItem colCount={4}>
                                <GroupItem >
                                    <SimpleItem dataField="U_TransactionDate" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'İşlem Tarihi' }} />
                                    <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsLgt, value: selectedLgt }} dataField="U_LogisticsNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Lojistik Belge' }} />
                                    <SimpleItem dataField="U_WghType" editorType="dxSelectBox" editorOptions={statusOptions} cssClass="transparent-bg" label={{ text: 'Tartım Tipi' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsEmp, value: selectedEmp }} dataField="U_WhgPerson" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Personel No' }} />
                                    <SimpleItem editorOptions={{ value: employeeName, disabled: true }} dataField="U_WghPersonName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Tartım Yapan' }} />
                                    <SimpleItem dataField="U_LoadingRamp" editorType="dxSelectBox" editorOptions={loadingRampOptions} cssClass="transparent-bg" label={{ text: 'Yükleme Rampası' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem dataField="U_DriverName" editorOptions={{ value: driverName, disabled: false }} editorType="dxTextBox" label={{ text: 'Şöför Adı' }} />
                                    <SimpleItem dataField="U_DeliveryNoteNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İrsaliye No' }} />
                                    {/* <SimpleItem dataField='U_IsCreatePO' editorType="dxSelectBox" editorOptions={poOptions} label={{ text: 'Satınalma Siparişi Mal Girişi Açılsın mı?' }} /> */}
                                    <SimpleItem dataField="U_PODocNo" editorOptions={{ ...textBoxWithButtonOptionsPO, value: selectedPO }} label={{ text: 'Satınalma Siparişi No' }} />

                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsVehicle, value: selectedVehicle }} dataField="U_VehicleNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Araç No' }} />
                                    <SimpleItem dataField="U_PlateCode" editorOptions={{ value: plateCode, disabled: false }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                                    <SimpleItem editorOptions={{/* ...textBoxWithButtonOptionsDrv,*/ value: trailerPlateCode }} dataField="U_TrailerPlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />


                                </GroupItem>
                            </GroupItem>
                            <GroupItem colCount={2}>
                                <GroupItem>
                                    <SimpleItem
                                        dataField="U_Description"
                                        editorType="dxTextArea"
                                        label={{ text: 'Açıklama' }}
                                        editorOptions={{ height: 50 }}
                                        isRequired={true}
                                        validationRules={[{ type: 'required', message: 'This field is required' }]}
                                    />
                                </GroupItem>

                            </GroupItem>
                            <GroupItem>
                                <div
                                    style={{
                                        height: '5px',
                                        background: '#3f51b5',
                                        margin: '20px 0',
                                        borderRadius: '4px',
                                        animation: 'glow 2s infinite',
                                        boxShadow: '0 0 10px #3f51b5',
                                    }}
                                ></div>
                                <style>
                                    {`
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px #3f51b5; }
      60% { box-shadow: 0 0 20px #3f51b5; }
    }
  `}
                                </style>
                            </GroupItem>
                            <GroupItem colCount={2}>
                                <GroupItem>
                                    <SimpleItem dataField="U_FirstWghDate" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" label={{ text: 'İlk Tartım Tarihi' }} />
                                    <SimpleItem editorOptions={{ ...firstWeightLostFocus, inputAttr: { class: 'right-align-text' }, disabled: true }} dataField="U_FirstWgh" editorType="dxTextBox" label={{ text: 'İlk Tartım' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem dataField="U_SecondWghDate" editorOptions={{ displayFormat: "dd/MM/yyyy", dateSerializationFormat: "yyyy-MM-dd", type: "date" }} editorType="dxDateBox" label={{ text: 'İkinci Tartım Tarihi' }} />
                                    <SimpleItem editorOptions={{ ...firstWeightLostFocus, inputAttr: { class: 'right-align-text' } }} dataField="U_SecondWgh" editorType="dxTextBox" label={{ text: 'İkinci Tartım' }} />
                                </GroupItem>
                            </GroupItem>
                            <GroupItem colCount={2}>
                                <SimpleItem dataField="U_NetWeight" editorOptions={{ value: netWeight, disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" label={{ text: 'Net Tartım' }} />
                                <SimpleItem dataField="U_DocTotal" editorOptions={{ ...docTotalLostFocus, value: docTotal, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" label={{ text: 'Belge Toplamı' }} />
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <GroupItem>

                                    <SimpleItem
                                        dataField="U_Difference"
                                        editorType="dxTextBox"
                                        label={{ text: 'Kantar Farkı' }}
                                        editorOptions={{ value: difference, inputAttr: { class: 'right-align-text' } }}
                                    />
                                </GroupItem>

                            </GroupItem>
                        </Form>
                    </div>
                </form>
                <div style={{ display: "flex", flexDirection: "column", width: "300px", margin: "20px auto" }}>
                    <label
                        htmlFor="customInput"
                        style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "5px",
                        }}
                    >
                        COM Port Verisi:
                    </label>
                    <input
                        id="customInput"
                        type="text"
                        placeholder="Veri bekleniyor..."
                        ref={comPortRef}
                        style={{
                            padding: "10px 15px",
                            border: "2px solid #4caf50",
                            borderRadius: "8px",
                            fontSize: "16px",
                            outline: "none",
                            transition: "all 0.3s ease-in-out",
                            background: "linear-gradient(45deg, #f3f4f6, #ffffff)",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                    />
                </div>
                <Button onClick={() => getData()} text='Başlat' ></Button>
                <Button onClick={() => stopData()} text='Duraklat' ></Button>
                <Button onClick={() => getLastData()} text='yaz' ></Button>
                <Button onClick={() => printCrystal()} text='Kantar Fişi' ></Button>
                {/* <Popup
                    visible={isPopupVisibleDriver}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupDriver}
                >
                    <ZoomLayout onRowSelected={handleDriverSelection} tableName={"SML_BAS_DRV"} tableKey={"DocEntry"} customFilter={""} filters={driverFilters} columns={driverColumns}></ZoomLayout>
                </Popup> */}
                <Popup
                    visible={isPopupVisibleLgtS}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupLgtS}
                    showCloseButton={true}
                    fullScreen={true}
                    title='Lojistik Planları (Satış)'
                >
                    {/* <ZoomLayout onRowSelected={handleLgtSelection} tableName={"SML_LGT_HDR"} tableKey={"DocEntry"} customFilter={logisticsSales} filters={logisticsFilters} columns={logisticsColumns}></ZoomLayout> */}
                    <LogisticsList onRowSelected={handleLgtSelection} gridData={gridData} formMode='u' type={1}>

                    </LogisticsList>
                </Popup>
                <Popup
                    visible={isPopupVisibleLgtP}
                    hideOnOutsideClick={true}
                    showCloseButton={true}
                    onHiding={togglePopupLgtP}
                    fullScreen={true}
                    title='Lojistik Planları (Alış)'
                >
                    <LogisticsList onRowSelected={handleLgtSelection} formMode='u' gridData={gridData} type={2}>

                    </LogisticsList>
                    {/* <ZoomLayout onRowSelected={handleLgtSelection} tableName={"SML_LGT_HDR"} tableKey={"DocEntry"} customFilter={logisticsPurchase} filters={logisticsFilters} columns={logisticsColumns}></ZoomLayout> */}
                </Popup>
                <Popup
                    visible={isPopupVisibleEmp}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupEmp}
                >
                    <ZoomLayout onRowSelected={handleEmpSelection} tableName={"EmployeesInfo"} tableKey={"EmployeeID"} customFilter={""} filters={employeeFilters} columns={employeeColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisibleVehicle}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupVehicle}
                >
                    <ZoomLayout onRowSelected={handleVehicleSelection} tableName={"SML_BAS_VHL"} tableKey={"DocEntry"} customFilter={notDeletedFilter} filters={vehicleFilters} columns={vehicleColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisiblePO}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupPO}
                >
                    <ZoomLayout onRowSelected={handlePOSelection} tableName={"PurchaseOrders"} tableKey={"DocEntry"} customFilter={poFilter} filters={poFilters} columns={poColumns}></ZoomLayout>
                </Popup>
            </div>
        </div>
    )
}

export default WeighbridgeUpdate