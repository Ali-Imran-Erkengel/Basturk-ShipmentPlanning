import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/myComponents/Header';
import {formData as initialFormData } from './data/data';
const tableName = "SML_LDN_RMP";

function LoadingRampAdd({ onBack }) {
    const [formData, setFormData] = useState({ ...initialFormData });

    useEffect(() => {
        setFormData({ ...initialFormData });
    }, []);
    return (
        <div >
            <div className="page-container">
                <form >
                    <Header save={true} trash={false} title={"Yükleme Rampası Ekle"} nav={'/loadingRampHome'} tableName={tableName} formData={formData} onBack={onBack} formMode={'Add'} ></Header>
                    <div className="form-container">
                        <Form formData={formData} colCount={6} labelLocation="top" >
                            <SimpleItem dataField="U_RampName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Rampa' }} />
                        </Form>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoadingRampAdd