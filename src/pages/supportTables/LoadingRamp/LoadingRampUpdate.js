import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../../store/appSlice';
import { useDispatch } from 'react-redux';
import Header from '../../../components/myComponents/Header';
const tableName = "SML_LDN_RMP";

function LoadingRampUpdate({ id, onBack }) {
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
        <div>
            <div className="page-container">
                <form>
                    <Header save={true} trash={true} isDelete={dataField} title={"Yükleme Rampası Güncelle"} nav={'/loadingRampHome'} tableName={tableName} formData={dataField} onBack={onBack} formMode={'Update'} id={id}></Header>
                    <div className="form-container">
                        <Form formData={dataField} colCount={6} labelLocation="top" >
                            <SimpleItem dataField="U_RampName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ranpa' }} />
                         
                        </Form>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoadingRampUpdate