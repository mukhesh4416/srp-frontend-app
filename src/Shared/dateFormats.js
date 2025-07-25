import moment from "moment";

const date = new Date()

const currentDate = date;
const yesterDayDate = moment().subtract(1,'day').toDate();

const getLocalDateFormat = (date)=>{
    return moment(date).format('DD/MM/YYYY')
}

const getDbDateFormat = (date)=>{
    return moment(date).format('YYYY-MM-DD')
}

const getDateTimeFormat = (dateTime)=>{
    return moment(dateTime).format("YYYY-MM-DD HH:mm:ss")
}

const get1HourBackTime = (dateTime)=>{
    return moment(dateTime).subtract(1, "hours").format("YYYY-MM-DD HH:mm") + ":00"
}

const getFromDate = (months=0)=>{
    return moment().subtract(months,'month').toDate();
}

const filterAutoRealTimeData = (data,lastDateTime)=>{
    let newData = []
    if(data.length && moment(lastDateTime, "DD-MM-YYYY HH:mm:ss", true).isValid()){
        for (let e of data) {
          if (moment(e.date_time,"DD-MM-YYYY HH:mm:ss").toDate() > moment(lastDateTime,"DD-MM-YYYY HH:mm:ss").toDate()) {
            newData.push(e);
          } else {
            break;
          }
        }
    }else{
        newData = []
    }
    return newData
}

export { currentDate , yesterDayDate , getLocalDateFormat , getDateTimeFormat , get1HourBackTime , getDbDateFormat, getFromDate, filterAutoRealTimeData}