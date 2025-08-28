import { HomePage,MainPage, TasksPage, ProfilePage, SupportTables, VehicleHome, CreateUdo, DriverHome, ShipmentHome, LogisticsHome, WeighbridgeHome, ShipmentReport, LoadingRampHome,TrailerTypeHome } from './pages';
import { withNavigationWatcher } from './contexts/navigation';
import DriverAdd from './pages/supportTables/Driver/DriverAdd';
import WeighbridgeAdd from './pages/weighbridge/WeighbridgeAdd';
import WeighbridgeUpdate from './pages/weighbridge/WeighbridgeUpdate';
import LogisticsAdd from './pages/logisticsPlanning/LogisticsAdd';
import ShipmentReportPO from './pages/shipmentReport/ShipmentRepotPO';
import ShippingArchive from './pages/shipmentReport/ShippingArchive';


const routes = [
    {
        path: '/tasks',
        element: TasksPage
    },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/mainPage',
        element: MainPage
    },
    {
        path: '/home',
        element: HomePage
    },
    {
        path: '/supportTables',
        element: SupportTables
    },
    {
        path: '/vehicleHome',
        element: VehicleHome
    },
    {
        path: '/driverHome',
        element: DriverHome
    },
    {
        path: '/driverAdd',
        element: DriverAdd
    },
    {
        path: '/trailerTypeHome',
        element: TrailerTypeHome
    },
    {
        path: '/loadingRampHome',
        element: LoadingRampHome
    },
    {
        path: '/createTable',
        element: CreateUdo
    },
    {
        path: '/shipmentPlanningHome',
        element: ShipmentHome
    },
    {
        path: '/logisticsPlanningHome',
        element: LogisticsHome
    },
    {
        path: '/logisticsPlanningAdd',
        element: LogisticsAdd
    },
    {
        path: '/weighbridgeHome',
        element: WeighbridgeHome
    },
    {
        path: '/weighbridgeAdd',
        element: WeighbridgeAdd
    },
    {
        path: '/weighbridgeUpdate',
        element: WeighbridgeUpdate
    },
    {
        path: '/shipmentReport',
        element: ShipmentReport
    },
    {
        path: '/shipmentReportPO',
        element: ShipmentReportPO
    },
    {
        path: '/shippingArchive',
        element: ShippingArchive
    }

];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
