import { DataTable } from 'primereact/datatable'
import React, { useState } from 'react'
import { exportPdf } from './exportPdf'
import { exportExcel } from './exportExcel'
import { exportWord } from './exportWord'
import { Column } from 'primereact/column'
import { Row } from 'primereact/row'
import Loader from './Loader'
import { ColumnGroup } from 'primereact/columngroup'
import PropTypes from 'prop-types'
import { object } from 'yup'
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux'
import Nodata from '../Assets/img/no_data.png'

function DynamicDatatable({dtOptions , data=[],children,totalCount=0,filterData,loading=false, filterBtn = true}) {

const language = useSelector((state) => state.searchApi.language)
const screenWidth = window.innerWidth;
const [maximized, setMaximized] = useState(String(sessionStorage.getItem('maxScreen')) === 'true');
const [rowsCount, setRowsCount] = useState(50);



const fullScreen = () => {
    if (!maximized) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
    sessionStorage.setItem('maxScreen',!maximized)
    setMaximized(!maximized);
};

const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
    }
};

const exitFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
        document.msExitFullscreen();
    }
};



    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 50,
        page: 1,
        sortField: null,
        sortOrder: null,
    });

    const loadLazyData = (event) => {
        let loadLazyTimeout = null;
        if (loadLazyTimeout) {
            clearTimeout(loadLazyTimeout);
        }

        // loadLazyTimeout = 
        setTimeout(() => {
            let req={
                startLimit:event.first || 0,
                endLimit:event.rows || 50
            }
            filterData(req)
        }, Math.random() * 1000 + 250);
    }

    const onPage = (event) => {
        setRowsCount(event.rows)
        setLazyParams(event);
        loadLazyData(event)
    }

    const onSort = (event) => {
        setLazyParams(event);
        loadLazyData(event)
    }

    const onFilter = (event) => {
        event['first'] = 0;
        setLazyParams(event);
        loadLazyData(event)
    }

    const headerGroup = (
        <ColumnGroup>
            <Row>
                {
                    dtOptions.columns.map((e, i) => {
                        if (e['parent'] !== undefined)
                            if (e['cols'] !== undefined)
                                return <Column key={e.header} field={e.data} header={<FormattedMessage id={e.parent} />} colSpan={e.cols} />
                            else return null
                        else return <Column key={e.header} field={e.data} header={<FormattedMessage id={e.header} />} rowSpan={2} frozen={e['frozen'] !== undefined && (screenWidth >= 800 || i === 0)} sortable />
                    })
                }
            </Row>
            {(dtOptions.columns.filter((k)=>{return ('parent' in k)}).length !== 0) && <Row>
                {
                    dtOptions.columns.map((e, i) => {
                        if (e['parent'] !== undefined)
                            return <Column key={e.header} field={e.data} header={<FormattedMessage id={e.header} />} sortable />
                        else
                            return null
                    })
                }
                <Column style={{display:'none'}} />
                <Column style={{display:'none'}} />
                <Column style={{display:'none'}} />
                <Column style={{display:'none'}} />
                <Column style={{display:'none'}} />
            </Row>}
        </ColumnGroup>
    );

    const noDataFound = (
        <div className='datatableNoDataImageFound'>
                     <img
                        src={Nodata}
                        alt="No data found"
                        style={{ width: '250px', height: '160px', marginBottom: '10px' }}
                    />
            <p className='fs-15 fw-500 mb-0'><FormattedMessage id="No Data Found"/></p>
        </div>
    )

  return (
    <div className={maximized ? 'maximized-datatable p-2' : ''}>
        <div className='row my-1 align-items-center'>
                    <div className='col-6 text-start'>
                        <h6 className='mb-0'><FormattedMessage id={dtOptions.title} /></h6>
                    </div>
                    <div className='col-6 text-end d-flex align-items-center justify-content-end'>
                        {filterBtn && <button className="btn btn-primary icon-btn" title='Filter'  data-bs-toggle="collapse" data-bs-target="#filterButton">
                        <i className="pi pi-filter filterIcon"></i> <i className="pi pi-filter-slash filterIconSlash"></i>
                        </button>}
                        <button className='btn btn-excel icon-btn' type='button' title='Excel' onClick={() => { exportExcel(dtOptions, data) }}>
                            <i className="pi pi-file-excel"   ></i>
                        </button>
                        <button className='btn btn-pdf icon-btn' type='button' title='PDF' onClick={() => { exportPdf(dtOptions, data) }}>
                            <i className="pi pi-file-pdf"  ></i>
                        </button>
                        <button className='btn btn-word icon-btn' type='button' title='Word' onClick={() => { exportWord(dtOptions, data) }}>
                            <i className="pi pi-file-word"></i>
                        </button>
                        {!maximized && <button className='btn btn-max-min icon-btn' type='button' title='Maximize' onClick={() => { fullScreen() }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M8 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V16M21 8V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H16M21 16V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </button>}
                        {maximized && <button className='btn btn-max-min icon-btn' type='button' title='Minimize' onClick={() => { fullScreen() }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.99988 8H3.19988C4.88004 8 5.72011 8 6.36185 7.67302C6.92634 7.3854 7.38528 6.92646 7.6729 6.36197C7.99988 5.72024 7.99988 4.88016 7.99988 3.2V3M2.99988 16H3.19988C4.88004 16 5.72011 16 6.36185 16.327C6.92634 16.6146 7.38528 17.0735 7.6729 17.638C7.99988 18.2798 7.99988 19.1198 7.99988 20.8V21M15.9999 3V3.2C15.9999 4.88016 15.9999 5.72024 16.3269 6.36197C16.6145 6.92646 17.0734 7.3854 17.6379 7.67302C18.2796 8 19.1197 8 20.7999 8H20.9999M15.9999 21V20.8C15.9999 19.1198 15.9999 18.2798 16.3269 17.638C16.6145 17.0735 17.0734 16.6146 17.6379 16.327C18.2796 16 19.1197 16 20.7999 16H20.9999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        </button>}
                    </div>
        </div>
        <div className="" style={{ textWrap: 'nowrap' }}>
            <Loader enableLoader={loading} />
            {!loading && <DataTable  filterDisplay="row" headerColumnGroup={headerGroup}  value={data} lazy  scrollable   stripedRows showGridlines size="small" 
                emptyMessage={noDataFound} paginator first={lazyParams.first}  totalRecords={totalCount} onPage={onPage}
                onSort={onSort} sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                onFilter={onFilter}  loading={loading}
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate={`${(language==='english')?'Showing {first} to {last} of {totalRecords}':'{first} से {last} तक दिखा रहे हैं, कुल {totalRecords}'}`} rows={rowsCount} rowsPerPageOptions={[50, 75, 100, 200]}
               >
                {
                    dtOptions.columns.map((e, i) => {
                        return <Column key={`${e.data}-${i}`} field={e.data} header={e.header} sortable frozen={e['frozen'] !== undefined && (screenWidth >= 800 || i === 0)} body={e.render} />
                    })
                }
                {children}
            </DataTable>}
        </div>
    </div>
);
}

DynamicDatatable.propTypes = {
    dtOptions:PropTypes.object,
    loading:PropTypes.bool,
    data:PropTypes.arrayOf(object),
    children:PropTypes.element,
    filterData:PropTypes.func,
    totalCount:PropTypes.number,
    filterBtn: PropTypes.bool
}

export default DynamicDatatable