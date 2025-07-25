import React from 'react';
import ErrorPng from '../Assets/img/no-result.png'
import { useNavigate } from 'react-router-dom';

function Forbidden() {
  const navigate = useNavigate()

  return (
    // forbidden(no access)
    <div className="error-403 w-100 h-100">
      <div className="row justify-content-center align-items-center w-100 h-100">
        <div className="col-6">
          <div className="card border-0" style={{ background: 'none' }}>
            <div className='d-flex flex-column align-items-center'>
              <div className='mb-4'>
                <img className="blob-icn" alt="" src={ErrorPng} width='400' />
              </div>
              <div className="">
                <div className="error-box mb-4">
                  <div className="error-msg mb-1">Access Denied</div>
                  <span className='fs-13 fw-500 text-secondary'>You have no access to view this page</span>
                </div>
                <button className='btn btn-sm btn-primary p-2 px-4 btn-back' type='button' onClick={()=>{navigate('/rms/home')}}>Back to Homepage</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      // forbidden(no access)

    //   <div className="error">
    //   <div className="error-inner">
    //     <div className="frame-parent">
    //       <div className="ooops-parent">
    //         <h1 className="ooops">Ooops....</h1>
    //         <div className="page-not-found">Page not found</div>
    //       </div>
    //       <div className="rectangle-parent">
    //         <div className="frame-child" />
    //         <div className="go-back">Go Back</div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="error-child">
    //     <div className="blob-parent">
    //       <img className="blob-icon" alt="" src={'ErrorPng'} width={200} />
    //     </div>
    //   </div>
    // </div>

  )
}

export default Forbidden