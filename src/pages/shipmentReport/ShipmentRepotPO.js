import React, { useEffect, useState } from 'react';
import DataGrid, { Column, MasterDetail } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { useDispatch } from 'react-redux';
import DetailTemplate from './DetailTemplate';
import { getFirstWghVehicle, getLoadedDetails, getLogisticHeader, getLogisticWaiting, getShipmentHeader, getShipmentItemNonPlanned, getShipmentWaiting, getVehicleWaiting, printShipmentDetail } from '../../store/detailRepotSlice';
import { updateData } from '../../store/appSlice';
import DetailTableLoaded from './DetailTableLoaded';
import DetailTableShipment from './DetailTableShipment';
import { useNavigate } from 'react-router-dom';
import { Form, SimpleItem } from 'devextreme-react/form';
import { Popup } from 'devextreme-react';
import ShipmentItemsPO from './components/ShipmentItemsPO';
import { Grid } from '@mui/material';
function ShipmentReportPO() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const today = new Date();
  const [logisticsMainTable, setLogisticsMainTable] = useState();
  const [logisticsDetailTable, setLogisticsDetailTable] = useState();
  const [shipmentMainTable, setShipmentMainTable] = useState();
  const [shipmentDetailTable, setShipmentDetailTable] = useState();
  const [detailTableLoaded, setDetailTableLoaded] = useState();
  const [comingVehicleTable, setComingVehicleTable] = useState();
  const [vehicleOnLoadingTable, setVehicleOnLoadingTable] = useState();
  const [vehicleLoadedTable, setVehicleLoadedTable] = useState();
  const [isPopupVisibleItems, setPopupVisibilityItems] = useState(false);
  const [nonPlannedItems, setNonPlannedItems] = useState(null);
  const [reportilterValues, setReportFilterValues] = useState({
    BeginDate: today,
    EndDate: today,
    CustomDocNum: "",
    CardName: "",
    PlateCode: ""
  });
  useEffect(() => {
    fetchAllData();
  }, [])
  const fetchAllData = async () => {
    await Promise.all([shipment(), logistic(),
    comingVehicle(), firstWgh(), secondWgh()]);
  };
  useEffect(() => {
    if (nonPlannedItems !== null) {
      setPopupVisibilityItems(true);
    }
  }, [nonPlannedItems]);
  const togglePopupItems = () => {
    setPopupVisibilityItems(!isPopupVisibleItems);
  }
  const shipment = () => {
    getShipments().then(({ header, items }) => {
      setShipmentMainTable(header);
      setShipmentDetailTable(items);
    })
  }
  const logistic = () => {
    getWaiting().then(({ header, items }) => {
      setLogisticsMainTable(header);
      setLogisticsDetailTable(items);

    });
  }

  const comingVehicle = async () => {
    const comingVehicle = await getWaitingVehicles({ status: 4 })//.then((result) => {
    setComingVehicleTable(comingVehicle);
  }
  const firstWgh = async () => {
    const vehicleOnLoading = await getEnteredWghVehicles({ status: 5 })
    setVehicleOnLoadingTable(vehicleOnLoading);
  }
  const secondWgh = async () => {
    await getLoadedVehicles({ status: 6 })
      .then(({ header, items }) => {
        setVehicleLoadedTable(header);
        setDetailTableLoaded(items);
      })
  }
  const getShipments = async () => {
    const items = await getShipmentWaiting({ reportFilterValues: reportilterValues, type: 2 })
    const header = await getShipmentHeader({ reportFilterValues: reportilterValues, type: 2 });
    return { header, items };
  }
  const getWaiting = async () => {
    const items = await getLogisticWaiting({ reportFilterValues: reportilterValues, type: 2 })
    const header = await getLogisticHeader({ reportFilterValues: reportilterValues, type: 2 });
    return { header, items };
  }
  const getWaitingVehicles = async ({ status }) => {
    const waitingVehicles = await getVehicleWaiting({ reportFilterValues: reportilterValues, status: status, type: 2 });
    return waitingVehicles;
  }
  const getEnteredWghVehicles = async ({ status }) => {
    const waitingVehicles = await getFirstWghVehicle({ reportFilterValues: reportilterValues, status: status, type: 2 });
    return waitingVehicles;
  }
  const getLoadedVehicles = async ({ status }) => {
    const header = await getFirstWghVehicle({ reportFilterValues: reportilterValues, status: status, type: 2 });
    const items = await getLoadedDetails({ reportFilterValues: reportilterValues, status: status, type: 2 })
    return { header, items }
  }
  const changetoVehicleCome = (rowData) => {
    const logisticsId = rowData.DocEntry;
    const lgtData = {
      "U_Status": 4
    }
    dispatch(updateData({ tableName: "SML_LGT_HDR", updatedData: lgtData, id: logisticsId })).then((result) => { })
    comingVehicle();
    logistic();
  }
  const itemDataAddAfter = () => {
    setPopupVisibilityItems(false);
  };
  const getShipmentItems = async (rowData) => {
    const shipmentId = rowData.DocEntry;
    const nonPlannedItem = await getShipmentItemNonPlanned({ id: shipmentId, type: 2 })
    setNonPlannedItems(nonPlannedItem);
    // navigate("/logisticsPlanningAdd", {
    //   state: {
    //     type: 2,
    //     itemData: nonPlannedItem,
    //     vis: false,
    //     onBackReport: "/shipmentReportPO"
    //   }

    // })
  }
  const renderButtonGoToLogistic = (cellData) => {
    return (
      <>
        <Button
          text="Araç Planla"
          onClick={() => getShipmentItems(cellData.data)}
          type="default"
        />
      </>
    );
  };
  const renderButtonFirstWeight = (cellData) => {
    return (
      <>
        <Button
          text="İlk Tartım Yap"
          onClick={() => {

            navigate("/weighbridgeAdd", {
              state: {
                type: 2,
                loadingRamp: cellData.data.LoadingRampID,
                driverName: cellData.data.U_DriverName,
                selectedLgt: cellData.data.DocEntry,
                selectedVehicle: cellData.data.U_VehicleNo,
                orderNo: cellData.data.OrderNo,
                trailerPlateCode: cellData.data.U_TrailerPlateCode,
                plateCode: cellData.data.U_PlateCode,
                deliveryNoteNo: cellData.data.U_DeliveryNoteNo,
                onBackReport: "/shipmentReportPO"
              }
            })
          }
          }
          type="default"
        />
      </>
    );
  };
  const renderButtonSecondWeight = (cellData) => {
    return (
      <>
        <Button
          text="İkinci Tartım Yap"
          onClick={() => {
            navigate("/weighbridgeUpdate", {
              state: {
                onBackReport: "/shipmentReportPO",
                id2: cellData.data.wDocEntry,
              }

            })
          }
          }
          type="default"
        />
      </>
    );
  };
  const renderButtonVehicleArrived = (cellData) => {
    return (
      <>
        <Button
          text="Geldiye Çevir"
          onClick={() => changetoVehicleCome(cellData.data)}
          type="default"
        />
      </>
    );
  };
  const printCrystal = () => {
    let beginDate = reportilterValues.BeginDate;
    let endDate = reportilterValues.EndDate;
    let cardName = reportilterValues.CardName;
    let customDocNum = reportilterValues.CustomDocNum;
    let plateCode = reportilterValues.PlateCode;
    printShipmentDetail({
      beginDate: beginDate,
      endDate: endDate,
      cardName: cardName,
      customDocNum: customDocNum,
      plateCode: plateCode,
      type: 2
    });
  }
  return (
    <>
      <div className='page-container'>
        <div style={{ textAlign: "left", color: "#000000 " }}>
          <h5 style={{ fontWeight: "bold" }}>Anlık Sevkiyat Satınalma Raporu</h5>
        </div>
        <div className="form-container">
          <Form formData={reportilterValues} colCount={5} labelLocation="top" >
            <SimpleItem dataField="BeginDate" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Başlangıç Tarihi' }} />
            <SimpleItem dataField="EndDate" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Bitiş Tarihi' }} />
            <SimpleItem dataField="CustomDocNum" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Lojistik Belge No' }} />
            <SimpleItem dataField="CardName" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Müşteri Adı' }} />
            <SimpleItem dataField="PlateCode" editorType="dxTextBox" cssClass="transparent-bg" label={{ text: 'Çekici Plaka' }} />
          </Form>
          <Grid container spacing={1} paddingBottom={2}>
            <Grid item>
          <Button icon='search' variant="contained" type="success" onClick={fetchAllData} />
            </Grid>
            <Grid item>
              <Button icon='print' variant="contained" type="success" onClick={() => printCrystal()} />
            </Grid>
          </Grid>
        </div>
        <div style={{ margin: 25 }}>
          <div style={{ textAlign: "center", color: "#b6b6b6" }}>
            <h5 style={{ fontWeight: "bold" }}>Araç Planlanacak</h5>
          </div>
          <DataGrid
            className='datagridShipment'
            id="grid-container"
            dataSource={shipmentMainTable}
            keyExpr="DocEntry"
            showBorders={true}
            columnAutoWidth={true}
            columnMinWidth={100}
            allowColumnResizing={true}
            width="100%"
          >
            <Column
              alignment='left'
              caption="İşlem"
              cellRender={renderButtonGoToLogistic}
            />
            <Column
              dataField="DocEntry"
              caption="Belge No"
              alignment='left'
            />
            <Column
              dataField="U_TradeFileNo"
              caption="Ticaret Dosya No"
              alignment='left'
            />
            <Column
              dataField="U_Date"
              caption="Teslim Tarihi"
              format="dd/MM/yyyy"
              dataType='date'
            />
            <Column
              dataField="ShipmentType"
              caption="Sevkiyat Türü"
            />
            <Column
              dataField="CardNames"
              caption="Muhatap"
            />
            <Column
              dataField="U_City"
              caption="İl"
            />
            <Column
              dataField="U_County"
              caption="İlçe"
            />
            <Column
              dataField="U_Country"
              caption="Ülke"
            />
            <Column
              dataField="TotalShipmentQuantity"
              caption="Toplam Miktar"
            />
            <Column
              dataField="TotalLogisticsQuantity"
              caption="Toplam Planlanan Miktar"
            />
            <Column
              dataField="RemainingQuantity"
              caption="Toplam Kalan Miktar"
            />


            <MasterDetail
              enabled={true}
              component={(props) => <DetailTableShipment {...props} detail={shipmentDetailTable} />}
            />
          </DataGrid>
          <div style={{ textAlign: "center", color: "#fcac6b" }}>
            <h5 style={{ fontWeight: "bold" }}>Araç Planlandı</h5>
          </div>
          <DataGrid
            className='datagridLogistics'
            id="grid-container"
            dataSource={logisticsMainTable}
            keyExpr="DocEntry"
            showBorders={true}
            columnAutoWidth={true}
            columnMinWidth={100}
            width="100%"
          >
            <Column
              alignment='left'
              caption="İşlem"
              cellRender={renderButtonVehicleArrived}
            />
            <Column
              dataField="DocEntry"
              caption="Belge ID"
              alignment='left'
            />
            <Column
              dataField="U_CustomDocNum"
              caption="Belge No"
              alignment='left'
            />
            <Column
              dataField="U_Date"
              caption="Teslim Tarihi"
              format="dd/MM/yyyy"
              dataType='date'
            />
            <Column
              dataField="PaymentStatus"
              caption="Ödeme Durumu"
            />
            <Column
              dataField="U_DeliveryNoteNo"
              caption="İrsaliye No"
            />

            <Column
              dataField="CardNames"
              caption="Muhatap"
            />
            <Column
              dataField="Cities"
              caption="İl"
            />
            <Column
              dataField="Counties"
              caption="İlçe"
            />
            <Column
              dataField="Countries"
              caption="Ülke"
            />
            <Column
              dataField="HCardName"
              caption="Nakliye Carisi"
            />
            <Column
              dataField="U_DriverName"
              caption="Şöför"
            />
            <Column
              dataField="U_Phone1"
              caption="Telefon"
            />
            <Column
              dataField="U_PlateCode"
              caption="Çekici"
            />
            <Column
              dataField="U_TrailerPlateCode"
              caption="Dorse"
            />
            <Column
              dataField="U_PalletCost"
              caption="Tutar"
            />

            <MasterDetail
              enabled={true}
              component={(props) => <DetailTemplate {...props} detail={logisticsDetailTable} />}
            />

          </DataGrid>

          <div style={{ textAlign: "center", color: "#3f76db" }}>
            <h5 style={{ fontWeight: "bold" }}>Araç Geldi</h5>
          </div>
          <DataGrid
            className='datagridVehicleComing'
            id="grid-container"
            dataSource={comingVehicleTable}
            showBorders={true}
            columnAutoWidth={true}
            columnMinWidth={100}
            width="100%"
          >
            <Column
              alignment='left'
              caption="İşlem"
              cellRender={renderButtonFirstWeight}
            />
            <Column
              dataField="DocEntry"
              caption="Belge ID"
              alignment='left'
            />
            <Column
              dataField="U_CustomDocNum"
              caption="Belge No"
              alignment='left'
            />
            <Column
              dataField="U_Date"
              caption="Teslim Tarihi"
              format="dd/MM/yyyy"
              dataType='date'
            />
            <Column
              dataField="PaymentStatus"
              caption="Ödeme Durumu"
            />
            <Column
              dataField="U_DeliveryNoteNo"
              caption="İrsaliye No"
            />

            <Column
              dataField="CardNames"
              caption="Muhatap"
            />
            <Column
              dataField="Cities"
              caption="İl"
            />
            <Column
              dataField="Counties"
              caption="İlçe"
            />
            <Column
              dataField="Countries"
              caption="Ülke"
            />
            <Column
              dataField="OrderNo"
              caption="Sipariş No"
            />
            <Column
              dataField="U_CardName"
              caption="Nakliye Carisi"
            />
            <Column
              dataField="U_DriverName"
              caption="Şöför"
            />
            <Column
              dataField="U_Phone1"
              caption="Telefon"
            />
            <Column
              dataField="U_PlateCode"
              caption="Çekici"
            />
            <Column
              dataField="U_TrailerPlateCode"
              caption="Dorse"
            />
            <Column
              dataField="U_Price"
              caption="Tutar"
            />
            <Column
              visible={false}
              dataField="DriverNo"
              caption="DriverNo"
            />
            <Column
              visible={false}
              dataField="VehicleNo"
              caption="Vehicle No"
            />
            <Column
              dataField="U_LoadingRamp"
              caption="Yükleme Rampası"
            />
            <Column
              dataField="LoadingRampID"
              caption="Yükleme Rampası ID"
            />
            <Column
              visible={false}
              dataField="VehicleDesc"
              caption="VehicleDesc"
            />


          </DataGrid>
          <div style={{ textAlign: "center", color: "#f3d676" }}>
            <h5 style={{ fontWeight: "bold" }}>Araç İçerde</h5>
          </div>
          <DataGrid
            className='datagridVehicleLoading'
            id="grid-container"
            dataSource={vehicleOnLoadingTable}
            showBorders={true}
            columnAutoWidth={true}
            columnMinWidth={100}
            width="100%"
          >
            <Column
              alignment='left'
              caption="İşlem"
              cellRender={renderButtonSecondWeight}
            />
            <Column
              dataField="wDocEntry"
              caption="Kantar Belge No"
              alignment='left'
            />
            <Column
              dataField="lDocEntry"
              caption="Belge ID"
              alignment='left'
            />
            <Column
              dataField="U_CustomDocNum"
              caption="Belge No"
              alignment='left'
            />
            <Column
              dataField="U_Date"
              caption="Teslim Tarihi"
              format="dd/MM/yyyy"
              dataType='date'
            />
            <Column
              dataField="PaymentStatus"
              caption="Ödeme Durumu"
              alignment='left'
            />

            <Column
              dataField="CardNames"
              caption="Muhatap"
            />
            <Column
              dataField="Cities"
              caption="İl"
            />
            <Column
              dataField="Counties"
              caption="İlçe"
            />
            <Column
              dataField="Countries"
              caption="Ülke"
            />
            <Column
              dataField="U_CardName"
              caption="Nakliye Carisi"
            />
            <Column
              dataField="U_DriverName"
              caption="Şöför"
            />
            <Column
              dataField="U_Phone1"
              caption="Telefon"
            />
            <Column
              dataField="U_PlateCode"
              caption="Çekici"
            />
            <Column
              dataField="U_TrailerPlateCode"
              caption="Dorse"
            />
            <Column
              dataField="U_Price"
              caption="Tutar"
            />

          </DataGrid>
          <div style={{ textAlign: "center", color: "#72dd6f" }}>
            <h5 style={{ fontWeight: "bold" }}>Araç İndirildi</h5>
          </div>
          <DataGrid
            className='datagridVehicleLoaded'
            id="grid-container"
            dataSource={vehicleLoadedTable}
            keyExpr="lDocEntry"
            showBorders={true}
            columnAutoWidth={true}
            columnMinWidth={100}
            width="100%"
          >
            <Column
              dataField="wDocEntry"
              caption="Kantar Belge No"
              alignment='left'
            />
            <Column
              dataField="lDocEntry"
              caption="Belge ID"
              alignment='left'
            />
            <Column
              dataField="U_CustomDocNum"
              caption="Belge No"
              alignment='left'
            />
            <Column
              dataField="SecondWghDone"
              caption="İkinci Tartım"
            />
            <Column
              dataField="U_Date"
              caption="Teslim Tarihi"
              format="dd/MM/yyyy"
              dataType='date'
            />
            <Column
              dataField="PaymentStatus"
              caption="Ödeme Durumu"
              alignment='left'
            />

            <Column
              dataField="CardNames"
              caption="Muhatap"
            />
            <Column
              dataField="Cities"
              caption="İl"
            />
            <Column
              dataField="Counties"
              caption="İlçe"
            />
            <Column
              dataField="Countries"
              caption="Ülke"
            />
            <Column
              dataField="U_CardName"
              caption="Nakliye Carisi"
            />
            <Column
              dataField="U_DriverName"
              caption="Şöför"
            />
            <Column
              dataField="U_Phone1"
              caption="Telefon"
            />
            <Column
              dataField="U_PlateCode"
              caption="Çekici"
            />
            <Column
              dataField="U_TrailerPlateCode"
              caption="Dorse"
            />

            <Column
              dataField="U_Price"
              caption="Tutar"
            />
            <MasterDetail
              enabled={true}
              component={(props) => <DetailTableLoaded {...props} detail={detailTableLoaded} />}
            />
          </DataGrid>
          <Popup
            showCloseButton={false}
            visible={isPopupVisibleItems}
            hideOnOutsideClick={true}
            onHiding={togglePopupItems}
            title='Sevkiyat Satınalma Kalemleri'
            fullScreen={false}
            height="auto" >
            <ShipmentItemsPO dataAddAfter={itemDataAddAfter} nonPlannedItems={nonPlannedItems} />
          </Popup>
        </div>
      </div>
    </>
  );
}
export default ShipmentReportPO;
