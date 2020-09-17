import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.less'
import { remote } from 'electron';

import ViewManager from './ViewManager';

import { Provider } from 'react-redux';
import {configureStore} from "./store/configureStore";
import StoreWrapper from './Store'


const initialState = remote.getGlobal('state')
const store = configureStore(initialState, 'renderer');

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
      <StoreWrapper>
        <ViewManager />
      </StoreWrapper>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
