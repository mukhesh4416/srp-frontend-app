import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { SRP_URL } from '../../global';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';

function BoxOne({setRowData}) {

  const [nodes, setNodes] = useState([]);

  const columns = [
      { field: 'uniqueCode', header: 'Unique No.', expander: true, frozen:true },
      { field: 'project', header: 'Project' },
      { field: 'module', header: 'Module' },
      { field: 'component', header: 'Component' },
      { field: 'description', header: 'Description' },
      { field: 'priority', header: 'Priority', body:(rowData)=>{
        let priority = rowData.data.priority
        if(priority === "High"){
          return <span className='badge bg-danger'>High</span>
        }else if(priority === "Medium"){
          return <span className='badge bg-primary'>Medium</span>
        }else{
          return <span className='badge bg-info'>Low</span>
        }
      } },
      { field: 'type', header: 'Assigned To',body:(rowData)=>
        rowData.data.type === "Task"?rowData.data.testerName:rowData.data.developerName
      },
      { field: 'createdBy', header: 'Created By' },
      { field: 'status', header: 'Status', body:(rowData)=>{
        let submitStatus = rowData.data.submitStatus
        if(submitStatus){
          return <span className='badge bg-primary'>Submitted</span>
        }else{
          return <span className='badge bg-warning'>Pending</span>
        }
      } },
      { field: 'trackerStatus', header: 'Progress'},

  ];


  const getAllTrackerList = async()=>{
    const res = await axios.post(SRP_URL + "tracker/getAllTrackingList",{})
    if(res.data)
      setNodes(res.data)
  } 

  const actionTemplate = (rowData)=>{
    return <FontAwesomeIcon title="View" className='mx-1' icon={faEye} onClick={()=>setRowData(rowData)}/>
  }
  
  useEffect(() => {
    getAllTrackerList();
  }, []);



    

  return (
    <div>
      <div className='p-2 mb-2'>
        <div className='d-inline heading'>Tracker</div>
        <button className='btn btn-sm defaultBtn float-end' onClick={()=>onAddTask()}>
          Add New Task
        </button>
      </div>
      <div className=''>
        <TreeTable value={nodes} tableStyle={{ minWidth: '50rem'}} frozenWidth="200px"  frozenRightWidth="120px"  scrollable scrollHeight="250px" 
        // paginator rows={5} rowsPerPageOptions={[5, 10, 25]} 
          style={{ width: '100%' }}
          breakpoints={{
            '960px': '75vw',
            '641px': '100vw'
          }}
        >
            {columns.map((col, i) => (
                <Column key={col.field} style={{ width: '250px' }} field={col.field} header={col.header} frozen={col.frozen} expander={col.expander} body={col?.body}/>
            ))}
            <Column body={actionTemplate} header="Action" frozen frozenOnEnd style={{ width: '120px' }} />
        </TreeTable>
      </div>
    </div>
  )
}

export default BoxOne