import React from 'react'
import {configureStore} from "./store/configureStore";
import { remote } from 'electron';

import { Provider } from 'react-redux';
const initialState = remote.getGlobal('state')
const store = configureStore(initialState, 'renderer');

const StoreWrapper=(props)=>{
    return(
        <Provider store={store}>
            {props.children}
        </Provider>
    )
}
export {StoreWrapper}
export default store;