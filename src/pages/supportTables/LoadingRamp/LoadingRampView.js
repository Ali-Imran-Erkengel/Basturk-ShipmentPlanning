import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../../store/appSlice';
import { useDispatch } from 'react-redux';
import Header from '../../../components/myComponents/Header';

const tableName = "SML_LDN_RMP";
function LoadingRampView({ id, onBack }) {
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
                    <Header save={false} trash={false} title={"Yükleme Rampası Görüntüle"} onBack={onBack} nav={'/loadingRampHome'}></Header>
                    <div className="form-container">
                        <Form formData={dataField} colCount={6} labelLocation="top" >
                            <SimpleItem dataField="U_RampName" editorType="dxTextBox" editorOptions={{disabled:true}} cssClass="transparent-bg" label={{ text: 'Rampa' }} />
                        </Form>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default LoadingRampView