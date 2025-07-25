import React, { useEffect, useState } from 'react'
import { Column } from 'primereact/column';
import { TreeTable } from 'primereact/treetable';
import globalValidations from '../forms/ValidationSchema';
import DynamicForm from '../forms/DynamicForm';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { SRP_URL } from '../global';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { showToastMessage } from '../Stores/Slices/srpSlice';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faCheck, faDeleteLeft, faPaperclip, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots, faEdit, faEye } from '@fortawesome/free-regular-svg-icons';
import Chats from '../Shared/Chats';
import Attachments from '../Shared/Attachments';

function Home() {

  const userData = JSON.parse(sessionStorage.getItem("USER_DATA"))
  const validations_ = new globalValidations()
  const dispatch = useDispatch()

  const [projectsList,setProjectsList] = useState([])
  const [testersList,setTestersList] = useState([])
  const [developersList,setDevelopers] = useState([])
  const [nodes, setNodes] = useState([]);

  const [visible, setVisible] = useState(false);
  const [bugVisible, setBugVisible] = useState(false);
  const [trackerStatusVisible, setTrackerStatusVisible] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [attachVisible, setAttachVisible] = useState(false);
  const [taskEditFlag, setTaskEditFlag] = useState(false);
  const [bugEditFlag, setBugEditFlag] = useState(false);
  const [chatId, setChatId] = useState();
  const [attachId, setAttachId] = useState();
  const priorityList = ["High","Medium","Low"]


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
      { field: 'trackerStatus', header: 'Progress',body:(rowData)=>{
          return <span className='' onClick={()=>addTrackerStatus(rowData.data)}>{rowData.data.trackerStatus}</span>
      } },

  ];

// TASK FORM -----------------------
  const taskForm = {
    formName: 'taskForm',
    grid: { md: 6 },
    columns: [
        { label: "Project Name", key: "projName", field: "Select", options: projectsList, optionLabel: "projName", optionValue: 'projName'  },
        { label: "Module", key: "moduleName", field: "String" },
        { label: "Component", key: "component", field: "String" },
        { label: "Description", key: "description", field: "TextArea" },
        { label: "Priority", key: "priority", field: "Select", options: priorityList  },
        { label: "Assign To", key: "assignTester", field: "SearchSelect", options: testersList, optionLabel: "profileName", optionValue: 'userId'  },
    ]
  }

  const [taskFormInitialValues, setTaskFormInitialValues] = useState({
        id:0,
        projName: '',
        moduleName: '',
        component: '',
        description: '',
        assignTester: '',
        priority:''
  })

    const onTaskformFormChange = (e) => {
        const { name, value } = e.target
        setTaskFormInitialValues((props) => ({ ...props, [name]: value }));
    }

    const onAddTask = ()=>{
      setTaskEditFlag(false)
      setTaskFormInitialValues({
        id:0,
        projName: '',
        moduleName: '',
        component: '',
        description: '',
        assignTester: '',
        priority:''
      })
      setVisible(true)
    }

    const onUpdateTask = (rowData)=>{
      let data = rowData.data
      if(rowData.type === "Task"){
        setTaskEditFlag(true)
        setTaskFormInitialValues({
          id:data.taskId,
          projName: data.project,
          moduleName: data.module,
          component: data.component,
          description: data.description,
          assignTester: data.testerId,
          priority:data.priority
        })
        setVisible(true)
      }else{
        setBugEditFlag(true)
        setBugFormInitialValues({
          bugId:data.bugId,
          taskId:data.taskId,
          projName: data.project,
          moduleName: data.module,
          component: data.component,
          description: data.description,
          assignDeveloper: data.developerId,
          priority:data.priority
        })
        setBugVisible(true)
      }

    }

    const saveTaskTracker = ()=>{
        let data = {
          actionMode: taskEditFlag?"update":"insert",
          taskId: taskFormInitialValues.id,
          project:taskFormInitialValues.projName,
          module:taskFormInitialValues.moduleName,
          component:taskFormInitialValues.component,
          description:taskFormInitialValues.description,
          testerId:taskFormInitialValues.assignTester,
          priority:taskFormInitialValues.priority,
          createdId:userData.uId,
        }
        confirmDialog({
          message: `Are you sure you want to Save?`,
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {    
            axios.post(SRP_URL+`tracker/saveTaskData`,data).then(()=>{
              setVisible(false)
              getAllTrackerList()
              dispatch(showToastMessage({ type: 'success', msg: 'Success', content: `Saved Successfully` }))
            }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))});
          },
          reject: () => { }
        });
    }

  const submitTask = (rowData)=>{
    let taskFlag = rowData.type === "Task"
    const obj = {
      actionMode : taskFlag?"Task_Submit" : "Bug_Submit",
      refId : taskFlag? rowData?.data?.taskId : rowData?.data?.bugId
    }
    confirmDialog({
      message: 'Are you sure you want to Submit?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        axios.post(SRP_URL +`srp/update/any/globalApprovals`,obj).then(()=>{
          getAllTrackerList()
          dispatch(showToastMessage({type:'success',msg:'Success',content:'Submitted Successfully'}))
        }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))})
      },
      reject: () => {}
    });
  }

  const onDeleteTracker = (rowData)=>{
    let trackerDeleteApi = rowData?.type === "Task" ? `tracker/deleteTask?taskId=${rowData?.data.taskId}` : `tracker/deleteBug?bugId=${rowData?.data.bugId}`
    confirmDialog({
      message: 'Are you sure you want to Delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          axios.delete(SRP_URL + trackerDeleteApi).then(()=>{
            getAllTrackerList()
            dispatch(showToastMessage({type:'success',msg:'Success',content:'Deleted Successfully'}))
          }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))})
      },
      reject: () => {}
    });
  }

  const onViewTracker = (rowData)=>{
    setChatId(rowData?.data?.bugId)
    setChatVisible(true)
  }

  const onAddAttachments = (rowData)=>{
    setAttachId(rowData?.data?.bugId);
    setAttachVisible(true);
  }

  // TASK FORM END ----------------------

  //Bug FORM -------------------
  const bugForm = {
    formName: 'bugForm',
    grid: { md: 6 },
    columns: [
        { label: "Project Name", key: "projName", field: "Select", options: projectsList, optionLabel: "projName", optionValue: 'projName'  },
        { label: "Module", key: "moduleName", field: "String" },
        { label: "Component", key: "component", field: "String" },
        { label: "Description", key: "description", field: "TextArea" },
        { label: "Priority", key: "priority", field: "Select", options: priorityList  },
        { label: "Assign To", key: "assignDeveloper", field: "SearchSelect", options: developersList, optionLabel: "profileName", optionValue: 'userId'  },
    ]
  }

  const [bugFormInitialValues, setBugFormInitialValues] = useState({
        projName: '',
        moduleName: '',
        component: '',
        description: '',
        assignDeveloper: '',
        priority:'',
        taskId:0,
        bugId:0,
  })

  const onBugformFormChange = (e) => {
      const { name, value } = e.target
      setBugFormInitialValues((props) => ({ ...props, [name]: value }));
  }

  const saveBugTracker = ()=>{
        let data = {
          actionMode:bugEditFlag?"update":"insert",
          bugId:bugEditFlag?bugFormInitialValues.bugId:0,
          project:bugFormInitialValues.projName,
          module:bugFormInitialValues.moduleName,
          component:bugFormInitialValues.component,
          description:bugFormInitialValues.description,
          developerId:bugFormInitialValues.assignDeveloper,
          taskId:bugFormInitialValues.taskId,
          priority:bugFormInitialValues.priority,
          createdId:userData.uId,
        }
        confirmDialog({
          // trigger: event.currentTarget,
          message: `Are you sure you want to Save?`,
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {    
            axios.post(SRP_URL+`tracker/saveBugData`,data).then(()=>{
              setBugVisible(false)
              getAllTrackerList()
              dispatch(showToastMessage({ type: 'success', msg: 'Success', content: `Saved Successfully` }))
            }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))});
          },
          reject: () => { }
        });
  }

  // BUG FORM -----------------

  //Tracker Status FORM -------------------

  const addTrackerStatus = (data)=>{
    setTrackerStatusVisible(true)
    setTaskFormInitialValues({
      id:data.type === "Task"?data.taskId:data.bugId,
      trackerStatus:data.trackerStatus
    })
  }
  const trackerStatusForm = {
    formName: 'bugForm',
    grid: { md: 12 },
    columns: [
        { label: "Tracker Status", key: "trackerStatus", field: "Select", options: priorityList  },
      ]
  }

  const [trackerStatusFormInitialValues, setTrackerStatusFormInitialValues] = useState({
        trackerStatus:'',
        id:0,
  })

  const ontrackerStatusFormChange = (e) => {
      const { name, value } = e.target
      setTrackerStatusFormInitialValues((props) => ({ ...props, [name]: value }));
  }

  const saveTrackerStatus = ()=>{
        let data = {
          id:bugFormInitialValues.id,
          trackerStatus:bugFormInitialValues.trackerStatus,
        }
        confirmDialog({
          // trigger: event.currentTarget,
          message: `Are you sure you want to Update?`,
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {    
            axios.post(SRP_URL+`tracker/saveBugData`,data).then(()=>{
              setTrackerStatusVisible(false)
              getAllTrackerList()
              dispatch(showToastMessage({ type: 'success', msg: 'Success', content: `Updated Successfully` }))
            }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))});
          },
          reject: () => { }
        });
  }

  // Tracker Status FORM -----------------

  const getListData = async()=>{
    const res1 = await axios.get(SRP_URL + "srp/getAllProjectsList")
    if(res1.data)
      setProjectsList(res1.data)

    const res2 = await axios.get(SRP_URL + "srp/getAllTesters")
    if(res2.data)
      setTestersList(res2.data)

    const res3 = await axios.get(SRP_URL + "srp/getAllDevelopers")
    if(res2.data)
      setDevelopers(res3.data)
  }

  const getAllTrackerList = async()=>{
    const res = await axios.post(SRP_URL + "tracker/getAllTrackingList",{})
    if(res.data)
      setNodes(res.data)
  } 
  
      useEffect(() => {
        getListData();
        getAllTrackerList();
      }, []);


  const taskFooter = (
        <div>
          <button className='btn btn-sm saveBtn ms-1' onClick={saveTaskTracker}>{taskEditFlag?'Update':'Save'}</button>
          <button onClick={()=>setVisible(false)} className='btn btn-sm defaultBtn ms-1'>Close</button>
        </div>
  );

  const bugFooter = (
        <div>
          <button className='btn btn-sm btn-blue ms-1' onClick={saveBugTracker}>{bugEditFlag?'Update':'Save'}</button>
          <button onClick={()=>setBugVisible(false)} className='btn btn-sm btn-green ms-1'>Close</button>
        </div>
  );

  const trackerStatusFooter = (
    <div>
      <button className='btn btn-sm btn-blue ms-1' onClick={saveTrackerStatus}>{'Update'}</button>
      <button onClick={()=>setTrackerStatusVisible(false)} className='btn btn-sm btn-green ms-1'>Close</button>
    </div>
  )


  const actionTemplate = (rowData) => {
        let submitStatus = rowData.data.submitStatus
        return (
            <div className="flex flex-wrap gap-2">
              {!submitStatus && <FontAwesomeIcon title="Edit Task" className='mx-1' icon={faEdit} onClick={()=>onUpdateTask(rowData)}/>}
              {(rowData?.type ===  "Task" && !!submitStatus) && <FontAwesomeIcon title="Add New Bug" className='mx-1' icon={faAdd} onClick={()=>onAddbug(rowData.data)}/>}
              {!submitStatus &&<FontAwesomeIcon title="Delete Task" className='mx-1' icon={faTrash} onClick={()=>onDeleteTracker(rowData)}/>}
              {!submitStatus && <FontAwesomeIcon title="Submit" className='mx-1' icon={faCheck} onClick={()=>submitTask(rowData)}/>}
              {(rowData?.type ===  "Bug" && !!submitStatus) && <FontAwesomeIcon title="Chat" className='mx-1' icon={faCommentDots} onClick={()=>onViewTracker(rowData)}/>}
              {rowData?.type ===  "Bug" && <FontAwesomeIcon title="Attachents" className='mx-1' icon={faPaperclip} onClick={()=>onAddAttachments(rowData)}/>}
            </div>
        );
    };

  const onAddbug = (e)=>{
    setBugEditFlag(false)
    setBugFormInitialValues({
      projName: e.project,
      moduleName: e.module,
      component: e.component,
      description: '',
      assignDeveloper: '',
      taskId:e.taskId,
      priority:e.priority,
      bugId:0
    })
    setBugVisible(true)
  }
    

  return (
    <div>
      <div className='p-2 mb-2'>
        <div className='d-inline heading'>Tracker</div>
        <button className='btn btn-sm defaultBtn float-end' onClick={()=>onAddTask()}>
          Add New Task
        </button>
      </div>
      <div className=''>
        <TreeTable value={nodes} tableStyle={{ minWidth: '50rem'}} scrollable scrollHeight="250px" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} >
            {columns.map((col, i) => (
                <Column key={col.field} field={col.field} header={col.header} expander={col.expander} body={col?.body}/>
            ))}
            <Column body={actionTemplate} header="Action" ClassName="w-10rem" />
        </TreeTable>


      <Dialog header={taskEditFlag?"Update Task":"Add Task"} visible={visible} onHide={()=>setVisible(false)} draggable={false}
        style={{ width: '35vw'}} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={taskFooter}>
        <div className='p-1 pt-0'>
          <DynamicForm
           formContent={taskForm}
           initialValues={taskFormInitialValues}
           onHandleChange={onTaskformFormChange}
          />
        </div>   
      </Dialog>
      <Dialog header={bugEditFlag?"Update Bug":"Add Bug"} visible={bugVisible} onHide={()=>{ setBugVisible(false)}} draggable={false} 
        style={{ width: '35vw'}} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={bugFooter}>
        <div className='p-1 pt-0'>
          <DynamicForm
           formContent={bugForm}
           initialValues={bugFormInitialValues}
           onHandleChange={onBugformFormChange}
          />
        </div>   
      </Dialog>
      <Dialog header={"Tracker Status"} visible={trackerStatusVisible} onHide={()=>{ setTrackerStatusVisible(false)}} draggable={false} 
        style={{ width: '30vw'}} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={trackerStatusFooter}>
        <div className='p-1 pt-0'>
          <DynamicForm
           formContent={trackerStatusForm}
           initialValues={trackerStatusFormInitialValues}
           onHandleChange={ontrackerStatusFormChange}
          />
        </div>   
      </Dialog>
      {attachVisible && <Dialog header={"Attachments View"} visible={attachVisible} onHide={()=>{ setAttachVisible(false)}} draggable={false} 
        style={{ width: '45vw'}} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={<button onClick={()=>setAttachVisible(false)} className='btn btn-sm defaultBtn ms-1'>Close</button>}>
        <div className='p-1 pt-0'>
          <Attachments refId={attachId}/>
        </div>   
      </Dialog>}
        {chatVisible && <Chats refId={chatId} chatVisible={chatVisible} setChatVisible={setChatVisible}/>}
        <ConfirmDialog />
      </div>
    </div>
  )
}

export default Home