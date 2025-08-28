import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { createTable, createUDF } from '../../store/udoSlice';
import DataGrid, { Column, Editing, Lookup } from 'devextreme-react/data-grid';
import { Form, SimpleItem } from 'devextreme-react/form'
import { Button } from 'devextreme-react/button'
import { fieldType, objectType, subType, tableType, udf, udo, udt } from './data/data';
import { Popup } from 'devextreme-react/popup';
import BindTablePopup from './Components/BindTablePopup';
import Header from '../../components/myComponents/Header';




function CreateUdo() {
    const dispatch = useDispatch();
    const handleAdd = (e) => {
        e.preventDefault();
        dispatch(createTable({ udt: udt, udo: udo, udf: udf })).then((result) => {
            if (result.payload) {
                console.log("success");
            }
        })
    };
    const tableTypeOptions = {
        dataSource: tableType,
        displayExpr: 'Value',
        valueExpr: 'Key'
    };
    const objectTypeOptions = {
        dataSource: objectType,
        displayExpr: 'Value',
        valueExpr: 'Key'
    };
    const [isPopupVisible, setPopupVisibility] = useState(false);
    const togglePopup = () => {
        setPopupVisibility(!isPopupVisible);
    };
    const renderTitle = () => {
        return (
            <Header title={"Tablo Bağla"}></Header>

        );
    }
    return (
        <div >
            <div className="page-container">
                <form onSubmit={handleAdd}>
                    <div className="top-buttons">
                        <h6 className="header-title">UDT/UDF/UDO Create</h6>
                        <div className="button-group">
                            <Button icon="save" type="success" useSubmitBehavior={true} />
                            <Button icon="trash" type="default" />
                            <Button icon="close" type="danger" />
                        </div>
                    </div>
                    <div className="form-container">
                        <Form formData={udt} colCount={6} labelLocation="top" >
                            <SimpleItem dataField="TableName" editorType="dxTextBox" label={{ text: 'Tablo Adı' }} />
                            <SimpleItem dataField="TableDescription" editorType="dxTextBox" label={{ text: 'Açıklama' }} />
                            <SimpleItem dataField="TableType" editorType="dxSelectBox" editorOptions={tableTypeOptions} label={{ text: 'Tablo Tipi' }} />
                        </Form>
                        <Form formData={udo} colCount={6} labelLocation="top" >
                            <SimpleItem dataField="Code" editorType="dxTextBox" label={{ text: 'Kod' }} />
                            <SimpleItem dataField="Name" editorType="dxTextBox" label={{ text: 'Açıklama' }} />
                            <SimpleItem dataField="TableName" editorType="dxTextBox" label={{ text: 'Tablo Adı' }} />
                            <SimpleItem dataField="ObjectType" editorType="dxSelectBox" editorOptions={objectTypeOptions} label={{ text: 'Obje Tipi' }} />
                        </Form>
                    </div>
                    <Button onClick={togglePopup} text='Tablo Bağla' />
                    <div className="grid-container">
                        <DataGrid dataSource={udf} showBorders={true} >
                            <Editing
                                mode="form"
                                allowUpdating={true}
                                allowDeleting={true}
                                allowAdding={true} />
                            <Column dataField="Name" caption="Alan Adı" />
                            <Column dataField="Description" caption="Açıklama" />
                            <Column dataField="Type" caption="Alan Tipi" >
                                <Lookup dataSource={fieldType} displayExpr="Value" valueExpr="Key" />
                            </Column>
                            <Column dataField="SubType" caption='Alt Tip'>
                                <Lookup dataSource={subType} displayExpr="Value" valueExpr="Key" />
                            </Column>
                            <Column dataField="Size" caption="Boyut" />
                            <Column dataField="TableName" caption="Tablo Adı" />
                            <Column dataField="DefaultValue" caption="Varsayılan Değer" />
                        </DataGrid>
                    </div>
                </form>
            </div>
            <Popup
                //  titleRender={renderTitle}
                visible={isPopupVisible}
                hideOnOutsideClick={true}
                onHiding={togglePopup}
            >
                <BindTablePopup></BindTablePopup>
            </Popup>
        </div>

    )

}

export default CreateUdo