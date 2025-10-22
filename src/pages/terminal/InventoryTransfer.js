import React, { useEffect, useRef, useState } from "react";
import { Form, GroupItem, SimpleItem } from 'devextreme-react/form'
import { Button } from "devextreme-react/button";
import { batchControl, findBinAndWhs, getBinAndWhs, getBinUsingBatch, getLastTransferRecord, saveInventoryTransfer, saveTransfer } from "../../store/terminalSlice";
import { terminalDeliveryData, terminalTransferLastData } from "./data/data";
import { Popup } from "devextreme-react/popup";
import ZoomLayoutTerminal from "../../components/myComponents/ZoomLayoutTerminal";
import { binLocationColumns, binLocationFilters, employeeColumns, warehouseColumns, warehouseFilters } from "../../data/zoomLayoutData";
import notify from 'devextreme/ui/notify';
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmployeeList from "./components/EmployeeList";
import WarehouseList from "./components/WarehouseList";
import BinLocationList from "./components/BinLocationList";

const handleNotify = ({ message, type }) => {
    notify(
        {
            message: message,
            width: 300,
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

const InventoryTransfer = () => {
    const navigate = useNavigate();
    const [isPopupVisibleLoader, setPopupVisibilityLoader] = useState(false);
    const [isPopupVisiblePreparer, setPopupVisibilityPreparer] = useState(false);
    const [isPopupVisibleTargetBin, setPopupVisibilityTargetBin] = useState(false);
    const [isPopupVisibleTargetWhs, setPopupVisibilityTargetWhs] = useState(false);
    const [isPopupVisibleSourceBin, setPopupVisibilitySourceBin] = useState(false);
    const [isPopupVisibleSourceWhs, setPopupVisibilitySourceWhs] = useState(false);
    const [formData, setFormData] = useState({ ...terminalDeliveryData });
    const [transferData, setTransferData] = useState({ ...terminalTransferLastData });
    const barcodeRef = useRef(null);
    const employeeFilter = ["Department", "=", 10];
    const [whsFilter, setWhsFilter] = useState(["Inactive", "=", "tNO"])


    const createTextBoxWithButtonOptions = (type) => {
        return {
            buttons: [
                {
                    name: "customButton",
                    location: "after",
                    options: {
                        icon: "search",
                        onClick: () => {
                            togglePopupZoomLayout({ variable: type });
                        },
                    },
                },
            ],
        };
    };
    const togglePopupZoomLayout = ({ variable }) => {
        switch (variable) {
            case "loader":
                setPopupVisibilityLoader(!isPopupVisibleLoader);
                break;
            case "preparer":
                setPopupVisibilityPreparer(!isPopupVisiblePreparer);
                break;
            case "targetWhs":
                setPopupVisibilityTargetWhs(!isPopupVisibleTargetWhs);
                break;
            case "targetBin":
                setPopupVisibilityTargetBin(!isPopupVisibleTargetBin);
                break;
            case "sourceWhs":
                setPopupVisibilitySourceWhs(!isPopupVisibleSourceWhs);
                break;
            case "sourceBin":
                setPopupVisibilitySourceBin(!isPopupVisibleSourceBin);
                break;
            default:
                break;
        }
    };
    useEffect(() => {
        console.log("formData:", formData);

    }, [formData]);
    const handleLoaderSelection = (selectedRowData) => {
        setFormData(prev => ({
            ...prev,
            LoaderCode: selectedRowData.EmployeeID,
            LoaderName: selectedRowData.EmployeeName
        }));
        setPopupVisibilityLoader(false);
    };
    const handlePreparerSelection = (selectedRowData) => {
        setFormData(prev => ({
            ...prev,
            PreparerCode: selectedRowData.EmployeeID,
            PreparerName: selectedRowData.EmployeeName
        }));
        setPopupVisibilityPreparer(false);
    };
    const handleTargetWhsSelection = (selectedRowData) => {
        setFormData(prev => ({
            ...prev,
            TargetWhsCode: selectedRowData.WhsCode,
            TargetBinEntry: 0,
            TargetBinCode: ""
        }));
        setPopupVisibilityTargetWhs(false);
    };
    const handleSourceWhsSelection = (selectedRowData) => {
        setFormData(prev => ({
            ...prev,
            SourceWhsCode: selectedRowData.WhsCode,
            SourceBinEntry: 0,
            SourceBinCode: ""
        }));
        setPopupVisibilitySourceWhs(false);
    };
    const handleTargetBinSelection = (selectedRowData) => {
        setFormData(prev => ({
            ...prev,
            TargetWhsCode: selectedRowData.WhsCode,
            TargetBinEntry: selectedRowData.BinEntry,
            TargetBinCode: selectedRowData.BinCode
        }));
        setPopupVisibilityTargetBin(false);
    };
    const handleSourceBinSelection = (selectedRowData) => {
        setFormData(prev => ({
            ...prev,
            SourceWhsCode: selectedRowData.WhsCode,
            SourceBinEntry: selectedRowData.BinEntry,
            SourceBinCode: selectedRowData.BinCode

        }));
        setPopupVisibilitySourceBin(false);
    };
    // const handleLoaderSelection = (selectedRowData) => {
    //     formData.LoaderCode = selectedRowData.EmployeeID;
    //     formData.LoaderName = `${selectedRowData.FirstName ?? ""} ${selectedRowData.MiddleName ?? ""} ${selectedRowData.LastName ?? ""}`.trim();
    //     setPopupVisibilityLoader(false);
    // };
    // const handlePreparerSelection = (selectedRowData) => {
    //     formData.PreparerCode = selectedRowData.EmployeeID;
    //     formData.PreparerName = `${selectedRowData.FirstName ?? ""} ${selectedRowData.MiddleName ?? ""} ${selectedRowData.LastName ?? ""}`.trim();
    //     setPopupVisibilityPreparer(false);
    // };
    // const handleTargetWhsSelection = (selectedRowData) => {
    //     formData.TargetWhsCode = selectedRowData.WarehouseCode;
    //     formData.TargetBinEntry = 0;
    //     formData.TargetBinCode = "";
    //     setPopupVisibilityTargetWhs(false);
    // };
    // const handleSourceWhsSelection = (selectedRowData) => {
    //     formData.SourceWhsCode = selectedRowData.WarehouseCode;
    //     formData.SourceBinEntry = 0;
    //     formData.SourceBinCode = "";
    //     setPopupVisibilitySourceWhs(false);
    // };
    // const handleTargetBinSelection = (selectedRowData) => {
    //     formData.TargetWhsCode = selectedRowData.Warehouse;
    //     formData.TargetBinEntry = selectedRowData.AbsEntry;
    //     formData.TargetBinCode = selectedRowData.BinCode;
    //     setPopupVisibilityTargetBin(false);
    // };
    // const handleSourceBinSelection = (selectedRowData) => {
    //     formData.SourceWhsCode = selectedRowData.Warehouse;
    //     formData.SourceBinEntry = selectedRowData.AbsEntry;
    //     formData.SourceBinCode = selectedRowData.BinCode;
    //     setPopupVisibilitySourceBin(false);
    // };

    const handleTargetWarehouseEnter = async (whsCode) => {
        setFormData((prev) => ({
            ...prev,
            TargetWhsCode: whsCode,
            TargetBinCode: "",
            TargetBinEntry: 0
        }));
    }
    const handleSourceWarehouseEnter = async (whsCode) => {
        setFormData((prev) => ({
            ...prev,
            SourceWhsCode: whsCode,
            SourceBinCode: "",
            SourceBinEntry: 0
        }));
    }
    // #region requests

    const handleTargetBinCodeEnter = async (binCode) => {
        try {
            const result = await getBinAndWhs({ binCode: binCode })
            setFormData((prev) => ({
                ...prev,
                TargetWhsCode: result[0].WhsCode,
                TargetBinEntry: result[0].AbsEntry,
            }));
        } catch (error) {
            handleNotify({ message: error, type: 'error' })
        }
    }
    const handleSourceBinCodeEnter = async (binCode) => {
        try {

            const result = await getBinAndWhs({ binCode: binCode })
            setFormData((prev) => ({
                ...prev,
                SourceWhsCode: result[0].WhsCode,
                SourceBinEntry: result[0].AbsEntry,
            }));
        } catch (error) {
            handleNotify({ message: error, type: 'error' })

        }
    }

    const getLastInventoryTransferRecord = async () => {
        try {
            let lastTransfer = await getLastTransferRecord();
            let trnData = {
                DistNumber: lastTransfer[0].DistNumber,
                ItemCode: lastTransfer[0].ItemCode,
                Dscription: lastTransfer[0].Dscription,
                FromWhsCod: lastTransfer[0].FromWhsCod,
                WhsCode: lastTransfer[0].WhsCode,
                PalletQty: lastTransfer[0].PalletQty,
                OnHandQty: lastTransfer[0].OnHandQty,
                FromBinCode: lastTransfer[0].FromBinCode,
                ToBinCode: lastTransfer[0].ToBinCode,
                DocNum: lastTransfer[0].DocNum
            }
            console.log("transfer", lastTransfer)
            setTransferData(trnData)
        } catch (err) {
            console.error("err:", err.message);
            throw err
        }
    }

    const validateBeforeSave = ({ formData, }) => {
        if (!formData.PreparerCode) {
            handleNotify({ message: "Lütfen Operatör Seçiniz", type: "error" });
            return false;
        }
        if (!formData.SourceWhsCode) {
            handleNotify({ message: "Lütfen Kaynak Depo Seçiniz", type: "error" });
            return false;
        }
        if (!formData.TargetWhsCode) {
            handleNotify({ message: "Lütfen Hedef Depo Seçiniz", type: "error" });
            return false;
        }
        return true;
    };

    const handleSave = async ({ item }) => {
        try {


            const preparer = formData?.PreparerCode || 0;
            const loadedBy = formData?.LoaderCode || 0;
            const targetWhsCode = formData.TargetWhsCode;
            const targetBin = formData.TargetBinEntry;
            const itemList = {
                itemCode: item.ItemCode,
                quantity: item.InnerQty,
                stockQty: 1,
                tWhsCode: targetWhsCode,
                sWhsCode: item.WhsCode,
                innerQtyOfPallet: item.InnerQty,
                sBinEntry: item.AbsEntry,
                tBinEntry: targetBin,
                batchNumber: item.DistNumber,
                loadedBy: loadedBy,
                preparer: preparer
            }


            let result = await saveInventoryTransfer({ payload: itemList })

            //setFormData({ ...terminalDeliveryData })
            setFormData(prev => ({
                ...prev,
                Barcode: ""
            }))
            handleNotify({ message: "Kayıt başarılı", type: "success" });
            getLastInventoryTransferRecord()
        } catch (err) {
            console.error("Kaydetme hatası:", err);
            const parsed = extractJson({ str: err.response.data });
            handleNotify({ message: parsed["message"], type: "error" });
        }
    };
    // #endregion

    const clean = () => {
        setFormData({ ...terminalDeliveryData })
        setTransferData({ ...terminalTransferLastData })
    }

    const handleBarcodeEnter = async (barcode) => {
        try {
            if (!validateBeforeSave({ formData })) return;
            let oldBarcode = formData.OldBarcode;
            let barcodeValue = formData.Barcode;
            let whsCode = formData.SourceWhsCode;
            let binEntry = formData.SourceBinEntry;
            if (!oldBarcode) {
                barcodeValue = barcode.substring(3)
            }
            let apiResponse = await batchControl({ barcode: barcodeValue, whsCode: whsCode, binEntry: binEntry })
            if (apiResponse.length === 0) {
                return handleNotify({ message: "Girlen Parametrelere Ait Kaynak Depoda Veri Bulunamadı", type: "error" });
            }

            else {
                let quantity = apiResponse[0].OnHandQty;
                let innerQtyOfPallet = apiResponse[0].InnerQty;
                if (quantity < innerQtyOfPallet) return handleNotify({ message: `Yetersiz Miktar.`, type: "error" });
                await handleSave({ item: apiResponse[0] })

            }
        } catch (error) {
            console.error("Okutma hatası:", error);
            handleNotify({ message: "Bilinmeyen bir hata oluştu.", type: "error" });
        }
        finally {
            setFormData(prev => ({ ...prev, Barcode: "" }));
            setTimeout(focusBarcodeInput, 50);
        }
    };

    const focusBarcodeInput = () => {
        const inst = barcodeRef.current;
        if (!inst) return;

        try {
            if (typeof inst.focus === "function") {
                inst.focus();
            }
        } catch (err) {
            console.log("error", err)
        }
    };
    function extractJson({ str }) {
        const match = str.match(/{.*}/s);
        return match ? JSON.parse(match[0]) : null;
    }

    return (
        <div className="p-4">
            <div className="page-container">
                <Grid
                    container
                    spacing={1}
                    alignItems="center"
                    justifyContent="space-between"
                    paddingBottom={1}
                >
                    <Grid item>
                        <Grid container spacing={1}>
                            <Grid item>
                                <Button
                                    className="nav-btn"
                                    icon="arrowleft"
                                    type="default"
                                    stylingMode="contained"
                                    onClick={() => navigate('/selectScreen')}
                                />
                            </Grid>
                            <Grid item>
                                <Button
                                    className="nav-btn"
                                    icon="refresh"
                                    type="default"
                                    stylingMode="contained"
                                    onClick={() => clean()}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs>
                        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.53rem" }}>
                            TRANSFER
                        </div>
                    </Grid>
                    <Grid item style={{ width: 100 }}></Grid>
                </Grid>
                <Form
                    formData={formData}
                    labelLocation="top"
                    colCount={6}
                    colCountByScreen={{ lg: 6, md: 6, sm: 6, xs: 6 }}
                    className="terminal-form"
                >
                    <SimpleItem
                        dataField="Barcode"
                        editorType="dxTextBox"
                        editorOptions={{
                            showClearButton: true,
                            onEnterKey: (e) => {
                                const value = e.component.option("value");
                                handleBarcodeEnter(value);
                                const input = e.component.element().querySelector("input");
                                if (input) input.focus();
                            },
                            onInitialized: (e) => {
                                barcodeRef.current = e.component;
                            },
                        }}
                        cssClass="transparent-bg"
                        label={{ text: 'Barkod', location: 'top' }}
                        colSpan={6}
                    />


                    {/* <SimpleItem
                        dataField="LoaderName"
                        editorOptions={createTextBoxWithButtonOptions("loader")}
                        editorType="dxTextBox"
                        cssClass="transparent-bg"
                        label={{ text: 'Yükleyen' }}
                        colSpan={6}
                    /> */}

                    <SimpleItem
                        dataField="PreparerName"
                        editorOptions={createTextBoxWithButtonOptions("preparer")}
                        editorType="dxTextBox"
                        cssClass="transparent-bg"
                        label={{ text: 'Operatör' }}
                        colSpan={6}
                    />
                    <SimpleItem
                        dataField="SourceWhsCode"
                        editorType="dxTextBox"
                        cssClass="transparent-bg"
                        editorOptions={{
                            ...createTextBoxWithButtonOptions("sourceWhs"),
                            onEnterKey: (e) => {
                                const value = e.component.option("value");
                                handleSourceWarehouseEnter(value);
                            },
                        }}
                        label={{ text: 'Kaynak Depo' }}
                        colSpan={3}
                    />

                    <SimpleItem
                        dataField="SourceBinEntry"
                        editorType="dxTextBox"
                        cssClass="transparent-bg"
                        visible={false}
                        label={{ text: 'Kaynak Depo Yeri Entry' }}
                        colSpan={6}
                    />
                    <SimpleItem
                        dataField="SourceBinCode"
                        editorType="dxTextBox"
                        cssClass="transparent-bg"
                        label={{ text: 'Kaynak Depo Yeri' }}
                        colSpan={3}
                        editorOptions={{
                            ...createTextBoxWithButtonOptions("sourceBin"),
                            onEnterKey: (e) => {
                                const value = e.component.option("value");
                                handleSourceBinCodeEnter(value);
                            }
                        }}

                    />
                    <SimpleItem
                        dataField="TargetWhsCode"
                        editorType="dxTextBox"
                        cssClass="transparent-bg"
                        editorOptions={{
                            ...createTextBoxWithButtonOptions("targetWhs"),
                            onEnterKey: (e) => {
                                const value = e.component.option("value");
                                handleTargetWarehouseEnter(value);
                            },
                        }}
                        label={{ text: 'Hedef Depo' }}
                        colSpan={3}
                    />
                    <SimpleItem
                        dataField="TargetBinEntry"
                        editorType="dxTextBox"
                        cssClass="transparent-bg"
                        visible={false}
                        label={{ text: 'Hedef Depo Yeri Entry' }}
                        colSpan={6}
                    />
                    <SimpleItem
                        dataField="TargetBinCode"
                        editorType="dxTextBox"
                        cssClass="transparent-bg"
                        label={{ text: 'Hedef Depo Yeri' }}
                        colSpan={3}
                        editorOptions={{
                            ...createTextBoxWithButtonOptions("targetBin"),
                            onEnterKey: (e) => {
                                const value = e.component.option("value");
                                handleTargetBinCodeEnter(value);
                            }
                        }}
                    />


                    <SimpleItem
                        dataField="OldBarcode"
                        editorType="dxCheckBox"
                        cssClass="transparent-bg"
                        label={{ text: 'Eski Barkod' }}
                        colSpan={6}
                    />
                </Form>

                <hr></hr>
                <div className="parti-card">
                    <div className="parti-card-header">
                        <h2>Son Transfer Kaydı</h2>
                    </div>
                    <div className="parti-card-body">
                        <Form
                            className="transfer-form"
                            formData={transferData}
                            colCount={2}
                            labelLocation="left"
                            showColonAfterLabel={true}
                            minColWidth={200}
                        >
                            <SimpleItem dataField="DocNum" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Belge No' }} />
                            <SimpleItem dataField="DistNumber" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Parti No' }} />
                            <SimpleItem dataField="ItemCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Kalem Kodu' }} />
                            <SimpleItem dataField="Dscription" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Kalem Adı' }} />
                            <SimpleItem dataField="OnHandQty" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Miktar' }} />
                            <SimpleItem dataField="PalletQty" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Plt. Miktarı' }} />
                            <SimpleItem dataField="FromWhsCod" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'K. Depo' }} />
                            <SimpleItem dataField="FromBinCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'K. Depo Yeri' }} />
                            <SimpleItem dataField="WhsCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'H. Depo' }} />
                            <SimpleItem dataField="ToBinCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'H. Depo Yeri' }} />

                            <GroupItem colSpan={2}>
                                <div className="btn-area">
                                    <Button text="Göster" onClick={getLastInventoryTransferRecord} type="default" />
                                </div>
                            </GroupItem>
                        </Form>
                    </div>
                </div>



            </div>
            <Popup
                visible={isPopupVisibleLoader}
                hideOnOutsideClick={true}
                fullScreen={true}
                onHiding={() => togglePopupZoomLayout({ variable: "loader" })}
                showCloseButton={true}
                title='Yükleyen Listesi'
                wrapperAttr={{
                    class: 'terminal-popup'
                }}
            >
                <EmployeeList
                    gridData={formData}
                    onRowSelected={handleLoaderSelection}
                />
                {/* <ZoomLayoutTerminal onRowSelected={handleLoaderSelection} tableName={"EmployeesInfo"} tableKey={"EmployeeID"} customFilter={employeeFilter} filters={employeeFilter} columns={employeeColumns}></ZoomLayoutTerminal> */}
            </Popup>
            <Popup
                visible={isPopupVisiblePreparer}
                hideOnOutsideClick={true}
                fullScreen={true}
                onHiding={() => togglePopupZoomLayout({ variable: "preparer" })}
                showCloseButton={true}
                title='Hazırlayan Listesi'
                wrapperAttr={{
                    class: 'terminal-popup'
                }}
            >
                <EmployeeList
                    gridData={formData}
                    onRowSelected={handlePreparerSelection}
                />
                {/* <ZoomLayoutTerminal onRowSelected={handlePreparerSelection} tableName={"EmployeesInfo"} tableKey={"EmployeeID"} customFilter={employeeFilter} filters={employeeFilter} columns={employeeColumns}></ZoomLayoutTerminal> */}
            </Popup>

            <Popup
                visible={isPopupVisibleTargetWhs}
                hideOnOutsideClick={true}
                fullScreen={true}
                onHiding={() => togglePopupZoomLayout({ variable: "targetWhs" })}
                showCloseButton={true}
                title='Depo Listesi'
                wrapperAttr={{
                    class: 'terminal-popup'
                }}
            >
                <WarehouseList
                    gridData={formData}
                    onRowSelected={handleTargetWhsSelection}
                />
                {/* <ZoomLayoutTerminal key={formData.TargetWhsCode} onRowSelected={handleTargetWhsSelection} tableName={"Warehouses"} tableKey={"WarehouseCode"} customFilter={whsFilter} filters={warehouseFilters} columns={warehouseColumns}></ZoomLayoutTerminal> */}
            </Popup>
            <Popup
                visible={isPopupVisibleTargetBin}
                hideOnOutsideClick={true}
                fullScreen={true}
                onHiding={() => togglePopupZoomLayout({ variable: "targetBin" })}
                showCloseButton={true}
                title='Depo Yeri Listesi'
                wrapperAttr={{
                    class: 'terminal-popup'
                }}
            >
                <BinLocationList
                    gridData={formData}
                    onRowSelected={handleTargetBinSelection}
                />
                {/* <ZoomLayoutTerminal key={formData.TargetBinEntry} onRowSelected={handleTargetBinSelection} tableName={"BinLocations"} tableKey={"AbsEntry"} customFilter={""} filters={binLocationFilters} columns={binLocationColumns}></ZoomLayoutTerminal> */}
            </Popup>
            <Popup
                visible={isPopupVisibleSourceWhs}
                hideOnOutsideClick={true}
                fullScreen={true}
                onHiding={() => togglePopupZoomLayout({ variable: "sourceWhs" })}
                showCloseButton={true}
                title='Depo Listesi'
                wrapperAttr={{
                    class: 'terminal-popup'
                }}
            >
                <WarehouseList
                    gridData={formData}
                    onRowSelected={handleSourceWhsSelection}
                />
                {/* <ZoomLayoutTerminal key={formData.SourceWhsCode} onRowSelected={handleSourceWhsSelection} tableName={"Warehouses"} tableKey={"WarehouseCode"} customFilter={whsFilter} filters={warehouseFilters} columns={warehouseColumns}></ZoomLayoutTerminal> */}
            </Popup>
            <Popup
                visible={isPopupVisibleSourceBin}
                hideOnOutsideClick={true}
                fullScreen={true}
                onHiding={() => togglePopupZoomLayout({ variable: "sourceBin" })}
                showCloseButton={true}
                title='Depo Yeri Listesi'
                className="terminal-popup"
                wrapperAttr={{
                    class: 'terminal-popup'
                }}
            >
                <BinLocationList
                    gridData={formData}
                    onRowSelected={handleSourceBinSelection}
                />
                {/* <ZoomLayoutTerminal key={formData.SourceBinEntry} onRowSelected={handleSourceBinSelection} tableName={"BinLocations"} tableKey={"AbsEntry"} customFilter={""} filters={binLocationFilters} columns={binLocationColumns}></ZoomLayoutTerminal> */}
            </Popup>
        </div>
    );
};
export default InventoryTransfer;
