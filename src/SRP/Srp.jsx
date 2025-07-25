import React from 'react'
import { Outlet } from 'react-router-dom'
import MenuHeader from './MenuHeader'

function Srp() {
  return (
       <div className="wrapper d-flex flex-column align-items-stretch w-100 ">
            <div>
               <main>
                  <section>
                     <div className='content'>
                        <header className="w-100">
                          <MenuHeader/>
                        </header>
                        <div className='container-fluid  body-container'>
                           <Outlet />
                        </div>
                     </div>
                  </section>
               </main>
            </div>
    </div>
  )
}

export default Srp