import React from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

const DetailTableLoaded = (props) => {
  const { detail } = props;
  const getTasks = (key) =>
    new DataSource({
      store: new ArrayStore({
        data: detail,
        key: 'lDocEntry',
      }),
      filter: ['lDocEntry', '=', key],
    });
  const dataSource = getTasks(props.data.key);
  return (
    <React.Fragment>
      <DataGrid
        dataSource={dataSource}
        showBorders={true}
        columnAutoWidth={true} 
        allowColumnResizing={true} 
      >
        <Column
          dataField="lDocEntry"
          caption='Belge No'
          alignment='left' />
        <Column
          dataField="U_TradeFileNo"
          caption='Ticaret Dosya No'
          alignment='left' />
        <Column
          dataField="U_CardName"
          caption='Muhatap'/>
        <Column
          dataField="U_ItemCode"
          caption='Ürün Kodu'/>
        <Column
          dataField="U_ItemName"
          caption='Ürün Adı'
        />
        <Column
          dataField="U_Quantity"
          caption='Palet Sayısı'
        />

      </DataGrid>
    </React.Fragment>
  );
};
export default DetailTableLoaded;