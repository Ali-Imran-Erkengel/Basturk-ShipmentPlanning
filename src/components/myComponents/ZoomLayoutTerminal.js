import { Column, DataGrid, Selection } from 'devextreme-react/data-grid'
import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { createODataSource, filter } from '../../store/appSlice';
import { getEmployees } from '../../store/terminalSlice';

function ZoomLayoutTerminal({ tableName, tableKey, customFilter, filters, columns, onRowSelected }) {

  const initialFilterValues = filters.reduce((acc, value) => {
    acc[value.DataField] = '';
    return acc;
  }, {});
  const [selectedItem, setSelectedItem] = useState('');
  const [dataSource, setDataSource] = useState(null);
  const [filterValues, setFilterValues] = useState(initialFilterValues);
  const filtersConfig =
    filters.map((value, index) => (
      { field: value, operator: 'contains', type: 'string' }
    ))
  useEffect(() => {
    const myDataSource = createODataSource(tableName, tableKey, customFilter);
    setDataSource(myDataSource);
  }, []);
  const applyFilterold = () => {
    const newDataSource = filter({ tableName: tableName, tableKey: tableKey, filtersConfig: filtersConfig, filterValues: filterValues, customFilter: customFilter });
    setDataSource(newDataSource);
  };
  const applyFilter = async () => {
    debugger
    switch (tableName) {
      case "EmployeesInfo":
        const res = await getEmployees({ filterValues});
        setDataSource(res);
        break;
        case "OBIN":

        break;
        case "OWHS":

        break;
    
      default:
        break;
    }
};

  const handleSelectionChanged = (e) => {
    const selectedRowData = e.selectedRowsData[0];
    setSelectedItem(selectedRowData?.DocEntry);
    if (onRowSelected && selectedRowData) {
      onRowSelected(selectedRowData);
    }
  };
  return (
    <div   style={{ backgroundColor: '#d7f1ef' }} 

    // className='page-container'
    >
      <div className="form-container">
        <Form formData={filterValues} colCount={filters.length} labelLocation="top" onFieldDataChanged={applyFilter} className="terminal-form">
          {
            columns.map((value, index) => (
              <SimpleItem key={index} dataField={value.DataField} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: value.Caption }} />
            ))
          }
        </Form>
      </div>
      <DataGrid
        selection={true}
        className="datagridZoomLayout"
        rowAlternationEnabled={true}
        // onSelectionChanged={(e) => setSelectedItem(e.selectedRowsData[0]?.DocEntry)}
        onSelectionChanged={handleSelectionChanged}
        dataSource={dataSource}
        keyExpr={tableKey}
        showBorders={true}
        columnAutoWidth={true}
        columnMinWidth={120}
        allowColumnResizing={false}
      >
        <Selection
          mode="single"
          selectAllMode="page"
        />
        {
          columns.map((value, index) => (
            <Column key={index} dataField={value.DataField} caption={value.Caption} alignment='left' />
          ))
        }
      </DataGrid>
    </div>
  )
}
export default ZoomLayoutTerminal