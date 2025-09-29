import React, { useEffect, useState } from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { Popup } from 'devextreme-react/popup';
import { Form, GroupItem, SimpleItem } from 'devextreme-react/form';
import Header from '../../../components/myComponents/Header';
import ZoomLayout from '../../../components/myComponents/ZoomLayout';
import { getAplatz } from '../../../store/terminalSlice';
import { binLocationColumns, binLocationFilters } from '../../../data/zoomLayoutData';
import { useDispatch } from 'react-redux';
import { addData, createODataSource, updateData } from '../../../store/appSlice';
import { Grid } from '@mui/material';


function AplatzBinLocation() {
    const tableName = "SML_APL_BIN";
    const tableKey = "DocEntry";
    const dispatch = useDispatch();

    const [dataSource, setDataSource] = useState(null);
    const [aplatzData, setAplatzData] = useState([]);
    const [isPopupVisible, setPopupVisible] = useState(false);
    const [isPopupVisibleBin, setPopupVisibilityBin] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formState, setFormState] = useState({
        U_APLATZ_ID: '',
        U_BinEntry: '',
        U_BinCode: ''
    });

    useEffect(() => {
        const ds = createODataSource(tableName, tableKey);
        setDataSource(ds);
    }, []);

    useEffect(() => {
        const fetchAplatz = async () => {
            const data = await getAplatz();
            setAplatzData(data);
        };
        fetchAplatz();
    }, []);

    const aplatzOptions = {
        dataSource: aplatzData,
        displayExpr: 'BEZ',
        valueExpr: 'APLATZ_ID',
        value: formState.U_APLATZ_ID,
        onValueChanged: (e) => setFormState(prev => ({ ...prev, U_APLATZ_ID: e.value }))
    };

    const textBoxWithButtonOptionsBin = {
        buttons: [{
            name: "customButton",
            location: "after",
            options: {
                icon: "search",
                onClick: () => setPopupVisibilityBin(true)
            }
        }]
    };

    const handleBinSelection = (selectedRowData) => {
        setFormState(prev => ({
            ...prev,
            U_BinEntry: selectedRowData.AbsEntry,
            U_BinCode: selectedRowData.BinCode
        }));
        setPopupVisibilityBin(false);
    };

    const openNewPopup = () => {
        setFormState({ U_APLATZ_ID: '', U_BinEntry: '', U_BinCode: '' });
        setIsEditMode(false);
        setPopupVisible(true);
    };

    const openEditPopup = () => {
        if (!selectedItem) {
            alert('Lütfen güncellemek için bir satır seçin.');
            return;
        }
        dataSource.store().byKey(selectedItem).then(row => {
            setFormState({
                U_APLATZ_ID: row.U_APLATZ_ID,
                U_BinEntry: row.U_BinEntry,
                U_BinCode: row.U_BinCode,
                DocEntry: row.DocEntry
            });
            setIsEditMode(true);
            setPopupVisible(true);
        });
    };
    const handleSave = () => {
        if (!formState.U_APLATZ_ID || !formState.U_BinEntry) {
            alert('Lütfen depo yeri ve hat seçin');
            return;
        }

        if (isEditMode) {
            dispatch(updateData({tableName: tableName, id:formState.DocEntry ,updatedData: formState }));
        } else {
            dispatch(addData({ tableName, formData: formState }));
        }

        setFormState({ U_APLATZ_ID: '', U_BinEntry: '', U_BinCode: '' });
        setPopupVisible(false);
        dataSource.reload()
    };

    return (
        <div className="page-container">
            <Header save={false} trash={false} title="Hat-Depo Yeri" />

            <Grid container spacing={1} paddingBottom={2}>
                <Grid item>
                    <Button icon='rename' type="success"  onClick={openEditPopup} />
                </Grid>
                <Grid item>
                    <Button icon='add' type="success"  onClick={openNewPopup} />
                </Grid>
            </Grid>

            <DataGrid
                selection={true}
                dataSource={dataSource }
                keyExpr="DocEntry"
                onSelectionChanged={(e) => setSelectedItem(e.selectedRowsData[0]?.DocEntry)}
            >
                <Column dataField="U_APLATZ_ID" caption="Hat Kodu" />
                <Column dataField="U_BinEntry" caption="Depo Yeri Entry" />
                <Column dataField="U_BinCode" caption="Depo Yeri" />
            </DataGrid>

            <Popup
                visible={isPopupVisible}
                onHiding={() => setPopupVisible(false)}
                showCloseButton
                title={isEditMode ? "Kaydı Güncelle" : "Yeni Kayıt Ekle"}
            >
                <div style={{ padding: 20 }}>
                    <Form formData={formState}>
                        <GroupItem colCount={3}>
                            <SimpleItem dataField="U_APLATZ_ID" editorType="dxSelectBox" editorOptions={aplatzOptions} label={{ text: 'Hat' }} />
                            <SimpleItem dataField="U_BinEntry" editorType="dxTextBox" editorOptions={{ ...textBoxWithButtonOptionsBin, value: formState.U_BinEntry }} label={{ text: 'Depo Yeri Entry' }} />
                            <SimpleItem dataField="U_BinCode" editorType="dxTextBox" editorOptions={{ value: formState.U_BinCode, disabled: true }} label={{ text: 'Depo Yeri' }} />
                        </GroupItem>
                    </Form>
                    <Button text={isEditMode ? "Güncelle" : "Kaydet"} type="success" onClick={handleSave} />
                </div>
            </Popup>

            <Popup
                visible={isPopupVisibleBin}
                hideOnOutsideClick={true}
                onHiding={() => setPopupVisibilityBin(false)}
            >
                <ZoomLayout
                    onRowSelected={handleBinSelection}
                    tableName="BinLocations"
                    tableKey="AbsEntry"
                    filters={binLocationFilters}
                    columns={binLocationColumns}
                />
            </Popup>
        </div>
    );
}

export default AplatzBinLocation;
