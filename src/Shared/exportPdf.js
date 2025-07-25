import logoImg from '../Assets/img/lw-logo.png'

export const exportPdf = (dtOptions,data)=>{
    let headersData = []
    let columnsData =[]

    dtOptions.columns.forEach((e,i) => {
        headersData.push(e.header);
        columnsData.push(e.data+'='+i);
    });

    import('jspdf').then(jsPDF => {
        import('jspdf-autotable').then(() => {
            const doc = new jsPDF.default({
                orientation: 'portrait',
                unit: 'mm',
                format: [600, 420],
                compress: true,
            });
            const logoWidth = 40;
            const logoHeight = 10;
            const logoX = doc.internal.pageSize.getWidth() - logoWidth - 10;
            const logoY = 10;
            doc.addImage(logoImg, 'PNG', logoX, logoY, logoWidth, logoHeight);

            const tableData = getData(columnsData,data,dtOptions)
            
            doc.autoTable({
            head: [headersData],
            body:tableData,
            startY: 30,
            margin: { top: 20, right: 20, bottom: 20, left: 20 },
            styles: {
                lineWidth: 0.5,
            },
            });
            doc.save(`${dtOptions.title}.pdf`);
        })
    })
}

const getData = (columnsData,data,dtOptions)=>{
    return data.map(row => {
        let formattedRow = [];
        columnsData.forEach((col,i) => {
            if(dtOptions.title === "Home" && i ===1){
                if(+(row.speed) >= 1 && (+(row.swnp_flg1) === 596 || +(row.swnp_flg2) === 596) && row.colorIndication === "green"){
                    formattedRow.push("Active");
                }else if( (row.active_tab === "CAB-1" || row.active_tab === "CAB-2" || row.pantograph === "P1-Up" || row.pantograph === "P2-Up" || row.vcb_status === "Closed") && row.colorIndication === "green"){
                    formattedRow.push("Active");                  
                }else if(row.colorIndication === "red"){
                    formattedRow.push("Inactive");
                }else{
                    formattedRow.push("Inactive");
                }
            }
            else
                formattedRow.push(
                    dtOptions.columns[i]?.render? dtOptions.columns[i]?.render(row) :row[(col.split('=')[0])] || ''
                );
        });
        return formattedRow;
    });
}