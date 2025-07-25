import React, { useEffect, useState } from 'react'
import ErrorPng from '../Assets/img/nointernet.png'
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Button } from 'primereact/button';


function CheckInternet() {
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
      const handleOnline = () => {
        setOnline(true);
      };
  
      const handleOffline = () => {
        setOnline(false);
      };
  
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
  
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);
  
  const message = (
    <div className="row justify-content-center align-items-center w-100 h-100">
    <div className="col-12">
      <div className="card border-0" style={{ background: 'none' }}>
        <div className='d-flex flex-column align-items-center'>
          <div className='mb-4'>
            <img className="blob-icn" alt="" src={ErrorPng} width='400' />
          </div>
          <div className="">
            <div className="error-box mb-4">
              <div className="error-msg mb-1">Connection Lost</div>
              <span className='fs-13 fw-500 text-secondary'>Oops! Looks like your connection got lost.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
  
  const footer = (
    <div className="custom-footer">
      <Button label="Ok" className="p-button-primary" onClick={()=>{setOnline(true)}} />
    </div>
  );
  return (
          <ConfirmDialog
        visible={!online}
        onHide={() => setOnline(true)}
        message={message}
        footer={footer}
        className="custom-confirm-dialog internet-lost-dlg"
        style={{ width: '50vw' }}
      />
  )
}

export default CheckInternet