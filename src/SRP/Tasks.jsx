import React, { useEffect, useState } from 'react'
import DefaultDatatable from '../Shared/DefaultDatatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { SRP_URL } from '../global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';

function Tasks() {

  const [taskList, setTaskList] = useState([])
  const [loader, setLoader] = useState(false);

  const dtOptions = {
    title:'Tasks',
    columns: [
      { data: "taskCode", header: "Unique No."},
      { data: "project", header: "Project Name"},
      { data: "module", header: "Module"},
      { data: "component", header: "Component"},
      { data: "description", header: "Description"},
      { data: "testerName", header: "Assigned To"},
      { data: "createdBy", header: "Created By"},
      { data: "createdDate", header: "Created Date"},
      { data: "status", header: "Status"},
    ],
  }

  const getAllTasksData = async()=>{
    setLoader(true)
    const res = await axios.post(SRP_URL + "tracker/getAllTaskList",{})
    if(res.data)
      setTaskList(res.data)
    setLoader(false)
  }

  const actionTemplate = (e)=>{
      return <FontAwesomeIcon title="View Bugs" className='mx-1 f-s-14' icon={faEye} onClick={()=>{}}/>
  }

  useEffect(()=>{
    getAllTasksData()
  },[])

  return (
    <div>
      <div className='p-2 mb-2'>
        <h6 className='d-inline heading'>Tasks List</h6>
      </div>
      <div className=''>
        <DefaultDatatable data={taskList} dtOptions={dtOptions} loader={loader}>
          <Column header="Action" body={actionTemplate}/>
        </DefaultDatatable>
      </div>
    </div>
  )
}

export default Tasks