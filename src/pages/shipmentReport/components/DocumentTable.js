import DataGrid, { Column } from 'devextreme-react/data-grid';
import Button, { Button as DxButton } from 'devextreme-react/button';

const columns = [
  { dataField: 'DocEntry', caption: 'DocEntry', width: 100 },
  { dataField: 'fileName', caption: 'Dosya Adı', width: 300 },
];

const DocumentTable = ({ documentList, onDownload}) => {
  const dataWithFileName = documentList.map(doc => {
    const filePath = doc.U_Path || '';
    const pathParts = filePath.split('\\');
    return {
      ...doc,
      fileName: pathParts[pathParts.length - 1] || '',
    };
  });

  return (
    <DataGrid
      dataSource={dataWithFileName}
      keyExpr="DocEntry"
      showBorders={true}
      columnAutoWidth={true}
      rowAlternationEnabled={true}
      noDataText="Hiç belge bulunamadı."
    >
      <Column
        caption="İşlem"
        width={100}
        cellRender={({ data }) => (
          <DxButton
           icon='print'
            type="default"
            stylingMode="contained"
            onClick={() => onDownload({ fileId: data.DocEntry,fileName: data.fileName })}
          />
        )}
      />
      <Column dataField="DocEntry" caption="DocEntry" width={0} />
      <Column dataField="fileName" caption="Dosya Adı" />
    </DataGrid>
  );
};
export default DocumentTable;
