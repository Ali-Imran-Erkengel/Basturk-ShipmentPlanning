import React, { useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, FilterRow, Paging} from 'devextreme-react/data-grid';
import {  getBusinessPartners, getWarehouses } from '../../../store/terminalSlice';
import { Form, SimpleItem } from 'devextreme-react/form';
function BusinessPartnerList({ onRowSelected, gridData }) {
    const [dataSource, setDataSource] = useState([]);
    const [filters, setFilters] = useState({ whsCode: '', whsName: '' });
  
    const dataGridRef = useRef(null);
  
    useEffect(() => {
        fetchDataSource(filters); 
    }, []); 
    
    const fetchDataSource = async (filterParams = {}) => {
        try {
            const params = {
                cardCode: filterParams.cardCode || '',
                cardName: filterParams.cardName || ''
            };
            const businessPartners = await getBusinessPartners({ filterValues: params });
            setDataSource(businessPartners || []);
        } catch (err) {
            console.error(err);
            setDataSource([]);
        }
    };
  
    const onRowClick = (e) => {
      debugger
        const selected = e.data;
        const updatedGridData = {
            CardCode: selected.cardCode,
            CardName: selected.cardName,
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
            dataField="cardCode"
            label={{ text: 'Müşteri Kodu', location: 'top' }}
            editorOptions={{
              onEnterKey: (e) => handleFilterEnter('cardCode', e.component.option('value'))
            }}
          />
          <SimpleItem
            dataField="cardName"
            label={{ text: 'Müşteri Adı', location: 'top' }}
            editorOptions={{
              onEnterKey: (e) => handleFilterEnter('cardName', e.component.option('value'))
            }}
          />
        </Form>
  
        <DataGrid
          ref={dataGridRef}
          dataSource={dataSource}
          onRowClick={onRowClick}
          className="datagridZoomLayout"
          keyExpr="cardCode"
          showBorders={true}
          columnAutoWidth={true}
          allowColumnResizing={true}
          selection={{ mode: 'single' }}
          paging={{ pageSize: 10 }}
        >
          <Editing mode="cell" allowUpdating={false} />
          <Column dataField="cardCode" caption="Müşteri Kodu" />
          <Column dataField="cardName" caption="Müşteri Adı" />
        </DataGrid>
      </div>
    );
  }
  
  export default BusinessPartnerList;