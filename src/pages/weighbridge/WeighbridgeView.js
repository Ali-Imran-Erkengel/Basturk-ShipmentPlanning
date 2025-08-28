import { Form, GroupItem, SimpleItem } from 'devextreme-react/form'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '../../components/myComponents/Header'
import { formData, statuses, yesno } from './data/data';
import { Popup } from 'devextreme-react/popup';
import ZoomLayout from '../../components/myComponents/ZoomLayout';
import { driverColumns, driverFilters, employeeColumns, employeeFilters, logisticsColumns, logisticsFilters, vehicleColumns, vehicleFilters } from '../../data/zoomLayoutData';
import { useDispatch } from 'react-redux';
import { createODataSource, getItemById } from '../../store/appSlice';
import { documentTotal, driverVehicleInformation, getDocTotal, getLoadingRamps } from '../../store/weighbridgeSlice';
const tableName = "SML_WGHB_HDR";
const statusOptions = {
    dataSource: statuses,
    displayExpr: 'Value',
    valueExpr: 'Key'
};
function WeighbridgeUpdate({ id, onBack }) {
    const dispatch = useDispatch();
    const [gridData, setGridData] = useState(formData);
    const [isPopupVisibleDriver, setPopupVisibilityDriver] = useState(false);
    const [isPopupVisibleLgt, setPopupVisibilityLgt] = useState(false);
    const [isPopupVisibleEmp, setPopupVisibilityEmp] = useState(false);
    const [isPopupVisibleVehicle, setPopupVisibilityVehicle] = useState(false);
    const [wghType, setWghType] = useState(false);
    const [employeeName, setEmployeeName] = useState(false);
    const [driverName, setDriverName] = useState(false);
    const [plateCode, setPlateCode] = useState(false);
    const [trailerPlateCode, setTrailerPlateCode] = useState(false);
    const [docTotal, setDocTotal] = useState(formData.U_DocTotal || '0');
    const [netWeight, setNetWeight] = useState(formData.U_NetWeihgt || '0');
    const [firstWeight, setFirstWeight] = useState(formData.U_FirstWgh || '0');
    const [secondWeight, setSecondWeight] = useState(formData.U_SecondWgh || '0');
    const [selectedPO, setSelectedPO] = useState();
    const [selectedDriver, setSelectedDriver] = useState(formData.U_DriverNo || '');
    const [selectedLgt, setSelectedLgt] = useState(formData.U_LogisticsNo || '');
    const [selectedEmp, setSelectedEmp] = useState(formData.U_WhgPerson || '');
    const [selectedVehicle, setSelectedVehicle] = useState(formData.U_VehicleNo || '');
    const [loadingRampData, setloadingRampData] = useState(null);
    const loadingRampOptions = {
        dataSource: loadingRampData,
        displayExpr: 'U_RampName',
        valueExpr: 'DocEntry',
    };
    const togglePopupDriver = () => {
        setPopupVisibilityDriver(!isPopupVisibleDriver);
    };
    const togglePopupLgt = () => {
        setPopupVisibilityLgt(!isPopupVisibleLgt);
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
                    togglePopupLgt();
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
    useEffect(() => {
        if (gridData) {
        }
    }, [gridData]);
    const getRampData = async () => {
        const ramps = await getLoadingRamps();
        setloadingRampData(ramps);
    }
    const firstLoad = async () => {
        await dispatch(getItemById({ tableName: tableName, id: id })).then((result) => {
            if (result.payload) {
                setGridData(result.payload);
                setSelectedDriver(result.payload.U_DriverNo);
                setDriverName(result.payload.U_DriverName);
                setSelectedEmp(result.payload.U_WhgPerson);
                setEmployeeName(result.payload.U_WghPersonName);
                setSelectedVehicle(result.payload.U_VehicleNo);
                setTrailerPlateCode(result.payload.U_TrailerPlateCode)
                setPlateCode(result.payload.U_PlateCode)
                setSelectedLgt(result.payload.U_LogisticsNo);
                setDocTotal(result.payload.U_DocTotal)
                setSelectedPO(result.payload.U_PODocNo)





                // getDriverVehicle(result.payload.U_VehicleNo);
                // setSelectedDriver(result.payload.U_DriverNo)

                // getEmployeeFirstLoad({ id: result.payload.U_WhgPerson });
                // getDriverFirstLoad({ id: result.payload.U_DriverNo });
                // getVehicleFirstLoad({ id: result.payload.U_VehicleNo })
                // getDocTotalFirstLoad({ id: result.payload.U_LogisticsNo })
                // setWghType(result.payload.U_Type)
            }
        })

        sessionStorage.setItem('activeComponent', null)
    }
    const getDriverFirstLoad = async ({ id }) => {
        const driver = await dispatch(getItemById({ tableName: "SML_BAS_DRV", id: id }))
        const fullName = driver.payload.U_Name + " " + (driver.payload.U_MiddleName || '') + " " + driver.payload.U_Surname;
        setSelectedDriver(id);
        setDriverName(fullName);
    }

    const getEmployeeFirstLoad = async ({ id }) => {
        const getEmployee = await dispatch(getItemById({ tableName: "EmployeesInfo", id: id }))
        const fullName = getEmployee.payload.FirstName + " " + (getEmployee.payload.MiddleName || '') + " " + getEmployee.payload.LastName;
        setSelectedEmp(id);
        setEmployeeName(fullName);
    }
    const getVehicleFirstLoad = async ({ id }) => {
        const vehicle = await dispatch(getItemById({ tableName: "SML_BAS_VHL", id: id }))
        setSelectedVehicle(id);
        //setVehicleDesc(vehicle.payload.U_Vehicle || '')
        setPlateCode(vehicle.payload.U_PlateCode || '')
    }
    const getDocTotalFirstLoad = ({ id }) => {
        setSelectedLgt(id);
        getDocTotal1({ id: id });
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
    const poOptions = {
        dataSource: yesno,
        displayExpr: 'Value',
        valueExpr: 'Key'

    };
    const getDocTotal1 = (async ({ id }) => {
        const res = await getDocTotal({ id: id });
        setDocTotal(res.data.value[0].Items.total)
    });
    const firstWeightLostFocus = {
        // onKeyDown: ({ e }) => {

        //     console.log(e.event.target.name)
        // },
        onValueChanged: ({ value }) => {

            if (value === "0") {

            }
            setNetWeight(gridData.U_SecondWgh - gridData.U_FirstWgh)
        },
        valueChangeEvent: "blur"

    };



    const extraFunctions = ({ result }) => {


    }
    // const options={
    //     statusOptions
    //     {

    //         disabled:true
    //     }
    // }
    return (
        <div >
            <div className="page-container">
                <form >
                    <Header save={false} trash={false} isDelete={gridData} title={"Kantar Görüntüle"} nav={'/weighbridgeHome'} tableName={tableName} formData={gridData} onBack={onBack} formMode={'Update'} extraFunctions={extraFunctions} id={id}></Header>
                    <div className="form-container">
                        <Form
                            formData={gridData}
                            labelLocation="top"
                        >
                            <GroupItem colCount={4}>
                                <GroupItem >
                                    <SimpleItem dataField="U_TransactionDate" editorOptions={{ displayFormat: "dd/MM/yyyy", disabled: true }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'İşlem Tarihi' }} />
                                    <SimpleItem editorOptions={{ value: selectedLgt, disabled: true }} dataField="U_LogisticsNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Lojistik Belge' }} />
                                    <SimpleItem dataField="U_WghType" editorType="dxSelectBox" editorOptions={{ ...statusOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Tartım Tipi' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem editorOptions={{ value: selectedEmp, disabled: true }} dataField="U_WhgPerson" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Personel No' }} />
                                    <SimpleItem dataField="U_WghPersonName" editorOptions={{ value: employeeName, disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Tartım Yapan' }} />
                                    <SimpleItem dataField="U_LoadingRamp" editorType="dxSelectBox" editorOptions={{ ...loadingRampOptions, disabled: true }} cssClass="transparent-bg" label={{ text: 'Yükleme Rampası' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem dataField="U_DriverName" editorOptions={{ value: driverName, disabled: true }} editorType="dxTextBox" label={{ text: 'Şöför Adı' }} />
                                    <SimpleItem dataField="U_DeliveryNoteNo" editorOptions={{  disabled: true }} editorType="dxTextBox" label={{ text: 'İrsaliye No' }} />
                                    {/* <SimpleItem dataField='U_IsCreatePO' editorType="dxSelectBox" editorOptions={{...poOptions, disabled: true}} label={{ text: 'Satınalma Siparişi Mal Girişi Açılsın mı?' }} /> */}
                                    <SimpleItem dataField="U_PODocNo" editorOptions={{  value: selectedPO , disabled: true}} label={{ text: 'Satınalma Siparişi No' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem editorOptions={{ value: selectedVehicle, disabled: true }} dataField="U_VehicleNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Araç No' }} />
                                    <SimpleItem dataField="U_PlateCode" editorOptions={{ value: plateCode, disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                                    <SimpleItem dataField="U_TrailerPlateCode" editorOptions={{ value: trailerPlateCode, disabled: true }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />

                                </GroupItem>
                            </GroupItem>
                            <SimpleItem
                                dataField="U_Description"
                                editorType="dxTextArea"
                                label={{ text: 'Açıklama' }}
                                editorOptions={{ height: 50, disabled: true }}
                            />
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
                                    <SimpleItem dataField="U_FirstWghDate" editorOptions={{ displayFormat: "dd/MM/yyyy", disabled: true }} editorType="dxDateBox" label={{ text: 'İlk Tartım Tarihi' }} />
                                    <SimpleItem editorOptions={{ disabled: true }} dataField="U_FirstWgh" editorType="dxTextBox" label={{ text: 'İlk Tartım' }} />
                                </GroupItem>
                                <GroupItem>
                                    <SimpleItem dataField="U_SecondWghDate" editorOptions={{ displayFormat: "dd/MM/yyyy", disabled: true }} editorType="dxDateBox" label={{ text: 'İkinci Tartım Tarihi' }} />
                                    <SimpleItem editorOptions={{ disabled: true }} dataField="U_SecondWgh" editorType="dxTextBox" label={{ text: 'İkinci Tartım' }} />
                                </GroupItem>
                            </GroupItem>
                            <GroupItem colCount={2}>
                                <SimpleItem dataField="U_NetWeight" editorOptions={{ value: netWeight, disabled: true }} editorType="dxTextBox" label={{ text: 'Net Tartım' }} />
                                <SimpleItem dataField="U_DocTotal" editorOptions={{ value: docTotal, disabled: true }} editorType="dxTextBox" label={{ text: 'Belge Toplamı' }} />
                            </GroupItem>
                        </Form>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default WeighbridgeUpdate