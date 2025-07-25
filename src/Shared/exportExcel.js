import ExcelJS from 'exceljs';
import FileSaver from 'file-saver'; // Import saveAs from file-saver

export const exportExcel = (dtOptions,data)=>{
    let wb = new ExcelJS.Workbook(); 
    let worksheetName = "Sheet1";
    let ws = wb.addWorksheet(worksheetName, {
        properties: {
            tabColor: { argb: 'FFFF0000' }
        }
    });
    let cols = dtOptions.columns.map((e,i)=> ({
        key: e.data+'='+i,
        header: e.header,
        width: 20,
        render: e.render?e.render:false
    }));
    ws.columns = cols;
    ws.getRow(1).font = { bold: true };

    let formattedData = data.map(row => {
        let formattedRow = {};
        cols.forEach((col,i) => {
            if(dtOptions.title === "Home" && i ===1){
                if(+(row.speed) >= 1 && (+(row.swnp_flg1) === 596 || +(row.swnp_flg2) === 596) && row.colorIndication === "green"){
                    formattedRow[col.key] = "Active";
                }else if( (row.active_tab === "CAB-1" || row.active_tab === "CAB-2" || row.pantograph === "P1-Up" || row.pantograph === "P2-Up" || row.vcb_status === "Closed") && row.colorIndication === "green"){
                    formattedRow[col.key] = "Active";                  
                }else if(row.colorIndication === "red"){
                    formattedRow[col.key] = "Inactive";
                }else{
                    formattedRow[col.key] = "Inactive";
                }
            }
            else{
                formattedRow[col.key] = col.render?col.render(row):row[(col.key.split('='))[0]] || '-';
            }
        });
        return formattedRow;
    });

    ws.addRows(formattedData);
  
    wb.xlsx.writeBuffer()
    .then((buffer) => {
        saveExcelFile(buffer, dtOptions.title);
    })
    .catch((error) => {
        console.error('Error writing Excel buffer:', error);
    });
}

function saveExcelFile(buffer, fileName){
    const data = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName + '.xlsx');
  }
