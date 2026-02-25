import React, { useState } from 'react';

import { Form, GroupItem, SimpleItem } from 'devextreme-react/form';
import { Button } from 'devextreme-react/button';
import { createGoodsreceiptIssue, getConsumptions } from '../../../store/terminalSlice';
import { Column, DataGrid } from 'devextreme-react/data-grid';
import { consumptionColumns, endOfProcessData } from '../data/data';
import notify from 'devextreme/ui/notify';


function EopDescPopup({ onRowSelected, gridData, consumptions,itemCode,batchNum }) {
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
    
    
            const itemList = consumptions?.map(item => ({
                itemCode: item.ItemCode,
                quantity: item.Quantity,
                sWhsCode: item.WhsCode,
                mainItemCode:item.MainItemCode,
                mainQuantity:item.MainItemQuantity,
                mainWarehouse:item.MainWarehouse,
                batchNumber:item.BatchNum,
                errorDesc:formData.Description,
                templateNum:formData.MoldNo
              }));
        
            debugger
              const payload = { itemList };
              let result = await createGoodsreceiptIssue({ payload: payload })
            
              // handleNotify({ message: "Kayıt başarılı", type: "success" });
            } catch (err) {
              console.error("Kaydetme hatası:", err);
              const parsed = extractJson({ str: err.response.data });
              handleNotify({ message: parsed["message"], type: "error" });
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

                            rowAlternationEnabled={true}
                            showBorders={true}
                        >

                            {consumptionColumns.map((col) => (
                                <Column key={col.dataField} {...col} />
                            ))}

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




