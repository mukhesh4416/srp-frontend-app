import React, { useEffect, useState } from 'react'
import DefaultDatatable from '../Shared/DefaultDatatable';
import axios from 'axios';
import { SRP_URL } from '../global';
import { Column } from 'primereact/column';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { Dialog } from 'primereact/dialog';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import DynamicForm from '../forms/DynamicForm';
import { useDispatch } from 'react-redux';
import globalValidations from '../forms/ValidationSchema';
import { showToastMessage } from '../Stores/Slices/srpSlice';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function UserRegistration() {
  const [usersList, setUsersList] = useState([])
  const [loader, setLoader] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const rolesList = ["Developer", "Tester"]
  const dispatch = useDispatch()
  const validations_ = new globalValidations()
  const userData = JSON.parse(sessionStorage.getItem("USER_DATA"))
  const [formInitialValues, setFormInitialValues] = useState({
        userName: '',
        profileName: '',
        email: '',
        phnNo: '',
        role: '',
        password: '',
  })

  const dtOptions = {
    title:'Tasks',
    columns: [
      { data: "userName", header: "User Name"},
      { data: "profileName", header: "Profile Name"},
      { data: "role", header: "Role"},
    ],
  }

    const userForm = {
      formName: 'userForm',
      grid: { md: 6 },
      columns: [
          { label: "User Name", key: "userName", field: "String", validations: validations_.required() },
          { label: "Profile Name", key: "profileName", field: "String", validations: validations_.required() },
          { label: "E-mail", key: "mail", field: "String", validations: validations_.required() },
          { label: "Phone Number", key: "phnNo", field: "Number", validations: validations_.required() },
          { label: "Role", key: "role", field: "Select", options: rolesList, optionLabel: "", optionValue: ''  },
          { label: "Password", key: "password", field: "String", validations: validations_.required() },
      ]
    }
    
    const handleClickAdd = () => {
      setFormInitialValues({
        userName: '',
        profileName: '',
        email: '',
        phnNo: '',
        role: '',
        password: '',
      })
      setVisible(true)
    }
    const handleClickClose = () => {
      setVisible(false);
    };
    
    const onformFormChange = (e) => {
        const { name, value } = e.target
        setFormInitialValues((props) => ({ ...props, [name]: value }));
    }

  const saveUser = ()=>{
    let data = {
      actionMode:editFlag?"update":"insert",
      userName:formInitialValues.userName,
      profileName:formInitialValues.profileName,
      mailId:formInitialValues.mail,
      phoneNo:formInitialValues.phnNo,
      role:formInitialValues.role,
      password:formInitialValues.password,
      createdBy:userData.userName,
    }
    confirmDialog({
      // trigger: event.currentTarget,
      message: `Are you sure you want to Save?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {    
        axios.post(SRP_URL+`srp/saveUser`,data).then(()=>{
          getAllUsersData()
          setVisible(false)
          dispatch(showToastMessage({ type: 'success', msg: 'Success', content: `Saved Successfully` }))
        }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))});
      },
      reject: () => { }
    });
  }
    
  const footerContent = (
    <div>
        <button className='btn btn-sm btn-blue ms-1' onClick={saveUser}>Save</button>
        <button onClick={()=>setVisible(false)} className='btn btn-sm btn-green ms-1'>Close</button>
    </div>
  
  );

  const getAllUsersData = async()=>{
    setLoader(true)
    const res = await axios.get(SRP_URL + "srp/getAllUsers")
    if(res.data)
      setUsersList(res.data)
    setLoader(false)
  }

  const editUser = (data)=>{
    setEditFlag(true)
    setFormInitialValues({
      userName: data.userName,
      profileName: data.profileName,
      email: data.mailId,
      phnNo: data.phoneNo,
      role: data.role,
      password: data.password,
    })
  }

  const deleteUser = (e)=>{
    confirmDialog({
      message: 'Are you sure you want to Delete?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        axios.delete(SRP_URL +`srp/deleteUser?uId=${e.uId}`,{}).then(()=>{
          getAllUsersData()
          dispatch(showToastMessage({type:'success',msg:'Success',content:'Deleted Successfully'}))
        }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))})
      },
      reject: () => {}
    });
  }

  const actionTemplate = (rowData)=>{
      return <div>
        <FontAwesomeIcon title="View" className='mx-1 f-s-14 me-1' icon={faEye} onClick={()=>{editUser(rowData)}}/>
        <FontAwesomeIcon title="Delete" className='mx-1' icon={faTrash} onClick={()=>deleteUser(rowData)}/>
      </div>
  }

  useEffect(()=>{
    getAllUsersData()
  },[])

  return (
    <div>
      <div className='p-2 mb-2'>
        <h6 className='d-inline heading'>Users List</h6>
        <button className='btn btn-sm defaultBtn float-end' onClick={handleClickAdd}>
          Add New User
        </button>
      </div>
      <div className=''>
        <DefaultDatatable data={usersList} dtOptions={dtOptions} loader={loader}>
          <Column header="Action" body={actionTemplate}/>
        </DefaultDatatable>
      </div>
       <Dialog header="Add New User" visible={visible} onHide={handleClickClose} draggable={false}
          style={{ width: '40vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={footerContent}>
          <div className='p-1 pt-0'>
            <DynamicForm
            formContent={userForm}
            initialValues={formInitialValues}
            onHandleChange={onformFormChange}
            />
          </div>   
        </Dialog>
      <ConfirmDialog />
    </div>
  )
}

export default UserRegistration