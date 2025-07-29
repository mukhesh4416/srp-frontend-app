import './App.css'
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import ToastMessage from './Shared/ToastMessage';
import { HashRouter } from 'react-router-dom';
import RoutesConfig from './RoutesConfig';
import 'react-mosaic-component/react-mosaic-component.css';

function App() {

  return (
    <>
       <HashRouter>
          <React.Suspense fallback={<div>Loading...</div>}>
            {/* <Loader enableLoader={!checkStatus} loaderHeight={'100%'} /> */}
            <RoutesConfig/>
          </React.Suspense>
        </HashRouter>
      <ToastMessage />
    </>
  )
}

export default App
