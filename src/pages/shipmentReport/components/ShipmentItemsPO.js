import React, {   useRef } from 'react';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';
import DataGrid, { Column, Paging } from 'devextreme-react/cjs/data-grid';
import { useNavigate } from 'react-router-dom';
function ShipmentItemsPO({ dataAddAfter, nonPlannedItems }) {
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
    const quantitiesRef = useRef({});
    const navigate = useNavigate();
    const handleSave = async () => {
        let formDataWithItems;
        if (nonPlannedItems != null) {
            debugger
            let totalQuantity = 0;
            const sum = Object.values(quantitiesRef.current)
                .map(Number)  
                .reduce((acc, val) => acc + val, 0); // Topla


            const rowsWithQuantities = nonPlannedItems.filter(row => {
                const key = `${row.DocEntry}-${row.LineId}`;
                return quantitiesRef.current[key] && quantitiesRef.current[key] > 0;
            }).map(row => {
                const key = `${row.DocEntry}-${row.LineId}`;
                const palletType = row.U_PalletType;
                let coefficient = 1;
                if (palletType === 'Tam Palet') {
                    coefficient = 1;
                } else if (palletType === 'Yarım Palet') {
                    coefficient = 0.5;
                }

                totalQuantity += parseInt(quantitiesRef.current[key]) * coefficient || 0

                return {
                    DocEntry: row.DocEntry,
                    LineId: row.LineId,
                    U_ItemCode: row.U_ItemCode,
                    U_ItemName: row.U_ItemName,
                    U_CardCode: row.U_CardCode,
                    U_CardName: row.U_CardName,
                    U_OrderNo: row.U_OrderNo,
                    U_OrderLine: row.U_OrderLine,
                    U_WhsCode: row.U_WhsCode,
                    U_TradeFileNo: row.U_TradeFileNo,
                    U_TransportType: row.U_TransportType,
                    U_PalletGrossWgh: row.U_PalletGrossWgh / row.U_Quantity * quantitiesRef.current[key],
                    U_PalletNetWgh: row.U_PalletNetWgh / row.U_Quantity * quantitiesRef.current[key],
                    U_PalletType: row.U_PalletType,
                    U_InnerQtyOfPallet: row.U_InnerQtyOfPallet,
                    U_County: row.U_County,
                    U_City: row.U_City,
                    U_Country: row.U_Country,
                    U_Address: row.U_Address,
                    U_ZipCode: row.U_ZipCode,
                    // U_PalletCost: ((gridData.U_Price / sum) * quantitiesRef.current[key]).toFixed(2),
                    RemainingQuantity: quantitiesRef.current[key] || 0

                };

            });
            formDataWithItems = rowsWithQuantities;
            if (totalQuantity > 26) {
                handleNotify({ message: "Konteynerin Alacağı Maksimum Palet Miktarı Aşıldı. (Max: 26)", type: "error" })

            }
            else {

                navigate("/logisticsPlanningAdd", {
                    state: {
                        type: 2,
                        itemData: formDataWithItems,
                        vis: false,
                        onBackReport: "/shipmentReportPO"
                    }
                })
            }
        }
    };

    const cancel = () => {
        nonPlannedItems = null;
        dataAddAfter();
    }
    
    const onRowPrepared = (e) => {
        if (e.rowType === 'data') {
            const key = `${e.data.DocEntry}-${e.data.LineId}`;
            if (quantitiesRef.current[key] && quantitiesRef.current[key] > 0) {
                e.rowElement.style.backgroundColor = '#d3f9d8';
            }
        }
    };
    const handleFill = () => {
        if (nonPlannedItems) {
            nonPlannedItems.forEach(row => {
                debugger
                const key = `${row.DocEntry}-${row.LineId}`;
                const remainingQty = row.RemainingQuantity;
                quantitiesRef.current[key] = remainingQty;
                const input = document.getElementById(`inpQty-${key}`);
                if (input) {
                    input.value = remainingQty;
                    input.parentElement.parentElement.style.backgroundColor = '#d3f9d8';

                }
            });
        }
    }
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


        let totalQuantity = 0;
        let totalGrossWeight = 0;
        const rowsWithQuantities = nonPlannedItems.filter(row => {
            const key = `${row.DocEntry}-${row.LineId}`;
            return quantitiesRef.current[key] && quantitiesRef.current[key] > 0;
        }).map(row => {
            const key = `${row.DocEntry}-${row.LineId}`;
            const palletType = row.U_PalletType;
            const gross = row.U_PalletGrossWgh / row.U_Quantity * quantitiesRef.current[key]
            let coefficient = 1;
            if (palletType === 'Tam Palet') {
                coefficient = 1;
            } else if (palletType === 'Yarım Palet') {
                coefficient = 0.5;
            }
            totalQuantity += parseInt(quantitiesRef.current[key]) * coefficient || 0
            totalGrossWeight += gross

        });
    };

    return (
        <>
            <form>
                <div className="form-container">
                    <DataGrid
                        id="gridContainer"
                        dataSource={nonPlannedItems}
                        showBorders={true}
                        onRowPrepared={onRowPrepared}
                        columnAutoWidth={true}  
                        wordWrapEnabled={false}   
                        allowColumnResizing={true}
                        width="100%"             
                        scrolling={{ mode: 'standard' }}
                    >
                        <Paging
                            enabled={true}
                            pageSize={10} />

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
                        <Column dataField="RemainingQuantity" caption="Kalan Palet Miktarı" allowEditing={false} alignment='right' width={180} />
                        <Column dataField="U_Quantity" caption="Toplam Miktar" allowEditing={false} alignment='right' width={125} />
                        <Column dataField="DocEntry" caption="Sevkiyat No" allowEditing={false} alignment='left' width={120} sortOrder='desc' />
                        <Column dataField="LineId" caption="Sevkiyat Satır" allowEditing={false} alignment='left' width={120} />
                        <Column dataField="U_Date" caption="Sevkiyat Tarihi" allowEditing={false} dataType='date' format="dd/MM/yyyy" width={150} />
                        <Column dataField="U_TradeFileNo" caption="Ticaret Dosya Numarası" allowEditing={false} width={150} />
                        <Column dataField="U_TransportType" caption="Sevkiyat Şekli" allowEditing={false} width={0} />
                        <Column dataField="U_DeliveryStatus" caption="Durum" allowEditing={false} width={0} />
                        <Column dataField="U_ItemCode" caption="Kalem Kodu" allowEditing={false} width={150} />
                        <Column dataField="U_ItemName" caption="Kalem Açıklama" allowEditing={false} width={180} />
                        <Column dataField="U_WhsCode" caption="Depo Kodu" allowEditing={false} width={100} />
                        <Column dataField="U_CardName" caption="Müşteri" allowEditing={false} width={150} />
                        <Column dataField="U_OrderNo" caption="Sipariş No" allowEditing={false} alignment='left' width={150} />
                        <Column dataField="U_PalletGrossWgh" caption="Palet Brut" allowEditing={false} alignment='left' width={150} />
                        <Column dataField="U_PalletNetWgh" caption="Palet Net" allowEditing={false} alignment='left' width={150} />
                        <Column dataField="U_InnerQtyOfPallet" caption="Palet İçi Adet" allowEditing={false} alignment='left' width={150} />
                        <Column dataField="U_PalletType" caption="Palet  Şekli" allowEditing={false} alignment='left' width={150} />
                        <Column dataField="U_Address" caption="Adres" allowEditing={false} />
                        <Column dataField="U_City" caption="İl" allowEditing={false} />
                        <Column dataField="U_County" caption="İlçe" allowEditing={false} />
                        <Column dataField="U_Country" caption="Ülke" allowEditing={false} />
                        <Column dataField="U_ZipCode" caption="Posta Kodu" allowEditing={false} />
                        {/* <Column dataField="SML_SHP_HDR/SML_SHP_ITEMCollection.U_OrderLine" caption="Sipariş Satır" allowEditing={false} /> */}
                    </DataGrid>
                </div>
            </form>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 10,
            }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Button
                        text="Ekle"
                        onClick={handleSave}
                        style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            marginTop: 10,
                        }}
                    />
                    <Button
                        text="Tümünü Doldur"
                        onClick={handleFill}
                        style={{
                            backgroundColor: '#3fbeee',
                            color: '#fff',
                            marginTop: 10,
                        }}
                    />
                    <Button
                        text="İptal"
                        onClick={() => cancel()}
                        style={{
                            backgroundColor: '#ea110b',
                            color: '#fff',
                            marginTop: 10,
                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default ShipmentItemsPO;
