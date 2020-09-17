const actionTypes = require('../actionTypes')


const newActionName = (data,someOtherDate) =>{
    return{
        type:actionTypes.SOME_NEW_ACTION,
        payload:data,
        morePayload:someOtherDate
    }
}

const anotherNewActionName = (data,someOtherDate,evenMoreData) =>{
    return{
        type:actionTypes.SOME_OTHER_NEW_ACTION,
        payload:data,
        morePayload:someOtherDate,
        evenMorePayload:evenMoreData
    }
}

module.exports = {newActionName,anotherNewActionName}
