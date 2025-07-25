import React, { useRef, useState } from 'react'
import TreeTableDt from '../Shared/TreeTableDt'
import { Dialog } from 'primereact/dialog';
import DynamicForm from '../forms/DynamicForm';
import globalValidations from '../forms/ValidationSchema';

function TesterPage() {

  const [visible, setVisible] = useState(false);
  const basicinfoFormRef = useRef(null);
  const validations_ = new globalValidations()


  const basicinfoForm = {
    formName: 'saleForm',
    grid: { md: 4 },
    columns: [
        { label: "Project", key: "dep_budgethead", field: "String", validations: validations_.required() },
        { label: "Module", key: "projName", field: "String", validations: validations_.required() },
        { label: "Component", key: "authBudget", field: "Number", validations: validations_.required() },
        // { label: "", key: "contName", field: "Date", validations: validations_.required() },
        // { label: "Contract Expiry Date", key: "expDate", field: "String", validations: validations_.required() },
        // { label: "Project Incharge", key: "projIncharge", field: "SearchSelect", options: empList, optionLabel: "name", optionValue: 'name' },
        // { label: "Allocate Estimation Resource", key: "estResource", field: "SearchSelect", options: empList, optionLabel: "name", optionValue: 'name' },
        // { label: "Allocate Costing Resource", key: "costResource", field: "SearchSelect", options: empList, optionLabel: "name", optionValue: 'name' },
        { label: "Description", key: "remarks", field: "TextArea" },
    ]
  }

  const handleClickAdd = () => {
    setVisible(true)
  }
  const handleClickClose = () => {
    setVisible(false);
  };

  const [basicformInitialValues, setBasicInitialValues] = useState({
        dep_budgethead: '',
        projName: '',
        authBudget: '0',
        contName: '',
        expDate: '',
        projIncharge: '',
        estResource: '',
        costResource: '',
        remarks: '',
  })

    const onbasicformFormChange = (e) => {
        const { name, value } = e.target
        setBasicInitialValues((props) => ({ ...props, [name]: value }));
    }

  const footerContent = (
    <div className='d-flex gap-1 justify-content-end align-items-center'>
            <button onClick={handleClickClose} className='btn btn-sm btn-secondary'>Close</button>
    </div>
  );


  return (
    <div>
      <header className='p-2'>
        <div className="row">
          <di className="col-6"><h6>Test Page</h6></di>
          <di className="col-6">
            <button className='btn btn-sm float-end btn-secondary' onClick={handleClickAdd}>Add</button>
          </di>
        </div>
      </header>
      <TreeTableDt/>

      <Dialog header="Add" visible={visible} onHide={handleClickClose} draggable={false}
        style={{ width: '60vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} footer={footerContent}>
        <div className='p-1 pt-0'>
          <DynamicForm
           formContent={basicinfoForm}
           initialValues={basicformInitialValues}
           onHandleChange={onbasicformFormChange}
           formikRef={basicinfoFormRef}
          />
        </div>   
      </Dialog>
    </div>
  )
}

export default TesterPage