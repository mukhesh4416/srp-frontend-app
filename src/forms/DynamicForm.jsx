import React, { useEffect } from 'react'
import * as yup from 'yup'
import { Formik, Form, ErrorMessage } from'formik'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Rating } from 'primereact/rating';
import { FileUpload } from 'primereact/fileupload';

const DynamicForm = ({formContent , initialValues  , onHandleChange , formikRef})=>{
    
  useEffect(()=>{

  },[])

  const createShema = ()=>{
    let obj = {}
    formContent.columns.forEach((e)=> {
       if(e['validations'])obj[e['key']]=e.validations
    })
    return obj
  } 

  const _validationSchema = yup.object().shape(
    createShema()
  );
  const getGridClass = (grid)=>{
    let gridClass = ''
    if(grid){
      Object.keys(grid).forEach((key)=>{
        gridClass += key=='xs'? `col-${grid[key]} mb-2` : `col-${key}-${grid[key]} mb-2`
      })
    }else{
      Object.keys(formContent.grid).forEach((key)=>{
        gridClass +=   key=='xs'? `col-${formContent.grid[key]} mb-2` : `col-${key}-${formContent.grid[key]} mb-2`
      })
    }
    return gridClass;
  }
  return (
    <div id='dform'>
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={_validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
        }}
    >
        {({ handleChange, handleSubmit, getFieldProps, handleBlur, errors, touched, values, resetForm, setFieldValue, dirty  }) => (

                <Form className='w-100 dynamic-form' id={formContent.formName}>
                    <div className='row'>
                      {
                        formContent.columns.map((el)=>{

                          switch (el.field){
                            case 'String':
                                return <div className={getGridClass(el.grid)} key={el.key}>
                                          <label htmlFor={el.key+'test'} className='mb-1 d-block'>{el.label}</label>
                                          <InputText className='form-feild w-100' id={el.key+'test'} type="text"  placeholder={el.label} name={el.key} value={initialValues[el.key]} onChange={onHandleChange} onBlur={handleBlur} />
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                      </div>

                            case 'TextArea':
                              return  <div className={getGridClass(el.grid)} key={el.key}>
                                          <label htmlFor={el.key+'test'} className='mb-1 d-block'>{el.label}</label>
                                          <InputTextarea className='form-feild w-100' id={el.key+'test'}  rows={2} placeholder={el.label} name={el.key} value={initialValues[el.key]} onChange={onHandleChange} onBlur={handleBlur} />
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                      </div>

                            case 'Number':
                              return  <div className={getGridClass(el.grid)} key={el.key}>
                                          <label htmlFor={el.key+'test'} className='mb-1 d-block'>{el.label}</label>
                                          <InputNumber className='form-feild w-100' id={el.key+'test'}  useGrouping={false}  placeholder={el.label} name={el.key} value={initialValues[el.key]} onChange={(e)=>{onHandleChange(e.originalEvent)}} onBlur={handleBlur} />
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                      </div>

                            case 'Select':
                              return  <div className={getGridClass(el.grid)} key={el.key}>
                                          <label htmlFor={el.key+'test'} className='mb-1 d-block'>{el.label}</label>
                                          <Dropdown className='form-feild w-100' id={el.key+'test'}  placeholder={`Select ${el.label}`} options={el.options} optionLabel={el.optionLabel} name={el.key}  optionValue={el.optionValue} value={initialValues[el.key]} onChange={onHandleChange} onBlur={handleBlur} />
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                      </div>

                            case 'SearchSelect':
                              return  <div className={getGridClass(el.grid)} key={el.key}>
                                          <label htmlFor={el.key+'test'} className='mb-1 d-block'>{el.label}</label>
                                          <Dropdown className='form-feild w-100' id={el.key+'test'}  placeholder={`Select ${el.label}`} options={el.options} optionLabel={el.optionLabel}  optionValue={el.optionValue} name={el.key} value={initialValues[el.key]} filter filterBy={el.optionLabel} onChange={onHandleChange} onBlur={handleBlur} />
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                      </div>

                            case 'Date':
                              return  <div className={getGridClass(el.grid)} key={el.key}>
                                        <div className={`${el.class} form-input date-input`}>
                                          <label htmlFor={el.key+'test'} className='mb-6px'>{el.label}</label>
                                          <Calendar className='form-feild' id={el.key+'test'} name={el.key} showTime={el.showTime}  hourFormat={el.hourFormat?'12':'24'}  
                                          timeOnly={el.timeOnly} dateFormat="dd/mm/yy" value={initialValues[el.key]} onChange={onHandleChange} onBlur={handleBlur} placeholder='DD/MM/YYYY'/>
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                        </div>
                                      </div>

                            case 'Month':
                              return  <div className={getGridClass(el.grid)} key={el.key}>
                                        <div className={`${el.class} form-input`}>
                                          <label htmlFor={el.key+'test'} className='mb-6px'>{el.label}</label>
                                          <Calendar className='form-feild' id={el.key+'test'} name={el.key}   view="month" dateFormat="mm/yy"value={initialValues[el.key]} onChange={onHandleChange} onBlur={handleBlur}/>
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                        </div>
                                      </div>

                            case 'Year':
                              return  <div className={getGridClass(el.grid)} key={el.key}>
                                        <div className={`${el.class} form-input`}>
                                          <label htmlFor={el.key+'test'} className='mb-6px'>{el.label}</label>
                                          <Calendar className='form-feild' id={el.key+'test'} name={el.key}   view="year" dateFormat="yy" value={initialValues[el.key]} onChange={onHandleChange} onBlur={handleBlur}/>
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                        </div>
                                      </div>
                                      
                            case 'Rating':
                              return  <div className={getGridClass(el.grid)} key={el.key}>
                                        <div className={`${el.class} form-input`}>
                                          <label htmlFor={el.key+'test'} className='mb-6px'>{el.label}</label>
                                          <Rating  className='form-feild' id={el.key+'test'} name={el.key} value={initialValues[el.key]} stars={el.stars} onChange={onHandleChange} cancel={false} />
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                        </div>
                                      </div>

                            case 'File':
                                return <div className={getGridClass(el.grid)} key={el.key}>
                                          <label htmlFor={el.key+'test'} className='mb-1 d-block'>{el.label}</label>
                                           <FileUpload 
                                              mode="basic"
                                              name={el.key}
                                              customUpload
                                              maxFileSize={1000000}
                                              onSelect={(e)=>{
                                                const file = e.files[0];
                                                if (file){
                                                  onHandleChange({
                                                    target: {
                                                      name: "file",
                                                      value: file
                                                    }
                                                  });
                                                  if (e.options && typeof e.options.clear === "function") {
                                                    e.options.clear();
                                                  }
                                                }
                                              }}
                                              chooseLabel="Attachment File"
                                            />
                                          <ErrorMessage name={el.key} component="div" className="error-text" />
                                      </div>

                            case 'None':
                              return  <div className={getGridClass(el.grid)} key={el.key}>
                                      </div>
                          }
                        })
                      }
                    </div>
                </Form>

        )}
    </Formik>
    </div>
  )

}

export default DynamicForm