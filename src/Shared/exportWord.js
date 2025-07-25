import { callGlobalApi } from "../Stores/apiCall";


export const exportWord= async(dtOptions,data)=>{
    let columnHeaders = dtOptions.columns.map((e)=>{
      return e.header
    })
      let wordData=[];
      data.forEach((e,i)=>{
        let col=[]
        dtOptions.columns.forEach((j,k)=>{
          if(dtOptions.title === "Home" && k===1){
            if(+(e.speed) >= 1 && (+(e.swnp_flg1) === 596 || +(e.swnp_flg2) === 596) && e.colorIndication === "green"){
              col.push("Active")
            }else if( (e.active_tab === "CAB-1" || e.active_tab === "CAB-2" || e.pantograph === "P1-Up" || e.pantograph === "P2-Up" || e.vcb_status === "Closed") && e.colorIndication === "green"){
              col.push("Active")
            }else if(e.colorIndication === "red"){
              col.push("Inactive")
            }else{
              col.push("Inactive")
            }
          }
          else
            col.push(
                j?.render? j?.render(e) : e[j.data] || ''
            )
        })
        wordData.push(col)
      })
      wordData.unshift(columnHeaders)
      let body = {}
      body[dtOptions.title] = wordData
      const response = await callGlobalApi("getFaultDataWordDoc",body)
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dtOptions.title}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
}