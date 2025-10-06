import React, { useState } from 'react';
import { Button } from 'devextreme-react/button';
import { useDispatch } from 'react-redux';
import { Form, SimpleItem } from 'devextreme-react/form';
import notify from 'devextreme/ui/notify';

import { addData } from '../../../../store/appSlice';
import { Popup } from 'devextreme-react';
import ZoomLayout from '../../../../components/myComponents/ZoomLayout';
import { GLAccountColumns, GLAccountFilters } from '../../../../data/zoomLayoutData';
import { glAccountsData } from '../data/data';

function CreateBankAccount({ dataAddAfter, bankCode, bankKey }) {
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
    const tableName = "HouseBankAccounts";
    const glaccountsFilter = [
        ["ActiveAccount", "=", "tYES"],
        ["LockManualTransaction", "<>", "tYES"]
    ]
    const [dataSource, setDataSource] = useState({ ...glAccountsData });
    const dispatch = useDispatch();
    const [isPopupVisibleGLAccount, setPopupVisibilityGLAccount] = useState(false);
    const [selectedGLAccount, setSelectedGLAccount] = useState()
    const togglePopupGLAccount = () => {
        setPopupVisibilityGLAccount(!isPopupVisibleGLAccount);
    };
    const handleRowSelectionGLAccount = async (selectedRowData) => {
        setSelectedGLAccount(selectedRowData.Code);
        setPopupVisibilityGLAccount(false);
    };

    const textBoxWithButtonOptionsGLAccount = {

        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => {
                    togglePopupGLAccount();
                }
            }
        }]
    };
    const handleSave = async () => {
        if (dataSource != null) {
            const result = await dispatch(addData({ tableName: tableName, formData: dataSource }))
            if (result.payload) {
                setDataSource({ ...glAccountsData });
                setSelectedGLAccount(null);
                dataAddAfter();
            }
        }
    };
    const cancel = () => {
        setDataSource({ ...glAccountsData });
        setSelectedGLAccount(null);
        dataAddAfter();
    }
    return (
        <>
            <form>
                <div className="form-container">
                    <Form formData={dataSource} colCount={3} labelLocation="top">
                        <SimpleItem dataField="BankKey" editorType="dxTextBox" editorOptions={{ value: bankKey, disabled: true }} cssClass="transparent-bg" label={{ text: 'Banka ID' }} />
                        <SimpleItem dataField="BankCode" editorType="dxTextBox" editorOptions={{ value: bankCode, disabled: true }} cssClass="transparent-bg" label={{ text: 'Banka Kodu' }} />
                        <SimpleItem dataField="AccNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Hesap Kodu' }} />
                        <SimpleItem dataField="AccountName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Banka Hesap Adı' }} />
                        <SimpleItem dataField="GLAccount" editorOptions={{ ...textBoxWithButtonOptionsGLAccount, value: selectedGLAccount }} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Defteri Kebir Hesabı' }} />
                        <SimpleItem dataField="IBAN" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'IBAN' }} />
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
                        onClick={handleSave}
                        style={{
                            backgroundColor: '#28a745',
                            color: '#fff',
                            marginTop: 10,
                        }}
                        text="Kaydet"></Button>
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
            </div>

            <Popup
                visible={isPopupVisibleGLAccount}
                hideOnOutsideClick={true}
                onHiding={togglePopupGLAccount}
                title='Defteri Kebir Hesapları'
                showCloseButton={true}
            >
                <ZoomLayout onRowSelected={handleRowSelectionGLAccount} tableName={"ChartOfAccounts"} tableKey={"Code"} customFilter={glaccountsFilter} filters={GLAccountFilters} columns={GLAccountColumns}></ZoomLayout>
            </Popup>

        </>
    );
}

export default CreateBankAccount;
