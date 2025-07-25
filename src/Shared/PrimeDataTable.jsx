import React,{useEffect, useState} from 'react'
import { DataTable } from 'primereact/datatable'
import { FilterMatchMode } from 'primereact/api';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Column } from 'primereact/column';
import Loader from './Loader';
import PropTypes from 'prop-types';
import Nodata from '../Assets/img/no_data.png'
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';

function PrimeDataTable({dtOptions,tableData=[],children,searchText='',loader}) {

    const language = useSelector((state) => state.searchApi.language)
    const screenWidth = window.innerWidth;
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    useEffect(() => {
        const onGlobalFilterChange = (value) => {
            let _filters = { ...filters };
            _filters['global'].value = value;
            setFilters(_filters);
            setGlobalFilterValue(value);
        };

        if (searchText !== globalFilterValue) {
            onGlobalFilterChange(searchText);
        }
        
    }, [searchText, globalFilterValue,filters]); 

    const headerGroup = (
        <ColumnGroup>
            <Row>
                {
                    dtOptions.columns.map((e, i) => {
                        if (e['parent'] !== undefined)
                            if (e['cols'] !== undefined)
                                return <Column key={e.header} field={e.data} header={<FormattedMessage id={e.parent}/>} colSpan={e.cols} />
                            else return null
                        else {return <Column key={e.header} field={e.data} header={<FormattedMessage id={e.header}/>} rowSpan={2} frozen={e['frozen'] !== undefined && (screenWidth >= 800 || i === 0)} sortable />}
                    })
                }
                {
                    children && <Column key={'action'} header={<FormattedMessage id={'Action'}/>} rowSpan={2}/>  
                }
            </Row>
            { (dtOptions.columns.filter((k)=>{return ('parent' in k)}).length !== 0) &&
                <Row>
                    {
                        dtOptions.columns.map((e, i) => {
                            if (e['parent'] !== undefined)
                                return <Column key={e.header} field={e.data} header={<FormattedMessage id={e.header}/>} sortable />
                            else
                                return null
                        })
                    }
                    <Column style={{display:'none'}} />
                    <Column style={{display:'none'}} />
                    <Column style={{display:'none'}} />
                    <Column style={{display:'none'}} />
                    <Column style={{display:'none'}} />
                </Row>
            }
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
        <div className='' style={{textWrap:'nowrap'}}>
            <Loader enableLoader={loader} />
            {!loader && <DataTable  filters={filters} filterDisplay="row" scrollable value={tableData} emptyMessage={noDataFound} headerColumnGroup={headerGroup} stripedRows showGridlines size="small"  paginator
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate={`${(language==='english')?'Showing {first} to {last} of {totalRecords}':'{first} से {last} तक दिखा रहे हैं, कुल {totalRecords}'}`} rows={50} rowsPerPageOptions={[50,75,100,200]}>
                {
                    dtOptions.columns.map((e, i) => {
                        return <Column key={e.header} field={e.data} header={e.header} frozen={e['frozen'] !== undefined && (screenWidth >= 800 || i === 0)} sortable  body={e.render} />
                    })
                }
                {children}
            </DataTable>}
        </div>
    
    );
}

PrimeDataTable.propTypes = {
    tableData: PropTypes.arrayOf(PropTypes.object),
    dtOptions: PropTypes.object,
    children: PropTypes.element,
    searchText: PropTypes.string,
    loader: PropTypes.bool
  };

export default PrimeDataTable