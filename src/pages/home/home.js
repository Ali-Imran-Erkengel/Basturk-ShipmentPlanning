import React, { useState } from 'react';
import './home.scss';
import backgroundImage from './basturk.jpg';

import { useDispatch, useSelector } from 'react-redux';
import Form, {
    ButtonItem,
    ButtonOptions,
    GroupItem,
    SimpleItem
} from 'devextreme-react/form';
import { loginUser } from '../../store/userSlice';
import { LoadIndicator } from 'devextreme-react/load-indicator';
import { useNavigate } from 'react-router-dom';
import notify from 'devextreme/ui/notify';
import { companies } from './data/data';

export default function Home() {
    const { loading, error } = useSelector((state) => state.user);
    const [err, setErr] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const companyOptions = {
        dataSource: companies,
        displayExpr: 'Value',
        valueExpr: 'Key',
        // onValueChanged: () => {
        //     gridData.SML_SHP_ITEMCollection = null;
        //     setGridData(gridData);
        //     console.log("gridData",gridData)
        // },
    };
    let userCredentials = {
        CompanyDB: "FBASTURKK",
        UserName: "",
        Password: ""
    };
    const handleLoginEvent = (e) => {
        e.preventDefault();

        dispatch(loginUser(userCredentials)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate("/mainPage");
            } else {
                handleNotify({ message: result.payload.error.message, type: "error" });
            }
        });
    };
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
    return (
        <React.Fragment>
            {/* <h2 className={'content-block'}>Home</h2> */}
            <div
                // className="content-block"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div
                    className="dx-card responsive-paddings"
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        margin: '0 auto',
                        padding: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        borderRadius: '8px'
                    }}
                >
                    <form className="login-form" onSubmit={handleLoginEvent}>
                        <Form disabled={loading} formData={userCredentials} >
                            <GroupItem caption="Giriş">
                                <SimpleItem dataField="UserName" label={{ text: 'Kullanıcı Adı' }} />
                                <SimpleItem
                                    dataField="Password"
                                    label={{ text: 'Şifre' }}
                                    editorOptions={{
                                        mode: 'password'
                                    }}
                                />
                                <SimpleItem colSpan={2} dataField="CompanyDB" editorType="dxSelectBox" editorOptions={companyOptions} cssClass="transparent-bg" label={{ text: 'Şirket' }} />
                                <ButtonItem>
                                    <ButtonOptions
                                        width="100%"
                                        type="default"
                                        useSubmitBehavior={true}
                                    >
                                        <span className="dx-button-text">
                                            {loading ? (
                                                <LoadIndicator width="24px" height="24px" visible={true} />
                                            ) : (
                                                'Giriş'
                                            )}
                                        </span>
                                    </ButtonOptions>
                                </ButtonItem>
                            </GroupItem>
                        </Form>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}
