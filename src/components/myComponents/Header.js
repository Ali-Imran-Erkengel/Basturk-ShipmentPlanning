import { Button } from "devextreme-react/button";
import React from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addData, updateData } from "../../store/appSlice";
export default function Header({ save, trash, title, nav, onBack, formData, tableName, formMode, id, extraFunctions }) {
    const navigate = useNavigate();
    const exit = () => {
        navigate(nav)
    };

    const dispatch = useDispatch();
    const handleDelete = () => {
        formData.U_IsDeleted = "Y";
        handleData();
    };
    const handleData = () => {
if (nav==="/vehicleHome") {
    formData.SML_VHL_DRVCollection = formData.SML_VHL_DRVCollection.map(item => {
        const newItem = { ...item };
        delete newItem.__KEY__;
        return newItem;
    });
}

        if (formMode === 'Add') {
            dispatch(addData({ tableName: tableName, formData: formData })).then((result) => {
                // formData = null;
                if (result.meta.requestStatus === "fulfilled") {
                    formData=null;
                    if (extraFunctions) {
                        extraFunctions({ result });
                    }
                    onBack()
                }
            })
        }
        else if (formMode === 'Update') {
            if (nav==="/weighbridgeHome") {
                formData.U_SecondWghDone = "Y";
            }
            dispatch(updateData({ tableName: tableName, updatedData: formData, id: id })).then((result) => {
                if (result.meta.requestStatus === "fulfilled") {
                    if (extraFunctions) {
                        extraFunctions({ result });
                        formData=null;
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

