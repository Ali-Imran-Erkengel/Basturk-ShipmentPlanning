import React, { useEffect, useState } from 'react';

import { Form, GroupItem, SimpleItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';
import { createGoodsreceiptIssue } from '../../../store/terminalSlice';
import { Column, DataGrid, Editing } from 'devextreme-react/data-grid';
import { endOfProcessData } from '../data/data';
import notify from 'devextreme/ui/notify';

function EopDescPopup({ consumptions, itemCode, batchNum, newStatus, newStatusName,onClose, refresh, labelGiven, costingCodeList }) {
  const [formData, setFormData] = useState({ ...endOfProcessData });

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


  function extractJson({ str }) {
    const match = str.match(/{.*}/s);
    return match ? JSON.parse(match[0]) : null;
  }
  const handleSave = async () => {
    try {

      if (!formData.Description || formData.Description.trim() === "") {
        handleNotify({ message: "Açıklama alanı boş olamaz", type: "error" });
        return;
      }
  
      if (!formData.MoldNo || formData.MoldNo.trim() === "") {
        handleNotify({ message: "Kalıp No alanı boş olamaz", type: "error" });
        return;
      }
      if (!labelGiven && !consumptions?.some(x => x.IsSelected === 1)) {
        handleNotify({
          message: "En az bir satır seçmelisiniz",
          type: "error"
        });
        return;
      }
      let userName = sessionStorage.getItem('userName')
      const itemList = consumptions?.map(item => ({
        itemCode: item.ItemCode,
        quantity: item.Quantity,
        sWhsCode: item.WhsCode,
        mainItemCode: item.MainItemCode,
        mainQuantity: item.MainItemQuantity,
        mainWarehouse: item.MainWarehouse,
        batchNumber: item.BatchNum,
        errorDesc: formData.Description,
        templateNum: formData.MoldNo,
        userName: userName,
        newStatus: newStatus,
        newStatusName: newStatusName,
        labelGiven: labelGiven,
        isSelected: item.IsSelected,
        costingCode: item.CostingCode,
        costingCode2: item.CostingCode2
      }));
      debugger
      const payload = { itemList };
      let result = await createGoodsreceiptIssue({ payload: payload })
      if (result === "OK") {
        handleNotify({ message: "Kayıt başarılı", type: "success" });
        refresh();
        setFormData({ ...endOfProcessData });
        onClose();
      }
    } catch (err) {
      console.error("Kaydetme hatası:", err);
      const parsed = extractJson({ str: err.response.data });
      handleNotify({ message: parsed["message"], type: "error" });
    }

  };
  const handleCellPrepared = (e) => {
    if (
      e.rowType === "data" &&
      e.column.dataField === "Quantity" &&
      !labelGiven
    ) {
      e.cellElement.style.setProperty("background-color", "#f0f7ff", "important");
      e.cellElement.style.setProperty("font-weight", "500", "important");
      e.cellElement.style.setProperty("color", "#0d6efd", "important");
    }
  };
  return (
    <div className="page-container">

      <div className="parti-card">
        <div className="parti-card-header">
          <h2>{itemCode}-{batchNum}</h2>
        </div>
        <div className="parti-card-body">
          <DataGrid
            dataSource={consumptions}
            className='datagridTerminalDelivery'
            columnAutoWidth={true}
            columnMinWidth={120}
            allowColumnResizing={true}
            width="auto"
            onCellPrepared={handleCellPrepared}
            rowAlternationEnabled={true}
            showBorders={true}
          >
            <Editing
              mode="cell"
              allowUpdating={!labelGiven}
            />
            <Column
              dataField="IsSelected"
              caption="Seç"
              dataType="boolean"
              visible={!labelGiven}
              calculateCellValue={(row) => row.IsSelected === 1}
              setCellValue={(row, value) => {
                row.IsSelected = value ? 1 : 0;
              }}
            />
            <Column dataField="DocEntry" caption="İş Emri" alignment="left" allowEditing={false} />
            <Column dataField="ItemCode" caption="Kalem Kodu" alignment="left" allowEditing={false} />
            <Column dataField="Dscription" caption="Kalem Adı" alignment="left" allowEditing={false} />
            <Column
              dataField="Quantity"
              caption="Miktar"
              alignment="right"
              allowEditing={!labelGiven}
            />
            <Column dataField="WhsCode" caption="Depo Kodu" alignment="left" allowEditing={false} />

            <Column
              dataField="CostingCode"
              caption="Departman"
              visible={!labelGiven}
              lookup={{
                dataSource: costingCodeList.filter(x => x.DimCode === 1),
                valueExpr: "OcrCode",
                displayExpr: "OcrName"
              }}
            />

            <Column
              dataField="CostingCode2"
              caption="Masraf Yeri"
              visible={!labelGiven}
              lookup={{
                dataSource: costingCodeList.filter(x => x.DimCode === 2),
                valueExpr: "OcrCode",
                displayExpr: "OcrName"
              }}
            />
          </DataGrid>
          <br></br>
          <br></br>
          <Form
            className="transfer-form"
            formData={formData}
            colCount={1}
            labelLocation="left"
            showColonAfterLabel={true}
            minColWidth={200}
          >
            <SimpleItem dataField="Description" editorType="dxTextBox" label={{ text: 'Açıklama' }} />
            <SimpleItem dataField="MoldNo" editorType="dxTextBox" label={{ text: 'Kalıp No' }} />
            <GroupItem colSpan={2}>
              <div className="btn-area">
                <Button text="Başlat"
                  onClick={handleSave}
                  type="default" />
              </div>
            </GroupItem>
          </Form>
        </div>
      </div>
    </div >
  );
}

export default EopDescPopup;




