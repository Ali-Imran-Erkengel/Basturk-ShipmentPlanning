import { Form, GroupItem, Item, SimpleItem } from 'devextreme-react/form'
import React, { useEffect, useState } from 'react'
import { getItemById } from '../../../store/appSlice';
import { useDispatch } from 'react-redux';
import Header from '../../../components/myComponents/Header';
import { DataGrid, Editing, Column, Lookup } from 'devextreme-react/data-grid';
import { formData, phoneOptions } from './data/data';
import { TabPanel } from 'devextreme-react/tab-panel';

const tableName = "SML_BAS_VHL";
function VehicleView({ id, onBack }) {
    const [dataField, setDataField] = useState(formData);
    const [trailerType, setTrailerType] = useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        firstLoad();
    }, [])
    const firstLoad = async () => {
        await dispatch(getItemById({ tableName: tableName, id: id })).then((result) => {
            if (result.payload) {
                setDataField(result.payload);
                getTrailerFirstLoad({ id: result.payload.U_TrailerType });
            }
        })
        sessionStorage.setItem('activeComponent', null)
    }
    const driverOptions = {
        dataSource: dataField,
        displayExpr: (item) => {
            if (item) {
                return `${item.U_Name} ${item.U_MiddleName} ${item.U_Surname}`;
            }
            return '-';
        },
        valueExpr: 'DocEntry',


    };
    const getTrailerFirstLoad = async ({ id }) => {
        const trailer = await dispatch(getItemById({ tableName: "SML_TRL_TYPE", id: id }))
        if (trailer.payload) {
            setTrailerType(trailer.payload.U_Trailer);
        }
    }
    return (
        <div >
            <div className="page-container">
                <form>
                    <Header save={false} trash={false} title={"Araç Görüntüle"} onBack={onBack} nav={'/vehicleHome'}></Header>
                    <div className="form-container">
                        {/* <Form formData={dataField} colCount={6} labelLocation="top"  >
                            <SimpleItem dataField="U_Vehicle" editorType="dxTextBox" editorOptions={{ disabled: true }} cssClass="transparent-bg" label={{ text: 'Araç' }} />
                            <SimpleItem dataField="U_PlateCode" editorType="dxTextBox" editorOptions={{ disabled: true }} cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                            <SimpleItem dataField="U_VehicleCode" editorType="dxTextBox" editorOptions={{ disabled: true }} cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />
                            <SimpleItem dataField="U_VehicleType" editorType="dxTextBox" editorOptions={{ disabled: true }} cssClass="transparent-bg" label={{ text: 'Araç Tipi' }} />
                            <SimpleItem  editorType="dxTextBox" editorOptions={{ disabled: true,value:trailerType }} cssClass="transparent-bg" label={{ text: 'Dorse Tipi' }} />
                        </Form> */}
                          <TabPanel deferRendering={false}>
                            <Item title="Araç Bilgileri">
                                <Form formData={dataField}  labelLocation="top">
                                    <GroupItem colCount={3}>
                                        <GroupItem colCount={1}>
                                            <SimpleItem dataField="U_PlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
                                            <SimpleItem dataField="U_TrailerPlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Plaka' }} />
                                            <SimpleItem dataField="U_VehicleType" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Araç Tipi' }} />
                                            <SimpleItem dataField="U_TrailerType" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Dorse Tipi' }} />
                                        </GroupItem>
                                    </GroupItem>
                                </Form>
                            </Item>
                            <Item title="Şoför Bilgileri">
                                <Form formData={dataField} labelLocation="top">
                                    <GroupItem colCount={3} >
                                        <GroupItem colCount={1}>
                                            <SimpleItem dataField="U_Name" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Ad' }} />
                                            <SimpleItem dataField="U_Surname" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Soyad' }} />
                                            <SimpleItem dataField="U_IdentityNo" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'TC Kimlik No' }} />
                                            <SimpleItem  dataField="U_CardCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Nakliyeci Kodu' }} />
                                            <SimpleItem dataField="U_CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Nakliyeci Adı' }} />
                                            <SimpleItem dataField="U_Phone1" editorOptions={phoneOptions} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 1' }} />
                                            <SimpleItem dataField="U_Phone2" editorOptions={phoneOptions} editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Telefon 2' }} />

                                        </GroupItem>
                                    </GroupItem>
                                </Form>
                            </Item>
                        </TabPanel>
                    </div>
                    {/* <div className="grid-container">
                        <DataGrid disabled={true} dataSource={dataField.SML_VHL_DRVCollection} showBorders={true} >
                            <Editing
                                mode="form"
                                allowUpdating={true}
                                allowDeleting={true}
                                allowAdding={true} />
                            <Column dataField="U_DriverId" editorOptions={driverOptions} caption='Şöför'>
                                <Lookup displayExpr="U_Name" />
                            </Column>
                            <Column dataField="U_BeginDate" format="dd/MM/yyyy" dataType='date' caption="BaşlangıçTarihi" />
                            <Column dataField="U_EndDate" format="dd/MM/yyyy" dataType='date' caption="Bitiş Tarihi" />
                        </DataGrid>
                    </div> */}
                </form>
            </div>

        </div>
    )
}

export default VehicleView