import React, { forwardRef } from 'react';
import { DataGrid, Column, StateStoring } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

const DetailTableShipment = forwardRef((props, ref) => {
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
          dataField="U_ItemCode"
          caption='Ürün Kodu'
        />
        <Column
          dataField="U_ItemName"
          caption='Ürün Adı'
        />
        <Column
          dataField="U_CardName"
          caption='Muhatap'
        />
        <Column
          dataField="TotalShipmentQuantity"
          caption='Toplam Miktar'
        />
        <Column
          dataField="TotalLogisticsQuantity"
          caption='Planlanan Miktar'
        />
        <Column
          dataField="RemainingQuantity"
          caption='Kalan Miktar'
        />
        <Column
          dataField="U_OrderNo"
          caption='Sipariş Entry'
        />
        <Column
          dataField="U_OrderNum"
          caption='Sipariş No'
        />
        <Column
          dataField="U_OrderLine"
          caption='Sipariş Satır'
        />
        {/* <Column
          dataField="Country"
          caption='Ülke'
        />
        <Column
          dataField="City"
          caption='İl'
        />
        <Column
          dataField="County"
          caption='İlçe'
        /> */}


      </DataGrid>
    </React.Fragment>
  );
});
export default DetailTableShipment;