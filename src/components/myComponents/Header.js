import { Button } from "devextreme-react/button";
import React from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addData, updateData } from "../../store/appSlice";
import validationEngine from "devextreme/ui/validation_engine";

// import { confirm } from "devextreme/ui/dialog";
import { custom } from "devextreme/ui/dialog";
import notify from "devextreme/ui/notify";

export default function Header({ save, trash, title, nav, onBack, formData, tableName, formMode, id, extraFunctions, validationGroup }) {
    const navigate = useNavigate();
    const exit = () => {
        navigate(nav)
    };

    const dispatch = useDispatch();
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
    // const handleDelete1 = () => {
    //     formData.U_IsDeleted = "Y";
    //     handleData();
    // };
    // const handleDelete2 = async () => {
    //     const result = await confirm(
    //         "Bu kaydı silmek istediğinize emin misiniz?",
    //         "Silme Onayı"
    //     );

    //     if (result) {
    //         formData.U_IsDeleted = "Y";
    //         handleData();
    //     }
    // };
    const handleDelete = async () => {
        const dialog = custom({
            title: "Silme Onayı",
            messageHtml: "<p>Bu kaydı silmek istediğinize emin misiniz?</p>",
            buttons: [
                {
                    text: "Evet",
                    type: "danger",
                    onClick: () => true
                },
                {
                    text: "Hayır",
                    type: "normal",
                    onClick: () => false
                }
            ]
        });

        const result = await dialog.show();

        if (result) {
            formData.U_IsDeleted = "Y";
            handleData();
        }
    };
    const handleData = () => {
        if (nav === "/vehicleHome") {
            formData.SML_VHL_DRVCollection = formData.SML_VHL_DRVCollection.map(item => {
                const newItem = { ...item };
                delete newItem.__KEY__;
                return newItem;
            });
        }
        debugger
        const validationResult = validationEngine.validateGroup(validationGroup);
        if (!validationResult.isValid) {
            const messages = validationResult.brokenRules.map(rule => rule.message).join('\n');
            handleNotify({ message: messages, type: 'error' })
            return;
        }

        if (formMode === 'Add') {
            dispatch(addData({ tableName: tableName, formData: formData })).then((result) => {
                // formData = null;
                if (result.meta.requestStatus === "fulfilled") {
                    formData = null;
                    if (extraFunctions) {
                        extraFunctions({ result });
                    }
                    onBack()
                }
            })
        }
        else if (formMode === 'Update') {
            if (nav === "/weighbridgeHome") {
                formData.U_SecondWghDone = "Y";
            }
            dispatch(updateData({ tableName: tableName, updatedData: formData, id: id })).then((result) => {
                if (result.meta.requestStatus === "fulfilled") {
                    if (extraFunctions) {
                        extraFunctions({ result });
                        formData = null;
                    }
                    onBack()
                }
            })
        }
    };
    return (
        <div className="top-buttons">
            <h5 className="header-title">{title}</h5>
            <div className="button-group">
                <Button icon="save" type="success" disabled={!save} onClick={handleData} />
                <Button icon="trash" type="default" disabled={!trash} onClick={handleDelete} />
                <Button icon="close" type="danger" onClick={onBack} />
            </div>
        </div>
    )
}

