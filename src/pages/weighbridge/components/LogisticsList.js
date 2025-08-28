import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, Paging, Selection } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { useDispatch } from 'react-redux';
import { Form, SimpleItem } from 'devextreme-react/form';
import { odataQuery, odataQuery2 } from '../../../store/logisticsSlice';
import notify from 'devextreme/ui/notify';
import { getAllLogistics, getAllWgh } from '../../../store/weighbridgeSlice';
function LogisticsList({ onRowSelected, gridData, formMode, type }) {
    const [filterValues, setFilterValues] = useState({
        DocEntry: '',
        CustomDocNum: '',
        Date: '',
        Type: type
    });

    const quantitiesRef = useRef({});
    const lineIdRef = useRef({});
    const [dataSource, setDataSource] = useState(null);
    const [selectedItem, setSelectedItem] = useState('');
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
    const sendOdataQuery = useCallback(() => {
        const newDataSource = odataQuery2({ filterValues });
        setDataSource(newDataSource);

    }, [filterValues]);
    const applyFilter = async () => {
        const logistics = await getAllLogistics({ filterValues });
        const wghs = await getAllWgh();
        const wghsLogisticNos = wghs.map(item => item.U_LogisticsNo);

        // logistics içinde olup, wghs içinde bulunmayan DocEntry'leri filtreleyelim
        const notInWghs = logistics.filter(item => !wghsLogisticNos.includes(item.DocEntry));

        setDataSource(logistics);
    };
 

    // useEffect(() => {
    //     if (gridData.length > 0) {
    //         gridData.forEach(row => {
    //             const key = `${row['Orders/DocumentLines'].DocEntry}-${row['Orders/DocumentLines'].LineNum}`;
    //             quantitiesRef.current[key] = row.quantity || 0;
    //         });
    //     }
    // }, [gridData]);
    // useEffect(() => {
    //     if (gridData && gridData.SML_LGT_ITEMCollection) {
    //         gridData.SML_LGT_ITEMCollection.forEach(item => {
    //             const key = `${item.U_ShipmentNo}-${item.U_ShipmentLine}`;
    //             quantitiesRef.current[key] = item.U_Quantity || 0;
    //             lineIdRef.current[key] = item.LineId || "";
    //         });
    //     }
    // }, [gridData]);



    const handleSelectionChanged = (e) => {
        const selectedRowData = e.selectedRowsData[0];
        setSelectedItem(selectedRowData?.DocEntry);
        if (onRowSelected && selectedRowData) {
            onRowSelected(selectedRowData);
        }
    };

    return (
        <>
            <div className="form-container">
                <Form formData={filterValues} colCount={3} labelLocation="top">
                    <SimpleItem dataField="DocEntry" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Belge No' }} />
                    <SimpleItem dataField="CustomDocNum" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Custom Belge No' }} />
                    <SimpleItem dataField="Date" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Teslim Tarihi' }} />

                </Form>
            </div>

            <Button onClick={applyFilter} style={{ marginTop: 10 }} text="Ara "></Button>
            <DataGrid
                id="gridContainer"
                selection={true}
                onSelectionChanged={handleSelectionChanged}
                dataSource={dataSource}
                // keyExpr={dataSource.DocEntry}
                showBorders={true}
            >

                <Paging
                    enabled={true}
                    pageSize={10} />
                <Selection
                    mode="single"
                    selectAllMode="page"
                />

                <Column dataField="DocEntry" caption="Lojistik No" allowEditing={false} alignment='left' />
                <Column dataField="U_CustomDocNum" caption="Custom Belge No" allowEditing={false} />
                <Column dataField="U_Date" caption="Teslim Tarihi" dataType='date' format="dd/MM/yyyy" allowEditing={false} />
                <Column dataField="U_Description" caption="Açıklama" allowEditing={false} />
                {/* <Column dataField="SML_SHP_HDR/SML_SHP_ITEMCollection.U_CardCode" caption="Müşteri Kodu" allowEditing={false} /> */}
                <Column dataField="U_DriverName" caption="Şöför" allowEditing={false} />
                <Column dataField="U_PalletQuantity" caption="Palet Miktarı" allowEditing={false} />

            </DataGrid>
        </>
    );
}

export default LogisticsList;
