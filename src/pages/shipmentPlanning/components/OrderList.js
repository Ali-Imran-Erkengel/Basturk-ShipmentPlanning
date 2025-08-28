import React, {  useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { useDispatch } from 'react-redux';
import { Form, SimpleItem } from 'devextreme-react/form';
import {  getOpenOrders} from '../../../store/shipmentSlice';
import notify from 'devextreme/ui/notify';

function OrderList({ onRowSelected, gridData, formMode }) {
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

    const applyFilter = async () => {
        const openItems = await getOpenOrders({ filterValues });
        setDataSource(openItems);
    };

    useEffect(() => {
        if (gridData && gridData.SML_SHP_ITEMCollection) {
            gridData.SML_SHP_ITEMCollection.forEach(item => {
                const key = `${item.U_OrderNo}-${item.U_OrderLine}`;
                quantitiesRef.current[key] = item.U_PalletQuantity || 0;
                lineIdRef.current[key] = item.LineId || "";
            });
        }
    }, [gridData]);

    const handleQuantityChange = (key, value, e) => {
       
        let currentValue = parseInt(e.target.parentElement.parentElement.children[1].innerHTML);
        const input = document.getElementById(`inpQty-${key}`);
        if (input && value <= currentValue && value >= 0) {
            quantitiesRef.current[key] = value;
            input.value = value;
        }
        else if (value < 0) {
            quantitiesRef.current[key] = 0;
            input.value = 0;
            handleNotify({ message: "0' dan Küçük Değer Girilemez.", type: "error" })
        }
        else {
            quantitiesRef.current[key] = currentValue;
            input.value = currentValue
            handleNotify({ message: "Miktar Aşımı. Alınabilecek En Yüksek Değer Girildi.", type: "error" })
        }
    };

    const handleSave = () => {
        debugger
        if (dataSource != null) {
            let totalQuantity = 0;
            let transportType = -1;
            const rowsWithQuantities = dataSource.filter(row => {
                const key = `${row.DocEntry}-${row.LineNum}`;
                return quantitiesRef.current[key] && quantitiesRef.current[key] > 0;
            }).map(row => {
                const key = `${row.DocEntry}-${row.LineNum}`;
                const palletType = row.U_PaletSekli;
                let coefficient = 1;
                if (palletType === 'Tam Palet') {
                    coefficient = 1;
                } else if (palletType === 'Yarım Palet') {
                    coefficient = 0.5;
                }

                // totalQuantity += palletQuantity;
                gridData.U_County=row.CountyS;
                gridData.U_City=row.CityS;
                gridData.U_Country=row.Country;
                gridData.U_Address=row.StreetS;
                gridData.U_ZipCode=row.ZipCodeS;
                transportType = row.TrnspCode;
                totalQuantity += parseInt(quantitiesRef.current[key]) * coefficient || 0
                if (formMode === 'u') {
                    return {
                        U_ItemCode: row.ItemCode,
                        U_ItemName: row.Dscription,
                        U_CardCode: row.CardCode,
                        U_CardName: row.CardName,
                        U_PalletQuantity: quantitiesRef.current[key] || 0,
                        U_Quantity: row.Quantity / row.U_StokMiktari * quantitiesRef.current[key],
                        LineId: lineIdRef.current[key] || "",
                        U_DeliveryStatus: '',
                        U_Weight: '',
                        U_Price: '',
                        U_OrderNo: row.DocEntry,
                        U_OrderNum:row.DocNum,
                        U_OrderLine: row.LineNum,
                        U_WhsCode: row.WhsCode,
                        U_PalletGrossWgh: row.U_PaletBrut / row.U_StokMiktari * quantitiesRef.current[key],
                        U_PalletNetWgh: row.U_PaletNet / row.U_StokMiktari * quantitiesRef.current[key],
                        U_PalletType: row.U_PaletSekli,
                        U_InnerQtyOfPallet: row.U_PaletIcAdeti,
                 
                    };

                }
                else {
                    return {
                        U_ItemCode: row.ItemCode,
                        U_ItemName: row.Dscription,
                        U_CardCode: row.CardCode,
                        U_CardName: row.CardName,
                        U_PalletQuantity: quantitiesRef.current[key] || 0,
                        U_Quantity: row.Quantity / row.U_StokMiktari * quantitiesRef.current[key],
                        U_DeliveryStatus: 1,
                        U_Weight: '',
                        U_Price: '',
                        U_OrderNo: row.DocEntry,
                        U_OrderNum:row.DocNum,
                        U_OrderLine: row.LineNum,
                        U_WhsCode: row.WhsCode,
                        U_PalletGrossWgh: row.U_PaletBrut / row.U_StokMiktari * quantitiesRef.current[key],
                        U_PalletNetWgh: row.U_PaletNet / row.U_StokMiktari * quantitiesRef.current[key],
                        U_PalletType: row.U_PaletSekli,
                        U_InnerQtyOfPallet: row.U_PaletIcAdeti,
               
                    };
                }
            });
            gridData.U_PalletQuantity = totalQuantity;
            gridData.U_TruckQuantity = Math.ceil(totalQuantity / 26);
            gridData.U_ContainerQuantity = Math.ceil(totalQuantity / 21);
            gridData.U_TransportType = transportType;
            const formDataWithItems = {
                ...gridData,
                SML_SHP_ITEMCollection: rowsWithQuantities
            };
            debugger
            onRowSelected(formDataWithItems);
        }

    };
    const onRowPrepared = (e) => {
        if (e.rowType === 'data') {
            console.log("e data", e.data)
            const key = `${e.data.DocEntry}-${e.data.LineNum}`;
            if (quantitiesRef.current[key] && quantitiesRef.current[key] > 0) {
                e.rowElement.style.backgroundColor = '#d3f9d8';
            }
        }
    };
    const handleFill = () => {
        if (dataSource) {
            dataSource.forEach(row => {
                debugger
                const key = `${row.DocEntry}-${row.LineNum}`;
                const remainingQty = row.RemainingQuantity;
                quantitiesRef.current[key] = remainingQty;
                const input = document.getElementById(`inpQty-${key}`);
                if (input && remainingQty) {
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
                    <SimpleItem dataField="Date" editorType="dxDateBox" editorOptions={{ displayFormat: "dd/MM/yyyy" }} cssClass="transparent-bg" label={{ text: 'Kayıt Tarihi' }} />
                    <SimpleItem dataField="OrderNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Sipariş Numarası' }} />
                    <SimpleItem dataField="ItemCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Kalem Kodu' }} />
                    <SimpleItem dataField="CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Müşteri' }} />
                </Form>
            </div>

            <Button onClick={applyFilter} style={{ marginTop: 10 }} text="Ara "></Button>
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
                columnAutoWidth={true}
            >
                <Paging
                    enabled={true}
                    pageSize={10} />
                <Editing
                    mode="cell"
                    allowUpdating={true}
                />
                <Column
                    // alignment='right'
                    width={120}
                    caption="Sevk Miktarı"
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
                <Column dataField="RemainingQuantity" caption="Kalan Miktar" allowEditing={false} alignment='right' />
                <Column dataField="U_StokMiktari" caption="Palet Miktarı" allowEditing={false} />
                <Column dataField="Quantity" caption="Sipariş Miktarı" allowEditing={false} />
                <Column dataField="OnHand" caption="Stok Miktarı" allowEditing={false} />
                <Column dataField="ItemCode" caption="Kalem Kodu" allowEditing={false} />
                <Column dataField="Dscription" caption="Kalem Açıklama" allowEditing={false} />
                <Column dataField="WhsCode" caption="Depo" allowEditing={false} />
                <Column dataField="CardCode" caption="Müşteri Kodu" allowEditing={false} />
                <Column dataField="CardName" caption="Müşteri" allowEditing={false} />
                <Column dataField="DocDate" caption="Kayıt Tarihi" dataType='date' format="dd/MM/yyyy" allowEditing={false} />
                <Column dataField="TrnspCode" caption="Sevkiyat Şekli Kodu" allowEditing={false} alignment='left' width={0} />
                <Column dataField="TrnspName" caption="Sevkiyat Şekli" allowEditing={false} alignment='left' />
                <Column dataField="DocEntry" caption="Sipariş Entry" allowEditing={false} alignment='left' width={0} />
                <Column dataField="DocNum" caption="Sipariş No" allowEditing={false} alignment='left' />
                <Column dataField="LineNum" caption="Sipariş Sıra" allowEditing={false} alignment='left' />
                <Column dataField="U_PaletBrut" caption="Palet Brut" allowEditing={false} alignment='left' />
                <Column dataField="U_PaletNet" caption="Palet Net" allowEditing={false} alignment='left' />
                <Column dataField="U_PaletSekli" caption="Palet   Şekli" allowEditing={false} alignment='left' />
                <Column dataField="U_PaletIcAdeti" caption="Palet İçi Adet" allowEditing={false} alignment='left' />
                <Column dataField="StreetS" caption="Adres Bilgi" allowEditing={false}  />
                <Column dataField="CityS" caption="İl" allowEditing={false}  />
                <Column dataField="CountyS" caption="İlçe" allowEditing={false}  />
                <Column dataField="Country" caption="Ülke" allowEditing={false}  />
                <Column dataField="ZipCodeS" caption="Posta Kodu" allowEditing={false}  />
               
            </DataGrid>
        </>
    );
}

export default OrderList;
