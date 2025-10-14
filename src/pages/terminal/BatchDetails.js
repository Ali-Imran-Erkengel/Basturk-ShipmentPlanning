import React, { useRef, useState } from "react";
import { Form, SimpleItem } from 'devextreme-react/form'
import { Button } from "devextreme-react/button";
import { getBatchDetails } from "../../store/terminalSlice";
import { terminalBatchDetailData, terminalDeliveryData } from "./data/data";

import notify from 'devextreme/ui/notify';
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

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

const BatchDetails = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ ...terminalDeliveryData });
    const [batchData, setBatchData] = useState({ ...terminalBatchDetailData });
    const barcodeRef = useRef(null);



    // #region requests


    const fillBatchDetail = async ({ barcode }) => {
        try {
            let result = await getBatchDetails({ barcode: barcode });
            if (result.length === 0) {
                handleNotify({ message: "Girlen Parametrelere Ait Parti Bulunamadı", type: "error" });
                setBatchData([]);
                return
            }
            let batchDetail = {

                DistNumber: result[0].DistNumber,
                ItemCode: result[0].ItemCode,
                ItemName: result[0].ItemName,
                WhsCode: result[0].WhsCode,
                BinCode: result[0].BinCode,
                U_Status: result[0].U_Status,
                OnHandQty: result[0].OnHandQty,
                PalletQty: result[0].PalletQty,
                MnfSerial: result[0].MnfSerial,
                LotNumber: result[0].LotNumber,
                InDate: result[0].InDate,
                U_StatusUpdateDate: result[0].U_StatusUpdateDate,
                U_BlockReason: result[0].U_BlockReason,
                U_BlockReason2: result[0].U_BlockReason2,
                U_ErrorDesc: result[0].U_ErrorDesc,
                U_TemplateNum: result[0].U_TemplateNum,
                U_ReShrinkCount: result[0].U_ReShrinkCount,
                U_ReShrinkDesc: result[0].U_ReShrinkDesc
            }
            console.log("transfer", batchDetail)
            setBatchData(batchDetail)
        } catch (err) {
            console.error("err:", err.message);
            throw err
        }
    }

    // #endregion


    const handleBarcodeEnter = async (barcode) => {
        try {

            let oldBarcode = formData.OldBarcode;
            let barcodeValue = formData.Barcode;
            if (!oldBarcode) {
                barcodeValue = barcode.substring(3)
            }
            debugger
            await fillBatchDetail({ barcode: barcodeValue })
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


    return (
        <div className="p-4">
            <div className="page-container">
                <Grid container spacing={1} paddingBottom={1}>
                    <Grid item>
                        <Button
                            className="nav-btn"
                            icon="arrowleft"
                            type="default"
                            stylingMode="contained"
                            onClick={() => navigate('/selectScreen')}
                        />
                    </Grid>
                </Grid>
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
                        dataField="OldBarcode"
                        editorType="dxCheckBox"
                        cssClass="transparent-bg"
                        label={{ text: 'Eski Barkod' }}
                        colSpan={3}
                    />
                </Form>

                <hr></hr>
                <div className="parti-card">
                    <div className="parti-card-header">
                        <h2>Parti Ayrıntıları</h2>
                    </div>
                    <div className="parti-card-body">
                        <Form
                            className="transfer-form"
                            formData={batchData}
                            colCount={3}
                            labelLocation="left"
                            showColonAfterLabel={true}
                            minColWidth={200}
                        >
                            <SimpleItem dataField="DistNumber" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Parti No' }} />
                            <SimpleItem dataField="ItemCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Kalem Kodu' }} />
                            <SimpleItem dataField="ItemName" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Kalem Adı' }} />
                            <SimpleItem dataField="WhsCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Depo' }} />
                            <SimpleItem dataField="BinCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Depo Yeri' }} />
                            <SimpleItem dataField="U_Status" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Durum' }} />
                            <SimpleItem dataField="OnHandQty" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Miktar' }} />
                            <SimpleItem dataField="PalletQty" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Palet Miktarı' }} />
                            <SimpleItem dataField="MnfSerial" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Parti Nit. 1' }} />
                            <SimpleItem dataField="LotNumber" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Parti Nit. 2' }} />
                            <SimpleItem dataField="InDate" editorType="dxDateBox" editorOptions={{ disabled: true, displayFormat: "dd/MM/yyyy" }} label={{ text: 'Kabul Tarihi' }} />
                            <SimpleItem dataField="MnfDate" editorType="dxDateBox" editorOptions={{ disabled: true, displayFormat: "dd/MM/yyyy" }} label={{ text: 'Üretim Tarihi' }} />
                            <SimpleItem dataField="ExpDate" editorType="dxDateBox" editorOptions={{ disabled: true, displayFormat: "dd/MM/yyyy" }} label={{ text: 'Geç. Sonu' }} />
                            <SimpleItem dataField="U_StatusUpdateDate" editorType="dxDateBox" editorOptions={{ disabled: true, displayFormat: "dd/MM/yyyy" }} label={{ text: 'Stü. Gün. Tar.' }} />
                            <SimpleItem dataField="Notes" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Ayrıntılar' }} />
                            <SimpleItem dataField="U_BlockReason" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Blk. Nedeni' }} />
                            <SimpleItem dataField="U_BlockReason2" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Blk. Nedeni2' }} />
                            <SimpleItem dataField="U_ErrorDesc" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Hata Açk.' }} />
                            <SimpleItem dataField="U_TemplateNum" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Kalıp No' }} />
                            <SimpleItem dataField="U_ReShrinkCount" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Yn. Shr. Say.' }} />
                            <SimpleItem dataField="U_ReShrinkDesc" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Yn. Shr. Açk.' }} />
                        </Form>
                    </div>
                </div>



            </div>
        </div>
    );
};
export default BatchDetails;
