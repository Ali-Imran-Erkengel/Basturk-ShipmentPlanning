import React, {  useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { Form, SimpleItem } from 'devextreme-react/form';
import {  getPurchaseShipments } from '../../../store/logisticsSlice';
import notify from 'devextreme/ui/notify';
function ShipmentListPO({ onRowSelected, gridData, formMode, type }) {
    const today = new Date();
    const [filterValues, setFilterValues] = useState({
        ItemCode: '',
        CardName: '',
        Date: '',
        ShipmentCode: ''
    });
    const quantitiesRef = useRef({});
    const lineIdRef = useRef({});
    const [dataSource, setDataSource] = useState(null);
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
    
    
    const applyFilter = async () => {
        const purchaseShipments = await getPurchaseShipments({ filterValues });
        setDataSource(purchaseShipments)
    };



    useEffect(() => {
        if (gridData && gridData.SML_LGT_ITEMCollection) {
            gridData.SML_LGT_ITEMCollection.forEach(item => {
                const key = `${item.U_ShipmentNo}-${item.U_ShipmentLine}`;
                quantitiesRef.current[key] = item.U_Quantity || 0;
                lineIdRef.current[key] = item.LineId || "";
            });
        }
    }, [gridData]);

    const handleQuantityChange = (key, value, e) => {
        let currentValue = parseInt(e.target.parentElement.parentElement.children[1].innerHTML);
        const input = document.getElementById(`inpQty-${key}`);
        if (input && value <= currentValue) {
            quantitiesRef.current[key] = value;
            input.value = value;
        }
        else {
            quantitiesRef.current[key] = currentValue;
            input.value = currentValue
            handleNotify({ message: "Miktar Aşımı. Alınabilecek En Yüksek Değer Girildi.", type: "error" })
        }
    };

    const handleSave = () => {

        if (dataSource != null) {
            let totalQuantity = 0;
            const sum = Object.values(quantitiesRef.current)
                .map(Number)  // Sayısal değerlere dönüştür
                .reduce((acc, val) => acc + val, 0); // Topla


            const rowsWithQuantities = dataSource.filter(row => {
                const key = `${row.DocEntry}-${row.LineId}`;
                return quantitiesRef.current[key] && quantitiesRef.current[key] > 0;
            }).map(row => {
                const key = `${row.DocEntry}-${row.LineId}`;
                totalQuantity += parseInt(quantitiesRef.current[key]) || 0
                if (formMode === 'u') {
                    return {
                        U_ShipmentNo: row.DocEntry,
                        U_ShipmentLine: row.LineId,
                        U_ItemCode: row.U_ItemCode,
                        U_ItemName: row.U_ItemName,
                        U_CardCode: row.U_CardCode,
                        U_CardName: row.U_CardName,
                        U_OrderNo: row.U_OrderNo,
                        U_OrderLine: row.U_OrderLine,
                        U_WhsCode: row.U_WhsCode,
                        U_TradeFileNo: row.U_TradeFileNo,
                        // U_PalletCost: ((gridData.U_Price / sum) * quantitiesRef.current[key]).toFixed(2),
                        U_Quantity: quantitiesRef.current[key] || 0,
                        LineId: lineIdRef.current[key] || "",
                    };
                }
                else {
                    return {
                        U_ShipmentNo: row.DocEntry,
                        U_ShipmentLine: row.LineId,
                        U_ItemCode: row.U_ItemCode,
                        U_ItemName: row.U_ItemName,
                        U_CardCode: row.U_CardCode,
                        U_CardName: row.U_CardName,
                        U_OrderNo: row.U_OrderNo,
                        U_OrderLine: row.U_OrderLine,
                        U_WhsCode: row.U_WhsCode,
                        U_TradeFileNo: row.U_TradeFileNo,
                        // U_PalletCost: ((gridData.U_Price / sum) * quantitiesRef.current[key]).toFixed(2),
                        U_Quantity: quantitiesRef.current[key] || 0

                    };
                }
            });
            gridData.U_TotalWeight = totalQuantity;
            // gridData.U_ContainerQuantity = Math.ceil(totalQuantity / 26);
            const formDataWithItems = {
                ...gridData,
                SML_LGT_ITEMCollection: rowsWithQuantities
            };
            if (totalQuantity > 26) {
                // handleNotify({ message: "Konteynerin Alacağı Maksimum Palet Miktarı Aşıldı. (Max: 26)", type: "error" })
                onRowSelected(formDataWithItems);
            }
            else {

                onRowSelected(formDataWithItems);
            }
        }

    };
    const onRowPrepared = (e) => {
        if (e.rowType === 'data') {
            const key = `${e.data.DocEntry}-${e.data.LineId}`;
            if (quantitiesRef.current[key] && quantitiesRef.current[key] > 0) {
                e.rowElement.style.backgroundColor = '#d3f9d8';
            }
        }
    };

    const handleFill = () => {
        if (dataSource) {
            dataSource.forEach(row => {
                const key = `${row.DocEntry}-${row.LineId}`;
                const remainingQty = row.U_RemainingQty;
                quantitiesRef.current[key] = remainingQty;
                const input = document.getElementById(`inpQty-${key}`);
                if (input) {
                    input.value = remainingQty;
                    input.parentElement.parentElement.style.backgroundColor = '#d3f9d8';
                }
            });
        }
    }
    return (
        <>
            <div className="form-container">
                <Form formData={filterValues} colCount={4} labelLocation="top">
                    <SimpleItem dataField="Date" editorType="dxDateBox" editorOptions={{ displayFormat: "dd/MM/yyyy" }} cssClass="transparent-bg" label={{ text: 'Sevkiyat Tarihi' }} />
                    <SimpleItem dataField="ShipmentNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Sevkiyat No' }} />
                    <SimpleItem dataField="ItemCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Kalem Kodu' }} />
                    <SimpleItem dataField="CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Tedarikçi' }} />

                </Form>
            </div>

            <Button
                onClick={applyFilter}
                // onClick={sendOdataQuery}
                style={{ marginTop: 10 }} text="Ara "></Button>
            <Button
                text="Ekle"
                onClick={handleSave}
                style={{ marginTop: 10 }}
            />
            {formMode === 'a' && (
                <Button
                    text="Tümünü Doldur"
                    onClick={handleFill}
                    style={{ marginTop: 10 }}
                />
            )}
            <DataGrid
                id="gridContainer"
                dataSource={dataSource}
                showBorders={true}
                onRowPrepared={onRowPrepared}
                columnAutoWidth={false}  // Otomatik sütun genişliği ayarı kapalı
                wordWrapEnabled={false}   // Metinler hücre içinde sarılabilir
                width="100%"             // Genişliği yüzde veya px olarak belirleyebilirsin
                scrolling={{ mode: 'standard' }}
            //  ref={dataGridRef}
            >
                <Paging
                    enabled={true}
                    pageSize={10} />
                <Editing
                    mode="cell"
                    allowUpdating={true}
                />
                <Column alignment='right'
                    caption="Miktar"
                    width={120}
                    cellRender={(data) => {
                        const key = `${data.data.DocEntry}-${data.data.LineId}`;
                        return (
                            <input
                                id={`inpQty-${key}`}
                                type="number"
                                style={{ "text-align": "right", "width": "75px" }}
                                defaultValue={quantitiesRef.current[key] || 0}
                                onFocus={(e) => {
                                    if (e.target.value === '0') {
                                        e.target.value = '';
                                    }
                                }}
                                onBlur={(e) => {
                                    if (e.target.value === '') {
                                        e.target.value = '0';
                                    }
                                    else {
                                        e.target.parentElement.parentElement.style.backgroundColor = '#d3f9d8';
                                    }
                                }}
                                onChange={(e) => handleQuantityChange(key, e.target.value, e)}
                            />
                        );
                    }}
                />
                <Column dataField="U_RemainingQty" caption="Kalan Miktar" allowEditing={false} alignment='right'  />
                <Column dataField="U_Quantity" caption="Toplam Miktar" allowEditing={false} alignment='right'   />
                <Column dataField="DocEntry" caption="Sevkiyat No" allowEditing={false} alignment='left'  />
                <Column dataField="LineId" caption="Sevkiyat Satır" allowEditing={false} alignment='left'  />
                <Column dataField="U_Date" caption="Teslim Tarihi" allowEditing={false} dataType='date' format="dd/MM/yyyy"  />
                <Column dataField="U_TradeFileNo" caption="Ticaret Dosya Numarası" allowEditing={false}  />
                <Column dataField="U_TypeDescription" caption="Tip" allowEditing={false}  />
                {/* <Column dataField="U_DeliveryStatus" caption="Durum" allowEditing={false} width={130} /> */}
                <Column dataField="U_ItemCode" caption="Kalem Kodu" allowEditing={false}  />
                <Column dataField="U_ItemName" caption="Kalem Açıklama" allowEditing={false}  />
                <Column dataField="U_WhsCode" caption="Depo Kodu" allowEditing={false}  />
                <Column dataField="U_CardName" caption="Tedarikçi" allowEditing={false}  />
                <Column dataField="U_OrderNo" caption="Sipariş Entry" allowEditing={false}  alignment='left'/>
                <Column dataField="U_OrderNum" caption="Sipariş No" allowEditing={false}  alignment='left'/>
                <Column dataField="U_OrderLine" caption="Sipariş Sıra" allowEditing={false}  alignment='left'/>
                {/* <Column dataField="SML_SHP_HDR/SML_SHP_ITEMCollection.U_OrderLine" caption="Sipariş Satır" allowEditing={false} /> */}
            </DataGrid>
        </>
    );
}

export default ShipmentListPO;
