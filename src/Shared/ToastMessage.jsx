
import React, { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

function ToastMessage({color,subject,content}) {

    const toastMsg = useSelector((state)=>state.srp.toast)
    const toast = useRef(null);
    useEffect(()=>{
        if(toastMsg)
        toast.current.show({severity:toastMsg?.type, summary: toastMsg?.msg, detail:toastMsg?.content, life: 3000});
    },[toastMsg])

    return (
        <div className="flex justify-content-center">
            <Toast ref={toast} position="top-left"/>
        </div>
    )
}

ToastMessage.propTypes = {
    color: PropTypes.string,
    subject: PropTypes.string,
    content: PropTypes.string,
  };
        
export default ToastMessage