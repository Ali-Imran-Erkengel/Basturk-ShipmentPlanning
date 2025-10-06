import { Form, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/myComponents/Header';
import { formData as initialFormData, phoneOptions } from './data/data';
import { Popup } from 'devextreme-react/popup';
import ZoomLayout from '../../../components/myComponents/ZoomLayout';
import { businessPartnersColumns, businessPartnersFilters, itemsColumns, itemsFilters } from '../../../data/zoomLayoutData';
import { TextBox } from 'devextreme-react/text-box';
const tableName = "SML_BAS_DRV";

function DriverAdd({ onBack }) {
    const [formData, setFormData] = useState({ ...initialFormData });

    useEffect(() => {
        setFormData({ ...initialFormData });
    }, []);
    const handleRowSelection = (selectedRowData) => {
        setSelectedCardCode(selectedRowData.CardCode);
        formData.U_CardName=selectedRowData.CardName;
        setPopupVisibility(false);
    };
    
    const cardSector = [["Industry", "=", 8],["CardType","=","cSupplier"]]
    const [selectedCardCode, setSelectedCardCode] = useState(formData.U_CardCode || '');
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
    const [isPopupVisible, setPopupVisibility] = useState(false);
    const togglePopup = () => {
        setPopupVisibility(!isPopupVisible);
    };


    return (
        <div >
            <div className="page-container">
                <form >
                    <Header save={true} trash={false} title={"Şöför Ekle"} nav={'/driverHome'} tableName={tableName} formData={formData} onBack={onBack} formMode={'Add'} ></Header>
                    <div className="form-container">
                        <Form formData={formData} colCount={5} labelLocation="top" >
                            <SimpleItem dataField="U_Name" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ad' }} />
                            <SimpleItem dataField="U_Surname" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Soyad' }} />
                            <SimpleItem dataField="U_IdentityNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'TC Kimlik No' }} />
                            <SimpleItem dataField="U_PlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Plaka Kodu' }} />
                            <SimpleItem dataField="U_TrailerPlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka Kodu' }} />
                            <SimpleItem dataField="U_Phone1" editorOptions={phoneOptions} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 1' }} />
                            <SimpleItem dataField="U_Phone2" editorOptions={phoneOptions} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 2' }} />
                            <SimpleItem editorOptions={{ ...textBoxWithButtonOptions, value: selectedCardCode }} dataField="U_CardCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Nakliyeci' }} />
                            <SimpleItem dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap Adı' }} />

                            {/* <SimpleItem dataField="U_Attachments" editorType='dxFileUploader' editorOptions={{ accept: "*", uploadMode: "useForm", }} cssClass="transparent-bg" label={{ text: 'Ekler' }} /> */}
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
                {/* <ZoomLayout onRowSelected={handleRowSelection} tableName={"Items"} tableKey={"ItemCode"} customFilter={""} filters={itemsFilters} columns={itemsColumns}></ZoomLayout> */}
            </Popup>
        </div>
    )
}

export default DriverAdd