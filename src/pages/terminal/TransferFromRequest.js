import React, { useEffect, useRef, useState } from "react";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { Form, SimpleItem } from 'devextreme-react/form'
import DataGrid, { Column, Paging, Pager } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { getBarcodedProcessBatch, getTransferRequest, isBinActiveTransferFromReq, requestIsBatch, requestWithoutBatchControl, returnBatchControl, saveTransferFromRequest, transferFromReqControlBinActive, transferFromReqControlBinDective, transferFromReqStatusControl } from "../../store/terminalSlice";
import { terminalBarcodedProcessData, terminalReturnData, terminalTransferFromRequestColumns, transferRequestColumns } from "./data/data";
import { Popup } from "devextreme-react/popup";
import ZoomLayoutTerminal from "../../components/myComponents/ZoomLayoutTerminal";
import { employeeColumns } from "../../data/zoomLayoutData";
import notify from 'devextreme/ui/notify';
import { useNavigate } from "react-router-dom";
import { Grid } from "@mui/material";
import EmployeeList from "./components/EmployeeList";

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
        5000
    );
}

const TransferFromRequest = () => {
    const navigate = useNavigate();
    const [invoiceGrid, setInvoiceGrid] = useState();
    const [tabIndex, setTabIndex] = useState(0);
    const [batchGrid, setBatchGrid] = useState([]);
    const [selectedDocEntry, setSelectedDocEntry] = useState(0);
    const [isPopupVisibleLoader, setPopupVisibilityLoader] = useState(false);
    const [isPopupVisiblePreparer, setPopupVisibilityPreparer] = useState(false);
    const [formData, setFormData] = useState({ ...terminalBarcodedProcessData });
    const [isBatchExists, setIsBatchExists] = useState('N');
    const employeeFilter = ["Department", "=", 10];
    const barcodeRef = useRef(null);
    const [scannedCount, setScannedCount] = useState(0);


    useEffect(() => {
        fetchWaitForLoadDocs();
    }, [])
    useEffect(() => {
    }, [selectedDocEntry]);
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


    // #region requests
    const fetchWaitForLoadDocs = async () => {
        let docs = await getTransferRequest({ whsCode: '', status1: '', status2: '' });
        setInvoiceGrid(docs);
    };
    const goForReadBarcodes = async ({ docEntry }) => {
        let result = await requestIsBatch({ docEntry: docEntry });
        setBatchGrid([])
        if (result[0].item === 'N') return handleNotify({ message: "Stok Nakil Talebinde Kalem Yok.", type: "error" });
        if (result[0].batch === 'Y') {
            setIsBatchExists('Y')
            let items = await getBarcodedProcessBatch({ docEntry: docEntry, whsCode: '', status1: '', status2: '' });
            const duplicates = items.reduce((acc, cur) => {
                const key = `${cur.ItemCode}-${cur.DistNumber}`;
                if (!acc[key]) acc[key] = new Set();
                acc[key].add(cur.BinCode);
                return acc;
            }, {});

            const conflicts = Object.entries(duplicates)
                .filter(([_, binSet]) => binSet.size > 1)
                .map(([key]) => key);

            if (conflicts.length > 0) {
                handleNotify({ message: `Bu Belgede Bulunan Parti Birden Fazla Depo Yerinde Bulundu`, type: 'error' })
                return
            }
            setBatchGrid(items)
        }
        else {
            setIsBatchExists('N')
        }
        setSelectedDocEntry(docEntry);
        setFormData({ ...terminalReturnData })
        setTabIndex(1);
        setScannedCount(0);
    };


    const batchControl = async ({ documentNo, barcode }) => {
        try {
            let result = await returnBatchControl({ documentNo: documentNo, barcode: barcode });
            return result;
        } catch (err) {
            console.error("err:", err.message);
            throw err
        }
    };
    const validateBeforeSave = ({ formData }) => {
        if (!formData.PreparerCode) {
            handleNotify({ message: "Lütfen Operatör Seçiniz", type: "error" });
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        try {

            if (!validateBeforeSave({ formData })) return;
            const preparer = formData?.PreparerCode || 0;
            const loadedBy = formData?.LoaderCode || 0;
            const entries = batchGrid?.map(batch => ({
                docNum: batch.ApplyEntry,
                docLine: batch.ApplyLine,
                batchNumber: batch.DistNumber,
                quantity: batch.InnerQtyOfPallet,
                itemCode: batch.ItemCode,
                sBinEntry: batch.U_SourceBinEntry,
                tBinEntry: batch.U_TargetBinEntry,
                innerQtyOfPallet: batch.InnerQtyOfPallet,
                sWhsCode: batch.FromWhsCod,
                tWhsCode: batch.WhsCode,


            }));
            const grouped = entries.reduce((acc, entry) => {
                const key = entry.docLine;
                if (!acc[key]) acc[key] = [];
                acc[key].push(entry);
                return acc;
            }, {});

            debugger
            const summaryList = Object.keys(grouped).map(key => {
                const group = grouped[key];
                const first = group[0];
                return {
                    docLine: parseInt(key),
                    docNum: first.docNum,
                    Count: group.length,
                    totalQuantity: group.reduce((sum, x) => sum + parseInt(x.innerQtyOfPallet || 0), 0),
                    itemCode: first.itemCode,
                    LoadedBy: loadedBy,
                    sWhsCode: first.sWhsCode,
                    tWhsCode: first.tWhsCode,
                    binEntry: first.binEntry,
                    Preparer: preparer
                };
            });
            const payload = {
                itemList: summaryList,
                batchList: entries
            };
            debugger
            let result = await saveTransferFromRequest({ payload: payload })
            // setFormData({ ...terminalBarcodedProcessData })
            setFormData(prev => ({
                ...prev,
                Barcode: ""
            }))
            setBatchGrid([]);
            setTabIndex(0);
            setSelectedDocEntry(0)
            fetchWaitForLoadDocs();
            setScannedCount(0);
            handleNotify({ message: "Kayıt başarılı", type: "success" });
        } catch (err) {
            console.error("Kaydetme hatası:", err);
            const parsed = extractJson({ str: err.response.data });
            handleNotify({ message: parsed["message"], type: "error" });
        }
    };
    // #endregion
    const goToProcess = (cellData) => {
        let docEntry = cellData.data["DocEntry"];
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                    className="nav-btn"
                    icon='send'
                    onClick={() => goForReadBarcodes({ docEntry: docEntry })}
                    type="default"
                />

            </div>
        );
    };
    const batchStatusControl = async ({ barcode }) => {
        let result = await transferFromReqStatusControl({ barcode: barcode });
        if (result.length === 0) {
            return "OK"
        }
        else {
            return result[0].Warning
        }
    }
    const controlBinActive = async ({ barcode }) => {
        let result = await isBinActiveTransferFromReq({ docEntry: selectedDocEntry, barcode: barcode })

        if (result.length === 0) {
            return "ERROR"
        }
        else {
            return result[0].BinActivat
        }
    }
    const handleBarcodeEnter = async (barcode) => {
        try {
            let isGetBack = formData.GetBack;
            let oldBarcode = formData.OldBarcode;
            let barcodeValue = formData.Barcode;
            if (!oldBarcode) {
                barcodeValue = barcode.substring(3)
            }
            if (isGetBack) {
                debugger
                const batchExists = batchGrid.some(b => b.DistNumber === barcodeValue);
                if (!batchExists) {
                    handleNotify({ message: "Okutulan barkod listede yok!", type: "error" });
                    return;
                }
                if (isBatchExists === 'Y') {
                    setBatchGrid(prevItems => {
                        const newData = [...prevItems];
                        const idx = newData.findIndex(item => item.DistNumber === barcodeValue);
                        if (idx !== -1) {
                            newData[idx] = {
                                ...newData[idx],
                                Readed: 'N'
                            };
                        }
                        return newData;
                    });
                } else {

                    setBatchGrid(prev => prev.filter(b => b.DistNumber !== barcodeValue));
                }
                formData.Barcode = "";
                handleNotify({ message: "Okutma geri alındı.", type: "success" });
                setScannedCount(prev => Math.max(prev - 1, 0));

                return;
            }
            let warning = await batchStatusControl({ barcode });

            if (warning !== "OK") return handleNotify({ message: warning, type: 'error' })

            if (isBatchExists === 'Y') {

                readWithBatch({ barcode: barcodeValue })
            }
            else {
                readWithoutBatch({ barcode: barcodeValue })
            }
            if (barcodeRef.current) {
                console.log(barcodeRef.current)
                const input = barcodeRef.current.element().querySelector("input");
                debugger
                if (input) input.focus();
            }
        } catch (error) {
            console.error("Okutma hatası:", error);
            handleNotify({ message: "Bilinmeyen bir hata oluştu.", type: "error" });
        }
        finally {
            setFormData(prev => ({ ...prev, Barcode: "" }));
            forceFocusBarcode();
            // setTimeout(focusBarcodeInput, 50);
        }
    };
    function readWithBatch({ barcode }) {
        try {
            setBatchGrid(prevItems => {
                const newData = [...prevItems];
                const idx = newData.findIndex(item => item.DistNumber === barcode);

                if (idx === -1) {
                    handleNotify({ message: `${barcode} Barkodu listede bulunamadı`, type: "error" });
                    return newData;
                }

                if (newData[idx].Readed === 'N') {
                    newData[idx] = { ...newData[idx], Readed: 'Y' };
                    setScannedCount(prev => prev + 1);
                    console.log("scanned :", scannedCount)
                } else {
                    handleNotify({ message: `${barcode} Bu Barkod zaten okutuldu`, type: "error" });
                }

                return newData;
            });
        } catch (error) {
            console.error("readWithBatch error:", error);
        }
        finally {
            forceFocusBarcode()
        }
    }
    async function readWithoutBatch({ barcode }) {
        try {
            let isBinActive = await controlBinActive({ barcode: barcode });
            if (isBinActive === "ERROR") return handleNotify({ message: "Depo Yeri Aktifliği Kontrolünde Geçersiz Parti.", type: 'error' })
            if (isBinActive === 'Y') {
                let result = await transferFromReqControlBinActive({ docEntry: selectedDocEntry, barcode: barcode })
                if (result.length === 0) return handleNotify({ message: "Yetersiz Miktar.", type: 'error' })
                const newRow = {
                    ApplyEntry: result[0].DocEntry,
                    ApplyLine: result[0].LineNum,
                    BinAbsEntry: result[0].U_TargetBinEntry,
                    BinCode: result[0].U_TargetBin,
                    DistNumber: result[0].DistNumber,
                    FromWhsCod: result[0].FromWhsCod,
                    WhsCode: result[0].WhsCode,
                    U_SourceBinEntry: result[0].U_SourceBinEntry,
                    U_SourceBin: result[0].U_SourceBin,
                    U_TargetBinEntry: result[0].U_TargetBinEntry,
                    U_TargetBin: result[0].U_TargetBin,
                    InnerQtyOfPallet: result[0].InnerQtyOfPallet,
                    ItemCode: result[0].ItemCode,
                    itemName: result[0].Dscription,
                    Readed: 'Y'
                };
                setBatchGrid(prev => {
                    const exists = prev?.some(item => item.DistNumber === newRow.DistNumber);
                    if (exists) {
                        handleNotify({ message: "Bu parti zaten okutuldu!", type: "error" });
                        return prev;
                    } else {
                        handleNotify({ message: "Okutma Başarılı.", type: "success" });
                        setScannedCount(prev => prev + 1);
                        console.log("scanned :", scannedCount)
                        return [...prev, newRow];
                    }
                });
            }
            else {
                let result = await transferFromReqControlBinDective({ docEntry: selectedDocEntry, barcode: barcode })
                if (result.length === 0) return handleNotify({ message: "Yetersiz Miktar.", type: 'error' })
                const newRow = {
                    ApplyEntry: result[0].DocEntry,
                    ApplyLine: result[0].LineNum,
                    BinAbsEntry: result[0].U_TargetBinEntry,
                    BinCode: result[0].U_TargetBin,
                    DistNumber: result[0].DistNumber,
                    FromWhsCod: result[0].FromWhsCod,
                    WhsCode: result[0].WhsCode,
                    U_SourceBinEntry: result[0].U_SourceBinEntry,
                    U_SourceBin: result[0].U_SourceBin,
                    U_TargetBinEntry: result[0].U_TargetBinEntry,
                    U_TargetBin: result[0].U_TargetBin,
                    InnerQtyOfPallet: result[0].InnerQtyOfPallet,
                    ItemCode: result[0].ItemCode,
                    itemName: result[0].Dscription,
                    Readed: 'Y'
                };
                setBatchGrid(prev => {
                    const exists = prev?.some(item => item.DistNumber === newRow.DistNumber);
                    if (exists) {
                        handleNotify({ message: "Bu parti zaten okutuldu!", type: "error" });
                        return prev;
                    } else {
                        handleNotify({ message: "Okutma Başarılı.", type: "success" });
                        setScannedCount(prev => prev + 1);
                        console.log("scanned :", scannedCount)

                        return [...prev, newRow];
                    }
                });
            }


            return


        } catch (error) {
            console.error("readWithBatch error:", error);
        }
        finally {
            forceFocusBarcode()
        }
    }
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
    function forceFocusBarcode() {
        setTimeout(() => {
            try {
                if (barcodeRef.current) {
                    barcodeRef.current.focus();
                    const input = barcodeRef.current.element().querySelector("input");
                    if (input) input.select();
                }
            } catch (err) {
                console.log("focus error:", err);
            }
        }, 120);
    }
    return (
        <div className="p-4">
            <TabPanel
                selectedIndex={tabIndex}
                onSelectionChanged={(e) => setTabIndex(e.component.option("selectedIndex"))}
                swipeEnabled={false}
            >
                {/* TAB 1 - Belge Seç */}
                <Item title="Belge Seç">
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
                                            onClick={fetchWaitForLoadDocs}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs>
                                <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.53rem" }}>
                                    NAKİL TALEBİNDEN TRANSFER
                                </div>
                            </Grid>
                            <Grid item style={{ width: 100 }}></Grid>
                        </Grid>
                        <div style={{ marginBottom: "20px" }}>
                        </div>
                        <DataGrid
                            dataSource={invoiceGrid}
                            className='datagridTerminalDelivery'
                            columnAutoWidth={true}
                            columnMinWidth={120}
                            allowColumnResizing={true}
                            width="auto"
                            rowAlternationEnabled={true}
                            showBorders={true}
                        >
                            <Column
                                width="auto"
                                alignment='left'
                                caption="İşlem"
                                cellRender={goToProcess}
                            />
                            {transferRequestColumns.map((col) => (
                                <Column key={col.dataField} {...col} />
                            ))}
                            <Paging defaultPageSize={10} />
                            <Pager showPageSizeSelector={true} />
                        </DataGrid>
                    </div>
                </Item>

                {/* TAB 2 - Process */}
                <Item title="Nakl Talebinden Transfer">
                    <div className="page-container">
                        <Form
                            formData={formData}
                            labelLocation="left"
                            colCount={6}
                            colCountByScreen={{ lg: 6, md: 6, sm: 6, xs: 6 }}
                            className="terminal-form"
                        >
                            <SimpleItem
                                dataField="Barcode"
                                editorType="dxTextBox"
                                editorOptions={{
                                    showClearButton: true,
                                    inputAttr: {
                                        inputmode: "none",
                                        autocomplete: "off",
                                    },
                                    onEnterKey: (e) => {
                                        const value = e.component.option("value");
                                        handleBarcodeEnter(value);
                                        // const input = e.component.element().querySelector("input");
                                        // if (input) input.focus();
                                    },
                                    onInitialized: (e) => {
                                        barcodeRef.current = e.component;
                                    },
                                    onFocusOut: () => {
                                        setTimeout(() => barcodeRef.current?.focus(), 50);
                                    }
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
                                dataField="GetBack"
                                editorType="dxCheckBox"
                                cssClass="transparent-bg"
                                label={{ text: 'Geri Al' }}
                                colSpan={3}
                            />
                            <SimpleItem
                                dataField="OldBarcode"
                                editorType="dxCheckBox"
                                cssClass="transparent-bg"
                                label={{ text: 'Eski Barkod' }}
                                colSpan={3}
                            />
                            <SimpleItem
                                editorType="dxButton"
                                editorOptions={{
                                    text: "Kaydet",
                                    type: "success",
                                    stylingMode: "contained",
                                    width: "100%",
                                    onClick: handleSave
                                }}
                                colSpan={6}
                            />
                        </Form>
                        <hr></hr>
                        <b className="mt-6 font-bold">Okutulan Partiler</b>
                        <div style={{ marginTop: 10, marginBottom: 10, fontWeight: "bold", fontSize: "1.2rem" }}>
                            Okutulan Miktar: {scannedCount}
                        </div>
                        <DataGrid
                            dataSource={batchGrid}
                            showBorders={true}
                            columnAutoWidth={true}
                            width="100%"
                            rowAlternationEnabled={true}
                            columnMinWidth={100}
                            className="datagridTerminalDelivery">
                            {terminalTransferFromRequestColumns.map(col => (
                                <Column key={col.dataField} {...col} />
                            ))}
                        </DataGrid>
                    </div>

                </Item>
            </TabPanel>
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
        </div>
    );
};
export default TransferFromRequest;
