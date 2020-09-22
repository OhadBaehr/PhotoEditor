import React from 'react'
import { configureStore } from "./configureStore";
import { remote } from 'electron';

import { Provider } from 'react-redux';

const initialState = remote.getGlobal('state')
const globalStore = configureStore(initialState, 'renderer');

globalStore.setStore = (payload,local=null) => {
    if (typeof payload === "function") {
        const prev = globalStore.getState().canvasStore
        globalStore.dispatch({ type: 'PLACEHOLDER', payload: payload(prev) , meta:{scope: local}})
    }else{
        globalStore.dispatch({ type: 'PLACEHOLDER', payload, meta:{scope: 'local'} })
        globalStore.dispatch({ type: 'PLACEHOLDER', payload})
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
    let store = globalStore.getState().canvasStore
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