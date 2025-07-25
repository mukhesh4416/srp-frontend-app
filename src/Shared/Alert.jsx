import React, { useState } from 'react'

function Alert(showAlert=false) {

 const [visible,setVisible]=useState(false)
  return (
    <Dialog header="Header" visible={visible} style={{ width: '25vw' }} onHide={() => setVisible(false)}>
        
    </Dialog>
  )
}

export default Alert