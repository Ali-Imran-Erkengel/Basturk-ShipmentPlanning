import React, { useEffect, useRef, useState } from "react";
import TabPanel, { Item } from "devextreme-react/tab-panel";
import { Form, SimpleItem } from 'devextreme-react/form'
import DataGrid, { Column, Paging, Pager } from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import { getBarcodedProcessBatch, getCustomerInvoicesForReturns, getTransferRequest, requestIsBatch, returnBatchControl, saveBarcodedProcess, saveReturns } from "../../store/terminalSlice";
import { returnColumns, terminalBarcodedProcessColumns, terminalBarcodedProcessData, terminalRetrunColumns, terminalReturnData } from "./data/data";
import { Popup } from "devextreme-react/popup";
import ZoomLayout from "../../components/myComponents/ZoomLayout";
import { businessPartnersColumns, businessPartnersFilters, employeeColumns } from "../../data/zoomLayoutData";
import notify from 'devextreme/ui/notify';
import { useLocation, useNavigate } from "react-router-dom";

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

const BarcodedProcess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const processType = location.state?.processType;
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
    const { title, whsCode, status1, status2 } = getProcessConfig(processType);

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
    function getProcessConfig(processType) {
        let config = {
            title: "",
            whsCode: "",
            status1: "",
            status2: ""
        };

        switch (processType) {
            case "BRK":
                config.title = "Kırık";
                config.whsCode = "KR01";
                config.status1 = "-4";
                config.status2 = "-2";
                break;

            case "EMR":
                config.title = "EMR/AYR";
                config.whsCode = "EM01";
                config.status1 = "-4";
                config.status2 = "-2";
                break;

            case "REP":
                config.title = "Repack";
                config.whsCode = "RP01";
                config.status1 = "-5";
                config.status2 = "-3";
                break;
            case "REQ":
                config.title = "Nakil Talebinden Transfer";
                config.whsCode = "";
                config.status1 = "";
                config.status2 = "";
                break;

            default:
                break;
        }

        return config;
    }
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

    const handleLoaderSelection = (selectedRowData) => {
        formData.LoaderCode = selectedRowData.EmployeeID;
        formData.LoaderName = `${selectedRowData.FirstName ?? ""} ${selectedRowData.MiddleName ?? ""} ${selectedRowData.LastName ?? ""}`.trim();
        setPopupVisibilityLoader(false);
    };
    const handlePreparerSelection = (selectedRowData) => {
        formData.PreparerCode = selectedRowData.EmployeeID;
        formData.PreparerName = `${selectedRowData.FirstName ?? ""} ${selectedRowData.MiddleName ?? ""} ${selectedRowData.LastName ?? ""}`.trim();
        setPopupVisibilityPreparer(false);
    };


    // #region requests
    const fetchWaitForLoadDocs = async () => {
        let docs = await getTransferRequest({ whsCode: whsCode, status1: status1, status2: status2 });
        setInvoiceGrid(docs);
    };
    const goForReadBarcodes = async ({ docEntry }) => {
        let result = await requestIsBatch({ docEntry: docEntry });
        if (result[0].item === 'N') return handleNotify({ message: "Stok Nakil Talebinde Kalem Yok.", type: "error" });
        if (result[0].batch === 'Y') {
            setIsBatchExists('Y')
            let items = await getBarcodedProcessBatch({ docEntry: docEntry, whsCode: whsCode, status1: status1, status2: status2 });
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
            console.log("items", items)
        }
        setSelectedDocEntry(docEntry);
        setFormData({ ...terminalReturnData })
        setTabIndex(1);
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
        if (!formData.PreparerCode || !formData.LoaderCode) {
            handleNotify({ message: "Lütfen Hazırlayan ve Yükleyen seçiniz", type: "error" });
            return false;
        }
        return true;
    };

    const handleSave = async () => {
        try {

            if (!validateBeforeSave({ formData })) return;
            const preparer = formData.PreparerCode;
            const loadedBy = formData.LoaderCode;
            console.log("whs", whsCode)
            const entries = batchGrid?.map(batch => ({
                docNum: batch.ApplyEntry,
                docLine: batch.ApplyLine,
                batchNumber: batch.DistNumber,
                quantity: batch.InnerQtyOfPallet,
                itemCode: batch.ItemCode,
                binEntry: batch.BinAbsEntry,
                innerQtyOfPallet: batch.InnerQtyOfPallet,
                sWhsCode: batch.FromWhsCod,
                tWhsCode: whsCode

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
                    tWhsCode: whsCode,
                    binEntry:first.binEntry,
                    Preparer: preparer
                };
            });
            const payload = {
                itemList: summaryList,
                batchList: entries
            };
            debugger
            let result = await saveBarcodedProcess({ payload: payload })
            setFormData({ ...terminalBarcodedProcessData })
            setBatchGrid([]);
            setTabIndex(0);
            setSelectedDocEntry(0)
            handleNotify({ message: "Kayıt başarılı", type: "success" });
        } catch (err) {
            console.error("Kaydetme hatası:", err);
            const parsed = extractJson({ str: err.response.data });
            handleNotify({ message: parsed["message"], type: "error" });
        }
    };
    // #endregion
    const goToReturn = (cellData) => {
        let docEntry = cellData.data["DocEntry"];
        return (
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                    icon='send'
                    onClick={() => goForReadBarcodes({ docEntry: docEntry })}
                    type="default"
                />

            </div>
        );
    };

    const handleBarcodeEnter = async (barcode) => {
        try {
            debugger
            let isGetBack = formData.GetBack;
            let oldBarcode = formData.OldBarcode;
            let barcodeValue = formData.Barcode;
            if (!oldBarcode) {
                barcodeValue = barcode.substring(3)
            }
            if (isGetBack) {
                const batchExists = batchGrid.some(b => b.Batch === barcodeValue);
                if (!batchExists) {
                    handleNotify({ message: "Bu barkod listede yok!", type: "error" });
                    return;
                }
                setBatchGrid(prev => prev.filter(b => b.Batch !== barcodeValue));
                formData.Barcode = "";
                handleNotify({ message: "Okutma geri alındı.", type: "success" });
                return;
            }

            debugger
            readWithBatch({ barcode: barcode })
            return
            let apiResponse = await batchControl({ documentNo: selectedDocEntry, barcode: barcodeValue })
            if (apiResponse.length === 0) return handleNotify({ message: "Girilen Barkod Seçilen Müşteri Faturasında Mevcut Değil", type: "error" });
            const newRow = {
                ItemCode: apiResponse[0].ItemCode,
                ItemName: apiResponse[0].Dscription,
                DocEntry: apiResponse[0].DocEntry,
                LineNum: apiResponse[0].LineNum,
                Quantity: apiResponse[0].Quantity,
                CardCode: apiResponse[0].CardCode,
                PalletQuantity: 1,
                Batch: apiResponse[0].BatchNum
            };

            setBatchGrid(prev => {
                const exists = prev?.some(item => item.Batch === newRow.Batch);
                if (exists) {
                    handleNotify({ message: "Bu parti zaten okutuldu!", type: "error" });
                    return prev;
                } else {
                    handleNotify({ message: "Okutma Başarılı.", type: "success" });

                    return [...prev, newRow];
                }
            });
            if (barcodeRef.current) {
                console.log(barcodeRef.current)
                const input = barcodeRef.current.element().querySelector("input");
                if (input) input.focus();
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
                } else {
                    handleNotify({ message: `${barcode} Bu Barkod zaten okutuldu`, type: "error" });
                }

                return newData;
            });
        } catch (error) {
            console.error("readWithBatch error:", error);
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
                        <div style={{ marginBottom: "20px" }}>
                            <Button
                                text="🗘"
                                type="default"
                                stylingMode="contained"
                                width="100%"
                                onClick={fetchWaitForLoadDocs}
                                elementAttr={{ style: "font-size: 34px; width: 100%" }} />
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
                                cellRender={goToReturn}
                            />
                            {returnColumns.map((col) => (
                                <Column key={col.dataField} {...col} />
                            ))}
                            <Paging defaultPageSize={10} />
                            <Pager showPageSizeSelector={true} />
                        </DataGrid>
                    </div>
                </Item>

                {/* TAB 2 - Process */}
                <Item title={title}>
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


                            <SimpleItem
                                dataField="LoaderName"
                                editorOptions={createTextBoxWithButtonOptions("loader")}
                                editorType="dxTextBox"
                                cssClass="transparent-bg"
                                label={{ text: 'Yükleyen' }}
                                colSpan={6}
                            />

                            <SimpleItem
                                dataField="PreparerName"
                                editorOptions={createTextBoxWithButtonOptions("preparer")}
                                editorType="dxTextBox"
                                cssClass="transparent-bg"
                                label={{ text: 'Hazırlayan' }}
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
                        <b className="mt-2 font-bold">Kalemler</b>

                        <br></br>
                        <hr></hr>
                        <b className="mt-6 font-bold">Okutulan Partiler</b>
                        <DataGrid
                            dataSource={batchGrid}
                            showBorders={true}
                            columnAutoWidth={true}
                            width="100%"
                            rowAlternationEnabled={true}
                            columnMinWidth={100}
                            className="datagridTerminalDelivery">
                            {terminalBarcodedProcessColumns.map(col => (
                                <Column key={col.dataField} {...col} />
                            ))}
                        </DataGrid>
                    </div>

                </Item>
            </TabPanel>
            <Popup
                visible={isPopupVisibleLoader}
                hideOnOutsideClick={true}
                onHiding={() => togglePopupZoomLayout({ variable: "loader" })}
                showCloseButton={true}
                title='Yükleyen Listesi'
            >
                <ZoomLayout onRowSelected={handleLoaderSelection} tableName={"EmployeesInfo"} tableKey={"EmployeeID"} customFilter={employeeFilter} filters={employeeFilter} columns={employeeColumns}></ZoomLayout>
            </Popup>
            <Popup
                visible={isPopupVisiblePreparer}
                hideOnOutsideClick={true}
                onHiding={() => togglePopupZoomLayout({ variable: "preparer" })}
                showCloseButton={true}
                title='Hazırlayan Listesi'
            >
                <ZoomLayout onRowSelected={handlePreparerSelection} tableName={"EmployeesInfo"} tableKey={"EmployeeID"} customFilter={employeeFilter} filters={employeeFilter} columns={employeeColumns}></ZoomLayout>
            </Popup>
        </div>
    );
};
export default BarcodedProcess;
