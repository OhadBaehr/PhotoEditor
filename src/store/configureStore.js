const {createStore,combineReducers,compose,applyMiddleware} = require('redux')
const { forwardToRenderer, triggerAlias, replayActionMain,forwardToMain,replayActionRenderer } = require ('electron-redux');
const {canvasStore} = require ('./reducers/canvasStore')
const {toolStore} = require ('./reducers/toolStore')

const rootReducer = combineReducers({
    canvasStore,
    toolStore
})

const configureStore = (initialState,scope='main')=>{
    let middleware = []

    if(scope==='renderer'){
        middleware = [
            forwardToMain,
            ...middleware
        ]
    }

    if(scope==='main'){
        middleware = [
            forwardToRenderer,
            ...middleware
        ]
    }

    let composeEnhancer = compose

    const store =  createStore(rootReducer,initialState,composeEnhancer(applyMiddleware(...middleware)))


    if (scope === 'main') {
        replayActionMain(store);
    } else {
        replayActionRenderer(store);
    }


    return store
}
module.exports ={configureStore}
