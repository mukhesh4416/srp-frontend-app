import React, { useEffect, useState } from 'react'
import DefaultDatatable from '../Shared/DefaultDatatable';
import axios from 'axios';
import { SRP_URL } from '../global';

function Bugs() {
  const [bugList, setBugList] = useState([])
  const [loader, setLoader] = useState(false);

  const dtOptions = {
    title:'Bugs',
    columns: [
      { data: "bugCode", header: "Unique No."},
      { data: "project", header: "Project Name"},
      { data: "module", header: "Module"},
      { data: "component", header: "Component"},
      { data: "description", header: "Description"},
      { data: "developerName", header: "Assigned To"},
      { data: "createdBy", header: "Created By"},
      { data: "createdDate", header: "Created Date"},
      { data: "status", header: "Status"},
    ],
  }

  const getAllBugsData = async()=>{
    setLoader(true)
    const res = await axios.post(SRP_URL + "tracker/getAllBugList",{})
    if(res.data)
      setBugList(res.data)
    setLoader(false)
  }

  // const actionTemplate = (e)=>{
  //     return <button className='btn btn-sm btn-text-red me-2' onClick={()=>{deleteLoco(e)}}>
  //           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  //             <path d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6M10 10.5V15.5M14 10.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  //           </svg>
  //       </button>
  // }

  useEffect(()=>{
    getAllBugsData()
  },[])

  return (
    <div>
      <div className='p-2 mb-2'>
        <h6 className='d-inline heading'>Bugs List</h6>
      </div>
      <div className=''>
        <DefaultDatatable data={bugList} dtOptions={dtOptions} loader={loader}>
          {/* <Column header="Action" body={actionTemplate}/> */}
        </DefaultDatatable>
      </div>
    </div>
  )
}

export default Bugs