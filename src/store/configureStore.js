const {createStore,combineReducers,compose,applyMiddleware} = require('redux')
const { forwardToRenderer, triggerAlias, replayActionMain,forwardToMain,replayActionRenderer } = require ('electron-redux');
const {canvas} = require ('./reducers/canvasStore')
const {settings} = require ('./reducers/settingsStore')
const {tools} = require ('./reducers/toolsStore')
const rootReducer = combineReducers({
    canvas,
    settings,
    tools
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
