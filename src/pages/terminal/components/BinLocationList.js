import React, { useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, FilterRow, Paging} from 'devextreme-react/data-grid';
import {  getBinLocations } from '../../../store/terminalSlice';
import { Form, SimpleItem } from 'devextreme-react/form';
function BinLocationList({ onRowSelected, gridData }) {
    const [dataSource, setDataSource] = useState([]);
    const [filters, setFilters] = useState({ whsCode: '', binCode: '' });
  
    const dataGridRef = useRef(null);
  
    useEffect(() => {
        fetchDataSource(filters); 
    }, []); 
    
    const fetchDataSource = async (filterParams = {}) => {
        try {
            const params = {
                whsCode: filterParams.whsCode || '',
                binCode: filterParams.binCode || ''
            };
            const warehouses = await getBinLocations({ filterValues: params });
            setDataSource(warehouses || []);
        } catch (err) {
            console.error(err);
            setDataSource([]);
        }
    };
  
    const onRowClick = (e) => {
      debugger
        const selected = e.data;
        const updatedGridData = {
            WhsCode: selected.whsCode,
            BinCode: selected.binCode,
            BinEntry:selected.absEntry
        };
        onRowSelected(updatedGridData);
      };
  
    const handleFilterEnter = (field, value) => {
      const newFilters = { ...filters, [field]: value };
      setFilters(newFilters);
      fetchDataSource(newFilters);
    };
  
    return (
      <div>
        <Form formData={filters} labelLocation="top" colCount={2} className="filter-form">
          <SimpleItem
            dataField="whsCode"
            label={{ text: 'Depo Kodu', location: 'top' }}
            editorOptions={{
              onEnterKey: (e) => handleFilterEnter('whsCode', e.component.option('value'))
            }}
          />
          <SimpleItem
            dataField="binCode"
            label={{ text: 'Depo Yeri', location: 'top' }}
            editorOptions={{
              onEnterKey: (e) => handleFilterEnter('binCode', e.component.option('value'))
            }}
          />
        </Form>
  
        <DataGrid
          ref={dataGridRef}
          dataSource={dataSource}
          onRowClick={onRowClick}
          className="datagridZoomLayout"
          keyExpr="absEntry"
          showBorders={true}
          columnAutoWidth={true}
          allowColumnResizing={true}
          selection={{ mode: 'single' }}
          paging={{ pageSize: 10 }}
        >
          <Editing mode="cell" allowUpdating={false} />
          <Column dataField="whsCode" caption="Depo Kodu" />
          <Column dataField="binCode" caption="Depo Yeri" />
        </DataGrid>
      </div>
    );
  }
  
  export default BinLocationList;