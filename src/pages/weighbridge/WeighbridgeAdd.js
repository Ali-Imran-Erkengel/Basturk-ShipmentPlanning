import { Form, GroupItem, SimpleItem } from 'devextreme-react/form'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '../../components/myComponents/Header'
import { formData as initialFormData, statuses, yesno } from './data/data';
import { Popup } from 'devextreme-react/popup';
import ZoomLayout from '../../components/myComponents/ZoomLayout';
import { driverColumns, driverFilters, employeeColumns, employeeFilters, logisticsColumns, logisticsFilters, poColumns, poFilters, vehicleColumns, vehicleFilters } from '../../data/zoomLayoutData';
import { useDispatch } from 'react-redux';
import { addData, createODataSource, getItemById, updateData } from '../../store/appSlice';
import { closeSerialPort, connectToSerialPort, documentTotal, driverVehicleInformation,  getDocTotal, getLoadingRamps, showLastValue } from '../../store/weighbridgeSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import LogisticsList from './components/LogisticsList';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
const tableName = "SML_WGHB_HDR";
function WeighbridgeAdd({ onBack }) {

    const logisticsSales = ["U_Type", "=", 1]
    const logisticsPurchase = ["U_Type", "=", 2]
    const notDeletedFilter = ["U_IsDeleted", "=", "N"]

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [gridData, setGridData] = useState({ ...initialFormData });
    const [onBackReport, setOnBackReport] = useState(location.state?.onBackReport || null)
    const [isPopupVisibleDriver, setPopupVisibilityDriver] = useState(false);
    const [isPopupVisibleLgtS, setPopupVisibilityLgtS] = useState(false);
    const [isPopupVisibleLgtP, setPopupVisibilityLgtP] = useState(false);
    const [isPopupVisiblePO, setPopupVisibilityPO] = useState(false);
    const [isPopupVisibleEmp, setPopupVisibilityEmp] = useState(false);
    const [isPopupVisibleVehicle, setPopupVisibilityVehicle] = useState(false);
    const [employeeName, setEmployeeName] = useState(false);
    const [driverName, setDriverName] = useState(location.state?.driverName || '');
    const [plateCode, setPlateCode] = useState(location.state?.plateCode || '');
    const [trailerPlateCode, setTrailerPlateCode] = useState(location.state?.trailerPlateCode || '');
    const [docTotal, setDocTotal] = useState(initialFormData.U_DocTotal || '0');
    const [netWeight, setNetWeight] = useState(initialFormData.U_NetWeight || '0');
    const [firstWeight, setFirstWeight] = useState(initialFormData.U_FirstWgh || '0');
    const [secondWeight, setSecondWeight] = useState(initialFormData.U_SecondWgh || '0');
    const [selectedDriver, setSelectedDriver] = useState(location.state?.selectedDriver || initialFormData.U_DriverNo || '');
    const [selectedLgt, setSelectedLgt] = useState(location.state?.selectedLgt || initialFormData.U_LogisticsNo || '');
    const [selectedPO, setSelectedPO] = useState(location.state?.orderNo || initialFormData.U_PODocNo || '');
    const [selectedEmp, setSelectedEmp] = useState(initialFormData.U_WhgPerson || '');
    const [selectedVehicle, setSelectedVehicle] = useState(location.state?.selectedVehicle || initialFormData.U_VehicleNo || '');
    const [wghData, setWghData] = useState(0);
    const [allData, setAllData] = useState(0);
    const [loadingRampData, setloadingRampData] = useState(location.state?.loadingRamp || initialFormData.U_LoadingRamp || '');
    const poFilter = [
        ["DocumentStatus", "=", "bost_Open"],
        ["U_SevPlnDahil", "=", "N"]]
    const handleBack = () => {
        navigate(onBackReport);
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
    const effectiveOnBack = onBack || handleBack;
    if (onBackReport) {
        gridData.U_WghType = location.state?.type || 1
        gridData.U_LogisticsNo = location.state?.selectedLgt;
        gridData.U_TrailerPlateCode = location.state?.trailerPlateCode;
        gridData.U_VehicleNo = location.state?.selectedVehicle;
        gridData.U_DriverName = location.state?.driverName;
        gridData.U_PlateCode = location.state?.plateCode;
        gridData.U_LoadingRamp = location.state?.loadingRamp;
        gridData.U_DeliveryNoteNo = location.state?.deliveryNoteNo;
        gridData.U_PODocNo=location.state?.orderNo;
    }

    useEffect(() => {

        setGridData({ ...initialFormData });
        const ramps = getRampData();
        setloadingRampData(ramps);
        setSelectedLgt(gridData.DocEntry);
        setSelectedVehicle(gridData.U_VehicleNo)
        setSelectedDriver(gridData.U_DriverNo);
        setSelectedEmp(gridData.U_WhgPerson);
    }, [])
    const getRampData = async () => {
        const ramps = await getLoadingRamps();
        setloadingRampData(ramps);
    }
    const statusOptions = {
        dataSource: statuses,
        displayExpr: 'Value',
        valueExpr: 'Key'

    };
    const poOptions = {
        dataSource: yesno,
        displayExpr: 'Value',
        valueExpr: 'Key'

    };
    const loadingRampOptions = {
        dataSource: loadingRampData,
        displayExpr: 'U_RampName',
        valueExpr: 'DocEntry',
    };
    const togglePopupDriver = () => {
        setPopupVisibilityDriver(!isPopupVisibleDriver);
    };
    const togglePopupLgtS = () => {
        setPopupVisibilityLgtS(!isPopupVisibleLgtS);
    };
    const togglePopupLgtP = () => {
        setPopupVisibilityLgtP(!isPopupVisibleLgtP);
    };
    const togglePopupPO = () => {
        setPopupVisibilityPO(!isPopupVisiblePO);
    };
    const togglePopupEmp = () => {
        setPopupVisibilityEmp(!isPopupVisibleEmp);
    };
    const togglePopupVehicle = () => {
        setPopupVisibilityVehicle(!isPopupVisibleVehicle);
    };
    const textBoxWithButtonOptionsDrv = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "add",
                onClick: () => {
                    navigate('/driverAdd')
                    //  togglePopupDriver();
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
        },
        valueChangeEvent: "blur"

    };
    const handleLgtSelection = async (selectedRowData) => {
        setSelectedLgt(selectedRowData.DocEntry);
        const logistic = await logisticDoc({ docEntry: selectedRowData.DocEntry });
        setSelectedVehicle(logistic.payload.U_VehicleNo)
        setTrailerPlateCode(logistic.payload.U_TrailerPlateCode);
        setPlateCode(logistic.payload.U_PlateCode)
        setDriverName(logistic.payload.U_DriverName);
        setSelectedDriver(logistic.payload.U_DriverNo);
        gridData.U_DeliveryNoteNo=logistic.payload.U_DeliveryNoteNo;
        const totalPalletGrossWgh = logistic.payload.SML_LGT_ITEMCollection.reduce((total, item) => {
            const weight = parseFloat(item.U_PalletGrossWgh) || 0; // Değer yoksa 0 al
            return total + weight;
        }, 0);
        gridData.U_DocTotal = totalPalletGrossWgh;
        setDocTotal(totalPalletGrossWgh)
        gridData.U_LoadingRamp = logistic.payload.U_LoadingRamp;
        //getDocTotal1({ id: selectedRowData.DocEntry });
        if (gridData.U_WghType === 1) {
            setPopupVisibilityLgtS(false);
        }
        if (gridData.U_WghType === 2) {
            setPopupVisibilityLgtP(false);
            setSelectedPO(logistic.payload.SML_LGT_ITEMCollection[0].U_OrderNo)
        }
    };
    const handleDriverSelection = (selectedRowData) => {
        setSelectedDriver(selectedRowData.DocEntry);
        setPopupVisibilityDriver(false);
    };
    const handlePOSelection = (selectedRowData) => {
        setSelectedPO(selectedRowData.DocEntry);
        //setDocTotal(selectedRowData.U_GrossWeight);
        setPopupVisibilityPO(false);
    };
    const handleEmpSelection = async (selectedRowData) => {
        setSelectedEmp(selectedRowData.EmployeeID);
        const getEmployee = await dispatch(getItemById({ tableName: "EmployeesInfo", id: selectedRowData.EmployeeID }))
        const fullName = getEmployee.payload.FirstName + " " + (getEmployee.payload.MiddleName || '') + " " + getEmployee.payload.LastName;
        setEmployeeName(fullName);
        setPopupVisibilityEmp(false);
    };
    const handleVehicleSelection = async (selectedRowData) => {
        setSelectedVehicle(selectedRowData.DocEntry);
        setDriverName(selectedRowData.U_Name+' '+selectedRowData.U_Surname);
        setPlateCode(selectedRowData.U_PlateCode)
        setTrailerPlateCode(selectedRowData.U_TrailerPlateCode)
       // getDriverVehicle({ id: selectedRowData.DocEntry })
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
    //     setSelectedDriver(driverId)
    // });
    const logisticDoc = async ({ docEntry }) => {
        const logistic = await dispatch(getItemById({ tableName: "SML_LGT_HDR", id: docEntry }));
        return logistic;
    }
    const getDocTotal1 = (async ({ id }) => {
        const res = await getDocTotal({ id: id });
        setDocTotal(res.data.value[0].Items.total)
    });
    const addPurchaseOrder = async ({ result }) => {
        const logisticNo = result.payload.data.U_LogisticsNo;
        let purchaseOrderData = {
            "CardCode": "",
            "U_LogisticNo": logisticNo,
            "DocumentLines": []
        }
        const res = await dispatch(getItemById({ tableName: "SML_LGT_HDR", id: logisticNo }))
        purchaseOrderData.CardCode = res.payload.U_OcrdNo;
        res.payload.SML_LGT_ITEMCollection.forEach(item => {
            purchaseOrderData.DocumentLines.push({
                "ItemCode": item.U_ItemCode,
                "Quantity": item.U_Quantity,
                "U_LogisticNo": item.DocEntry,
                "U_LogisticLine": item.LineId
            });
        });
        dispatch(addData({ tableName: "PurchaseOrders", formData: purchaseOrderData })).then((res) => {
            purchaseOrderData = null;

            if (res.meta.requestStatus === "fulfilled") {
                //   extraFunctions({ res });
            }
        })
    }

    const extraFunctions = ({ result }) => {
        if (result.payload.data.U_IsCreatePO === "N" && result.payload.data.U_WghType === 1 && result.payload.data.U_LogisticsNo) {

            const logisticsId = result.payload.data.U_LogisticsNo;
            const lgtData = {
                "U_Status": 5
            }
            dispatch(updateData({ tableName: "SML_LGT_HDR", updatedData: lgtData, id: logisticsId })).then((result) => {
                if (result.payload) {

                }
            })
        }
        if (result.payload.data.U_WghType === 2 && result.payload.data.U_LogisticsNo) {

            const logisticsId = result.payload.data.U_LogisticsNo;
            const lgtData = {
                "U_Status": 5
            }
            dispatch(updateData({ tableName: "SML_LGT_HDR", updatedData: lgtData, id: logisticsId })).then((result) => {
                if (result.payload) {

                }
            })
        }
        // if (result.payload.data.U_IsCreatePO === "Y" && gridData.U_WghType === 1) {
        //     addPurchaseOrder({ result });
        // }
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
        setWghData(lastData); // Son değeri wghData'ya yaz
        gridData.U_FirstWgh = lastData;
    };
    return (
        <div >
            <div className="page-container">
                <form >

                    <Header save={true} trash={false} title={"Kantar"} nav={'/weighbridgeHome'} tableName={tableName} formData={gridData} onBack={effectiveOnBack} formMode={'Add'} extraFunctions={extraFunctions}></Header>
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
                                    <SimpleItem editorOptions={{ value: employeeName, disabled: true }} editorType="dxTextBox" dataField="U_WghPersonName" cssClass="transparent-bg" label={{ text: 'Tartım Yapan' }} />
                                    <SimpleItem dataField="U_LoadingRamp" editorType="dxSelectBox" editorOptions={loadingRampOptions} cssClass="transparent-bg" label={{ text: 'Yükleme Rampası' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem editorOptions={{ value: driverName, disabled: false }} dataField="U_DriverName" editorType="dxTextBox" label={{ text: 'Şöför Adı' }} />
                                    <SimpleItem dataField="U_DeliveryNoteNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'İrsaliye No' }} />

                                    {/* <SimpleItem dataField='U_IsCreatePO' editorType="dxSelectBox" editorOptions={poOptions} label={{ text: 'Satınalma Siparişi Mal Girişi Açılsın mı?' }} /> */}
                                    <SimpleItem dataField="U_PODocNo" editorOptions={{ ...textBoxWithButtonOptionsPO, value: selectedPO }} label={{ text: 'Satınalma Siparişi No' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem editorOptions={{ ...textBoxWithButtonOptionsVehicle, value: selectedVehicle }} dataField="U_VehicleNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Araç No' }} />
                                    <SimpleItem editorOptions={{ value: plateCode, disabled: false }} dataField="U_PlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                                    <SimpleItem editorOptions={{ value: trailerPlateCode }} dataField="U_TrailerPlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />

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
                                    <SimpleItem editorOptions={{ ...firstWeightLostFocus, inputAttr: { class: 'right-align-text' } }} dataField="U_FirstWgh" editorType="dxTextBox" label={{ text: 'İlk Tartım' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem dataField="U_SecondWghDate" editorOptions={{ displayFormat: "dd/MM/yyyy", disabled: true }} editorType="dxDateBox" label={{ text: 'İkinci Tartım Tarihi' }} />
                                    <SimpleItem editorOptions={{ ...firstWeightLostFocus, disabled: true, inputAttr: { class: 'right-align-text' } }} dataField="U_SecondWgh" editorType="dxTextBox" label={{ text: 'İkinci Tartım' }} />
                                </GroupItem>
                            </GroupItem>
                            <GroupItem colCount={2}>
                                <SimpleItem dataField="U_NetWeight" editorOptions={{ value: netWeight, disabled: true, inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" label={{ text: 'Net Tartım' }} />
                                <SimpleItem dataField="U_DocTotal" editorOptions={{ value: docTotal,  inputAttr: { class: 'right-align-text' } }} editorType="dxTextBox" label={{ text: 'Belge Toplamı' }} />
                            </GroupItem>
                            <GroupItem colCount={4}>
                                <GroupItem>

                                    <SimpleItem
                                        dataField="U_Difference"
                                        editorType="dxTextBox"
                                        label={{ text: 'Kantar Farkı' }}
                                        editorOptions={{ inputAttr: { class: 'right-align-text' } }}
                                    />
                                </GroupItem>

                            </GroupItem>
                            {/* <SimpleItem
                                editorType="dxTextArea"
                                label={{ text: 'Kantar Verisi' }}
                                editorOptions={{ value: wghData, width: 500, height: 60 }}
                            /> */}
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
                <Popup
                    visible={isPopupVisibleDriver}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupDriver}
                >
                    <ZoomLayout onRowSelected={handleDriverSelection} tableName={"SML_BAS_DRV"} tableKey={"DocEntry"} notDeleted={""} filters={driverFilters} columns={driverColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisibleLgtS}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupLgtS}
                    fullScreen={true}
                    showCloseButton={true}
                    title='Lojistik Planları (Satış)'
                >
                    {/* <ZoomLayout onRowSelected={handleLgtSelection} tableName={"SML_LGT_HDR"} tableKey={"DocEntry"} notDeleted={logisticsSales} filters={logisticsFilters} columns={logisticsColumns}></ZoomLayout> */}
                    <LogisticsList onRowSelected={handleLgtSelection} formMode='a' gridData={gridData} type={1}>

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
                    <LogisticsList onRowSelected={handleLgtSelection} formMode='a' gridData={gridData} type={2}>

                    </LogisticsList>
                    {/* <ZoomLayout onRowSelected={handleLgtSelection} tableName={"SML_LGT_HDR"} tableKey={"DocEntry"} notDeleted={logisticsPurchase} filters={logisticsFilters} columns={logisticsColumns}></ZoomLayout> */}
                </Popup>
                <Popup
                    visible={isPopupVisibleEmp}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupEmp}
                >
                    <ZoomLayout onRowSelected={handleEmpSelection} tableName={"EmployeesInfo"} tableKey={"EmployeeID"} notDeleted={""} filters={employeeFilters} columns={employeeColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisibleVehicle}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupVehicle}
                >
                    <ZoomLayout onRowSelected={handleVehicleSelection} tableName={"SML_BAS_VHL"} tableKey={"DocEntry"} notDeleted={notDeletedFilter} filters={vehicleFilters} columns={vehicleColumns}></ZoomLayout>
                </Popup>
                <Popup
                    visible={isPopupVisiblePO}
                    hideOnOutsideClick={true}
                    onHiding={togglePopupPO}
                >
                    <ZoomLayout onRowSelected={handlePOSelection} tableName={"PurchaseOrders"} tableKey={"DocEntry"} notDeleted={poFilter} filters={poFilters} columns={poColumns}></ZoomLayout>
                </Popup>

            </div>
        </div>
    )
}
export default WeighbridgeAdd