const userName = sessionStorage.getItem('userName');
export const navigation = [
  {
    text: 'Giriş',
    path: '/home',
    icon: 'group'
  },
  {
    text: 'Ana Sayfa',
    path: '/mainPage',
    icon: 'home',
  },

  {
    text: 'Destek Tablosu',
    path: '/supportTables',
    icon: 'detailslayout',
    visible: userName !== 'kantar'
  },
  {
    text: 'UDT/UDF/UDO',
    path: '/createTable',
    icon: 'folder',
    visible: userName !== 'kantar'
  },
  {
    text: 'Sevkiyat Planlama',
    path: '/shipmentPlanningHome',
    icon: 'importselected',
    visible: userName !== 'kantar'
  },
  {
    text: 'Lojistik Planlama',
    path: '/logisticsPlanningHome',
    icon: 'airplane',
    visible: userName !== 'kantar'
  },
  {
    text: 'Kantar',
    path: '/weighbridgeHome',
    icon: 'car'
  },
  // {
  //   text: 'Sevkiyat Detay Raporu',
  //   path: '/shipmentReport',
  //   icon: 'datatrending'
  // },
  {
    text: 'Sevkiyat Detay Raporu',
    icon: 'datatrending',
    visible: userName !== 'kantar',
    items: [
      {
        text: 'Anlık Satış',
        path: '/shipmentReport'
      },
      {
        text: 'Anlık Satınalma',
        path: '/shipmentReportPO'
      },
      {
        text: 'Nakliye Arşivi',
        path: '/shippingArchive'
      }
    ]
  },
];
