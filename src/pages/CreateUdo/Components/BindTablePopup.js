import React, { useState } from 'react'
import Header from '../../../components/myComponents/Header'
import { Form, Item, SimpleItem } from 'devextreme-react/form'
import { childTable } from '../data/data'
import { TextBox } from 'devextreme-react/text-box';
import { bindChildTable } from '../../../store/udoSlice';
import { useDispatch } from 'react-redux';
import { Button } from 'devextreme-react/button';

function BindTablePopup() {
    const dispatch = useDispatch();
    const [mainTable, setMainTable] = useState('');
    const [childTable, setChildTabvl] = useState('');
  
    const handleAdd = (e) => {
        
        e.preventDefault();
        dispatch(bindChildTable({ mainTable: mainTable, childTable: childTable })).then((result) => {
            if (result.payload) {
                console.log("success");
            }
        })
    };

   const  handleValueChange=(e)=> {
        const previousValue = e.previousValue;
        const newValue = e.value;
 
       setMainTable(newValue);
    }
   const  handleValueChange1=(e)=> {
        const previousValue = e.previousValue;
        const newValue = e.value;
 
        setChildTabvl(newValue);
    }
    return (
        <>
            <form onSubmit={handleAdd}>
            <div className="top-buttons">
                        <h6 className="header-title">Bind Table</h6>
                        <div className="button-group">
                            <Button icon="save" type="success" useSubmitBehavior={true} />
                            <Button icon="trash" type="default" />
                            <Button icon="close" type="danger" />
                        </div>
                    </div>
                {/* <Form formData={childTable} colCount={2} labelLocation="top" >
                    <SimpleItem dataField="TableName" editorType="dxTextBox" label={{ text: 'Tablo Adı' }} />
                    <SimpleItem dataField="ObjectName" editorType="dxTextBox" label={{ text: 'Tablo Obje' }} />

                </Form> */}
                <TextBox value={childTable} onValueChanged={handleValueChange1}
                ></TextBox>
                <TextBox value={mainTable}
                onValueChanged={handleValueChange}></TextBox>
            </form>
        </>
    )
}

export default BindTablePopup