import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';
import './dx-styles.scss';
import LoadPanel from 'devextreme-react/load-panel';
import { NavigationProvider } from './contexts/navigation';
import { AuthProvider, useAuth } from './contexts/auth';
import { useScreenSizeClass } from './utils/media-query';
import Content from './Content';
import UnauthenticatedContent from './UnauthenticatedContent';
import { loginUser, logout } from './store/userSlice';
import { useDispatch, useSelector } from 'react-redux';
function App() {
  const { loading } = useAuth();
  const { user } = useSelector((state) => state.user);
  const login = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  //useEffect(() => {
  // debugger
  // if (!user) {
  //     navigate('/home'); 
  // }

  //}, [user, navigate, dispatch]);
  const autoLogin = () => {
    const session = sessionStorage.getItem('sessionData');
    const userName = sessionStorage.getItem('userName');
    const password = sessionStorage.getItem('password');
    const company = sessionStorage.getItem('company');


    if (userName && password && company) {
      const userCredentials = {
        CompanyDB: company,
        UserName: userName,
        Password: password,
      };
      dispatch(loginUser(userCredentials));
  }
};

useEffect(() => {

  const intervalId = setInterval(() => {
    autoLogin();
  }, 15*60*1000);


  return () => clearInterval(intervalId);
}, []);

if (loading) {
  return <LoadPanel visible={true} />;
}

else if (user) {
  return <Content />;
}


return <Content />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <App />
          </div>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}
