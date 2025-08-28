import React, { useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, FilterRow, Paging} from 'devextreme-react/data-grid';
function BinLocations({ onRowSelected, gridData, binLocDataSource, columnIndex }) {
    const [dataSource, setDataSource] = useState(null);
    const [gridKey, setGridKey] = useState(Date.now());
    const dataGridRef = useRef(null);
    useEffect(() => {
        if (binLocDataSource && Array.isArray(binLocDataSource)) {
            setDataSource(binLocDataSource);
            setGridKey(Date.now());
        } else {
            setDataSource([]);
            setGridKey(Date.now());
        }
    }, [binLocDataSource]);
    const onRowClick = (e) => {
        const selected = e.data;
        const updatedGridData = {
            ...gridData,
            SML_LGT_ITEMCollection: gridData.SML_LGT_ITEMCollection.map((item, index) => {
                if (index === columnIndex) {
                    return {
                        ...item,
                        U_BinEntry: selected.AbsEntry,
                        U_BinCode: selected.BinCode
                    };
                }
                return item;
            })
        };
        onRowSelected(updatedGridData);
    };
    return (
        <>
            
            <DataGrid
                key={gridKey}
                ref={dataGridRef}
                onRowClick={onRowClick}
                id="gridContainer"
                dataSource={dataSource}
                showBorders={true}
                keyExpr={["AbsEntry", "ItemCode"]}
                columnAutoWidth={true}
                wordWrapEnabled={false}
                allowColumnResizing={true}
                selection={{ mode: 'single' }}
                width="100%"
                scrolling={{ mode: 'standard' }}
            >
                <Editing
                    mode="cell"
                    allowUpdating={true}
                />
                <FilterRow visible={true} />
                <Paging
                    enabled={true}
                    pageSize={10}
                />
                <Column dataField="ItemCode" caption="Kalem Kodu" allowEditing={false} />
                <Column dataField="ItemName" caption="Kalem Açıklama" allowEditing={false} />
                <Column dataField="AbsEntry" caption="Abs Entry" allowEditing={false} />
                <Column dataField="BinCode" caption="Depo Yeri Kodu" allowEditing={false} />
                <Column dataField="Descr" caption="Depo Yeri" allowEditing={false} />
                <Column dataField="WhsCode" caption="Depo Kodu" allowEditing={false} />
                <Column dataField="WhsName" caption="Depo" allowEditing={false} />
                <Column dataField="OnHandQty" caption="Stok" allowEditing={false} />
                <Column dataField="InnerQtyOfPallet" caption="Palet İçi Miktar" allowEditing={false} />
                <Column dataField="TotalPallet" caption="Palet Miktarı" allowEditing={false} />
            </DataGrid>
        </>
    );
}

export default BinLocations;