import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { useDispatch } from 'react-redux';
import { Form, SimpleItem } from 'devextreme-react/form';
import { getAllPurchaseOrders, getAllShipment, getOpenPurchaseOrders, getPurchaseOrders } from '../../../store/shipmentSlice';
import notify from 'devextreme/ui/notify';

function PurchaseOrderList({ onRowSelected, gridData, formMode }) {
    const [filterValues, setFilterValues] = useState({
        CardName: '',
        ItemCode: '',
        OrderNo: '',
        Date: ''
    });
    const quantitiesRef = useRef({});
    const lineIdRef = useRef({});
    const [dataSource, setDataSource] = useState(null);
    const dispatch = useDispatch();
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
    const sendOdataQuery = useCallback(async () => {
        const newDataSource = await dispatch(getPurchaseOrders({ filterValues })).unwrap();
        setDataSource(newDataSource.value);
    }, [dispatch, filterValues]);

    useEffect(() => {
        if (gridData && gridData.SML_SHP_ITEMCollection) {
            gridData.SML_SHP_ITEMCollection.forEach(item => {
                const key = `${item.U_OrderNo}-${item.U_OrderLine}`;
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
            const rowsWithQuantities = dataSource.filter(row => {
                const key = `${row.DocEntry}-${row.LineNum}`;
                return quantitiesRef.current[key] && quantitiesRef.current[key] > 0;
            }).map(row => {
                const key = `${row.DocEntry}-${row.LineNum}`;
                totalQuantity += parseInt(quantitiesRef.current[key]) || 0
                if (formMode === 'u') {
                    return {
                        U_ItemCode: row.ItemCode,
                        U_ItemName: row.Dscription,
                        U_CardCode: row.CardCode,
                        U_CardName: row.CardName,
                        U_Quantity: quantitiesRef.current[key] || 0,
                        LineId: lineIdRef.current[key] || "",
                        U_DeliveryStatus: '',
                        U_Weight: '',
                        U_Price: '',
                        U_OrderNo: row.DocEntry,
                        U_OrderNum:row.DocNum,
                        U_OrderLine: row.LineNum,
                        U_WhsCode: row.WhsCode

                    };

                }
                else {
                    return {
                        U_ItemCode: row.ItemCode,
                        U_ItemName: row.Dscription,
                        U_CardCode: row.CardCode,
                        U_CardName: row.CardName,
                        U_Quantity: quantitiesRef.current[key] || 0,
                        U_DeliveryStatus: 1,
                        U_Weight: '',
                        U_Price: '',
                        U_OrderNo: row.DocEntry,
                        U_OrderNum:row.DocNum,
                        U_OrderLine: row.LineNum,
                        U_WhsCode: row.WhsCode,

                    };
                }
            });
            gridData.U_PalletQuantity = totalQuantity;
            gridData.U_TruckQuantity = Math.ceil(totalQuantity / 26);
            gridData.U_ContainerQuantity = Math.ceil(totalQuantity / 21);
            const formDataWithItems = {
                ...gridData,
                SML_SHP_ITEMCollection: rowsWithQuantities
            };
            onRowSelected(formDataWithItems);
        }
        
    };
    const onRowPrepared = (e) => {
        if (e.rowType === 'data') {
            const key = `${e.data.DocEntry}-${e.data.LineNum}`;
            if (quantitiesRef.current[key] && quantitiesRef.current[key] > 0) {
                e.rowElement.style.backgroundColor = '#d3f9d8';
            }
        }
    };
    const applyFilter = async () => {
        const openItems = await getOpenPurchaseOrders({ filterValues });
        setDataSource(openItems);

        // const orders = await getAllPurchaseOrders({ filterValues });
        // const shipments = await getAllShipment({type:2});


        // const updatedShipments = orders.map(order => {
        //     const lines = shipments
        //         .map(shipment => shipment.SML_SHP_ITEMCollection)
        //         .flat()
        //         .filter(shipment =>
        //             shipment.U_OrderNo === order["PurchaseOrders/DocumentLines"].DocEntry &&
        //             shipment.U_OrderLine === order["PurchaseOrders/DocumentLines"].LineNum
        //         );

        //     const totalQuantity = lines.reduce((sum, line) => sum + line.U_Quantity, 0);

        //     order.RemainingQuantity = order["PurchaseOrders/DocumentLines"].Quantity - totalQuantity;

        //     return order;
        // });
        // const openItemList = formMode === 'a'
        //     ? updatedShipments.filter(order => order.RemainingQuantity !== 0)
        //     : updatedShipments;

        // setDataSource(openItemList);
        //setDataSource(openItemList);
        // console.log(dataSource)
    };
    return (
        <>
            <div className="form-container">
                <Form formData={filterValues} colCount={4} labelLocation="top">
                    <SimpleItem dataField="Date" editorType="dxDateBox" editorOptions={{ displayFormat: "dd/MM/yyyy" }} cssClass="transparent-bg" label={{ text: 'Kayıt Tarihi' }} />
                    <SimpleItem dataField="OrderNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Sipariş Numarası' }} />
                    <SimpleItem dataField="ItemCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Kalem Kodu' }} />
                    <SimpleItem dataField="CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Tedarikçi' }} />

                </Form>
            </div>

            <Button onClick={applyFilter} style={{ marginTop: 10 }} text="Ara "></Button>
            <Button
                text="Ekle"
                onClick={handleSave}
                style={{ marginTop: 10 }}
            />
            <DataGrid
                id="gridContainer"
                dataSource={dataSource}
                showBorders={true}
                onRowPrepared={onRowPrepared}
                columnAutoWidth={true}
            >
                <Paging
                    enabled={true}
                    pageSize={10} />
                <Editing
                    mode="cell"
                    allowUpdating={true}
                />
                <Column alignment='right'
                    caption="Sevk Miktarı"
                    width={120}
                    cellRender={(data) => {
                        const key = `${data.data.DocEntry}-${data.data.LineNum}`;
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
                <Column dataField="RemainingQuantity" caption="Kalan Miktar" allowEditing={false} alignment='right' width={125} />
                <Column dataField="Quantity" caption="Sipariş Miktarı" allowEditing={false} width={125} />
                <Column dataField="ItemCode" caption="Kalem Kodu" allowEditing={false} />
                <Column dataField="Dscription" caption="Kalem Açıklama" allowEditing={false} />
                <Column dataField="WhsCode" caption="Depo Kodu" allowEditing={false} />
                <Column dataField="CardCode" caption="Müşteri Kodu" allowEditing={false} />
                <Column dataField="CardName" caption="Müşteri" allowEditing={false} />
                <Column dataField="DocDate" caption="Kayıt Tarihi" dataType='date' format="dd/MM/yyyy" allowEditing={false} />
                <Column dataField="DocEntry" caption="Sipariş Entry" allowEditing={false} alignment='left' width={0} />
                <Column dataField="DocNum" caption="Sipariş No" allowEditing={false} alignment='left' />
                <Column dataField="LineNum" caption="Sipariş Sıra" allowEditing={false} alignment='left' />
            </DataGrid>
        </>
    );
}

export default PurchaseOrderList;
