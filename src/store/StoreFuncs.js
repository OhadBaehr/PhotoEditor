import React from 'react'
import { configureStore} from "./configureStore";
import { remote } from 'electron';

import { Provider } from 'react-redux';

const initialState = remote.getGlobal('state')
const globalStore = configureStore(initialState, 'renderer');

globalStore.setStore = (payload,mode=null) => {
    if (typeof payload === "function") {
        const prev = globalStore.getState()
        const res=payload({...prev.canvas,...prev.settings})
        if(mode!=='global')globalStore.dispatch({ type: 'PLACEHOLDER', payload:res, meta:{scope: 'local'} })
        if(mode!=='local')globalStore.dispatch({ type: 'PLACEHOLDER', payload:res})
    }else{
        if(mode!=='global')globalStore.dispatch({ type: 'PLACEHOLDER', payload, meta:{scope: 'local'} })
        if(mode!=='local')globalStore.dispatch({ type: 'PLACEHOLDER', payload})
    }
}

function saveActiveLayerImage(newImage) {
    globalStore.setStore(store => ({
        layers: store.layers.map((layer, j) => {
            if (j === store.activeLayer) {
                return { ...layer, src: newImage };
            } else {
                return layer;
            }
        })
    }))
}


function addLayer(layer) {
    let store = globalStore.getState().canvas
    store.layers.push(layer)
    // store.activeLayer = store.layersCount
    store.layersCount += 1
    globalStore.setStore(store)
}

const StoreProvider = (props) => {
    return (
        <Provider store={globalStore}>
            {props.children}
        </Provider>
    )
}
export { StoreProvider, saveActiveLayerImage, addLayer }
export default globalStore;