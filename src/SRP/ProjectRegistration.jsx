import React, { useEffect, useState } from 'react'
import globalValidations from '../forms/ValidationSchema';
import { Dialog } from 'primereact/dialog';
import DynamicForm from '../forms/DynamicForm';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { SRP_URL } from '../global';
import axios from 'axios';
import DefaultDatatable from '../Shared/DefaultDatatable';
import { Column } from 'primereact/column';
import { useDispatch } from 'react-redux';
import { showToastMessage } from '../Stores/Slices/srpSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function ProjectRegistration() {

    const [visible, setVisible] = useState(false);
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch()
    const [projectsList, setProjectsList] = useState([]);
    const validations_ = new globalValidations()
    const userData = JSON.parse(sessionStorage.getItem("USER_DATA"))
    const [formInitialValues, setFormInitialValues] = useState({
          projName: '',
    })
    
    const dtOptions = {
      title:'Home',
      columns: [
        { data: "projName", header: "Project Name"},
        { data: "createdBy", header: "Created By"},
        { data: "createdDate", header: "Created Date"},
      ],
   }
    
    const projectForm = {
      formName: 'projForm',
      grid: { md: 12 },
      columns: [
          { label: "Project Name", key: "projName", field: "String", validations: validations_.required() },
      ]
    }
    
    const handleClickAdd = () => {
      setFormInitialValues({projName:''})
      setVisible(true)
    }
    const handleClickClose = () => {
      setVisible(false);
    };
    
    const onformFormChange = (e) => {
        const { name, value } = e.target
        setFormInitialValues((props) => ({ ...props, [name]: value }));
    }

    const saveProject = ()=>{
      let data = {
        projName:formInitialValues.projName,
        createdId:userData.uId,
      }
      confirmDialog({
        // trigger: event.currentTarget,
        message: `Are you sure you want to Save?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {    
          axios.post(SRP_URL+`srp/saveProjectName`,data).then(()=>{
            getAllProjectsData()
            setVisible(false)
            dispatch(showToastMessage({ type: 'success', msg: 'Success', content: `Saved Successfully` }))
          }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))});
        },
        reject: () => { }
      });
    }

    const deleteProject = (e)=>{
      confirmDialog({
        message: 'Are you sure you want to Delete?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          axios.delete(SRP_URL +`srp/deleteProjectById?projId=${e.projId}`,{}).then(()=>{
            getAllProjectsData()
            dispatch(showToastMessage({type:'success',msg:'Success',content:'Deleted Successfully'}))
          }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))})
        },
        reject: () => {}
      });
  }
    
    const footerContent = (
      <div>
          <button onClick={saveProject} className='btn btn-sm btn-blue d-block w-100 mb-2'>Save</button>
          <button onClick={handleClickClose} className='btn btn-sm btn-green d-block w-100'>Close</button>
      </div>
   
    );

  const getAllProjectsData = async()=>{
    setLoader(true)
    const res = await axios.get(SRP_URL + "srp/getAllProjectsList")
    if(res.data)
      setProjectsList(res.data)
    setLoader(false)
  }

  const actionTemplate = (e)=>{
      return <FontAwesomeIcon title="Delete" className='mx-1' icon={faTrash} onClick={()=>deleteProject(e)}/>
  }

  useEffect(()=>{
    getAllProjectsData()
  },[])

  return (
     <div>
      <div className='p-2 mb-2'>
        <h6 className='d-inline heading'>Projects List</h6>
        <button className='btn btn-sm defaultBtn float-end' onClick={handleClickAdd}>
          Add New Project
        </button>
      </div>
      <div className=''>
        <DefaultDatatable data={projectsList} dtOptions={dtOptions} loader={loader}>
          <Column header="Action" body={actionTemplate}/>
        </DefaultDatatable>
      </div>
      <Dialog header={<div className='text-center dialog-header'>Add New Project</div>} visible={visible} position="center" onHide={handleClickClose} draggable={false} closable={false}
          style={{ width: '20vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={footerContent}>
          <div className='p-1 pt-0'>
            <DynamicForm
            formContent={projectForm}
            initialValues={formInitialValues}
            onHandleChange={onformFormChange}
            />
          </div>   
        </Dialog>
      <ConfirmDialog />
    </div>
  )
}

export default ProjectRegistration