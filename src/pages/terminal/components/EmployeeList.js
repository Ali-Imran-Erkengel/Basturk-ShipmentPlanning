import React, { useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, FilterRow, Paging} from 'devextreme-react/data-grid';
import { getEmployees } from '../../../store/terminalSlice';
import { Form, SimpleItem } from 'devextreme-react/form';
function EmployeeList({ onRowSelected, gridData }) {
    const [dataSource, setDataSource] = useState([]);
    const [filters, setFilters] = useState({ firstName: '', lastName: '' });
  
    const dataGridRef = useRef(null);
  
    useEffect(() => {
        fetchDataSource(filters); 
    }, []); 
    
    const fetchDataSource = async (filterParams = {}) => {
        try {
            const params = {
                firstName: filterParams.firstName || '',
                lastName: filterParams.lastName || ''
            };
            const employees = await getEmployees({ filterValues: params });
            setDataSource(employees || []);
        } catch (err) {
            console.error(err);
            setDataSource([]);
        }
    };
  
    const onRowClick = (e) => {
        const selected = e.data;
        const updatedGridData = {
            EmployeeID: selected.EmployeeID,
            EmployeeName: `${selected.FirstName} ${selected.LastName}`
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
            dataField="firstName"
            label={{ text: 'Ad', location: 'top' }}
            editorOptions={{
              onEnterKey: (e) => handleFilterEnter('firstName', e.component.option('value'))
            }}
          />
          <SimpleItem
            dataField="lastName"
            label={{ text: 'Soyad', location: 'top' }}
            editorOptions={{
              onEnterKey: (e) => handleFilterEnter('lastName', e.component.option('value'))
            }}
          />
        </Form>
  
        <DataGrid
          ref={dataGridRef}
          dataSource={dataSource}
          onRowClick={onRowClick}
          className="datagridZoomLayout"
          keyExpr="EmployeeID"
          showBorders={true}
          columnAutoWidth={true}
          allowColumnResizing={true}
          selection={{ mode: 'single' }}
          paging={{ pageSize: 10 }}
        >
          <Editing mode="cell" allowUpdating={false} />
          <Column dataField="EmployeeID" caption="ID" allowFiltering={false} alignment='left'/>
          <Column dataField="FirstName" caption="Ad" />
          <Column dataField="LastName" caption="Soyad" />
        </DataGrid>
      </div>
    );
  }
  
  export default EmployeeList;