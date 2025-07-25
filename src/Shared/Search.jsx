import React, { useEffect, useRef, useState } from 'react'
import { Dropdown } from './PrimeImports';
import PropTypes from 'prop-types';
import { Formik, Form, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { getSearchFiltersApi } from '../Stores/services/rmsServices';
import { setEmptyData, showToastMessage } from '../Stores/Slices/searchSlice';
import { Calendar } from 'primereact/calendar';
import { currentDate, get1HourBackTime, getFromDate, yesterDayDate } from './dateFormats';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';


function Search({ dateFlag = true, dateFilter = true, fetchData, removeAllForLocoNo = false, minFromDate = 6, loader=false, showReload = false, runTime=30000 }) {

    const { getSearchLists } = useSelector((state) => state.searchApi)
    const dispatch = useDispatch()
    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);
    const dateTimeRef = useRef(null);

    const [shedList, setShedList] = useState([])
    const [locoTypeList, setLocoTypeList] = useState([])
    const [vendorList, setVendorList] = useState([])
    const [locoList, setLocoList] = useState([])
    const [reloadFlag, setReloadFlag] = useState(false)

    const [initialFormValues, setInitialFormValues] = useState({
        shed: '',
        locoType: '',
        vendor: '',
        loco: '',
        date: null,
        toDateTime: null,
        fromDateTime: null,
        fromDate: null,
        toDate: null
    })

    const handleSearchBtn = async (searchData) => {
        let sData = {
            shed: searchData.shed,
            locoType: searchData.locoType,
            vendor: searchData.vendor,
            loco: searchData.loco,
            date: searchData.date,
            fromDateTime: get1HourBackTime(searchData['toDateTime']),
            toDateTime: searchData['toDateTime'],
            fromDate: searchData.fromDate,
            toDate: searchData.toDate,
            reFlag: searchData.loco?.locoId !== "0"
        }
        if (sData.fromDate != null && sData.toDate != null && searchData.loco && searchData.toDateTime != null){
            sessionStorage.setItem("SearchData", JSON.stringify(sData))
            fetchData()
        }
        else if(!searchData.loco){
            dispatch(showToastMessage({type:'info',msg:'',content:'Please select Loco'}))
        }else{
            dispatch(showToastMessage({type:'info',msg:'',content:'Date not slected..!'}))
        }
    }

    const handleResetBtn = (setFieldValue) => {
        let resetdata = {
            shed: { shedId: "0", shedCode: "All" },
            locoType: { ltId: "0", ltCode: "All" },
            vendor: { vendorId: "0", vendorName: "All" },
            loco: { locoId: "0", locoNo: "All" },
            date: [yesterDayDate, currentDate],
            fromDateTime: get1HourBackTime(new Date()),
            toDateTime: new Date(),
            fromDate: yesterDayDate,
            toDate: currentDate,
            reFlag: false
        }
        const locoArList = [...getSearchLists.locoList]
        if (removeAllForLocoNo) {
            locoArList.shift();
            resetdata['loco'] = locoArList?.[0]
        }
        setLocoList(locoArList)
        sessionStorage.setItem("SearchData", JSON.stringify(resetdata))
        let keys = Object.keys(resetdata)
        for (let key of keys) {
            setFieldValue([key], resetdata[key])
        }
        fetchData()
    }

    const onSetFieldsValues = (e, setFieldValue, control) => {
        setFieldValue(control, e.value)
    }

    const onChangeShed = (e, setFieldValue, formValue) => {
        setFieldValue('shed', e.value)
        filterLocoList(e.value.shedId, formValue.locoType.ltId, formValue.vendor.vendorId, setFieldValue)
    }

    const onChangeLocoType = (e, setFieldValue, formValue) => {
        setFieldValue('locoType', e.value)
        filterLocoList(formValue.shed.shedId, e.value.ltId, formValue.vendor.vendorId, setFieldValue)
    }

    const onChangeVendor = (e, setFieldValue, formValue) => {
        setFieldValue('vendor', e.value)
        filterLocoList(formValue.shed.shedId, formValue.locoType.ltId, e.value.vendorId, setFieldValue)
    }

    const filterLocoList = (shedId, locoTypeId, vendorId, setFieldValue) => {
        let filterLocos = getSearchLists.locoList.filter((e) => {
            return ((+(shedId) === 0 || +(e.shedId) === +(shedId)) && (+(locoTypeId) === 0 || +(locoTypeId) === +(e.ltId)) && (+(vendorId) === 0 || +(e.vendorId) === +(vendorId))) || +(e.locoId) === 0
        });
        let locoAry = [...filterLocos];
        if (filterLocos && removeAllForLocoNo)
            locoAry.shift();
        setLocoList(locoAry)
        setFieldValue('loco', locoAry[0]);
    }

    const dateFooterTemplate = (type)=>{
        return <button className="btn btn-sm datepicker-close-btn w-100 text-center"  onClick={()=>{
            switch(type){
                case 'fromDate':
                    fromDateRef.current?.hide()
                    break;
                case 'toDate':
                    toDateRef.current?.hide()
                    break;
                default:
                    dateTimeRef.current?.hide()
                    break;
            }
        }} >Ok</button>
    }

    useEffect(() => {

        let ignore = false
        dispatch(setEmptyData())

        const patchData = (data) => {
            setShedList(data.shedList)
            setLocoTypeList(data.locoTypeList)
            setVendorList(data.vendorList)

            if (!sessionStorage.getItem("SearchData")) {
                sessionStorage.setItem("SearchData",
                    JSON.stringify({
                        shed: { shedId: "0", shedCode: "All" },
                        locoType: { ltId: "0", ltCode: "All" },
                        vendor: { vendorId: "0", vendorName: "All" },
                        loco: data.locoList && removeAllForLocoNo ? data.locoList[0] : { locoId: "0", locoNo: "All" },
                        date: [yesterDayDate, currentDate],
                        toDateTime: currentDate,
                        fromDateTime: get1HourBackTime(currentDate),
                        fromDate: yesterDayDate,
                        toDate: currentDate,
                        reFlag: false,
                    })
                )
            }
            let obj = JSON.parse(sessionStorage.getItem("SearchData"))
            let locoArrayList = [...data.locoList]
            if (data.locoList && removeAllForLocoNo) {
                locoArrayList.shift();
            }
            let filterLocos = locoArrayList.filter((e) => {
                return ((+(obj?.shed?.shedId) === 0 || +(e.shedId) === +(obj?.shed?.shedId)) && (+(obj?.locoType?.ltId) === 0 || +(obj?.locoType?.ltId) === +(e.ltId)) && (+(obj?.vendor?.vendorId) === 0 || +(obj?.vendor?.vendorId) === +(e.vendorId))) || +(e.locoId) === 0
            });
            setLocoList([...filterLocos])

            obj['date'] = [new Date(obj['date'][0]), new Date(obj['date'][1])]
            obj['fromDateTime'] = get1HourBackTime(new Date())
            obj['toDateTime'] = new Date()
            obj['fromDate'] = (minFromDate !== 0 && new Date(obj['fromDate']) < getFromDate(minFromDate))?getFromDate(minFromDate):new Date(obj['fromDate'])
            obj['toDate'] = new Date(obj['toDate'])
            
            if(obj['reFlag'] === false && obj['loco']?.locoId === "0"){
                obj['loco'] = removeAllForLocoNo?filterLocos[0] :{ locoId: "0", locoNo: "All" }
            }
            setInitialFormValues(obj)
            sessionStorage.setItem("SearchData", JSON.stringify(obj))
        }


        const getApiData = async () => {
            return dispatch(getSearchFiltersApi(null))
        }

        const getFiltersData = async () => {
            let data = []
            if (getSearchLists) {
                patchData(getSearchLists)
            } else {
                const getData = await getApiData()
                data = (getData.payload) ? getData.payload[0] : []
                if (data) patchData(data);
            }
        }

        if (!ignore) {
            getFiltersData()
        }

        return () => {
            ignore = true
        };
    }, [dispatch, removeAllForLocoNo, getSearchLists, minFromDate])

    const intervalRef = useRef(null);
    const autoReload = (val)=>{
        setReloadFlag(val)
    }

    useEffect(() => {
        if (reloadFlag) {
          intervalRef.current = setInterval(() => {
            if(!dateFlag){
                let obj = JSON.parse(sessionStorage.getItem("SearchData"))
                obj['fromDateTime'] = new Date(moment(obj['toDateTime']).subtract(10, "minutes").format("YYYY-MM-DD HH:mm") + ":00")
                obj['toDateTime'] = new Date(moment(obj['toDateTime']).add(30,'seconds').format("YYYY-MM-DD HH:mm:ss"))
                sessionStorage.setItem("SearchData", JSON.stringify(obj))
                setInitialFormValues(obj)
            }

            fetchData('auto')
          }, runTime);
        } else {
          clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [reloadFlag,fetchData,runTime,dateFlag]);

    return (
        <Formik
            initialValues={initialFormValues}
            enableReinitialize={true}
            onSubmit={(values) => {
                if(!loader)
                    handleSearchBtn(values);
            }}>
            {({ handleChange, handleSubmit, getFieldProps, handleBlur, errors, touched, values, resetForm, setFieldValue }) => (
                <Form>
                    <div className='card p-2 w-100  mb-1 search-filter'>
                        <div className="row">
                            <div className="row m-0 p-0 col-xl-3  col-md-8 col-sm-12 d-flex flex-column flex-md-row align-items-md-center align-items-start  py-1">
                                <div className="col-xl-6  col-md-6 col-sm-12 d-flex flex-column flex-md-row align-items-md-center align-items-start py-1">
                                    <span className="p-float-label">
                                        <Dropdown id="shed" name="shed" value={values.shed} options={shedList} onChange={(e) => onChangeShed(e, setFieldValue, values)} optionLabel="shedCode" filter filterBy="shedCode" placeholder="Select Shed" />
                                        <ErrorMessage name="shed" component="div" className="text-danger" />
                                        <label htmlFor="shed"><FormattedMessage id={'Shed'} /></label>
                                    </span>
                                </div>
                                <div className="col-xl-6  col-md-6 col-sm-12 d-flex flex-column flex-md-row align-items-md-center align-items-start py-1">
                                    <span className="p-float-label">
                                        <Dropdown id="locoType" name="locoType" value={values.locoType} options={locoTypeList} onChange={(e) => onChangeLocoType(e, setFieldValue, values)} optionLabel="ltCode" filter filterBy="ltCode" placeholder="Select Type" />
                                        <label htmlFor="locoType"><FormattedMessage id={'Type'} /></label>
                                    </span>
                                </div>
                            </div>
                            <div className="col-xl-2  col-md-4 col-sm-12 d-flex flex-column flex-md-row align-items-md-center align-items-start py-1">
                                <span className="p-float-label">
                                    <Dropdown id="vendor" name="vendor" value={values.vendor} options={vendorList} onChange={(e) => onChangeVendor(e, setFieldValue, values)} optionLabel="vendorName" filter filterBy="vendorName" placeholder="Select Vendor" />
                                    <label htmlFor="vendor"><FormattedMessage id={'Vendor'} /></label>
                                </span>
                            </div>
                            <div className="col-xl-2  col-md-4 col-sm-12 d-flex flex-column flex-md-row align-items-md-center align-items-start py-1">
                                <span className="p-float-label">
                                    <Dropdown id="loco" name="loco" value={values.loco} options={locoList} onChange={(e) => onSetFieldsValues(e, setFieldValue, 'loco')} optionLabel="locoNo" filter filterBy="locoNo" placeholder="Select Loco" />
                                    <label htmlFor="loco"><FormattedMessage id={'Loco'} /></label>
                                </span>
                            </div>
                            {dateFilter && ((dateFlag) ?
                                // <div className="col-3 d-flex align-items-center">
                                //     <label htmlFor="range" className='px-2'><FormattedMessage id={'Date From - To'} /></label>
                                //     <Calendar id="range" name="date"  dateFormat="dd/mm/yy" value={values.date} onChange={(e) => onSetFieldsValues(e,setFieldValue,'date')} selectionMode="range" readOnlyInput numberOfMonths={2} maxDate={new Date()}/>
                                // </div>
                                <div className="row m-0 p-0 col-xl-3  col-md-4 col-sm-12 d-flex flex-column flex-md-row align-items-md-center align-items-start  py-1">
                                    <div className="col-xl-6  col-md-6 col-sm-12 d-flex flex-column flex-md-row align-items-md-center align-items-start  py-1">
                                        <span className="p-float-label">
                                            <Calendar id="fromDate" name="fromDate" value={values.fromDate} dateFormat="dd/mm/yy" onChange={(e) => {
                                                const newDate = e.value;
                                                if (newDate instanceof Date && !isNaN(newDate.getTime())) {
                                                    onSetFieldsValues(e, setFieldValue, 'fromDate');
                                                    if (e.value > values.toDate)
                                                        onSetFieldsValues(e, setFieldValue, 'toDate')
                                                }
                                            }} maxDate={new Date()} minDate={minFromDate !== 0 ? getFromDate(minFromDate):false}
                                                ref={fromDateRef}
                                                footerTemplate={() => (dateFooterTemplate('fromDate'))}
                                            />
                                            <label htmlFor="fromDate" className='pe-2'><FormattedMessage id={'From Date'} /></label>
                                        </span>
                                    </div>
                                    <div className="col-xl-6  col-md-6 col-sm-12 d-flex flex-column flex-md-row align-items-md-center align-items-start py-1">
                                        <span className="p-float-label">
                                            <Calendar id="toDate" name="toDate" value={values.toDate} onChange={(e) => {
                                                    const newDate = e.value;
                                                    if (newDate instanceof Date && !isNaN(newDate.getTime())) {
                                                        onSetFieldsValues(e, setFieldValue, 'toDate')
                                                    }
                                                }} minDate={values.fromDate} maxDate={new Date()} dateFormat="dd/mm/yy" 
                                                    ref={toDateRef}
                                                    footerTemplate={() => (dateFooterTemplate('toDate'))}
                                                />
                                            <label htmlFor="toDate" className='px-2'><FormattedMessage id={'To Date'} /></label>
                                        </span>
                                    </div>
                                </div>
                                :
                                <div className="col-xl-2  col-md-4 col-sm-12 d-flex flex-column flex-md-row align-items-md-center align-items-start py-1">
                                    <span className="p-float-label">
                                        <Calendar id="time12" name="toDateTime" minDate={minFromDate !== 0 ? getFromDate(minFromDate):false} value={values.toDateTime} onChange={(e) => {
                                            const newDate = e.value;
                                            if (newDate instanceof Date && !isNaN(newDate.getTime())) {
                                                onSetFieldsValues(e, setFieldValue, 'toDateTime')
                                            }
                                        }} showTime hourFormat="12" dateFormat="dd/mm/yy" maxDate={new Date()}
                                            ref={dateTimeRef}
                                            footerTemplate={() => (dateFooterTemplate('dateTime'))}
                                        />
                                        <label htmlFor="time12" className='px-2'><FormattedMessage id={'Date & Time'} /></label>
                                    </span>
                                </div>
                            )
                            }
                            <div className="col-xl-2 col-lg-4 col-md-4 col-sm-12 d-flex align-items-center py-1">
                                <button className={`btn btn-sm btn-secondary me-2 ${loader?'cursorProgress':''}`} type="button" onClick={() => { if(!loader)handleResetBtn(setFieldValue) }}><FormattedMessage id={'Reset'} /></button>
                                <button className={`btn btn-sm btn-primary me-2 ${loader?'cursorProgress':''}`} type="submit"><FormattedMessage id={'Go'} /></button>
                                {showReload && !reloadFlag && <button className='btn btn-sm btn-primary p-1 me-2 px-2' title='Start Auto Reload' type="button" onClick={()=>{autoReload(true)}}>
                                    {/* <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 11.0007C19.7554 9.2409 18.9391 7.61034 17.6766 6.36018C16.4142 5.11001 14.7758 4.3096 13.0137 4.08224C11.2516 3.85487 9.46362 4.21316 7.9252 5.10193C6.38678 5.99069 5.18325 7.36062 4.5 9.00068M4 5.00068V9.00068H8M4 13.0007C4.24456 14.7605 5.06093 16.391 6.32336 17.6412C7.58579 18.8914 9.22424 19.6918 10.9863 19.9191C12.7484 20.1465 14.5364 19.7882 16.0748 18.8994C17.6132 18.0107 18.8168 16.6407 19.5 15.0007M20 19.0007V15.0007H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg> */}

                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 8H13V14H11V8ZM15 1H9V3H15V1ZM12 20C8.13 20 5 16.87 5 13C5 9.13 8.13 6 12 6C15.54 6 18.45 8.62 18.93 12.03C19.65 12.08 20.34 12.23 21 12.5C20.8798 10.6356 20.1924 8.85258 19.03 7.39L20.45 5.97C20 5.46 19.55 5 19.04 4.56L17.62 6C16.07 4.74 14.12 4 12 4C9.61305 4 7.32387 4.94821 5.63604 6.63604C3.94821 8.32387 3 10.6131 3 13C3 15.3869 3.94821 17.6761 5.63604 19.364C7.32387 21.0518 9.61305 22 12 22C12.34 22 12.67 22 13 21.94C12.63 21.35 12.35 20.69 12.18 20H12ZM22 18.5V14.5L20.83 15.67C20.4582 15.2987 20.017 15.0042 19.5314 14.8035C19.0458 14.6027 18.5254 14.4996 18 14.5C15.79 14.5 14 16.29 14 18.5C14 20.71 15.79 22.5 18 22.5C19.68 22.5 21.12 21.47 21.71 20H20C19.6938 20.4072 19.2705 20.7111 18.7868 20.871C18.3031 21.031 17.7821 21.0393 17.2936 20.895C16.805 20.7506 16.3722 20.4605 16.0531 20.0633C15.734 19.6662 15.5438 19.1811 15.5081 18.6729C15.4723 18.1647 15.5927 17.6577 15.8531 17.2198C16.1134 16.7819 16.5014 16.434 16.9649 16.2227C17.4285 16.0113 17.9455 15.9467 18.4469 16.0374C18.9482 16.128 19.4098 16.3697 19.77 16.73L18 18.5H22Z" fill="white"></path>
                                    </svg>
                                </button>}
                                {showReload && reloadFlag && <button className='btn btn-sm btn-primary p-1 me-2 px-2' title='Stop Auto Reload' type="button" onClick={()=>{autoReload(false)}}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 8L18.74 5.74C16.931 3.99122 14.516 3.00947 12 3C11 3 10.03 3.16 9.13 3.47M8 16H3V21M3 12C3 9.51 4 7.26 5.64 5.64" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M3 16L5.26 18.26C7.06897 20.0088 9.48395 20.9905 12 21C14.49 21 16.74 20 18.36 18.36M21 12C21 13 20.84 13.97 20.53 14.87M21 3V8H16M22 22L2 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>    
                                </button>}
                                
                            </div>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

Search.propTypes = {
    dateFlag: PropTypes.bool,
    dateFilter: PropTypes.bool,
    fetchData: PropTypes.func.isRequired,
    removeAllForLocoNo: PropTypes.bool,
    minFromDate: PropTypes.number,
    runTime: PropTypes.number,
    loader: PropTypes.bool,
    showReload: PropTypes.bool
};

export default React.memo(Search);
