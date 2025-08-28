import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/myComponents/Header';
import {formData as initialFormData } from './data/data';
const tableName = "SML_TRL_TYPE";

function TrailerTypeAdd({ onBack }) {
    const [formData, setFormData] = useState({ ...initialFormData });

    useEffect(() => {
        setFormData({ ...initialFormData });
    }, []);
    return (
        <div >
            <div className="page-container">
                <form >
                    <Header save={true} trash={false} title={"Dorse Tipi Ekle"} nav={'/trailerTypeHome'} tableName={tableName} formData={formData} onBack={onBack} formMode={'Add'} ></Header>
                    <div className="form-container">
                        <Form formData={formData} colCount={6} labelLocation="top" >
                            <SimpleItem dataField="U_Trailer" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Tipi' }} />
                        </Form>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default TrailerTypeAdd