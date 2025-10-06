import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../../store/appSlice';
import { useDispatch } from 'react-redux';
import Header from '../../../components/myComponents/Header';
import { formData, phoneOptions } from './data/data';
import { Popup } from 'devextreme-react';
import ZoomLayout from '../../../components/myComponents/ZoomLayout';
import { businessPartnersColumns, businessPartnersFilters } from '../../../data/zoomLayoutData';
const tableName = "SML_BAS_DRV";

function DriverUpdate({ id, onBack }) {
    const [dataField, setDataField] = useState(null);
    const cardSector = [["Industry", "=", 8],["CardType","=","cSupplier"]]
    const handleRowSelection = (selectedRowData) => {
        setSelectedCardCode(selectedRowData.CardCode);
        dataField.U_CardName=selectedRowData.CardName;
        setPopupVisibility(false);
    };
    const textBoxWithButtonOptions = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    togglePopup();
                }
            }
        }]
    };
    const dispatch = useDispatch();
    useEffect(() => {
        firstLoad();
    }, [])
    const firstLoad = async () => {
        await dispatch(getItemById({ tableName: tableName, id: id })).then((result) => {
            if (result.payload) {
                setDataField(result.payload);
                setSelectedCardCode(result.payload.U_CardCode)
            }
        })
        sessionStorage.setItem('activeComponent', null)
    }
    const [isPopupVisible, setPopupVisibility] = useState(false);
    const togglePopup = () => {
        setPopupVisibility(!isPopupVisible);
    };
    const [selectedCardCode, setSelectedCardCode] = useState(null);

    return (
        <div>
            <div className="page-container">
                <form>
                    <Header save={true} trash={true} isDelete={dataField} title={"Şöför Güncelle"} nav={'/driverome'} tableName={tableName} formData={dataField} onBack={onBack} formMode={'Update'} id={id}></Header>
                    <div className="form-container">
                        <Form formData={dataField} colCount={5} labelLocation="top" >
                            <SimpleItem dataField="U_Name" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ad' }} />
                            <SimpleItem dataField="U_Surname" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Soyad' }} />
                            <SimpleItem dataField="U_IdentityNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'TC Kimlik No' }} />
                            <SimpleItem dataField="U_PlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Plaka Kodu' }} />
                            <SimpleItem dataField="U_TrailerPlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka Kodu' }} />
                            <SimpleItem dataField="U_Phone1" editorType="dxTextBox" editorOptions={phoneOptions} cssClass="transparent-bg" label={{ text: 'Telefon 1' }} />
                            <SimpleItem dataField="U_Phone2" editorType="dxTextBox" editorOptions={phoneOptions} cssClass="transparent-bg" label={{ text: 'Telefon 2' }} />
                            <SimpleItem editorOptions={{ ...textBoxWithButtonOptions, value: selectedCardCode }} dataField="U_CardCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Nakliyeci' }} />
                            {/* <SimpleItem dataField="U_Attachments" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ekler' }} /> */}
                            <SimpleItem dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap Adı' }} />
                        </Form>
                    </div>
                </form>
            </div>
            <Popup
                title='Nakliyeciler'
                visible={isPopupVisible}
                hideOnOutsideClick={true}
                onHiding={togglePopup}
                showCloseButton={true}
                 height="auto"
            >
                <ZoomLayout onRowSelected={handleRowSelection} tableName={"BusinessPartners"} tableKey={"CardCode"} customFilter={cardSector} filters={businessPartnersFilters} columns={businessPartnersColumns}></ZoomLayout>
            </Popup>
        </div>
    )
}

export default DriverUpdate