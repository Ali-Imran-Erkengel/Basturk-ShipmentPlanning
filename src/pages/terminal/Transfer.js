import React, { useEffect, useRef, useState } from "react";
import { Form, GroupItem, SimpleItem } from 'devextreme-react/form'
import { Button } from "devextreme-react/button";
import { getBinUsingBatch, getLastTransferRecord, getPreviousEndOfProcess, saveTransfer, } from "../../store/terminalSlice";
import { terminalDeliveryData, terminalPrevEopData, terminalTransferLastData } from "./data/data";
import { Popup } from "devextreme-react/popup";
import ZoomLayoutTerminal from "../../components/myComponents/ZoomLayoutTerminal";
import { employeeColumns, employeeFiltersTerm } from "../../data/zoomLayoutData";
import notify from 'devextreme/ui/notify';
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import EmployeeList from "./components/EmployeeList";

const handleNotify = ({ message, type }) => {
  notify(
    {
      message: message,
      width: 300,
      position: {
        at: "bottom",
        my: "bottom",
        of: "#container"
      }
    },
    type,
    5000
  );
}

const Transfer = () => {
  const navigate = useNavigate();
  const [isPopupVisibleLoader, setPopupVisibilityLoader] = useState(false);
  const [isPopupVisiblePreparer, setPopupVisibilityPreparer] = useState(false);
  const [formData, setFormData] = useState({ ...terminalDeliveryData });
  const [transferData, setTransferData] = useState({ ...terminalTransferLastData });
  const [prevEopData, setPrevEopData] = useState({ ...terminalPrevEopData });
  const employeeFilter = ["Department", "=", 10];
  const barcodeRef = useRef(null);

  useEffect(() => {
    console.log("formData değişti:", formData);
  }, [formData]);
  const createTextBoxWithButtonOptions = (type) => {
    return {
      buttons: [
        {
          name: "customButton",
          location: "after",
          options: {
            icon: "search",
            onClick: () => {
              togglePopupZoomLayout({ variable: type });
            },
          },
        },
      ],
    };
  };
  const togglePopupZoomLayout = ({ variable }) => {
    switch (variable) {
      case "loader":
        setPopupVisibilityLoader(!isPopupVisibleLoader);
        break;
      case "preparer":
        setPopupVisibilityPreparer(!isPopupVisiblePreparer);
        break;
      default:
        break;
    }
  };

  const handleLoaderSelection = (selectedRowData) => {
    setFormData(prev => ({
      ...prev,
      LoaderCode: selectedRowData.EmployeeID,
      LoaderName: selectedRowData.EmployeeName
    }));
    setPopupVisibilityLoader(false);
  };
  const handlePreparerSelection = (selectedRowData) => {
    setFormData(prev => ({
      ...prev,
      PreparerCode: selectedRowData.EmployeeID,
      PreparerName: selectedRowData.EmployeeName
    }));
    setPopupVisibilityPreparer(false);
  };

  // #region requests


  const getLastInventoryTransferRecord = async () => {
    try {
      let lastTransfer = await getLastTransferRecord();
      let trnData = {
        DistNumber: lastTransfer[0].DistNumber,
        ItemCode: lastTransfer[0].ItemCode,
        Dscription: lastTransfer[0].Dscription,
        FromWhsCod: lastTransfer[0].FromWhsCod,
        WhsCode: lastTransfer[0].WhsCode,
        PalletQty: lastTransfer[0].PalletQty,
        OnHandQty: lastTransfer[0].OnHandQty,
        FromBinCode: lastTransfer[0].FromBinCode,
        ToBinCode: lastTransfer[0].ToBinCode,
        DocNum: lastTransfer[0].DocNum
      }
      setTransferData(trnData)
    } catch (err) {
      console.error("err:", err.message);
      throw err
    }
    finally{
      forceFocusBarcode() 
    }
  }
  const getPreviousRecordEndOfProcess = async () => {
    try {
      let oldBarcode = formData.OldBarcode;
      let barcodeValue = formData.Barcode;
      if (!barcodeValue) return handleNotify({ message: "Lütfen Önce Barkod Alanını Doldurunuz.", type: "error" }) ;
      if (!oldBarcode) {
        barcodeValue = formData.Barcode.substring(3)
      }
     
      let prevRecord = await getPreviousEndOfProcess({ barcode: barcodeValue });
      if (prevRecord.length > 0) {
        let eop = {
          Kayıt_Sırası: prevRecord[0]["Kayıt Sırası"],
          Parti_No: prevRecord[0]["Parti No"],
          Stok_Kodu: prevRecord[0]["Stok Kodu"],
          Kalem_Adı: prevRecord[0]["Kalem Adı"],
          Depo_Kodu: prevRecord[0]["Depo Kodu"],
          Depo_Yeri: prevRecord[0]["Depo Yeri"],
          Üretim_Tarihi: prevRecord[0]["Üretim Tarihi"],
          Parti_Tarih: prevRecord[0]["Parti Tarih"],
          Hat_No: prevRecord[0]["Hat No"],
          Günlük_Lot_No: prevRecord[0]["Günlük Lot No"],
          Bekleme_Süresi: prevRecord[0]["Bekleme Süresi(Saat)"],
          Statü: prevRecord[0]["Statü"],
        }
        handleNotify({ message: "Önceden Okutulmamış Palet Var", type: "error" })
        setPrevEopData(eop)
      }
    } catch (err) {
      console.error("err:", err.message);
      throw err
    }
    finally{
      forceFocusBarcode() 
    }
  }
  const validateBeforeSave = ({ formData, }) => {
    // if (!formData.PreparerCode || !formData.LoaderCode) {
    //   handleNotify({ message: "Lütfen Hazırlayan ve Yükleyen seçiniz", type: "error" });
    //   return false;
    // }
    return true;
  };

  const handleSave = async ({ item }) => {
    try {


      const preparer = formData?.PreparerCode || 0;
      const loadedBy = formData?.LoaderCode || 0;
      const itemList = {
        itemCode: item.ItemCode,
        quantity: item.OnHandQty,
        stockQty: 1,
        tWhsCode: "MA01",
        sWhsCode: item.WhsCode,
        innerQtyOfPallet: item.InnerQty,
        sBinEntry: item.AbsEntry,
        tBinEntry: 4,
        batchNumber: item.DistNumber,
        loadedBy: loadedBy,
        preparer: preparer
      }


      let result = await saveTransfer({ payload: itemList })

      // setFormData({ ...terminalDeliveryData })
      handleNotify({ message: "Kayıt başarılı", type: "success" });
      getLastInventoryTransferRecord()
      //getPreviousRecordEndOfProcess({ barcode: item.DistNumber })
      setFormData(prev => ({
        ...prev,
        Barcode: ""
      }))
    } catch (err) {
      console.error("Kaydetme hatası:", err);
      const parsed = extractJson({ str: err.response.data });
      handleNotify({ message: parsed["message"], type: "error" });
    }
    finally{
      forceFocusBarcode() 
}
  };
  // #endregion


  const handleBarcodeEnter = async (barcode) => {
    try {
      if (!validateBeforeSave({ formData })) return;
      let oldBarcode = formData.OldBarcode;
      let barcodeValue = formData.Barcode;
      if (!oldBarcode) {
        barcodeValue = barcode.substring(3)
      }
      let apiResponse = await getBinUsingBatch({ barcode: barcodeValue })
      if (apiResponse.length === 0) {
        return handleNotify({ message: "Girlen Parametrelere Ait Depo Yerinde Veri Bulunamadı", type: "error" });
      }
      else if (apiResponse.length > 1) {
        return handleNotify({ message: "Okutulan Barkod Birden Fazla Depo Yerinde Mevcut", type: "error" });
      }
      else {
        let binCode = apiResponse[0].BinCode;
        let quantity = apiResponse[0].OnHandQty;
        let innerQtyOfPallet = apiResponse[0].InnerQty;
        if (binCode.includes("SİSTEM")) {
          if (quantity < innerQtyOfPallet) return handleNotify({ message: `Yetersiz Miktar.`, type: "error" });
          await handleSave({ item: apiResponse[0] })
        }
        else {
          return handleNotify({ message: `Okutulan Barkod ${binCode} Depo Yerinde!`, type: "error" });
        }
      }
      if (barcodeRef.current) {
        console.log(barcodeRef.current)
        const input = barcodeRef.current.element().querySelector("input");
        if (input) input.focus();
      }
    } catch (error) {
      console.error("Okutma hatası:", error);
      handleNotify({ message: "Bilinmeyen bir hata oluştu.", type: "error" });
    }
    finally {
      setFormData(prev => ({ ...prev, Barcode: "" }));
      setTimeout(focusBarcodeInput, 50);
    }
  };

  const focusBarcodeInput = () => {
    const inst = barcodeRef.current;
    if (!inst) return;

    try {
      if (typeof inst.focus === "function") {
        inst.focus();
      }
    } catch (err) {
      console.log("error", err)
    }
  };
  function extractJson({ str }) {
    const match = str.match(/{.*}/s);
    return match ? JSON.parse(match[0]) : null;
  }
  function forceFocusBarcode() {
    setTimeout(() => {
        try {
            if (barcodeRef.current) {
                barcodeRef.current.focus();   
                const input = barcodeRef.current.element().querySelector("input");
                if (input) input.select();    
            }
        } catch (err) {
            console.log("focus error:", err);
        }
    }, 120);  
}
  return (
    <div className="p-4">
      <div className="page-container">
        <Grid
          container
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
          paddingBottom={1}
        >
          <Grid item>
            <Grid container spacing={1}>
              <Grid item>
                <Button
                  className="nav-btn"
                  icon="arrowleft"
                  type="default"
                  stylingMode="contained"
                  onClick={() => navigate('/selectScreen')}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <div style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.53rem" }}>
              HATTAN TRANSFER
            </div>
          </Grid>
          <Grid item style={{ width: 100 }}></Grid>
        </Grid>
        <Form
          formData={formData}
          labelLocation="left"
          colCount={6}
          colCountByScreen={{ lg: 6, md: 6, sm: 6, xs: 6 }}
          className="terminal-form"
        >
          <SimpleItem
            dataField="Barcode"
            editorType="dxTextBox"
            editorOptions={{
              showClearButton: true,
              inputAttr: {
                inputmode: "none",   
                autocomplete: "off",
              },
              onEnterKey: (e) => {
                const value = e.component.option("value");
                handleBarcodeEnter(value);
                const input = e.component.element().querySelector("input");
                if (input) input.focus();
              },
              onInitialized: (e) => {
                barcodeRef.current = e.component;
              },
            }}
            cssClass="transparent-bg"
            label={{ text: 'Barkod', location: 'top' }}
            colSpan={6}
          />


          {/* <SimpleItem
            dataField="LoaderName"
            editorOptions={createTextBoxWithButtonOptions("loader")}
            editorType="dxTextBox"
            cssClass="transparent-bg"
            label={{ text: 'Yükleyen' }}
            colSpan={6}
          /> */}

          <SimpleItem
            dataField="PreparerName"
            editorOptions={createTextBoxWithButtonOptions("preparer")}
            editorType="dxTextBox"
            cssClass="transparent-bg"
            label={{ text: 'Operatör' }}
            colSpan={6}
          />

          <SimpleItem
            dataField="OldBarcode"
            editorType="dxCheckBox"
            cssClass="transparent-bg"
            label={{ text: 'Eski Barkod' }}
            colSpan={3}
          />
        </Form>

        <hr></hr>
        <div className="parti-card">
          <div className="parti-card-header">
            <h2>Son Transfer Kaydı</h2>
          </div>
          <div className="parti-card-body">
            <Form
              className="transfer-form"
              formData={transferData}
              colCount={2}
              labelLocation="left"
              showColonAfterLabel={true}
              minColWidth={200}
            >
              <SimpleItem dataField="DocNum" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Belge No' }} />
              <SimpleItem dataField="DistNumber" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Parti No' }} />
              <SimpleItem dataField="ItemCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Kalem Kodu' }} />
              <SimpleItem dataField="Dscription" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Kalem Adı' }} />
              <SimpleItem dataField="OnHandQty" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Miktar' }} />
              <SimpleItem dataField="PalletQty" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Plt. Miktarı' }} />
              <SimpleItem dataField="FromWhsCod" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'K. Depo' }} />
              <SimpleItem dataField="FromBinCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'K. Depo Yeri' }} />
              <SimpleItem dataField="WhsCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'H. Depo' }} />
              <SimpleItem dataField="ToBinCode" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'H. Depo Yeri' }} />

              <GroupItem colSpan={2}>
                <div className="btn-area">
                  <Button text="Göster" onClick={getLastInventoryTransferRecord} type="default" />
                </div>
              </GroupItem>
            </Form>
          </div>
        </div>
        <div className="prev-parti-card">
          <div className="prev-parti-card-header">
            <h2>Önceki Kayıt</h2>
          </div>
          <div className="prev-parti-card-body">
            <Form
              className="transfer-form"
              formData={prevEopData}
              colCount={2}
              labelLocation="left"
              showColonAfterLabel={true}
              minColWidth={200}
            >
              <SimpleItem dataField="Kayıt_Sırası" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Katyıt Sırası' }} />
              <SimpleItem dataField="Parti_No" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Parti No' }} />
              <SimpleItem dataField="Stok_Kodu" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Kalem Kodu' }} />
              <SimpleItem dataField="Kalem_Adı" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Kalem Adı' }} />
              <SimpleItem dataField="Depo_Kodu" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Depo' }} />
              <SimpleItem dataField="Depo_Yeri" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Depo Yeri' }} />
              <SimpleItem dataField="Üretim_Tarihi" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Üretim Tarihi' }} />
              <SimpleItem dataField="Parti_Tarih" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Parti Tarihi' }} />
              <SimpleItem dataField="Hat_No" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Hat No' }} />
              <SimpleItem dataField="Günlük_Lot_No" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Gün. Lot No' }} />
              <SimpleItem dataField="Bekleme_Süresi" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Bek. Süresi' }} />
              <SimpleItem dataField="Statü" editorType="dxTextBox" editorOptions={{ disabled: true }} label={{ text: 'Statü' }} />

              <GroupItem colSpan={2}>
                <div className="btn-area">
                  <Button text="Önceki Kayıt" onClick={getPreviousRecordEndOfProcess} type="default" />
                </div>
              </GroupItem>
            </Form>
          </div>
        </div>



      </div>
      <Popup
        visible={isPopupVisibleLoader}
        hideOnOutsideClick={true}
        fullScreen={true}
        onHiding={() => togglePopupZoomLayout({ variable: "loader" })}
        showCloseButton={true}
        title='Yükleyen Listesi'
        wrapperAttr={{
          class: 'terminal-popup'
        }}
      >
        <EmployeeList
          gridData={formData}
          onRowSelected={handleLoaderSelection}
        />
      </Popup>
      <Popup
        visible={isPopupVisiblePreparer}
        hideOnOutsideClick={true}
        fullScreen={true}
        onHiding={() => togglePopupZoomLayout({ variable: "preparer" })}
        showCloseButton={true}
        title='Hazırlayan Listesi'
        wrapperAttr={{ class: 'terminal-popup' }}
      >
        <EmployeeList
          gridData={formData}
          onRowSelected={handlePreparerSelection}
        />
      </Popup>
    </div>
  );
};
export default Transfer;
