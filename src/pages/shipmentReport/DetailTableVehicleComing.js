import React, { forwardRef } from 'react';
import { DataGrid, Column, StateStoring } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

const DetailTableVehicleComing = forwardRef((props, ref) => {
    const { detail, gridKey, loadGridState } = props;

    const dataSource = new DataSource({
        store: new ArrayStore({
            data: detail,
            key: 'DocEntry',
        }),
        filter: ['DocEntry', '=', props.data.key],
    });
    return (
        <React.Fragment>
            <DataGrid
                ref={ref}
                dataSource={dataSource}
                showBorders={true}
                columnAutoWidth={true}
                allowColumnResizing={true}
                allowColumnReordering={true}
            >
                <StateStoring
                    enabled={true}
                    type="custom"
                    customLoad={() => loadGridState(gridKey)}
                />
                <Column
                    dataField="DocEntry"
                    caption='Belge No'
                    alignment='left' />
                <Column
                    dataField="U_TradeFileNo"
                    caption='Ticaret Dosya No'
                    alignment='left' />
                <Column
                    dataField="LineId"
                    caption='Sıra'
                    alignment='left' />
                <Column
                    dataField="ICardName"
                    caption='Muhatap'
                />
                <Column
                    dataField="U_ItemCode"
                    caption='Ürün Kodu'
                />
                <Column
                    dataField="U_ItemName"
                    caption='Ürün'
                />
                <Column
                    dataField="U_Quantity"
                    caption='Palet Sayısı'
                />

            </DataGrid>
        </React.Fragment>
    );
});
export default DetailTableVehicleComing;