import React, {  useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { Form, SimpleItem } from 'devextreme-react/form';
import {  getSalesShipments } from '../../../store/logisticsSlice';
import notify from 'devextreme/ui/notify';
function ShipmentList({ onRowSelected, gridData, formMode, type }) {
  
    const [filterValues, setFilterValues] = useState({
        ItemCode: '',
        CardName: '',
        Date: '',
        ShipmentCode: '',
        ShipmentNo:''
    });
   
    let totalQty = useRef();
    let totalGross = useRef();
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
        
        const shipmentss=await getSalesShipments({filterValues});
        setDataSource(shipmentss);
       
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


        let totalQuantity = 0;
        let totalGrossWeight = 0;
        const rowsWithQuantities = dataSource.filter(row => {
            const key = `${row.DocEntry}-${row.LineId}`;
            return quantitiesRef.current[key] && quantitiesRef.current[key] > 0;
        }).map(row => {
            const key = `${row.DocEntry}-${row.LineId}`;
            const palletType = row.U_PalletType;
            const gross = row.U_PalletGrossWgh / row.U_PalletQuantity * quantitiesRef.current[key]
            let coefficient = 1;
            if (palletType === 'Tam Palet') {
                coefficient = 1;
            } else if (palletType === 'Yarım Palet') {
                coefficient = 0.5;
            }
            totalQuantity += parseInt(quantitiesRef.current[key]) * coefficient || 0
            totalGrossWeight += gross

        });
        console.log("toplam miktar", totalQuantity);
        console.log("toplam brüt", totalGrossWeight);
        totalGross.current.value = totalGrossWeight;
        totalQty.current.value = totalQuantity;

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
                const palletType = row.U_PalletType;
                let coefficient = 1;
                if (palletType === 'Tam Palet') {
                    coefficient = 1;
                } else if (palletType === 'Yarım Palet') {
                    coefficient = 0.5;
                }
                gridData.U_County=row.U_County;
                gridData.U_City=row.U_City;
                gridData.U_Country=row.U_Country;
                gridData.U_Address=row.U_Address;
                gridData.U_ZipCode=row.U_ZipCode;
                totalQuantity += parseInt(quantitiesRef.current[key]) * coefficient || 0
                if (formMode === 'u') {
                    return {
                        U_ShipmentNo: row.DocEntry,
                        U_ShipmentLine: row.LineId,
                        U_ItemCode: row.U_ItemCode,
                        U_ItemName: row.U_ItemName,
                        U_CardCode: row.U_CardCode,
                        U_CardName: row.U_CardName,
                        U_OrderNo: row.U_OrderNo,
                        U_OrderNum: row.U_OrderNum,
                        U_OrderLine: row.U_OrderLine,
                        U_WhsCode: row.U_WhsCode,
                        U_TradeFileNo: row.U_TradeFileNo,
                        U_TransportType: row.U_TransportType,
                        U_PalletGrossWgh: row.U_PalletGrossWgh / row.U_PalletQuantity * quantitiesRef.current[key],
                        U_PalletNetWgh: row.U_PalletNetWgh / row.U_PalletQuantity * quantitiesRef.current[key],
                        U_PalletType: row.U_PalletType,
                        U_InnerQtyOfPallet: row.U_InnerQtyOfPallet,
                        U_PalletCost: ((gridData.U_Price / sum) * quantitiesRef.current[key]).toFixed(2),
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
                        U_OrderNum: row.U_OrderNum,
                        U_OrderLine: row.U_OrderLine,
                        U_WhsCode: row.U_WhsCode,
                        U_TradeFileNo: row.U_TradeFileNo,
                        U_TransportType: row.U_TransportType,
                        U_PalletGrossWgh: row.U_PalletGrossWgh / row.U_PalletQuantity * quantitiesRef.current[key],
                        U_PalletNetWgh: row.U_PalletNetWgh / row.U_PalletQuantity * quantitiesRef.current[key],
                        U_PalletType: row.U_PalletType,
                        U_InnerQtyOfPallet: row.U_InnerQtyOfPallet,
                        U_PalletCost: ((gridData.U_Price / sum) * quantitiesRef.current[key]).toFixed(2),
                        U_Quantity: quantitiesRef.current[key] || 0

                    };
                }
            });
            gridData.U_PalletQuantity = totalQuantity;
            // gridData.U_ContainerQuantity = Math.ceil(totalQuantity / 26);
            const formDataWithItems = {
                ...gridData,
                SML_LGT_ITEMCollection: rowsWithQuantities
            };
            if (totalQuantity > 26) {
                handleNotify({ message: "Konteynerin Alacağı Maksimum Palet Miktarı Aşıldı. (Max: 26)", type: "error" })
                //onRowSelected(formDataWithItems);
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
    // const onRowPrepared = (e) => {
    //     console.log("first", e)
    //     if (e.rowType === 'data') {
    //         const key = `${e.data['SML_'].DocEntry}-${e.data['Orders/DocumentLines'].LineNum}`;
    //         if (quantitiesRef.current[key] && quantitiesRef.current[key] > 0) {
    //             e.rowElement.style.backgroundColor = '#d3f9d8';
    //         }
    //     }
    // };
    const handleFill = () => {
        if (dataSource) {
            let totalQuantity = 0;
            let totalGrossWeight = 0;
            dataSource.forEach(row => {
                const key = `${row.DocEntry}-${row.LineId}`;
                const remainingQty = row.U_RemainingQty;
                quantitiesRef.current[key] = remainingQty;
                const input = document.getElementById(`inpQty-${key}`);
                if (input) {
                    input.value = remainingQty;
                    input.parentElement.parentElement.style.backgroundColor = '#d3f9d8';

                    const key = `${row.DocEntry}-${row.LineId}`;
                    const palletType = row.U_PalletType;
                    const gross = row.U_PalletGrossWgh / row.U_PalletQuantity * quantitiesRef.current[key]
                    let coefficient = 1;
                    if (palletType === 'Tam Palet') {
                        coefficient = 1;
                    } else if (palletType === 'Yarım Palet') {
                        coefficient = 0.5;
                    }
                    totalQuantity += parseInt(quantitiesRef.current[key]) * coefficient || 0
                    totalGrossWeight += gross


                }
            });
            totalGross.current.value = totalGrossWeight;
            totalQty.current.value = totalQuantity;
        }
    }
    return (
        <>
            <div className="form-container">
                <Form formData={filterValues} colCount={4} labelLocation="top">
                    <SimpleItem dataField="Date" editorType="dxDateBox" editorOptions={{ displayFormat: "dd/MM/yyyy" }} cssClass="transparent-bg" label={{ text: 'Sevkiyat Tarihi' }} />
                    <SimpleItem dataField="ShipmentNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Sevkiyat No' }} />
                    <SimpleItem dataField="ItemCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Kalem Kodu' }} />
                    <SimpleItem dataField="CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Müşteri' }} />
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
                columnAutoWidth={true}  // Otomatik sütun genişliği ayarı kapalı
                wordWrapEnabled={false}   // Metinler hücre içinde sarılabilir
                allowColumnResizing={true}
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
                <Column dataField="U_RemainingQty" caption="Kalan Palet Miktarı" allowEditing={false} alignment='right' width={180} />
                <Column dataField="U_PalletQuantity" caption="Toplam Palet Miktarı" allowEditing={false} alignment='right' width={180} />
                <Column dataField="U_Quantity" caption="Toplam Miktar" allowEditing={false} alignment='right' width={125} />
                <Column dataField="DocEntry" caption="Sevkiyat No" allowEditing={false} alignment='left' width={120} sortOrder='desc'/>
                <Column dataField="LineId" caption="Sevkiyat Satır" allowEditing={false} alignment='left' width={120} />
                <Column dataField="U_Date" caption="Sevkiyat Tarihi" allowEditing={false} dataType='date' format="dd/MM/yyyy" width={150} />
                <Column dataField="U_TradeFileNo" caption="Ticaret Dosya Numarası" allowEditing={false} width={150} />
                <Column dataField="U_TransportType" caption="Sevkiyat Şekli" allowEditing={false} width={0} />
                <Column dataField="U_TypeDescription" caption="Tip" allowEditing={false} width={150} />
                <Column dataField="U_DeliveryStatus" caption="Durum" allowEditing={false} width={0}/>
                <Column dataField="U_ItemCode" caption="Kalem Kodu" allowEditing={false} width={150} />
                <Column dataField="U_ItemName" caption="Kalem Açıklama" allowEditing={false} width={180} />
                <Column dataField="U_WhsCode" caption="Depo Kodu" allowEditing={false} width={100} />
                <Column dataField="U_CardName" caption="Müşteri" allowEditing={false} width={150} />
                <Column dataField="U_OrderNo" caption="Sipariş Entry" allowEditing={false} alignment='left' width={150} />
                <Column dataField="U_OrderNum" caption="Sipariş No" allowEditing={false} alignment='left' width={150} />
                <Column dataField="U_PalletGrossWgh" caption="Palet Brut" allowEditing={false} alignment='left' width={150} />
                <Column dataField="U_PalletNetWgh" caption="Palet Net" allowEditing={false} alignment='left' width={150} />
                <Column dataField="U_InnerQtyOfPallet" caption="Palet İçi Adet" allowEditing={false} alignment='left' width={150} />
                <Column dataField="U_PalletType" caption="Palet  Şekli" allowEditing={false} alignment='left' width={150} />
                <Column dataField="U_Address" caption="Adres" allowEditing={false}  />
                <Column dataField="U_City" caption="İl" allowEditing={false}  />
                <Column dataField="U_County" caption="İlçe" allowEditing={false}  />
                <Column dataField="U_Country" caption="Ülke" allowEditing={false}  />
                <Column dataField="U_ZipCode" caption="Posta Kodu" allowEditing={false}  />
                {/* <Column dataField="SML_SHP_HDR/SML_SHP_ITEMCollection.U_OrderLine" caption="Sipariş Satır" allowEditing={false} /> */}
            </DataGrid>
            <div style={{ display: "flex", flexDirection: "column", width: "300px", margin: "20px " }}>
                <label
                    htmlFor="customInput"
                    style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                        marginBottom: "5px",
                    }}
                >
                    Toplam Palet Miktarı
                </label>
                <input
                    id="customInput"
                    type="text"
                    ref={totalQty}
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
                <br></br>
                <label
                    htmlFor="customInput1"
                    style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#333",
                        marginBottom: "5px",
                    }}
                >
                    Toplam Brüt Ağırlık
                </label>
                <input
                    id="customInput1"
                    type="text"
                    ref={totalGross}
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

        </>
    );
}

export default ShipmentList;
