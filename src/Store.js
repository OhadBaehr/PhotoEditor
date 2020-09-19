import React from 'react'
import {configureStore} from "./store/configureStore";
import { remote } from 'electron';

import { Provider } from 'react-redux';

const initialState = remote.getGlobal('state')
const globalStore = configureStore(initialState, 'renderer');


function saveActiveLayerImage(newImage){
    let store=globalStore.getState().canvasStore 
    globalStore.dispatch({type:"SET_LAYERS",payload:store.layers.map((layer, j) => {
    if (j === store.activeLayer) {
        return {...layer,src:newImage};
    } else {
        return layer;
    }
    })})
}


function addLayer(layer){
    let store=globalStore.getState().canvasStore
    let layers=store.layers
    layers.push(layer)
    globalStore.dispatch({type:"SET_LAYERS",payload:layers})
    globalStore.dispatch({type:"SET_LAYERS_COUNT",payload:store.layersCount+1})
}

const StoreProvider=(props)=>{
    return(
        <Provider store={globalStore}>
            {props.children}
        </Provider>
    )
}
export {StoreProvider,saveActiveLayerImage,addLayer}
export default globalStore;