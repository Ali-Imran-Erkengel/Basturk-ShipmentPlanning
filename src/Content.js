import { Routes, Route, Navigate } from 'react-router-dom';
import appInfo from './app-info';
import routes from './app-routes';
import { SideNavInnerToolbar as SideNavBarLayout } from './layouts';
import Home from './pages/home/home';

export default function Content() {
  const userName = sessionStorage.getItem('userName');
  return (
    <>
      {userName ? (
        <SideNavBarLayout title={appInfo.title}>
          <Routes>
            {routes.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={element}
              />
            ))}
            <Route
              path="*"
              element={<Navigate to="/mainPage" />}
            />
          </Routes>
        </SideNavBarLayout>
      ) : (
             <div
          style={{
            width: '100%',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5',
            backgroundImage: `url('./basturk.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '100%', // Login formunun maksimum genişliği
            }}
          >
            <Home />
          </div>
        </div>
      )}
    </>
  );
}
