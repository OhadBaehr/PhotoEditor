const actionTypes = require('../actionTypes')


const initialState = {}


const toolStore = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SOME_NEW_ACTION:
            return implementNewAction(state, action.payload, action.morePayload)
        case actionTypes.SOME_OTHER_NEW_ACTION:
            return implementOtherNewAction(state, action.payload, action.morePayload, action.evenMorePayload)
        default:
            return state

    }
}

const implementNewAction = (state, data, moreData) => {
    // do stuff
    return state
}
const implementOtherNewAction = (state, data, moreData, evenMoreData) => {
    // do stuff
    return state
}


module.exports = {toolStore}
