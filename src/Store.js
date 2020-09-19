import React from 'react'
import {configureStore} from "./store/configureStore";
import { remote } from 'electron';

import { Provider } from 'react-redux';

const initialState = remote.getGlobal('state')
const globalStore = configureStore(initialState, 'renderer');


function saveActiveLayerImage(canvas,newImage){
    let store=globalStore.getState().canvasStore 
    globalStore.dispatch({type:"SET_LAYERS",payload:store.layers.map((layer, j) => {
    if (j === store.activeLayer) {
        return {...layer,src:newImage};
    } else {
        return layer;
    }
    })})
}

const StoreProvider=(props)=>{
    return(
        <Provider store={globalStore}>
            {props.children}
        </Provider>
    )
}
export {StoreProvider,saveActiveLayerImage}
export default globalStore;