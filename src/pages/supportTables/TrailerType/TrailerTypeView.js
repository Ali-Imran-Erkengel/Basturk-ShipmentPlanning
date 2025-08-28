import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../../store/appSlice';
import { useDispatch } from 'react-redux';
import Header from '../../../components/myComponents/Header';

const tableName = "SML_TRL_TYPE";
function TrailerTypeView({ id, onBack }) {
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
                    <Header save={false} trash={false} title={"Dorse Tipi Görüntüle"} onBack={onBack} nav={'/trailerTypeHome'}></Header>
                    <div className="form-container">
                        <Form formData={dataField} colCount={6} labelLocation="top" >
                            <SimpleItem dataField="U_Trailer" editorType="dxTextBox" editorOptions={{disabled:true}} cssClass="transparent-bg" label={{ text: 'Dorse Tipi' }} />
                        </Form>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default TrailerTypeView