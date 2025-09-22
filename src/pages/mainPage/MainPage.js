import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Chart, Series, ArgumentAxis, ValueAxis, Title, Tooltip, Legend } from 'devextreme-react/chart';
import { PieChart } from 'devextreme-react/pie-chart';
import { DataGrid, Column, Pager, Paging, Selection } from 'devextreme-react/data-grid';
import './dashboard.scss';
import { getLoadToday, getLoadTomorrow, getLogistics, getStatuses } from '../../store/dashboardSlice';
import { statusMap } from './data';
import { Home, Truck, Package, RotateCcw, AlertTriangle, ClipboardList, Layers, ArrowLeftRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useScreenSize } from '../../utils/media-query';


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
  const { isXSmall } = useScreenSize(); // mobil kontrolü
  const pages = [
    { name: "Transfer", icon: Truck, path: "/transfer", color: "#3f76db" },
    { name: "Teslimat", icon: Package, path: "/delivery", color: "#28a745" },
    { name: "Kalite Transfer", icon: RotateCcw, path: "/kalite-transfer", color: "#ffc107" },
    { name: "İade", icon: AlertTriangle, path: "/iade", color: "#dc3545" },
    { name: "Kırık", icon: ClipboardList, path: "/kırık", color: "#6f42c1" },
    { name: "EMR Ayr", icon: Layers, path: "/emr-ayr", color: "#20c997" },
    { name: "Repack", icon: ArrowLeftRight, path: "/repack", color: "#fd7e14" },
    { name: "Nakil Talebinden Transfer", icon: Truck, path: "/nakil-talebinden-transfer", color: "#17a2b8" }
  ];
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    justifyContent: "center",
    flexDirection: isXSmall ? "column" : "row" 
  };
  const cardStyle = {
    flex: isXSmall ? "1 1 100%" : "1 1 200px", 
    minHeight: "120px",
    cursor: "pointer",
    borderRadius: "8px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  };
  const iconStyle = { marginBottom: "8px" };
  const titleStyle = { fontWeight: 600, textAlign: "center" };
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
    if (user === "alskdj") {

      fetchStatuses();
      logistics();
      tomorrowSended()
      todaySended()
    }
  }, []);
  
  if (user === "manager") {
    return (
      <div style={containerStyle}>
        {pages.map(page => {
          const Icon = page.icon;
          return (
            <div
              key={page.name}
              style={{
                ...cardStyle,
                backgroundColor: page.color + "33"
              }}
              onClick={() => navigate(page.path)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = `0 4px 16px ${page.color}66`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
            >
              <Icon size={32} style={{ ...iconStyle, color: page.color }} />
              <div style={titleStyle}>{page.name}</div>
            </div>
          );
        })}
      </div>
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