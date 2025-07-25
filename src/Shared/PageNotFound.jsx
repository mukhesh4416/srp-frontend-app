import React from 'react'
import ErrorPng from '../Assets/img/404.png'
import { useNavigate } from 'react-router-dom'

function PageNotFound() {
  const navigate = useNavigate()

  return (
    <div className="error-403 w-100 h-100">
        <div className="row justify-content-center align-items-center w-100 h-100">
        <div className="col-6">
            <div className="card border-0" style={{ background: 'none' }}>
            <div className='d-flex flex-column align-items-center'>
                <div className=''>
                <img className="blob-icn" alt="" src={ErrorPng} width='400' />
                </div>
                <div className="">
                <div className="error-box mb-4">
                    <div className="error-msg mb-1">Oops! Page Not Found</div>
                    <span className='fs-13 fw-500 text-secondary'>Sorry, the page you're looking for cannot be found</span>
                </div>
                <button className='btn btn-sm btn-primary p-2 px-4 btn-back' type='button' onClick={()=>{navigate('/rms/home')}}>Back to Homepage</button>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default PageNotFound