import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react'
import { showToastMessage } from '../Stores/Slices/srpSlice';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { SRP_URL } from '../global';
import globalValidations from '../forms/ValidationSchema';
import DynamicForm from '../forms/DynamicForm';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Attachments({refId}) {
    const [attachmentsList,setAttachmentsList] = useState([])
    const [addVisible, setAddVisible] = useState(false);
    const [viewVisible, setViewVisible] = useState(false);
    const [iframeBase64, setIframeBase64] = useState(null);
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch()
    const userData = JSON.parse(sessionStorage.getItem("USER_DATA"))
    const validations_ = new globalValidations()
    const [formInitialValues, setFormInitialValues] = useState({
          fileName: '',
          file: '',
    })

    const attachForm = {
      formName: 'attachForm',
      grid: { md: 12 },
      columns: [
          { label: "File Name", key: "fileName", field: "String", validations: validations_.required() },
          { label: "File", key: "file", field: "File", validations: validations_.required() },
      ]
    }

    const onformFormChange = (e) => {
        const { name, value } = e.target
        setFormInitialValues((props) => ({ ...props, [name]: value }));
    }
    
    const handleClickAdd = () => {
      setFormInitialValues({
        fileName:"",
        file:""
      })
      setAddVisible(true)
    }

    const viewPdf = (base64Data, fileName) => {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    };

    const downloadPdf = (base64Data, fileName) => {
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.pdf`;
      link.click();
    };

    const viewIframePdf = (val)=>{
      setIframeBase64(val)
      setViewVisible(true)
    }

    const saveAttachment = ()=>{
       const formData = new FormData();
       formData.append('file', formInitialValues.file);
       formData.append('uId', userData.uId);
       formData.append('refId', refId);
       formData.append('documentName', formInitialValues.fileName);
       formData.append('createdId', userData.uId);
      confirmDialog({
        // trigger: event.currentTarget,
        message: `Are you sure you want to Save?`,
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {    
          axios.post(SRP_URL+`srp/uploadAttachment`,formData,{
              headers: {
                'Content-Type': 'multipart/form-data',
              },
          }).then(()=>{
            setAddVisible(false)
            dispatch(showToastMessage({ type: 'success', msg: 'Success', content: `Saved Successfully` }))
          }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))});
        },
        reject: () => { }
      });
    }

    const deleteAttachment = (e)=>{
      confirmDialog({
        message: 'Are you sure you want to Delete?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          axios.delete(SRP_URL +`srp/deleteAttachment?attachId=${e.attachId}`,{}).then(()=>{
            getAllAttachmentsList()
            setAddVisible(false)
            dispatch(showToastMessage({type:'success',msg:'Success',content:'Deleted Successfully'}))
          }).catch((error)=>{dispatch(showToastMessage({type:'error',msg:'Error',content:'Unsuccessfull'}))})
        },
        reject: () => {}
      });
  }
    
    const footerContent = (
        <div>
          <button className='btn btn-sm btn-blue ms-1' onClick={saveAttachment}>Save</button>
          <button onClick={()=>setAddVisible(false)} className='btn btn-sm btn-green ms-1'>Close</button>
        </div>
    );

  const getAllAttachmentsList = async()=>{
    setLoader(true)
    const res = await axios.get(SRP_URL + `srp/getAllAttachmentsList?refId=${refId}`)
    if(res.data)
      setAttachmentsList(res.data)
    setLoader(false)
  }

  useEffect(()=>{
    getAllAttachmentsList()
  },[])

  return (
     <div>
      <div className='p-2 mb-2'>
        <h6 className='d-inline heading'>Attachments List</h6>
        <button className='btn btn-sm defaultBtn float-end' onClick={()=>handleClickAdd()}>
          Add Attachment
        </button>
      </div>
      <div className='p-2'>
        <table className='table basicTable'>
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attachmentsList.map((attachment) => (
              <tr key={attachment.attachId}>
                <td>{attachment.documentName}</td>
                <td>{attachment.createdBy}</td>
                <td>
                  {/* <FontAwesomeIcon title="View" className='mx-1' icon={faEye} onClick={()=>viewPdf(attachment.attachFile, attachment.documentName)}/> */}
                  <FontAwesomeIcon title="View" className='mx-1' icon={faEye} onClick={()=>viewIframePdf(attachment.attachFile)}/>
                  <FontAwesomeIcon title="Edit Task" className='mx-1' icon={faTrash} onClick={()=>deleteAttachment(attachment)}/>
                  <FontAwesomeIcon title="Edit Task" className='mx-1' icon={faDownload} onClick={()=>downloadPdf(attachment.attachFile, attachment.documentName)}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog header={'Add Attachment'} visible={addVisible} position="center" onHide={()=>setAddVisible(false)} draggable={false}
          style={{ width: '20vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={footerContent}>
          <div className='p-1 pt-0'>
            <DynamicForm
              formContent={attachForm}
              initialValues={formInitialValues}
              onHandleChange={onformFormChange}
            />
          </div>   
      </Dialog>
      <Dialog header={'Attachment View'} visible={viewVisible} position="center" onHide={()=>setViewVisible(false)} draggable={false}
          style={{ width: '60vw',height:'100vh' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={<button onClick={()=>setViewVisible(false)} className='btn btn-sm btn-green ms-1'>Close</button>}>
          <div className='p-1 pt-0'>
            <iframe
              title="PDF Viewer"
              src={`data:application/pdf;base64,${iframeBase64}`}
              width="100%"
              height="470px"
              style={{ border: 'none' }}
            />
          </div>   
      </Dialog>
      <ConfirmDialog />
    </div>
  )
}

export default Attachments