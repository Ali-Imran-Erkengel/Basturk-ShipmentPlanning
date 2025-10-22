import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Chart, Series, ArgumentAxis, ValueAxis, Title, Tooltip, Legend } from 'devextreme-react/chart';
import { PieChart } from 'devextreme-react/pie-chart';
import { DataGrid, Column, Pager, Paging, Selection } from 'devextreme-react/data-grid';
import './dashboard.scss';
import { getLoadToday, getLoadTomorrow, getLogistics, getStatuses } from '../../store/dashboardSlice';
import { statusMap } from './data';
import { useNavigate } from 'react-router-dom';
import SelectScreen from '../terminal/SelectScreen';


const calculateMonthlyPalletCost = (data) => {
  const monthlyData = {};

  data.forEach(item => {
    const date = new Date(item.U_Date);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    const key = `${month} ${year}`;

    if (!monthlyData[key]) {
      monthlyData[key] = 0;
    }

    monthlyData[key] += item.U_PalletCost;
  });

  return Object.keys(monthlyData).map(key => ({
    month: key,
    palletCost: monthlyData[key]
  }));
};
function MainPage() {
  const [statuses, setStatuses] = useState([]);
  const [palletCostData, setPalletCostData] = useState([]);
  const [tomorrowSendData, setTomorrowSendData] = useState([]);
  const [todaySendData, setTodaySendData] = useState([]);
  const navigate = useNavigate();

  const user = sessionStorage.getItem('userName')
  useEffect(() => {
    const fetchStatuses = async () => {
      const data = await getStatuses();
      setStatuses(data);
    };
    const logistics = async () => {
      const data = await getLogistics();
      const monthlyPalletCost = calculateMonthlyPalletCost(data);
      setPalletCostData(monthlyPalletCost);
    };
    const tomorrowSended = async () => {
      const tomorrow = await getLoadTomorrow();

      setTomorrowSendData(tomorrow)
    };
    const todaySended = async () => {
      const today = await getLoadToday();

      setTodaySendData(today)
    };
    if (user === "manager") {

      fetchStatuses();
      logistics();
      tomorrowSended()
      todaySended()
    }
  }, []);

  if (user.includes("term")) {
    return (
     <SelectScreen></SelectScreen>
    );
  }
  else {
    return (
      <div className="dashboard">
        <Typography variant="h4" className="dashboard-title">Dashboard</Typography>
        <Grid container spacing={3} className="overview-cards">
          {statuses.map((item) => (
            <Grid item xs={12} md={3} key={item.U_Status}>
              <Card>
                <CardContent>
                  <Typography variant="h6">
                    {statusMap[item.U_Status] || "Durum Bilinmiyor"}
                  </Typography>
                  <Typography variant="h4">
                    {item.Count}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Sales Chart */}
        <div className="chart-section">
          <h3>Aylık Palet Giderleri</h3>
          <Chart dataSource={palletCostData}>
            <ArgumentAxis />
            <ValueAxis />
            <Series
              valueField="palletCost"
              argumentField="month"
              name="Toplam Tutar"
              type="bar"
              color="#3b82f6"
            />
            {/* <Title text="Aylık Palet Giderleri" /> */}
            <Tooltip enabled={true} />
            <Legend verticalAlignment="bottom" horizontalAlignment="center" />
          </Chart>
        </div>

        {/* Sales Distribution Pie Chart */}
        {/* <div className="chart-section">
                <h3>Sales by Category</h3>
                <PieChart dataSource={pieData}>
                    <Series
                        valueField="sales"
                        argumentField="category"
                        type="doughnut" // veya 'pie' tipi
                    />
                    <Legend verticalAlignment="bottom" horizontalAlignment="center" />
                    <Title text="Category-wise Sales Distribution" />
                </PieChart>
            </div> */}

        {/* Orders DataGrid */}
        <div className="grid-section" style={{ display: 'flex', gap: '20px' }}>
          <div >
            <h3>Bugün Yüklenecekler</h3>
            <DataGrid
              selection={true}
              dataSource={todaySendData}
              keyExpr="DocEntry"
              showBorders={true}
            >
              <Selection
                mode="single"
                selectAllMode="page"
              />
              <Column dataField="U_CustomDocNum" caption="Belge No" />
              <Column dataField="U_Date" format="dd/MM/yyyy" dataType='date' caption="Belge Taihi" />
              <Column dataField="U_Description" caption="Açıklama" />
              <Column dataField="U_DriverName" caption="Şöför" />
              <Column dataField="U_OcrdNo" caption="Muhatap" />
              <Column dataField="U_PalletQuantity" caption="Toplam Palet Miktarı" alignment='right' />

            </DataGrid>

          </div>
          <div >
            <h3>Yarın Yüklenecekler</h3>
            <DataGrid
              selection={true}
              dataSource={tomorrowSendData}
              keyExpr="DocEntry"
              showBorders={true}
            >
              <Selection
                mode="single"
                selectAllMode="page"
              />
              <Column dataField="U_CustomDocNum" caption="Belge No" />
              <Column dataField="U_Date" format="dd/MM/yyyy" dataType='date' caption="Belge Taihi" />
              <Column dataField="U_Description" caption="Açıklama" />
              <Column dataField="U_DriverName" caption="Şöför" />
              <Column dataField="U_OcrdNo" caption="Muhatap" />
              <Column dataField="U_PalletQuantity" caption="Toplam Palet Miktarı" alignment='right' />

            </DataGrid>

          </div>
        </div>
      </div>
    );
  }
}

export default MainPage