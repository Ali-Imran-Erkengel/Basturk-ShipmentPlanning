import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import List from 'devextreme-react/list';
import DataSource from 'devextreme/data/data_source';
import 'devextreme/ui/select_box';
import { tableCategories, tables } from '../../data/supportTablesData';

const renderLabel = () => (
  <div className="toolbar-label">
    <h2>Destek Tabloları</h2>
  </div>
);

const SupportTables = () => {
  const navigate = useNavigate();

  const handleLoginEvent = (item) => {
    navigate(`/${item.navigate}`);
  };


  return (
    <div className='page-container'>
      <Toolbar >
        <Item
          location="center"
          locateInMenu="never"
          render={renderLabel}
        />
        <Item
          location="after"
          locateInMenu="auto"
          widget="dxSelectBox"
          options={selectBoxOptions}
        />
      </Toolbar>
      <List
        onItemClick={(e) => handleLoginEvent({ ...tables[e.itemIndex] })}
        id="products"
        dataSource={productsStore}
      />
    </div>
  );
};

const productsStore = new DataSource(tables);

const selectBoxOptions = {
  width: 140,
  items: tableCategories,
  valueExpr: 'id',
  displayExpr: 'text',
  value: tableCategories[0].id,
  inputAttr: { 'aria-label': 'Categories' },
  onValueChanged: (args) => {
    if (args.value > 1) {
      productsStore.filter(['type', '=', args.value]);
    } else {
      productsStore.filter(null);
    }
    productsStore.load();
  },
};

export default SupportTables;
