import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import Loader from './Loader'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
// import { exportPdf } from './exportPdf'
// import { exportExcel } from './exportExcel'
// import { exportWord } from './exportWord'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api';
import PropTypes from 'prop-types'
import { object } from 'yup'

function DefaultDatatable({ dtOptions, data = [], children, loader }) {

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const headerGroup = (
        <ColumnGroup>
            <Row>
                {
                    dtOptions.columns.map((e, i) => {
                        if (e['parent'] !== undefined)
                            if (e['cols'] !== undefined)
                                return <Column key={`${e.parent}-${i}`} field={e.data} header={e.parent} colSpan={e.cols} />
                            else return null
                        else return <Column key={`${e.header}-${i}`} field={e.data} header={e.header} rowSpan={2} frozen={e['frozen'] !== undefined} sortable />
                    })   
                }
                {
                    children && <Column key={'action'} header={'Action'} rowSpan={2}/>  
                }
            </Row>
            {(dtOptions.columns.filter((k) => { return ('parent' in k) }).length !== 0) && <Row>
                {
                    dtOptions.columns.map((e, i) => {
                        if (e['parent'] !== undefined)
                            return <Column key={`${e.header}-${i}`} field={e.data} header={e.header} sortable />
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
            {/* <img
                src={Nodata}
                alt="No data found"
                style={{ width: '250px', height: '160px', marginBottom: '10px' }}
            /> */}
            <p className='fs-15 fw-500 mb-0'>No Data Found</p>
        </div>
    )
    return (
        <div className={'p-1'}>
            <div className='row my-1 mb-2 align-items-md-center'>
                {/* <div className='col-md-3 text-start'>
                    <h6 className='mb-0'>{dtOptions.title}</h6>
                </div> */}
                <div className='col-md-12'>
                    <span className="p-input-icon-left me-2">
                        <i className="pi pi-search searchPiIcon" style={{color:"#589f70",right:"10px"}}/>
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Search.." style={{height:"30px",border: '1px solidrgba(88, 159, 112, 0.76)'}}/>
                    </span>
                    {/* <button className="btn btn-primary icon-btn" title='Filter'  data-bs-toggle="collapse" data-bs-target="#filterButton">
                        <i className="pi pi-filter filterIcon"></i> <i className="pi pi-filter-slash filterIconSlash"></i>
                    </button> */}
                    {/* <button className='btn btn-excel icon-btn' type='button' title='Excel' onClick={() => { exportExcel(dtOptions, data) }}>
                        <i className="pi pi-file-excel"   ></i>
                    </button>
                    <button className='btn btn-pdf icon-btn' type='button' title='PDF' onClick={() => { exportPdf(dtOptions, data) }}>
                        <i className="pi pi-file-pdf"  ></i>
                    </button>
                    <button className='btn btn-word icon-btn' type='button' title='Word' onClick={() => { exportWord(dtOptions, data) }}>
                        <i className="pi pi-file-word" ></i>
                    </button> */}
                </div>
            </div>
            <div className='' style={{ textWrap: 'nowrap' }}>
                <Loader enableLoader={loader} />
                {!loader &&
                    <DataTable filters={filters} filterDisplay="row" scrollable value={data} headerColumnGroup={headerGroup} emptyMessage={noDataFound} stripedRows showGridlines size="small" paginator
                        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                        currentPageReportTemplate={`Showing {first} to {last} of {totalRecords}`} rows={50} rowsPerPageOptions={[50, 75, 100, 200]}>
                        {
                            dtOptions.columns.map((e, i) => {
                                return <Column key={`${e.data}-${i}`} field={e.data} header={e.header} sortable frozen={e['frozen'] !== undefined} body={e.render} />
                            })
                        }
                        {children}
                    </DataTable>
                }
            </div>
        </div>
    );
}

DefaultDatatable.propTypes = {
    dtOptions: PropTypes.object,
    loader: PropTypes.bool,
    data: PropTypes.arrayOf(object),
    children: PropTypes.element,
}

export default DefaultDatatable