import React, { useEffect, useState, useRef } from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { Form, SimpleItem } from 'devextreme-react/form';
import { downloadFile, getShippincArchive, openDocument, printShippingArchive, updateStatusAndUploadFile, uploadDocument } from '../../store/detailRepotSlice';
import { deliveryStatusFilter, invoiceStatusFilter, paymentStatusFilter } from '../logisticsPlanning/data/data';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Grid } from '@mui/material';
import { Popup } from 'devextreme-react/popup';
import DocumentTable from './components/DocumentTable';
function ShippingArchive() {
  const today = new Date();
  const navigate = useNavigate();

  const [archiveFilterValues, setArchiveFilterValues] = useState({
    BeginDate: today,
    EndDate: today,
    InvoiceStatus: 0,
    DeliveryStatus: 0,
    PaymentStatus: 0,
    CustomDocNum: "",
    DriverName: "",
    PlateCode: "",
    ShippingCardName: "",
    ShippingCardCode: ""
  });

  const paymentStatusOptions = {
    dataSource: paymentStatusFilter,
    displayExpr: 'Value',
    valueExpr: 'Key'
  };
  const deliveryStatusOptions = {
    dataSource: deliveryStatusFilter,
    displayExpr: 'Value',
    valueExpr: 'Key'
  };
  const invoiceStatusOptions = {
    dataSource: invoiceStatusFilter,
    displayExpr: 'Value',
    valueExpr: 'Key'
  };


  const [shippingArchiveTable, setShippingArchiveTable] = useState();

  useEffect(() => {

    fetchAllData();

  }, [])
  const fetchAllData = async () => {
    await Promise.all([archive()]);
  };

  const archive = async () => {
    const archives = await shippingArchive().then((result) => {
      const archiveArray = result.map(item => ({

        DocEntry: item.DocEntry,
        CustomDocNum: item.U_CustomDocNum,
        Date: item.U_Date,
        InvoiceDate: item.U_InvoiceDate,
        PaymentDate: item.U_PaymentDate,
        EInvoiceNo: item.U_EInvoiceNo,
        VehicleDesc: item.U_VehicleDesc,
        PlateCode: item.U_PlateCode,
        Phone: item.U_Phone1,
        ShippingCardCode: item.U_OcrdNo,
        ShippingCardName: item.U_CardName,
        GrossWeight: item.TotalGross,
        PalletCost: item.U_PalletCost,
        NetWeight: item.TotalNet,
        TrailerPlateCode: item.U_TrailerPlateCode,
        Country: item.MailCountr,
        City: item.MailCity,
        County: item.MailCounty,
        DriverName: item.U_DriverName,
        Price: item.U_Price,
        PalletQuantity: item.U_PalletQuantity,
        PaymentStatus: item.U_PaymentStatus,
        DeliveryStatus: item.U_DeliveryStatus,
        InvoiceStatus: item.U_InvoiceStatus,
        CustomerName: item.cCardName,
        cCity: item.cCity,
        cCounty: item.cCounty,
        cCountry: item.cCountry,
        U_Country: item.U_Country,
        U_City: item.U_City,
        U_County: item.U_County,
        U_ZipCode: item.U_ZipCode,
        U_Address: item.U_Address

      }))
      setShippingArchiveTable(archiveArray);
    })
  }
  const exportToExcel = async () => {
    const items = await getShippincArchive({ archiveFilterValues: archiveFilterValues })
    const preparedData = items.map((item) => ({
      "Belge No": item.U_CustomDocNum,
      "Fatura Durumu": item.U_InvoiceStatus,
      "Teslim Durumu": item.U_DeliveryStatus,
      "Ödeme  Durumu": item.U_PaymentStatus,
      "Yükleme Tarihi": item.U_Date,
      "Müşteri Adı": item.cCardName,
      "Nakliyeci Kodu": item.U_OcrdNo,
      "Nakliyeci Adı": item.U_CardName,
      "Şöför Adı-Soyadı": item.U_DriverName,
      "Çekici Plaka": item.U_PlateCode,
      "Dorse Plaka": item.U_TrailerPlateCode,
      "Nakliye Tutarı": item.U_Price,
      "E-Fatura No": item.U_EInvoiceNo,
      "Fatura Tarihi": item.U_InvoiceDate,
      "Ödeme Tarihi": item.U_PaymentDate,
      "Palet Miktarı": item.U_PalletQuantity,
      "Net Ağırlık": item.TotalNet,
      "Brüt Ağırlık": item.TotalGross,
      "Adres": item.U_Address,
      "İlçe": item.U_County,
      "İl": item.U_City,
      "Ülke": item.U_Country,
      "Posta Kodu": item.U_ZipCode,

    }));
    const ws = XLSX.utils.json_to_sheet(preparedData);
    const wb = XLSX.utils.book_new();
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}-${month}-${year} ${hours}_${minutes}_${seconds}`;
    XLSX.utils.book_append_sheet(wb, ws, "NakliyeArsiv");

    XLSX.writeFile(wb, `${formattedDate}NakliyeArsiv.xlsx`);
  };
  const shippingArchive = async () => {
    const archive = await getShippincArchive({ archiveFilterValues: archiveFilterValues })
    return archive;
  }
  const printCrystal = () => {
    let beginDate = archiveFilterValues.BeginDate;
    let endDate = archiveFilterValues.EndDate;
    let cardCode = archiveFilterValues.ShippingCardCode;
    let cardName = archiveFilterValues.ShippingCardName;
    let customDocNum = archiveFilterValues.CustomDocNum;
    let deliveryStatus = archiveFilterValues.DeliveryStatus;
    let invoiceStatus = archiveFilterValues.InvoiceStatus;
    let paymentStatus = archiveFilterValues.PaymentStatus;
    let plateCode = archiveFilterValues.PlateCode;
    let driverName = archiveFilterValues.DriverName;
    printShippingArchive({
      beginDate: beginDate,
      endDate: endDate,
      cardCode: cardCode,
      cardName: cardName,
      customDocNum: customDocNum,
      deliveryStatus: deliveryStatus,
      invoiceStatus: invoiceStatus,
      paymentStatus: paymentStatus,
      plateCode: plateCode,
      driverName: driverName
    });
  }
  // const uploadDocument  = async (rowData) => {
  //   const logisticsId = rowData.DocEntry;

  //   const file = await updateStatusAndUploadFile({ logisticsId:logisticsId })


  // }
  // const uploadDoc = (cellData) => {
  //   return (
  //     <div style={{ display: 'flex', gap: '8px' }}>

  //       <Button
  //         text="Belge Yükle"
  //         onClick={() => uploadDocument(cellData.data)}
  //         type="default"
  //       />
  //     </div>
  //   );
  // };
  const UploadButtonCell = ({ cellData }) => {
    const fileInputRef = useRef(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const logisticId = cellData.data.DocEntry;
    const customDocNum = cellData.data.CustomDocNum;
    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    const handleFileChange = async (event) => {
      const file = event.target.files[0];
      if (file) {
        const response = await uploadDocument(cellData.data, file);
        debugger
        if (response.status === 200) {
          archive();
        }
      }
    };
    const handleViewDocuments = async () => {
      try {
        const response = await openDocument({ logisticId });
        debugger
        console.warn(response)
        setDocumentList(response || []);
        setPopupVisible(true);
      } catch (error) {
        console.error('Belgeler alınamadı:', error);
      }
    };
    return (
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          icon='upload'
          onClick={handleButtonClick}
          type="default"
        />
        <Button
          icon='bulletlist'
          onClick={handleViewDocuments}
          type="normal" />
        <Popup
          visible={popupVisible}
          hideOnOutsideClick={true}
          onHiding={() => setPopupVisible(false)}
          title={`Belge - ${customDocNum}`}
          width={600}
          height={400}
        >
          <div style={{ padding: '16px' }}>
            <DocumentTable documentList={documentList} onDownload={downloadFile} />
          </div>
        </Popup>
      </div>
    );
  };

  return (
    <>
      <div className='page-container'>
        <div style={{ textAlign: "center", color: "#6de0c7" }}>
          <h5 style={{ fontWeight: "bold" }}>Nakliye Arşivi</h5>
        </div>
        <div className="form-container">
          <Form formData={archiveFilterValues} colCount={5} labelLocation="top" >
            <SimpleItem dataField="BeginDate" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Başlangıç Tarihi' }} />
            <SimpleItem dataField="EndDate" editorOptions={{ displayFormat: "dd/MM/yyyy" }} editorType="dxDateBox" cssClass="transparent-bg" label={{ text: 'Bitiş Tarihi' }} />
            <SimpleItem dataField="InvoiceStatus" editorType="dxSelectBox" editorOptions={invoiceStatusOptions} cssClass="transparent-bg" label={{ text: 'Fatura Durumu' }} />
            <SimpleItem dataField="DeliveryStatus" editorType="dxSelectBox" editorOptions={deliveryStatusOptions} cssClass="transparent-bg" label={{ text: 'Teslim Durumu' }} />
            <SimpleItem dataField="PaymentStatus" editorType="dxSelectBox" editorOptions={paymentStatusOptions} cssClass="transparent-bg" label={{ text: 'Ödeme Durumu' }} />
            <SimpleItem dataField="CustomDocNum" cssClass="transparent-bg" label={{ text: 'Belge No' }} />
            <SimpleItem dataField="DriverName" cssClass="transparent-bg" label={{ text: 'Şöför Adı' }} />
            <SimpleItem dataField="PlateCode" cssClass="transparent-bg" label={{ text: 'Plaka' }} />
            <SimpleItem dataField="ShippingCardCode" cssClass="transparent-bg" label={{ text: 'Nakliyeci Kodu' }} />
            <SimpleItem dataField="ShippingCardName" cssClass="transparent-bg" label={{ text: 'Nakliyeci adı' }} />
          </Form>

          <Grid container spacing={1} paddingBottom={2}>
            <Grid item>
              <Button icon='search' variant="contained" type="success" onClick={archive} />
            </Grid>

            <Grid item>
              <Button icon='exportxlsx' variant="contained" type="success" onClick={() => exportToExcel()} />
            </Grid>

            <Grid item>
              <Button icon='exportpdf' variant="contained" type="success" onClick={() => printCrystal()} />
            </Grid>

          </Grid>
        </div>
        <DataGrid
          className='datagridShippingArchive'
          id="grid-container"
          dataSource={shippingArchiveTable}
          keyExpr="DocEntry"
          showBorders={true}
          columnAutoWidth={true}
          columnMinWidth={180}
          allowColumnResizing={true}
          width="100%"
        >
          <Column
            alignment='left'
            caption="İşlem"
            cellRender={(cellData) => <UploadButtonCell cellData={cellData} />}
          />
          <Column
            dataField="CustomDocNum"
            caption="Belge No"
            alignment='left'
          />
          <Column
            dataField="InvoiceStatus"
            caption="Fatura Durumu"
          />
          <Column
            dataField="DeliveryStatus"
            caption="Teslim Durumu"
          />
          <Column
            dataField="PaymentStatus"
            caption="Ödeme Durumu"
            alignment='left'
          />
          {/* <Column
            dataField=""
            caption="Sevkiyat Tarihi"
            format="dd/MM/yyyy"
            dataType='date'
          /> */}
          <Column
            dataField="Date"
            caption="Yükleme Tarihi"
            format="dd/MM/yyyy"
            dataType='date'
          />
          <Column
            dataField="CustomerName"
            caption="Müşteri Adı"
          />

          <Column
            dataField="ShippingCardCode"
            caption="Nakliyeci Kodu"
          />
          <Column
            dataField="ShippingCardName"
            caption="Nakliyeci Adı"
          />
          <Column
            dataField="DriverName"
            caption="Şöför Adı-Soyadı"
          />
          <Column
            dataField="PlateCode"
            caption="Çekici Plaka"
          />
          <Column
            dataField="TrailerPlateCode"
            caption="Dorse Plaka"
          />
          <Column
            dataField="Price"
            caption="Nakliye Turarı"
            alignment='right'
          />

          <Column
            dataField="EInvoiceNo"
            caption="E-Fatura No"
          />
          <Column
            dataField="InvoiceDate"
            caption="Fatura Tarihi"
            format="dd/MM/yyyy"
            dataType='date'
          />
          <Column
            dataField="PaymentDate"
            caption="Ödeme Tarihi"
            format="dd/MM/yyyy"
            dataType='date'
          />
          <Column
            dataField="PalletQuantity"
            caption="Palet Miktarı"
            alignment='right'
          />
          <Column
            dataField="GrossWeight"
            caption="Brüt Ağırlık"
            alignment='right'
          />
          <Column
            dataField="NetWeight"
            caption="Net Ağırlık"
            alignment='right'
          />

          <Column
            dataField="U_Address"
            caption="Adres"
          />
          <Column
            dataField="U_County"
            caption="İlçe"
          />
          <Column
            dataField="U_City"
            caption="İl"
          />
          <Column
            dataField="U_Country"
            caption="Ülke"
          />
          <Column
            dataField="U_ZipCode"
            caption="Posta Kodu"
          />




          {/* <Column
            dataField="cCountry"
            caption="Teslim Ülkesi"
          />
          <Column
            dataField="cCity"
            caption="Teslim İl"
          />
          <Column
            dataField="cCounty"
            caption="Teslim İlçesi"
          /> */}


        </DataGrid>
      </div>

    </>
  );
}

export default ShippingArchive;
