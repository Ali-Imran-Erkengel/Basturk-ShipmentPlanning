import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Editing, Paging } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { useDispatch } from 'react-redux';
import { Form, SimpleItem } from 'devextreme-react/form';
import notify from 'devextreme/ui/notify';
import Header from '../../../../components/myComponents/Header';

import { addData, getBpSeries, getItemById } from '../../../../store/appSlice';
import { Box, Popup } from 'devextreme-react';
import ZoomLayout from '../../../../components/myComponents/ZoomLayout';
import { bankColumns, bankFilters, industryColumns, industryFilters } from '../../../../data/zoomLayoutData';
import CreateBankAccount from './CreateBankAccount';
import { BPTypes, businessPartnersData } from '../data/data';
import { getIBAN, selectAfterAccount, selectAfterIban } from '../../../../store/shipmentSlice';
import { getSlpCodes } from '../../../../store/logisticsSlice';

function OpenBusinessPartners({ dataAddAfter }) {
    const handleNotify = ({ message, type }) => {
        notify(
            {
                message: message,
                width: 720,
                position: {
                    at: "bottom",
                    my: "bottom",
                    of: "#container"
                }
            },
            type,
            1500
        );
    }
    const tableName = "BusinessPartners";
    const industryFilter = ["IndustryCode", "<>", -1]
    const [dataSource, setDataSource] = useState({ ...businessPartnersData });
    const dispatch = useDispatch();
    const [isPopupVisibleBank, setPopupVisibilityBank] = useState(false);
    const [isPopupVisibleSector, setPopupVisibilitySector] = useState(false);
    const [selectedBankCode, setSelectedBankCode] = useState()
    const [selectedSector, setSelectedSector] = useState()
    const [ibanOptions, setIbanOptions] = useState();
    const [bankAccountOptions, setBankAccountOptions] = useState();
    const [bankKey, setBankKey] = useState();
    const [cardCode, setCardCode] = useState();
    const [isPopupVisibleBankAccount, setPopupVisibilityBankAccount] = useState(false);

    useEffect(() => {
         getNextSeries();
        
    }, [])
const getNextSeries=async()=>{
    const bpSeries=await getBpSeries();
    let seriesnum=bpSeries[0].BeginStr+bpSeries[0].NextNumber+bpSeries[0].EndStr;
        setCardCode(seriesnum)

}
    const togglePopupBank = () => {
        setPopupVisibilityBank(!isPopupVisibleBank);
    };
    const handleRowSelectionBank = async (selectedRowData) => {
        setSelectedBankCode(selectedRowData.BankCode);
        const ibans = await getIBAN({ bankCode: selectedRowData.BankCode });
        const ibanArray = ibans.map(item => ({
            Key: item.IBAN,
            Value: item.IBAN
        }));
        setIbanOptions({
            items: ibanArray,
            displayExpr: 'Value',
            valueExpr: 'Key',
            onValueChanged: handleIbanChange
        });
        const accountArray = ibans.map(item => ({
            Key: item.AccNo,
            Value: item.AccNo
        }));
        setBankAccountOptions({
            items: accountArray,
            displayExpr: 'Value',
            valueExpr: 'Key',
            onValueChanged: handleAccountChange
        });
        setBankKey(selectedRowData.AbsoluteEntry);
        setPopupVisibilityBank(false);
    };

    const textBoxWithButtonOptionsBank = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    togglePopupBank();
                }
            }
        }]
    };


    const togglePopupSector = () => {
        setPopupVisibilitySector(!isPopupVisibleSector);
    };
    const handleRowSelectionSector = (selectedRowData) => {
        setSelectedSector(selectedRowData.IndustryCode);
        setPopupVisibilitySector(false);
    };

    const textBoxWithButtonOptionsSector = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    togglePopupSector();
                }
            }
        }]
    };





    const handleSave = async () => {
        if (dataSource != null) {
            const result = await dispatch(addData({ tableName: tableName, formData: dataSource }))
            if (result.payload) {
                setDataSource({ ...businessPartnersData });
                setSelectedBankCode(null);
                setSelectedSector(null);
                dataAddAfter();
            }
        }

    };
    const cancel = () => {
        setDataSource({ ...businessPartnersData });
        setSelectedBankCode(null);
        setSelectedSector(null);
        dataAddAfter();
    }
    const togglePopupBankAccount = () => {
        if (selectedBankCode) {
            setPopupVisibilityBankAccount(!isPopupVisibleBankAccount);

        } else {
            handleNotify({ message: "Lütfen Önce Hesap Oluşturacağınız Bankayı Seçiniz", type: "error" })
        }
    }
    const bankAccountAddAfter = async () => {
        if (selectedBankCode) {
            const ibans = await getIBAN({ bankCode: selectedBankCode });
            const ibanArray = ibans.map(item => ({
                Key: item.IBAN,
                Value: item.IBAN
            }));
            setIbanOptions({
                items: ibanArray,
                displayExpr: 'Value',
                valueExpr: 'Key',
                onValueChanged: handleIbanChange
            });
            const accountArray = ibans.map(item => ({
                Key: item.AccNo,
                Value: item.AccNo
            }));
            setBankAccountOptions({
                items: accountArray,
                displayExpr: 'Value',
                valueExpr: 'Key',
                onValueChanged: handleAccountChange
            });
        }
        setPopupVisibilityBankAccount(false);
    };
    const validationRules = {
        position: [{ type: 'required', message: 'Position is required.' }],
        hireDate: [{ type: 'required', message: 'Hire Date is required.' }],
    };
    const bpTypeOptions = {
        dataSource: BPTypes,
        displayExpr: 'Value',
        valueExpr: 'Key'
    };

    const handleIbanChange = async (e) => {
        if (e.value) {

            const account = await selectAfterIban({ bankCode: dataSource.HouseBank, iban: e.value });

            setDataSource(prevState => ({
                ...prevState,
                HouseBankAccount: account[0].AccNo
            }));
        }
    };
    const handleAccountChange = async (e) => {
        if (e.value) {

            const account = await selectAfterAccount({ bankCode: dataSource.HouseBank, account: e.value });
            setDataSource(prevState => ({
                ...prevState,
                HouseBankIBAN: account[0].IBAN
            }));
        }
    };
    return (
        <>
            <form>
                {/* <Header save={true} trash={false} title={"Sevkiyat Planı Oluştur"} nav={'/shipmentHome'} tableName={tableName} formData={dataSource} onBack={onBack} formMode={'Add'} ></Header> */}
                <div className="form-container">
                    <Form formData={dataSource} colCount={4} labelLocation="top">
                        <SimpleItem editorType="dxTextBox" editorOptions={{disabled:true, value: cardCode }} cssClass="transparent-bg" label={{ text: 'Muhatap Kodu' }} />
                        <SimpleItem dataField="CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Muhatap Adı' }} />
                        {/* <SimpleItem dataField="CardType" editorOptions={{bpTypeOptions}} editorType="dxSelectBox" cssClass="transparent-bg" label={{ text: 'Tipi' }} /> */}
                        {/* <SimpleItem dataField="CardType" editorOptions={{bpTypeOptions}} editorType="dxSelectBox" cssClass="transparent-bg" label={{ text: 'Tipi' }} /> */}
                        {/* <SimpleItem dataField="Industry" editorOptions={{ ...textBoxWithButtonOptionsSector, value: selectedSector }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Sektör' }} /> */}
                        <SimpleItem dataField="FederalTaxID" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'TC Kimlik No' }} />
                        <SimpleItem dataField="AdditionalID" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Vergi Dairesi' }} />
                        <SimpleItem dataField="HouseBank" editorOptions={{ ...textBoxWithButtonOptionsBank, value: selectedBankCode }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Banka Kodu' }} />
                        <SimpleItem dataField="HouseBankAccount" editorType="dxSelectBox" editorOptions={bankAccountOptions} /*validationRules={validationRules.position}*/ label={{ text: 'Banka Hesabı' }}></SimpleItem>
                        <SimpleItem dataField="HouseBankIBAN" editorType="dxSelectBox" editorOptions={ibanOptions} label={{ text: 'IBAN' }}></SimpleItem>
                        {/* <SimpleItem dataField="HouseBankIBAN"editorOptions={ibanOptions}  editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'IBAN' }} /> */}
                        <SimpleItem dataField="Phone1" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon' }} />

                    </Form>
                </div>
            </form>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: 10,
            }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <Button
                        text="Kaydet"
                        onClick={handleSave}
                        style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            marginTop: 10,
                        }}
                    />
                    <Button
                        text="İptal"
                        onClick={() => cancel()}
                        style={{
                            backgroundColor: '#ea110b',
                            color: '#fff',
                            marginTop: 10,
                        }}
                    />
                </div>

                <Button
                    text="Yeni Banka Hesabı Ekle"
                    onClick={() => togglePopupBankAccount()}
                    style={{
                        backgroundColor: '#36a3de',
                        color: '#fff',
                        marginTop: 10,
                    }}
                />
            </div>
            <Popup
                visible={isPopupVisibleBank}
                hideOnOutsideClick={true}
                onHiding={togglePopupBank}
                title='Bankalar'
                showCloseButton={true}
            >
                <ZoomLayout onRowSelected={handleRowSelectionBank} tableName={"Banks"} tableKey={"BankCode"} notDeleted={""} filters={bankFilters} columns={bankColumns}></ZoomLayout>
            </Popup>
            <Popup
                visible={isPopupVisibleSector}
                hideOnOutsideClick={true}
                onHiding={togglePopupSector}
                title='Sektör'
                showCloseButton={true}
            >
                <ZoomLayout onRowSelected={handleRowSelectionSector} tableName={"Industries"} tableKey={"IndustryCode"} notDeleted={industryFilter} filters={industryFilters} columns={industryColumns}></ZoomLayout>
            </Popup>
            <Popup
                visible={isPopupVisibleBankAccount}
                hideOnOutsideClick={false}
                onHiding={togglePopupBankAccount}
                title='Banka Hesabı Oluştur'
                fullScreen={false}
                showCloseButton={false}
                height="auto"
            >

                <CreateBankAccount dataAddAfter={bankAccountAddAfter} bankCode={selectedBankCode} bankKey={bankKey}></CreateBankAccount>
            </Popup>
        </>
    );
}

export default OpenBusinessPartners;
