import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../../store/appSlice';
import { useDispatch } from 'react-redux';
import Header from '../../../components/myComponents/Header';
import { phoneOptions } from './data/data';

const tableName = "SML_BAS_DRV";
function DriverView({ id, onBack }) {
    const [dataField, setDataField] = useState(null);

    const dispatch = useDispatch();
    useEffect(() => {
        firstLoad();
    }, [])
    const firstLoad = async () => {
        await dispatch(getItemById({ tableName: tableName, id: id })).then((result) => {
            if (result.payload) {
                setDataField(result.payload);
            }
        })
        sessionStorage.setItem('activeComponent', null)
    }
    return (
        <div >
            <div className="page-container">
                <form>
                    <Header save={false} trash={false} title={"Şöför Görüntüle"} onBack={onBack} nav={'/driverHome'}></Header>
                    <div className="form-container">
                        <Form formData={dataField} colCount={5} labelLocation="top" >
                            <SimpleItem dataField="U_Name" editorType="dxTextBox" editorOptions={{disabled:true}} cssClass="transparent-bg" label={{ text: 'Ad' }} />
                            <SimpleItem dataField="U_Surname" editorType="dxTextBox" editorOptions={{disabled:true}}cssClass="transparent-bg" label={{ text: 'Soyad' }} />
                            <SimpleItem dataField="U_IdentityNo" editorType="dxTextBox" editorOptions={{disabled:true}}cssClass="transparent-bg" label={{ text: 'TC Kimlik No' }} />
                            <SimpleItem dataField="U_PlateCode" editorType="dxTextBox" editorOptions={{disabled:true}} cssClass="transparent-bg" label={{ text: 'Plaka Kodu' }} />
                            <SimpleItem dataField="U_TrailerPlateCode" editorType="dxTextBox" editorOptions={{disabled:true}} cssClass="transparent-bg" label={{ text: 'Dorse Plaka Kodu' }} />
                            <SimpleItem dataField="U_Phone1" editorOptions={{...phoneOptions,disabled:true}} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 1' }} />
                            <SimpleItem dataField="U_Phone2" editorOptions={{...phoneOptions,disabled:true}} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 2' }} />
                            <SimpleItem dataField="U_CardCode" editorType="dxTextBox" editorOptions={{disabled:true}}cssClass="transparent-bg" label={{ text: 'Nakliyeci' }} />
                            <SimpleItem dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap Adı' }} />
                            {/* <SimpleItem dataField="U_Attachments" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ekler' }} /> */}
                        </Form>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default DriverView